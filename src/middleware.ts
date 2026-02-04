import { NextRequest, NextResponse } from "next/server";
import type { SessionData } from "@/types/auth";
import { Roles } from "@/config";
import { getSession } from "@/lib/session";
import { loginSessionKey } from "@/lib/definitions";

const publicRoutes = [
	"/auth/signin",
	"/auth/signup",
	"/admission/program-requierments",
	"/admission/payments/verify-admission",
	"/admission/terms-and-conditions",
	"/admission/terms-and-conditions/document-file",
];
const protectedRoutes = [
	"/dashboard",
	"/dashboard/update-application-form",
	"/admission",
	"/admission/program-requierments",
	"/admission/payments/verify-acceptance",
	"/admission/payments/verify-tuition",
];
const staticPaths = ["/_next", "/favicon.ico", "/images", /\.(png|jpg|jpeg|gif|svg)$/];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;

	// Skip static assets
	if (staticPaths.some(p => typeof p === 'string' ? path.startsWith(p) : path.match(p))) {
		return NextResponse.next();
	}

	const loginSession = (await getSession(loginSessionKey)) as SessionData | null;
	const user = loginSession?.user;
	const hasApplied = Boolean(user?.is_applied);
	const role = user?.role?.toUpperCase() || '';

	// 1. Handle public routes - accessible to everyone
	if (publicRoutes.some(publicPath => path.startsWith(publicPath))) {
		return NextResponse.next();
	}

	// 2. Handle unauthenticated users accessing protected routes
	if (!user) {
		if (protectedRoutes.some(p => path.startsWith(p))) {
			// Get the current full URL (path + query params)
			const currentUrl = `${path}${req.nextUrl.search}`;

			// Create redirect URL to signin page
			const signinUrl = new URL('/auth/signin', req.url);

			// Add callback URL parameter (only if not already on auth page to avoid loops)
			if (!path.startsWith('/auth')) {
				// Only encode once
				signinUrl.searchParams.set('callbackUrl', currentUrl);
			}

			return NextResponse.redirect(signinUrl);
		}
		return NextResponse.next();
	}

	// 3. Handle authenticated users on public routes (redirect them appropriately)
	if (publicRoutes.some(publicPath => path.startsWith(publicPath))) {
		// For logged-in users accessing auth pages, check for callbackUrl
		if (path.startsWith('/auth/signin') || path.startsWith('/auth/signup')) {
			const callbackUrl = req.nextUrl.searchParams.get('callbackUrl');

			// If there's a valid callback URL, redirect there
			if (callbackUrl) {
				try {
					// The callbackUrl should be a path, not a full URL
					let callbackPath = callbackUrl;

					// Remove leading slash if present to avoid double slashes
					if (callbackPath.startsWith('/')) {
						callbackPath = callbackPath.substring(1);
					}

					// Create a proper URL object
					const redirectUrl = new URL(callbackPath, req.url);

					// Validate it's a safe URL (same origin)
					if (redirectUrl.origin === req.nextUrl.origin) {
						return NextResponse.redirect(redirectUrl);
					}
				} catch (error) {
					console.error('Error parsing callback URL:', error);
					// If URL is invalid, continue to default redirect
				}
			}

			// Default redirect for logged-in users on auth pages
			let redirectPath = '/dashboard';

			if (role === Roles.STUDENT) {
				redirectPath = hasApplied ? '/dashboard/student' : '/admission';
			} else if (role) {
				redirectPath = `/dashboard/${role.toLowerCase()}`;
			}

			return NextResponse.redirect(new URL(redirectPath, req.url));
		}

		// Handle admission form special case
		if (path === ('/admission/form')) {
			if (role === Roles.STUDENT && hasApplied) {
				return NextResponse.redirect(new URL('/admission', req.url));
			}
			if (role !== Roles.STUDENT) {
				return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, req.url));
			}
			return NextResponse.next();
		}

		return NextResponse.next();
	}

	// 4. For logged in users, handle specific paths
	if (user) {
		// Admission form special case
		if (path === ('/admission/form')) {
			if (role === Roles.STUDENT && hasApplied) {
				return NextResponse.redirect(new URL('/admission', req.url));
			}
			return NextResponse.next();
		}

		// Dashboard routes
		if (path.startsWith('/dashboard')) {
			const subPath = path.split('/')[2]?.toLowerCase();
			const rolePath = role.toLowerCase();

			// Special case for update-application-form route
			if (path.startsWith('/dashboard/update-application-form')) {
				if (role !== Roles.STUDENT && role !== Roles.ADMIN) {
					return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, req.url));
				}
				return NextResponse.next();
			}

			if (role === Roles.STUDENT && !hasApplied) {
				return NextResponse.redirect(new URL('/admission', req.url));
			}

			const currentUrl = new URL(req.url);
			const expectedPath = `/dashboard/${rolePath}`;

			// Allow access to role-specific dashboard or update-application-form
			if (subPath !== rolePath && currentUrl.pathname !== expectedPath &&
				!path.startsWith('/dashboard/update-application-form')) {
				return NextResponse.redirect(new URL(expectedPath, req.url));
			}

			return NextResponse.next();
		}

		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|images/.*|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)",
	],
};













// import { NextRequest, NextResponse } from "next/server";
// import type { SessionData } from "@/types/auth";
// import { Roles } from "@/config";
// import { getSession } from "@/lib/session";
// import { loginSessionKey } from "@/lib/definitions";

// const publicRoutes = [
// 	"/auth/signin",
// 	"/auth/signup",
// 	"/admission/program-requierments",
// 	"/admission/payments/verify-admission",
// 	"/admission/terms-and-conditions",
// 	"/admission/terms-and-conditions/document-file",
// ];
// const protectedRoutes = [
// 	"/dashboard",
// 	"/dashboard/update-application-form",
// 	"/admission",
// 	"/admission/program-requierments",
// 	"/admission/payments/verify-acceptance",
// 	"/admission/payments/verify-tuition",
// ];
// const staticPaths = ["/_next", "/favicon.ico", "/images", /\.(png|jpg|jpeg|gif|svg)$/];

// export default async function middleware(req: NextRequest) {
// 	const path = req.nextUrl.pathname;

// 	// Skip static assets
// 	if (staticPaths.some(p => typeof p === 'string' ? path.startsWith(p) : path.match(p))) {
// 		return NextResponse.next();
// 	}

// 	const loginSession = (await getSession(loginSessionKey)) as SessionData | null;
// 	const user = loginSession?.user;
// 	const hasApplied = Boolean(user?.is_applied);
// 	const role = user?.role?.toUpperCase() || '';

// 	// 1. Handle public routes - accessible to everyone
// 	if (publicRoutes.some(publicPath => path.startsWith(publicPath))) {
// 		return NextResponse.next();
// 	}

// 	// 1. Handle public routes
// 	if (publicRoutes.includes(path)) {
// 		if (user) {
// 			if (path === ('/admission/form')) {
// 				if (role === Roles.STUDENT && hasApplied) {
// 					return NextResponse.redirect(new URL('/admission', req.url));
// 				}
// 				if (role !== Roles.STUDENT) {
// 					return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, req.url));
// 				}
// 				return NextResponse.next();
// 			}
// 			// const redirectPath = (role === Roles.STUDENT)
// 			// 	? hasApplied
// 			// 		? '/dashboard/student'
// 			// 		: '/admission'
// 			// 	: `/dashboard/${role.toLowerCase()}`;
// 			// return NextResponse.redirect(new URL(redirectPath, req.url));
// 		}
// 		return NextResponse.next();
// 	}

// 	// 2. Handle unauthenticated users
// 	if (!user) {
// 		if (protectedRoutes.some(p => path.startsWith(p))) {
// 			return NextResponse.redirect(new URL('/auth/signin', req.url));
// 		}
// 		return NextResponse.next();
// 	}

// 	// For loged in users, handle specific paths
// 	if (user) {
// 		// Admission form special case
// 		if (path === ('/admission/form')) {
// 			if (role === Roles.STUDENT && hasApplied) {
// 				return NextResponse.redirect(new URL('/admission', req.url));
// 			}
// 			return NextResponse.next();
// 		}

// 		// if (!path.startsWith('/admission')) {
// 		// 	if (hasApplied && role === Roles.STUDENT) {
// 		// 		return NextResponse.redirect(new URL('/dashboard/student', req.url));
// 		// 	}
// 		// 	// if (role !== Roles.STUDENT) {
// 		// 	// 	return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, req.url));
// 		// 	// }
// 		// 	return NextResponse.next();
// 		// }

// 		// Dashboard routes
// 		if (path.startsWith('/dashboard')) {
// 			const subPath = path.split('/')[2]?.toLowerCase();
// 			const rolePath = role.toLowerCase();

// 			// Special case for update-application-form route
// 			if (path.startsWith('/dashboard/update-application-form')) {
// 				if (role !== Roles.STUDENT && role !== Roles.ADMIN) {
// 					return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, req.url));
// 				}
// 				return NextResponse.next();
// 			}

// 			if (role === Roles.STUDENT && !hasApplied) {
// 				return NextResponse.redirect(new URL('/admission', req.url));
// 			}

// 			const currentUrl = new URL(req.url);
// 			const expectedPath = `/dashboard/${rolePath}`;

// 			// Allow access to role-specific dashboard or update-application-form
// 			if (subPath !== rolePath && currentUrl.pathname !== expectedPath &&
// 				!path.startsWith('/dashboard/update-application-form')) {
// 				return NextResponse.redirect(new URL(expectedPath, req.url));
// 			}

// 			return NextResponse.next();
// 		}
// 		return NextResponse.next();
// 	}

// 	return NextResponse.next();
// }

// export const config = {
// 	matcher: [
// 		"/((?!api|_next/static|_next/image|images/.*|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)",
// 	],
// };