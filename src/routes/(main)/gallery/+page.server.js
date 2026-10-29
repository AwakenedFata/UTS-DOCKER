import connectToDatabase from '$lib/server/db.js';
import Gallery from '$lib/server/models/galleryItems.js';
import Banner from '$lib/server/models/banner.js';

export const config = { isr: false };

export async function load() {
    await connectToDatabase();

    const timestamp = Date.now();
    
    const banner = await Banner.findOne({ isActive: true })
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();
        
    const galleries = await Gallery.find({ isActive: true })
        .sort({ uploadDate: -1 })
        .lean();

    const serializedBanner = banner ? {
        ...JSON.parse(JSON.stringify(banner)),
        imageUrl: banner.imageUrl,
        _timestamp: timestamp
    } : null;

    const serializedGalleries = JSON.parse(JSON.stringify(galleries));

    return {
        banner: serializedBanner,
        galleries: serializedGalleries
    };
}
