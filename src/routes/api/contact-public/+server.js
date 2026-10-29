import { json } from '@sveltejs/kit';
import connectToDatabase from '$lib/server/db.js';
import UserMail from '$lib/server/models/userMail.js';
import logger from '$lib/server/utils/logger.js';
import { validateRequest, userMailCreationSchema } from '$lib/server/utils/validation.js';
import { rateLimit } from '$lib/server/utils/rate-limit.js';

const limiter = rateLimit({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
    limit: 5,
});

export async function POST({ request, getClientAddress }) {
    try {
        // Apply rate limiting per IP
        const ip = request.headers.get("x-forwarded-for") || getClientAddress() || "unknown";
        const limitResult = await limiter.check(ip);

        if (!limitResult.success) {
            return json({ error: "Terlalu banyak pesan dari IP ini, silakan coba lagi nanti" }, { status: 429 });
        }

        await connectToDatabase();

        const body = await request.json();

        // Validate input
        const validation = await validateRequest(userMailCreationSchema, body);
        if (!validation.success) {
            logger.warn(`Invalid contact form submission: ${JSON.stringify(validation.error)}`);
            return json(validation.error, { status: 400 });
        }

        const { name, email, subject, message } = validation.data;

        // Create new mail document
        const userMail = new UserMail({
            name,
            email,
            subject,
            message,
        });

        await userMail.save();

        logger.info(`Contact form received from ${email} (${name}): ${subject}`);

        return json(
            {
                success: true,
                message: "Pesan Anda berhasil dikirim",
                data: {
                    id: userMail._id,
                    createdAt: userMail.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        if (error.statusCode === 429) {
            return json({ error: "Terlalu banyak pesan dari IP ini, silakan coba lagi nanti" }, { status: 429 });
        }
        logger.error(`Error submitting contact form: ${error.message}`);
        return json({ error: "Gagal mengirim pesan, silakan coba lagi" }, { status: 500 });
    }
}
