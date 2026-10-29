<script>
    import { goto } from "$app/navigation";
    import { format } from "date-fns";
    import { id as localeId } from "date-fns/locale";

    let { data } = $props();

    let labelSearch = $state("");
    let selectedLabel = $state("");

    const article = $derived(data.article);
    const recentArticles = $derived(data.recentArticles);
    const discoveredTopics = $derived(data.discoveredTopics);
    const allLabels = $derived(data.allLabels);
    const allArticles = $derived(data.allArticles);

    function formatDate(date) {
        if (!date) return "";
        return format(new Date(date), "dd MMMM yyyy", { locale: localeId });
    }

    const readingTime = $derived(
        Math.ceil((article.content?.length || 0) / 1000) || 1,
    );

    const filteredLabels = $derived(
        allLabels.filter((label) =>
            label.toLowerCase().includes(labelSearch.toLowerCase()),
        ),
    );

    const filteredArticles = $derived(
        selectedLabel
            ? allArticles.filter(
                  (a) =>
                      a.relatedGallery?.label === selectedLabel &&
                      a._id !== article._id,
              )
            : [],
    );

    // Build formatted content with inline images
    const formattedContent = $derived.by(() => {
        if (!article.content) return "";

        const paragraphs = article.content.split("\n").filter((p) => p.trim());

        if (!article.contentImages || article.contentImages.length === 0) {
            return paragraphs
                .map((p) => (p.trim() ? `<p>${p.trim()}</p>` : ""))
                .join("");
        }

        // Seeded random placement
        const seed = article._id
            ? article._id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
            : 0;
        let seedVal = seed;
        const seededRandom = () => {
            seedVal = (seedVal * 9301 + 49297) % 233280;
            return seedVal / 233280;
        };

        const availablePositions =
            paragraphs.length > 1 ? paragraphs.length - 1 : 0;
        const placements = {};

        if (availablePositions > 0) {
            const images = Array.isArray(article.contentImages)
                ? article.contentImages.filter(Boolean)
                : [];
            const gaps = Array.from(
                { length: availablePositions },
                (_, i) => i,
            );

            for (let i = gaps.length - 1; i > 0; i--) {
                const j = Math.floor(seededRandom() * (i + 1));
                [gaps[i], gaps[j]] = [gaps[j], gaps[i]];
            }

            images.forEach((img, idx) => {
                const gapIdx = gaps[idx % gaps.length];
                if (!placements[gapIdx]) placements[gapIdx] = [];
                placements[gapIdx].push(img);
            });
        }

        let result = "";
        paragraphs.forEach((paragraph, index) => {
            if (paragraph.trim()) result += `<p>${paragraph.trim()}</p>`;
            const imgsHere = placements[index] || [];
            imgsHere.forEach((image, i) => {
                result += `<div style="margin:20px 0;text-align:center;padding:12px;background:#f8f9fa;border-radius:8px;">
          <img src="${image.url}" alt="${image.originalName || `Gambar ${i + 1}`}" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);" />
        </div>`;
            });
        });
        return result;
    });

    function handleBackToGallery() {
        window.scrollTo({ top: 0, behavior: "instant" });
        goto("/gallery");
    }
</script>

<svelte:head>
    <title>{article.title} - HOK Lampung</title>
    <meta name="description" content={article.excerpt || article.title} />
</svelte:head>

<div class="article-container">
    <button class="back-btn" onclick={handleBackToGallery}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><line x1="19" y1="12" x2="5" y2="12" /><polyline
                points="12 19 5 12 12 5"
            /></svg
        >
        Kembali ke Gallery
    </button>

    <div class="article-layout">
        <!-- Main Content -->
        <article class="main-content">
            {#if article.coverImage}
                <div class="cover-image">
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        loading="eager"
                    />
                </div>
            {/if}

            <div class="article-header">
                <h1 class="article-title">{article.title}</h1>

                <div class="article-meta">
                    {#if article.publishedAt}
                        <div class="meta-item">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                /><line x1="16" y1="2" x2="16" y2="6" /><line
                                    x1="8"
                                    y1="2"
                                    x2="8"
                                    y2="6"
                                /><line x1="3" y1="10" x2="21" y2="10" /></svg
                            >
                            {formatDate(article.publishedAt)}
                        </div>
                    {/if}
                    <div class="meta-item">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            ><circle cx="12" cy="12" r="10" /><polyline
                                points="12 6 12 12 16 14"
                            /></svg
                        >
                        {readingTime} menit baca
                    </div>
                    {#if article.relatedGallery?.label}
                        <div class="meta-item">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><path
                                    d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                                /><line x1="7" y1="7" x2="7.01" y2="7" /></svg
                            >
                            {article.relatedGallery.label}
                        </div>
                    {/if}
                </div>

                {#if article.excerpt}
                    <p
                        style="font-size:1.1rem;color:#666;font-style:italic;margin-bottom:20px;"
                    >
                        {article.excerpt}
                    </p>
                {/if}

                {#if article.tags && article.tags.length > 0}
                    <div class="tags-container">
                        {#each article.tags as tag, i (i)}
                            <span class="tag-badge">{tag}</span>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="article-content">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html formattedContent}
            </div>
        </article>

        <!-- Sidebar -->
        <aside class="sidebar">
            {#if selectedLabel && filteredArticles.length > 0}
                <div class="sidebar-section filtered-section">
                    <h3 class="sidebar-title">
                        <span>Artikel dengan Label: {selectedLabel}</span>
                        <button
                            class="clear-filter-btn"
                            onclick={() => (selectedLabel = "")}
                            >Hapus Filter</button
                        >
                    </h3>
                    {#each filteredArticles as fa (fa._id)}
                        <a
                            href={`/article/${fa.slug}`}
                            class="filtered-article-item"
                        >
                            <div class="filtered-article-img">
                                <img
                                    src={fa.coverImage || "/placeholder.svg"}
                                    alt={fa.title}
                                    loading="eager"
                                />
                            </div>
                            <div class="filtered-article-content">
                                <h4 class="filtered-article-title">
                                    {fa.title}
                                </h4>
                                {#if fa.excerpt}
                                    <p class="filtered-article-excerpt">
                                        {fa.excerpt}
                                    </p>
                                {/if}
                                <span class="filtered-article-date"
                                    >{formatDate(fa.publishedAt)}</span
                                >
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}

            {#if allLabels.length > 0}
                <div class="sidebar-section">
                    <h3 class="sidebar-title">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            style="margin-right:8px;display:inline;"
                            ><circle cx="11" cy="11" r="8" /><line
                                x1="21"
                                y1="21"
                                x2="16.65"
                                y2="16.65"
                            /></svg
                        >
                        Jelajahi Berdasarkan Label
                    </h3>
                    <input
                        type="text"
                        placeholder="Cari label..."
                        class="search-input"
                        bind:value={labelSearch}
                    />
                    <div class="label-grid">
                        {#each filteredLabels as label, i (i)}
                            <button
                                class="label-item"
                                class:label-active={selectedLabel === label}
                                onclick={() => (selectedLabel = label)}
                                >{label}</button
                            >
                        {/each}
                    </div>
                </div>
            {/if}

            {#if !selectedLabel && recentArticles.length > 0}
                <div class="sidebar-section">
                    <h3 class="sidebar-title">Artikel Terbaru</h3>
                    {#each recentArticles as ra (ra._id)}
                        <a
                            href={`/article/${ra.slug}`}
                            class="recent-article-item"
                        >
                            <div class="recent-article-img">
                                <img
                                    src={ra.coverImage || "/placeholder.svg"}
                                    alt={ra.title}
                                    loading="eager"
                                />
                            </div>
                            <div class="recent-article-content">
                                <h4 class="recent-article-title">{ra.title}</h4>
                                <span class="recent-article-date"
                                    >{formatDate(ra.publishedAt)}</span
                                >
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}

            {#if !selectedLabel && discoveredTopics.length > 0}
                <div class="sidebar-section">
                    <h3 class="sidebar-title">
                        Topik Serupa: {article.relatedGallery?.label}
                    </h3>
                    {#each discoveredTopics as topic (topic._id)}
                        <a
                            href={`/article/${topic.slug}`}
                            class="discovered-topic-item"
                        >
                            {#if topic.relatedGallery?.label}
                                <span class="topic-label"
                                    >{topic.relatedGallery.label}</span
                                >
                            {/if}
                            <h4 class="topic-title">{topic.title}</h4>
                        </a>
                    {/each}
                </div>
            {/if}

            {#if article.relatedGallery}
                <div class="sidebar-section">
                    <h3 class="sidebar-title">Galeri Terkait</h3>
                    <div style="text-align:center;">
                        <img
                            src={article.relatedGallery.imageUrl ||
                                "/placeholder.svg"}
                            alt={article.relatedGallery.title}
                            loading="eager"
                            class="related-gallery-img"
                        />
                        <h4
                            style="font-size:16px;font-weight:600;margin-bottom:8px;"
                        >
                            {article.relatedGallery.title}
                        </h4>
                        <p
                            style="font-size:14px;color:#666;margin-bottom:10px;"
                        >
                            {article.relatedGallery.location}
                        </p>
                        <span class="topic-label"
                            >{article.relatedGallery.label}</span
                        >
                    </div>
                </div>
            {/if}
        </aside>
    </div>
</div>

<style>
    .article-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 100px 20px 40px;
        font-family: "Poppins", sans-serif;
    }

    @media (max-width: 768px) {
        .article-container {
            padding: 80px 15px 30px;
        }
    }

    .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #666;
        margin-bottom: 20px;
        font-size: 14px;
        transition: color 0.2s ease;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
    }
    .back-btn:hover {
        color: #f5a623;
    }

    .article-layout {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 40px;
    }

    @media (max-width: 1024px) {
        .article-layout {
            grid-template-columns: 1fr 250px;
            gap: 30px;
        }
    }
    @media (max-width: 768px) {
        .article-layout {
            grid-template-columns: 1fr;
            gap: 25px;
        }
    }

    .main-content {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .cover-image {
        width: 100%;
        height: 400px;
        overflow: hidden;
        border-radius: 12px;
        position: relative;
    }
    .cover-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media (max-width: 768px) {
        .cover-image {
            height: 250px;
        }
    }

    .article-header {
        padding: 30px;
        border-bottom: 1px solid #eee;
    }
    @media (max-width: 768px) {
        .article-header {
            padding: 20px;
        }
    }

    .article-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #333;
        margin-bottom: 20px;
        line-height: 1.2;
    }
    @media (max-width: 768px) {
        .article-title {
            font-size: 1.8rem;
        }
    }

    .article-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        color: #666;
        font-size: 14px;
        margin-bottom: 15px;
    }
    @media (max-width: 768px) {
        .article-meta {
            gap: 15px;
            font-size: 13px;
        }
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
    }

    .tag-badge {
        background: #f5a623;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }

    .article-content {
        padding: 30px;
        text-align: justify;
    }
    @media (max-width: 768px) {
        .article-content {
            padding: 20px;
        }
    }

    :global(.article-content p) {
        margin-bottom: 16px;
        line-height: 1.7;
        color: #444;
        font-size: 16px;
    }
    :global(.article-content h2, .article-content h3, .article-content h4) {
        margin: 24px 0 16px 0;
        color: #333;
    }
    :global(.article-content h2) {
        font-size: 1.8rem;
        font-weight: 600;
    }
    :global(.article-content h3) {
        font-size: 1.4rem;
        font-weight: 600;
    }
    :global(.article-content img) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 20px 0;
    }
    :global(.article-content blockquote) {
        border-left: 4px solid #f5a623;
        padding-left: 20px;
        margin: 20px 0;
        font-style: italic;
        color: #666;
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    @media (max-width: 768px) {
        .sidebar {
            gap: 20px;
        }
    }

    .sidebar-section {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    @media (max-width: 1024px) {
        .sidebar-section {
            padding: 20px;
        }
    }

    .filtered-section {
        margin-bottom: 0;
    }

    .sidebar-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #f5a623;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    }
    @media (max-width: 1024px) {
        .sidebar-title {
            font-size: 1.1rem;
        }
    }
    @media (max-width: 768px) {
        .sidebar-title {
            font-size: 1rem;
            margin-bottom: 15px;
        }
    }

    .recent-article-item,
    .filtered-article-item {
        display: flex;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
        text-decoration: none;
        color: inherit;
        transition: background 0.2s ease;
    }
    .recent-article-item:last-child,
    .filtered-article-item:last-child {
        border-bottom: none;
    }
    .recent-article-item:hover,
    .filtered-article-item:hover {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 12px;
        margin: 0 -12px;
    }

    .recent-article-img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
    }
    .recent-article-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    @media (max-width: 768px) {
        .recent-article-img {
            width: 50px;
            height: 50px;
        }
    }

    .recent-article-content {
        flex: 1;
    }

    .recent-article-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    @media (max-width: 768px) {
        .recent-article-title {
            font-size: 13px;
        }
    }

    .recent-article-date {
        font-size: 12px;
        color: #666;
    }
    @media (max-width: 768px) {
        .recent-article-date {
            font-size: 11px;
        }
    }

    .filtered-article-item {
        gap: 15px;
        padding: 15px 0;
    }
    .filtered-article-item:hover {
        padding: 15px;
        margin: 0 -15px;
    }
    @media (max-width: 768px) {
        .filtered-article-item {
            gap: 12px;
            padding: 12px 0;
        }
    }

    .filtered-article-img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
    }
    .filtered-article-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    @media (max-width: 768px) {
        .filtered-article-img {
            width: 60px;
            height: 60px;
        }
    }

    .filtered-article-content {
        flex: 1;
    }

    .filtered-article-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    @media (max-width: 768px) {
        .filtered-article-title {
            font-size: 14px;
        }
    }

    .filtered-article-excerpt {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    @media (max-width: 768px) {
        .filtered-article-excerpt {
            font-size: 13px;
        }
    }

    .filtered-article-date {
        font-size: 12px;
        color: #999;
    }
    @media (max-width: 768px) {
        .filtered-article-date {
            font-size: 11px;
        }
    }

    .discovered-topic-item {
        display: block;
        padding: 15px;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 12px;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s ease;
    }
    .discovered-topic-item:hover {
        border-color: #f5a623;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .discovered-topic-item:last-child {
        margin-bottom: 0;
    }
    @media (max-width: 768px) {
        .discovered-topic-item {
            padding: 12px;
        }
    }

    .topic-label {
        background: #f5a623;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        margin-bottom: 8px;
        display: inline-block;
    }

    .topic-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    @media (max-width: 768px) {
        .topic-title {
            font-size: 13px;
        }
    }

    .label-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
        margin-top: 15px;
    }
    @media (max-width: 1024px) {
        .label-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        }
    }
    @media (max-width: 768px) {
        .label-grid {
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
            gap: 6px;
        }
    }

    .label-item {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        color: #495057;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
    }
    .label-item:hover {
        background: #f5a623;
        color: white;
        border-color: #f5a623;
        transform: translateY(-1px);
    }
    .label-item.label-active {
        background: #f5a623;
        color: white;
        border-color: #f5a623;
    }
    @media (max-width: 768px) {
        .label-item {
            padding: 6px 10px;
            font-size: 11px;
        }
    }

    .search-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 15px;
    }
    .search-input:focus {
        outline: none;
        border-color: #f5a623;
    }
    @media (max-width: 768px) {
        .search-input {
            font-size: 13px;
            padding: 8px 10px;
        }
    }

    .clear-filter-btn {
        background: #dc3545;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        margin-left: 10px;
        transition: background 0.2s ease;
    }
    .clear-filter-btn:hover {
        background: #c82333;
    }
    @media (max-width: 768px) {
        .clear-filter-btn {
            padding: 5px 10px;
            font-size: 11px;
            margin-left: 0;
            margin-top: 5px;
        }
    }

    .related-gallery-img {
        width: 100%;
        max-width: 200px;
        height: auto;
        border-radius: 8px;
        margin: 0 auto 15px;
        display: block;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    @media (max-width: 1024px) {
        .related-gallery-img {
            max-width: 180px;
        }
    }
    @media (max-width: 768px) {
        .related-gallery-img {
            max-width: 160px;
        }
    }
</style>
