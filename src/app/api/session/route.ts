import { NextRequest, NextResponse } from "next/server";
import { updateSessionKey } from "@/lib/session";
import { loginSessionKey } from "@/lib/definitions";
import { UserInterface } from "@/config/Types";
import { SessionExists } from "@/lib/server.utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		const { user }: { user: UserInterface } = await request.json();

		if (!user) {
			return NextResponse.json(
				{ error: "User data is required" },
				{ status: 400 }
			);
		}

		// Update the user data in the session
		await updateSessionKey(loginSessionKey, { user });

		return NextResponse.json(
			{ success: true, message: "User session updated successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating user session:", error);
		return NextResponse.json(
			{ error: "Failed to update user session" },
			{ status: 500 }
		);
	}
}

// Optional: GET endpoint to fetch fresh user data and update session
export async function GET() {
	try {
		const loginSession = await SessionExists(loginSessionKey);

		if (!loginSession) {
			return new NextResponse(
				JSON.stringify({ error: "Session not found" }),
				{
					// status: 404,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
		return NextResponse.json(
			{ message: "User session refresh triggered" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in session refresh:", error);
		return NextResponse.json(
			{ error: "Failed to refresh session" },
			{ status: 500 }
		);
	}
}

