// // import NextAuth from "next-auth";
// // import { AuthConfig } from "@auth/core"
// // import Credentials from "next-auth/providers/credentials"
// // import { authenticateUser } from "./app/actions/auth-actions"

// // const config: AuthConfig = {
// //     providers: [
// //         Credentials({
// //             id: "credentials",
// //             name: "credentials",
// //             credentials: {
// //                 reference: {
// //                     label: "Reference",
// //                     type: "reference",
// //                     placeholder: "your reference no. or your-email@example.com"
// //                 },
// //                 password: {
// //                     label: "Password",
// //                     type: "password"
// //                 },
// //             },
// //             async authorize(credentials) {
// //                 // Add your authentication logic here
// //                 if (!credentials?.reference || !credentials?.password) {
// //                     return null
// //                 }

// //                 try {
// //                     // Example: Replace with your actual authentication logic
// //                     // This could be a database query, API call, etc.
// //                     const user = await authenticateUser({
// //                         reference: credentials.reference as string,
// //                         password: credentials.password as string
// //                     })

// //                     if (user) {
// //                         return {
// //                             id: user.id,
// //                             email: user.email,
// //                             name: user.name,
// //                         }
// //                     }

// //                     return null
// //                 } catch (error) {
// //                     console.error("Authentication error:", error)
// //                     return null
// //                 }
// //             },
// //         }),
// //     ],
// //     pages: {
// //         signIn: "/auth/signin",
// //         signOut: "/auth/signout",
// //         error: "/auth/error",
// //     },
// //     callbacks: {
// //         async jwt({ token, user }) {
// //             if (user) {
// //                 token.id = user.id
// //             }
// //             return token
// //         },
// //         async session({ session, token }) {
// //             if (token) {
// //                 session.user.id = token.id as string
// //             }
// //             return session
// //         },
// //     },
// //     session: {
// //         strategy: "jwt",
// //     },
// //     secret: process.env.NEXTAUTH_SECRET,
// // }

// // export const { handlers, auth, signIn, signOut } = NextAuth(config)













// import NextAuth from "next-auth";
// import { signinAction } from "./app/actions/auth-actions";
// import Credentials from 'next-auth/providers/credentials';

// export const {auth, handlers, signIn } = NextAuth({
//     providers: [
//         Credentials({
//             id: "credentials",
//             name: "Credentials",
//             credentials: {
//                 refrence: { label: "Email", type: "text" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 // Custom authorization logic
//                 const user = await signinAction({ refrence: credentials.refrence as string, password:credentials.password as string});
//                 if (user) {
//                     return user;
//                 } else {
//                     throw new Error("Invalid credentials");
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         authorized: async ({ user }) => {
//             // Custom authorization logic
//             return !!user; // Return true if user is authenticated
//         },
//         session: async ({ session, user }) => {
//             // Custom session handling
//             session.user = user;
//             return session;
//         },
//         jwt: async ({ token, user }) => {
//             // Custom JWT handling
//             if (user) {
//                 token.id = user.id; // Add user ID to the token
//             }
//             return token;
//         },
//         token: async ({ token, user }) => {
//             // Custom token handling
//             if (user) {
//                 token.id = user.id; // Add user ID to the token
//             }
//             return token;
//         }
//     },
//     trustHost: true, // Trust the host for security
//     debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
//     secret: process.env.NEXTAUTH_SECRET, // Secret for signing cookies
//     session: {
//         jwt: true, // Use JWT for session management
//         maxAge: 30 * 24 * 60 * 60, // Session max age in seconds (30 days)
//     },
//     jwt: {
//         secret: process.env.JWT_SECRET, // Secret for signing JWT tokens
//         encryption: true, // Enable JWT encryption
//     },
//     theme: {
//         colorScheme: 'light', // Set the color scheme
//         brandColor: '#0000FF', // Custom brand color
//         logo: '/logo.png', // Path to custom logo
//     },
//     pages: {
//         signIn: '/auth/signin', // Custom sign-in page
//         error: '/auth/error', // Error page
//     },
//     events: {
//         async signIn(message) {
//             // Event triggered on successful sign-in
//             console.log("User signed in:", message);
//         },
//         async error(message) {
//             // Event triggered on error
//             console.error("Error occurred:", message);
//         },
//     },
//     adapter: null, // Use a custom adapter or leave as null
//     logger: {
//         error(code, metadata) {
//             console.error(`Error: ${code}`, metadata);
//         },
//         warn(code) {
//             console.warn(`Warning: ${code}`);
//         },
//         debug(code, metadata) {
//             console.debug(`Debug: ${code}`, metadata);
//         },
//     },
// });