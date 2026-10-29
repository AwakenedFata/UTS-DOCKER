<script>
    import { goto } from "$app/navigation";

    let hoveredCard = $state(/** @type {number | null} */ (null));
</script>

<svelte:head>
    <title>About Us - HOK Lampung</title>
</svelte:head>

<div class="aboutus-page w-100 min-vh-100">
    <div class="page-container">
        <div class="bg-wrapper">
            <img
                src="/assets/aboutus/background.avif"
                alt="Background"
                loading="eager"
            />
        </div>
        <div class="cards-wrapper">
            <div
                class="about-card"
                role="button"
                tabindex="0"
                onclick={() => goto("/aboutus/maknalogo")}
                onkeydown={(e) =>
                    e.key === "Enter" && goto("/aboutus/maknalogo")}
                onmouseenter={() => (hoveredCard = 1)}
                onmouseleave={() => (hoveredCard = null)}
            >
                <div class="card-content">
                    <div class="image-container-logo">
                        <img
                            src="/assets/aboutus/logo2.avif"
                            alt="Makna Logo HOK"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div class="card-label">Makna Logo</div>
            </div>

            <div
                class="about-card"
                role="img"
                aria-label="Member Coming Soon"
                onmouseenter={() => (hoveredCard = 2)}
                onmouseleave={() => (hoveredCard = null)}
            >
                <div class="card-content">
                    <div class="image-container-siluet">
                        <img
                            src="/assets/aboutus/personsiluet.avif"
                            alt="Member Coming Soon"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div class="card-label">Member (Coming Soon)</div>
            </div>
        </div>
    </div>
</div>

<style>
    .page-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    @media (max-width: 768px) {
        .page-container {
            padding: 120px 20px 40px;
            align-items: flex-start;
        }
    }

    @media (max-width: 480px) {
        .page-container {
            padding: 50px 15px 30px;
        }
    }

    .bg-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 0;
    }

    .bg-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .cards-wrapper {
        display: flex;
        gap: 60px;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 1400px;
        position: relative;
        z-index: 1;
    }

    @media (max-width: 1024px) {
        .cards-wrapper {
            gap: 40px;
        }
    }

    @media (max-width: 768px) {
        .cards-wrapper {
            flex-direction: column;
            gap: 40px;
            padding: 20px 0;
        }
    }

    @media (max-width: 480px) {
        .cards-wrapper {
            gap: 30px;
            padding: 15px 0;
        }
    }

    .about-card {
        width: 340px;
        height: 440px;
        border-radius: 26px;
        overflow: hidden;
        background-color: #f5a623;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
        display: flex;
        flex-direction: column;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        cursor: pointer;
        position: relative;
    }

    @media (max-width: 1024px) {
        .about-card {
            width: 300px;
            height: 388px;
            border-radius: 23px;
        }
    }

    @media (max-width: 768px) {
        .about-card {
            width: 320px;
            height: 414px;
            border-radius: 24px;
        }
    }

    @media (max-width: 480px) {
        .about-card {
            width: 280px;
            height: 362px;
            border-radius: 21px;
            box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3);
        }
    }

    @media (max-width: 380px) {
        .about-card {
            width: 260px;
            height: 336px;
            border-radius: 20px;
        }
    }

    @media (max-width: 340px) {
        .about-card {
            width: 240px;
            height: 310px;
            border-radius: 18px;
        }
    }

    .about-card:hover {
        transform: scale(1.02);
    }

    .about-card:active {
        transform: scale(1.04);
    }

    @media (hover: none) {
        .about-card:hover {
            transform: none;
        }
        .about-card:active {
            transform: scale(0.98);
        }
    }

    .card-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background-color: #f5a623;
    }

    .image-container-logo {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image-container-logo img {
        width: 68%;
        height: auto;
        object-fit: contain;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        transition: transform 0.4s ease;
    }

    @media (max-width: 480px) {
        .image-container-logo img {
            width: 65%;
        }
    }

    .about-card:hover .image-container-logo img {
        transform: scale(1.08) rotate(2deg);
    }

    .image-container-siluet {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        position: relative;
    }

    .image-container-siluet img {
        width: 70%;
        height: auto;
        object-fit: contain;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
        transition: transform 0.4s ease;
    }

    @media (max-width: 480px) {
        .image-container-siluet img {
            width: 68%;
        }
    }

    .about-card:hover .image-container-siluet img {
        transform: scale(1.08) rotate(2deg);
    }

    .card-label {
        padding: 12px;
        background-color: rgba(0, 0, 0, 0.55);
        text-align: center;
        color: white;
        font-size: 24px;
        font-weight: 500;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }

    @media (max-width: 1024px) {
        .card-label {
            font-size: 22px;
            min-height: 40px;
        }
    }

    @media (max-width: 768px) {
        .card-label {
            font-size: 20px;
            padding: 10px;
        }
    }

    @media (max-width: 480px) {
        .card-label {
            font-size: 18px;
            min-height: 36px;
            padding: 8px;
        }
    }

    @media (max-width: 360px) {
        .card-label {
            font-size: 16px;
            min-height: 32px;
        }
    }

    .card-label::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, #f5a623, transparent);
        opacity: 0;
        transition: opacity 0.4s ease;
    }

    .about-card:hover .card-label::before {
        opacity: 1;
    }
</style>
