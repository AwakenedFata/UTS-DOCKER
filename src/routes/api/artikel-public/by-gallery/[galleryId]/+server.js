import connectToDatabase from '$lib/server/db.js';
import Article from '$lib/server/models/article.js';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
    try {
        const { galleryId } = params;
        
        if (!galleryId) {
            return json(
                { success: false, message: "Gallery ID is required" }, 
                { status: 400 }
            );
        }
        
        await connectToDatabase();

        const article = await Article.findOne({
            relatedGallery: galleryId,
            isActive: true,
            status: "published",
        })
            .select("slug title coverImage coverImageKey excerpt content tags publishedAt contentImages")
            .populate("relatedGallery", "title label location imageUrl")
            .lean();

        if (!article) {
            return json(
                { success: false, message: "Artikel tidak ditemukan" }, 
                { status: 404 }
            );
        }

        return json({ success: true, article });
    } catch (error) {
        console.error("[PUBLIC API] Error fetching article by gallery:", error);
        return json(
            { success: false, message: "Terjadi kesalahan server" }, 
            { status: 500 }
        );
    }
}
