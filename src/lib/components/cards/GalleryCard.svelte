<script>
    import { goto } from "$app/navigation";
    import { format } from "date-fns";

    let { item } = $props();

    const googleMapsPatterns = [
        /^https:\/\/maps\.google\.com/,
        /^https:\/\/www\.google\.com\/maps/,
        /^https:\/\/goo\.gl\/maps/,
        /^https:\/\/maps\.app\.goo\.gl/,
    ];

    const formattedDate = $derived(
        item.uploadDate ? format(new Date(item.uploadDate), "dd-MM-yyyy") : "",
    );

    const hasValidMapLink = $derived(
        !!(
            item.mapLink &&
            item.mapLink.trim() &&
            googleMapsPatterns.some((p) => p.test(item.mapLink.trim()))
        ),
    );

    async function handleCardClick() {
        try {
            const res = await fetch(
                `/api/artikel-public/by-gallery/${item._id}`,
            );
            const data = await res.json();
            if (data?.success && data?.article?.slug) {
                goto(`/article/${data.article.slug}`);
            } else {
                alert("Artikel belum tersedia untuk galeri ini");
            }
        } catch (err) {
            console.error("Error fetching related article:", err);
            alert("Terjadi kesalahan saat mengambil artikel");
        }
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="gallery-card"
    role="link"
    tabindex="0"
    onclick={handleCardClick}
    onkeydown={(e) => e.key === "Enter" && handleCardClick()}
>
    <div class="image-wrapper">
        <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            loading="eager"
        />
    </div>
    <div class="card-content">
        <div class="wrapper-upper">
            <span class="label">{item.label}</span>
            <div class="date-text">{formattedDate}</div>
        </div>
        <h3 class="card-title">{item.title}</h3>
        <div class="wrapper-lower">
            <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                style="flex-shrink:0; vertical-align: middle;"
            >
                <path
                    d="M515.664-.368C305.76-.368 128 178.4 128 390.176c0 221.76 206.032 448.544 344.624 607.936.528.64 22.929 25.52 50.528 25.52h2.449c27.6 0 49.84-24.88 50.399-25.52 130.064-149.52 320-396.048 320-607.936C896 178.4 757.344-.368 515.664-.368zm12.832 955.552c-1.12 1.12-2.753 2.369-4.193 3.409-1.472-1.008-3.072-2.288-4.255-3.408l-16.737-19.248C371.92 785.2 192 578.785 192 390.176c0-177.008 148.224-326.56 323.664-326.56 218.528 0 316.336 164 316.336 326.56 0 143.184-102.128 333.296-303.504 565.008zm-15.377-761.776c-106.032 0-192 85.968-192 192s85.968 192 192 192 192-85.968 192-192-85.968-192-192-192zm0 320c-70.576 0-129.473-58.816-129.473-129.408 0-70.576 57.424-128 128-128 70.624 0 128 57.424 128 128 .032 70.592-55.903 129.408-126.527 129.408z"
                ></path>
            </svg>
            {#if hasValidMapLink}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <a
                    href={item.mapLink.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Klik untuk buka lokasi di Google Maps"
                    class="meta-link"
                    onclick={(e) => e.stopPropagation()}>{item.location}</a
                >
            {:else}
                <span class="meta-text" title="Lokasi">{item.location}</span>
            {/if}
        </div>
    </div>
</div>

<style>
    .gallery-card {
        background: #fff;
        border-radius: 20px;
        overflow: hidden;
        transition: transform 0.3s ease;
        margin-bottom: 20px;
        cursor: pointer;
    }

    @media (min-width: 640px) {
        .gallery-card {
            margin-bottom: 26px;
        }
    }
    @media (min-width: 1024px) {
        .gallery-card {
            margin-bottom: 30px;
        }
    }

    .gallery-card:hover {
        transform: scale(1.02);
    }

    .image-wrapper {
        width: 100%;
        height: 280px;
        overflow: hidden;
        border-radius: 20px;
        position: relative;
        background: #f8f9fa;
        aspect-ratio: 16 / 10;
    }

    .image-wrapper img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
    }

    @media (max-width: 480px) {
        .image-wrapper {
            height: 200px;
        }
    }

    @media (min-width: 1024px) {
        .image-wrapper {
            aspect-ratio: 16 / 9;
            height: 280px;
        }
    }

    .card-content {
        padding: 16px;
        margin-left: 2px;
    }

    @media (max-width: 480px) {
        .card-content {
            padding: 25px;
        }
    }
    @media (min-width: 640px) {
        .card-content {
            padding: 20px;
        }
    }
    @media (min-width: 1024px) {
        .card-content {
            padding: 26px;
        }
    }

    .wrapper-upper {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        margin-bottom: 6px;
    }

    @media (min-width: 640px) {
        .wrapper-upper {
            gap: 12px;
            margin-bottom: 8px;
        }
    }

    .label {
        display: inline-block;
        background: #f5a623;
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        padding: 1px 10px;
        border-radius: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    @media (min-width: 640px) {
        .label {
            font-size: 14px;
            padding: 1px 11px;
        }
    }
    @media (min-width: 1024px) {
        .label {
            font-size: 15px;
            padding: 1px 12px;
        }
    }

    .date-text {
        font-size: 12px;
        color: #95a5a6;
        margin-top: 2px;
    }

    @media (min-width: 640px) {
        .date-text {
            margin-top: 4px;
        }
    }

    .card-title {
        font-family: "Poppins-Semibold", sans-serif;
        font-weight: normal;
        margin: 0 0 10px 0;
        cursor: pointer;
        line-height: 1.3;
        white-space: pre-line;
        word-wrap: break-word;
        font-size: 18px;
    }

    @media (max-width: 480px) {
        .card-title {
            font-size: 25px;
        }
    }
    @media (min-width: 640px) {
        .card-title {
            font-size: 22px;
        }
    }
    @media (min-width: 1024px) {
        .card-title {
            font-size: 29px;
        }
    }

    .wrapper-lower {
        display: flex;
        gap: 6px;
        color: #fe5050;
    }

    .meta-link {
        display: flex;
        align-items: center;
        font-size: 12px;
        cursor: pointer;
        color: #fe5050;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .meta-link:hover {
        color: #e74c3c;
    }
    .meta-link:visited {
        color: #fe5050;
    }

    @media (min-width: 1024px) {
        .meta-link {
            font-size: 11px;
        }
    }

    .meta-text {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #fe5050;
    }

    @media (min-width: 1024px) {
        .meta-text {
            font-size: 11px;
        }
    }
</style>
