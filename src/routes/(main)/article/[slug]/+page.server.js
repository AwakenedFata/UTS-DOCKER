import connectToDatabase from '$lib/server/db.js';
import Article from '$lib/server/models/article.js';
import Gallery from '$lib/server/models/galleryItems.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const { slug } = params;

    try {
        await connectToDatabase();

        const article = await Article.findOne({
            slug,
            isActive: true,
            status: 'published',
        })
            .populate('relatedGallery')
            .lean();

        if (!article) throw error(404, 'Article not found');

        const recentArticles = await Article.find({
            isActive: true,
            status: 'published',
            _id: { $ne: article._id },
        })
            .sort({ publishedAt: -1 })
            .limit(5)
            .select('title slug coverImage publishedAt')
            .lean();

        let discoveredTopics = [];
        if (article.relatedGallery?.label) {
            const relatedGalleries = await Gallery.find({
                label: article.relatedGallery.label,
                isActive: true,
                _id: { $ne: article.relatedGallery._id },
            })
                .limit(6)
                .lean();

            const relatedGalleryIds = relatedGalleries.map((g) => g._id);
            discoveredTopics = await Article.find({
                relatedGallery: { $in: relatedGalleryIds },
                isActive: true,
                status: 'published',
                _id: { $ne: article._id },
            })
                .populate('relatedGallery')
                .sort({ publishedAt: -1 })
                .limit(6)
                .lean();
        }

        const allLabels = await Gallery.distinct('label', { isActive: true });

        const allArticles = await Article.find({
            isActive: true,
            status: 'published',
        })
            .populate('relatedGallery')
            .select('title slug coverImage publishedAt excerpt relatedGallery')
            .sort({ publishedAt: -1 })
            .lean();

        return {
            article: JSON.parse(JSON.stringify(article)),
            recentArticles: JSON.parse(JSON.stringify(recentArticles)),
            discoveredTopics: JSON.parse(JSON.stringify(discoveredTopics)),
            allLabels,
            allArticles: JSON.parse(JSON.stringify(allArticles)),
        };
    } catch (err) {
        console.error('Error fetching article:', err);
        throw error(404, 'Article not found');
    }
}
