<script>
    import { onMount } from "svelte";

    const marketPlace = [
        { id: 1, image: "/assets/Merchandise/shopee.avif", name: "Shopee" },
        {
            id: 2,
            image: "/assets/Merchandise/tokopedia.avif",
            name: "Tokopedia",
        },
        { id: 3, image: "/assets/Merchandise/lazada.avif", name: "Lazada" },
        {
            id: 4,
            image: "/assets/Merchandise/tiktokshop.avif",
            name: "TikTok Shop",
        },
        { id: 5, image: "/assets/Merchandise/blibli2.avif", name: "Blibli" },
        { id: 6, image: "/assets/Merchandise/toco.avif", name: "Toco" },
    ];
</script>

<svelte:head>
    <title>Merchandise - HOK Lampung</title>
</svelte:head>

<div class="page-container">
    <div class="content-wrapper">
        <div class="product-section">
            <img
                src="/assets/Merchandise/product.avif"
                alt="Merchandise Products"
                class="product-image"
                loading="eager"
            />
        </div>

        <div class="info-section">
            <h1 class="title">Available On</h1>
            <div class="marketplace-box">
                {#each marketPlace as mp (mp.id)}
                    <div class="mp-icon">
                        <img src={mp.image} alt={mp.name} loading="lazy" />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .page-container {
        width: 100%;
        min-height: 100vh;
        background-color: #cdcdcd;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 70px 20px 20px;
        font-family: "Gilroy-SemiBold", sans-serif;
    }
    @media (max-width: 768px) {
        .page-container {
            padding: 50px 20px 70px;
        }
    }
    @media (max-width: 480px) {
        .page-container {
            padding: 60px 20px 80px;
        }
    }

    .content-wrapper {
        width: 100%;
        max-width: 1400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    @media (max-width: 768px) {
        .content-wrapper {
            flex-direction: column;
            gap: 20px;
            justify-content: center;
        }
    }

    .product-section {
        flex: 1.5;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 500px;
    }
    @media (max-width: 768px) {
        .product-section {
            flex: 1;
            min-height: auto;
            width: 100%;
            max-width: 100%;
            padding: 0 10px;
        }
    }
    @media (max-width: 480px) {
        .product-section {
            padding: 20px 5px 0;
        }
    }

    .product-image {
        width: 150%;
        height: auto;
        max-width: 850px;
        object-fit: contain;
        filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2));
        margin-left: 40px;
    }
    @media (max-width: 1024px) {
        .product-image {
            max-width: 650px;
            margin-left: 0;
        }
    }
    @media (max-width: 768px) {
        .product-image {
            width: 100%;
            max-width: 500px;
        }
    }
    @media (max-width: 480px) {
        .product-image {
            width: 150%;
            max-width: 360px;
        }
    }
    @media (max-width: 375px) {
        .product-image {
            max-width: 300px;
        }
    }

    .info-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
    @media (max-width: 768px) {
        .info-section {
            align-items: center;
            text-align: center;
            width: 100%;
            gap: 40px;
        }
    }
    @media (max-width: 480px) {
        .info-section {
            gap: 35px;
        }
    }

    .title {
        font-size: 2rem;
        color: #c41e3a;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin: 0;
        line-height: 1.2;
        font-weight: normal;
    }
    @media (max-width: 1024px) {
        .title {
            font-size: 2.2rem;
        }
    }
    @media (max-width: 768px) {
        .title {
            font-size: 2.8rem;
        }
    }
    @media (max-width: 480px) {
        .title {
            font-size: 2.3rem;
            letter-spacing: 1.5px;
        }
    }
    @media (max-width: 375px) {
        .title {
            font-size: 2rem;
        }
    }

    .marketplace-box {
        width: 75%;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 20px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        align-items: center;
        justify-items: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    @media (max-width: 1024px) {
        .marketplace-box {
            padding: 25px;
            width: 90%;
            gap: 15px;
        }
    }
    @media (max-width: 768px) {
        .marketplace-box {
            padding: 35px 30px;
            gap: 25px;
            width: 85%;
            max-width: 500px;
        }
    }
    @media (max-width: 480px) {
        .marketplace-box {
            padding: 32px 28px;
            gap: 22px;
            border-radius: 18px;
            width: 90%;
        }
    }
    @media (max-width: 375px) {
        .marketplace-box {
            padding: 28px 24px;
            gap: 20px;
            width: 92%;
        }
    }

    .mp-icon {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            transform 0.3s ease,
            filter 0.3s ease;
        cursor: pointer;
    }
    .mp-icon:hover {
        transform: scale(1.1);
        filter: brightness(1.1);
    }
    .mp-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    @media (max-width: 1024px) {
        .mp-icon {
            width: 55px;
            height: 55px;
        }
    }
    @media (max-width: 768px) {
        .mp-icon {
            width: 75px;
            height: 75px;
        }
    }
    @media (max-width: 480px) {
        .mp-icon {
            width: 68px;
            height: 68px;
        }
    }
    @media (max-width: 375px) {
        .mp-icon {
            width: 62px;
            height: 62px;
        }
    }
</style>
