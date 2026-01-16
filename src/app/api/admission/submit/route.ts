export const runtime = "nodejs"; // IMPORTANT

import { remoteApiUrl } from "@/config";

export async function POST(req: Request) {
    try {
        const auth = req.headers.get("authorization");
        if (!auth) {
            return new Response("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();

        const res = await fetch(
            `${remoteApiUrl}/application/application-form`,
            {
                method: "POST",
                headers: {
                    Authorization: auth,
                },
                body: formData,
            }
        );

        if (!res.ok) {
            const text = await res.text();
            return new Response(text, { status: res.status });
        }

        return Response.json(await res.json());
    } catch (err) {
        console.error("API route error:", err);
        return new Response(
            "Service temporarily unavailable",
            { status: 503 }
        );
    }
}

