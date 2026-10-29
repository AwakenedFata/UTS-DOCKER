import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
    try {
        const { token } = await request.json();

        if (!token) {
            return json(
                { success: false, error: "Token is required" },
                { status: 400 }
            );
        }

        // Verify the token with Cloudflare
        const verifyResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    secret: env.TURNSTILE_SECRET_KEY,
                    response: token,
                }),
            }
        );

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
            return json({ success: true });
        } else {
            return json(
                { success: false, error: "Verification failed" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Turnstile verification error:", error);
        return json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
