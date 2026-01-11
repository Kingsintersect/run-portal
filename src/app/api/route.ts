import { NextResponse } from "next/server";

export async function GET() {
   return NextResponse.json({ message: 'api endpoint' }, { status: 200 });
}