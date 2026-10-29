<script>
    import { onMount } from "svelte";
    import GalleryCard from "$lib/components/cards/GalleryCard.svelte";

    let { data } = $props();

    let currentPage = $state(1);
    const itemsPerPage = 6;

    onMount(() => {
        const saved = sessionStorage.getItem("galleryCurrentPage");
        if (saved) {
            const num = parseInt(saved, 10);
            const max = Math.ceil(data.galleries.length / itemsPerPage);
            if (num >= 1 && num <= max) currentPage = num;
        }
    });

    $effect(() => {
        sessionStorage.setItem("galleryCurrentPage", String(currentPage));
    });

    const totalPages = $derived(
        Math.ceil(data.galleries.length / itemsPerPage),
    );

    const currentItems = $derived(
        data.galleries.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
        ),
    );

    function getPaginationNumbers() {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "…");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("…", totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    }

    function handlePageChange(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
</script>

<svelte:head>
    <title>Gallery - HOK Lampung</title>
</svelte:head>

<div class="gallery-page w-100 min-vh-100">
    <div class="wrapper-gallery-page">
        <div class="wrapper">
            {#if data.banner}
                <div class="banner-wrapper">
                    <img
                        src={data.banner.imageUrl || "/placeholder.svg"}
                        alt="Gallery Banner"
                        loading="eager"
                        style="width:100%;height:100%;object-fit:cover;object-position:center;"
                    />
                </div>
            {/if}

            <div class="grid">
                {#each currentItems as item (item._id)}
                    <GalleryCard {item} />
                {/each}
            </div>

            {#if totalPages > 1}
                <div class="pagination-wrapper">
                    <button
                        class="pagination-arrow"
                        onclick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Halaman sebelumnya"
                        title="Sebelumnya">‹</button
                    >

                    {#each getPaginationNumbers() as number, index (index)}
                        {#if number === "…"}
                            <span class="pagination-dots" aria-hidden="true"
                                >…</span
                            >
                        {:else}
                            <button
                                class="pagination-btn"
                                class:active={currentPage === number}
                                onclick={() => handlePageChange(number)}
                                aria-current={currentPage === number
                                    ? "page"
                                    : undefined}
                                aria-label={`Ke halaman ${number}`}
                                title={`Halaman ${number}`}>{number}</button
                            >
                        {/if}
                    {/each}

                    <button
                        class="pagination-arrow"
                        onclick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Halaman berikutnya"
                        title="Berikutnya">›</button
                    >
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .wrapper-gallery-page {
        padding-top: 0px;
        min-height: 100vh;
    }

    @media (min-width: 640px) {
        .wrapper-gallery-page {
            padding-top: 0px;
        }
    }

    .wrapper {
        display: flex;
        flex-direction: column;
    }

    .banner-wrapper {
        position: relative;
        width: 100%;
        height: clamp(100px, 28vw, 360px);
        margin-bottom: 32px;
        overflow: hidden;
    }

    @media (min-width: 640px) {
        .banner-wrapper {
            margin-bottom: 40px;
        }
    }
    @media (min-width: 1024px) {
        .banner-wrapper {
            margin-bottom: 50px;
        }
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
        min-height: 400px;
    }

    @media (min-width: 640px) {
        .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            min-height: 500px;
            padding: 0 20px;
        }
    }

    @media (min-width: 1024px) {
        .grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 36px;
            min-height: 600px;
        }
    }

    .pagination-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        margin: 28px 0 40px 0;
        padding: 0 16px;
    }

    @media (min-width: 640px) {
        .pagination-wrapper {
            gap: 8px;
            margin: 32px 0 50px 0;
            padding: 0 20px;
        }
    }

    .pagination-btn,
    .pagination-arrow {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 50%;
        background: #ffffff;
        color: #333333;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 640px) {
        .pagination-btn,
        .pagination-arrow {
            width: 40px;
            height: 40px;
            font-size: 16px;
        }
    }

    .pagination-btn:hover {
        background: #f5f5f5;
        transform: translateY(-1px);
    }
    .pagination-btn.active {
        background: #f5a623;
        color: #ffffff;
    }
    .pagination-btn.active:hover {
        background: #e6951f;
    }

    .pagination-arrow {
        font-size: 22px;
        line-height: 1;
        padding-bottom: 4px;
        color: #666;
    }

    @media (min-width: 640px) {
        .pagination-arrow {
            font-size: 26px;
        }
    }

    .pagination-arrow:hover:not(:disabled) {
        background: #f5f5f5;
        color: #333;
    }
    .pagination-arrow:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination-dots {
        font-size: 14px;
        color: #666;
        padding: 0 6px;
    }

    @media (min-width: 640px) {
        .pagination-dots {
            font-size: 16px;
            padding: 0 8px;
        }
    }
</style>
