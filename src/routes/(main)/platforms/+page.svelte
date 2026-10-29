<script>
    import { onMount } from "svelte";

    const platforms = [
        {
            id: 1,
            image: "/assets/platforms/whatsapp-icon.avif",
            url: "https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR",
        },
        {
            id: 2,
            image: "/assets/platforms/instagram-logo.avif",
            url: "https://www.instagram.com/hoklampung.official/",
        },
        {
            id: 3,
            image: "/assets/platforms/facebook-circle-logo.avif",
            url: "https://www.facebook.com/Hoklampung",
        },
        {
            id: 4,
            image: "/assets/platforms/discord-logo.avif",
            url: "https://discord.gg/d43PJ4zS",
        },
        {
            id: 5,
            image: "/assets/platforms/logo-x-modern-2023.avif",
            url: "https://x.com/HonorOfKings",
        },
        {
            id: 6,
            image: "/assets/platforms/tiktok-logo.avif",
            url: "https://www.tiktok.com/@honorofkings.og.id",
        },
        {
            id: 7,
            image: "/assets/platforms/youtube.avif",
            url: "https://www.youtube.com/@honorofkings.indonesia",
        },
    ];

    let isMobile = $state(false);

    onMount(() => {
        const handleResize = () => {
            isMobile = window.innerWidth < 576;
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    function handleTouchStart(e) {
        e.currentTarget.style.transform = "scale(1.05)";
    }
    function handleTouchEnd(e) {
        e.currentTarget.style.transform = "scale(1)";
    }
    function handleMouseEnter(e) {
        if (!isMobile) e.currentTarget.style.transform = "scale(1.05)";
    }
    function handleMouseLeave(e) {
        if (!isMobile) e.currentTarget.style.transform = "scale(1)";
    }
</script>

<svelte:head>
    <title>Platforms - HOK Lampung</title>
</svelte:head>

<div class="page-wrapper platforms-page">
    <div class="bg-overlay">
        <img
            src="/assets/platforms/platforms.avif"
            alt="Platforms Background"
            loading="eager"
        />
    </div>

    <h1 class="title">Platforms</h1>

    <div class="container-fluid px-md-5">
        {#if isMobile}
            <div
                class="row justify-content-center g-2"
                data-aos="zoom-in"
                data-aos-duration="1000"
            >
                {#each platforms as platform (platform.id)}
                    <div class="col-6 d-flex justify-content-center">
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="platform-card"
                            ontouchstart={handleTouchStart}
                            ontouchend={handleTouchEnd}
                        >
                            <div class="card-bg"></div>
                            <div class="card-img-wrap">
                                <img
                                    src={platform.image}
                                    alt="Platform"
                                    loading="lazy"
                                />
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="row justify-content-center g-3 mb-4">
                {#each platforms.slice(0, 4) as platform (platform.id)}
                    <div
                        class="col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2 d-flex justify-content-center"
                        data-aos="zoom-in"
                        data-aos-duration="1000"
                    >
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="platform-card"
                            onmouseenter={handleMouseEnter}
                            onmouseleave={handleMouseLeave}
                        >
                            <div class="card-bg"></div>
                            <div class="card-img-wrap">
                                <img
                                    src={platform.image}
                                    alt="Platform"
                                    loading="lazy"
                                />
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
            <div class="row justify-content-center g-3">
                {#each platforms.slice(4, 7) as platform (platform.id)}
                    <div
                        class="col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2 d-flex justify-content-center"
                        data-aos="zoom-in"
                        data-aos-duration="1000"
                    >
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="platform-card"
                            onmouseenter={handleMouseEnter}
                            onmouseleave={handleMouseLeave}
                        >
                            <div class="card-bg"></div>
                            <div class="card-img-wrap">
                                <img
                                    src={platform.image}
                                    alt="Platform"
                                    loading="lazy"
                                />
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .page-wrapper {
        position: relative;
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 0 100px;
    }
    @media (max-width: 1024px) and (min-width: 576px) {
        .page-wrapper {
            min-height: 100vh;
            padding: 50px 20px 100px;
            justify-content: center;
        }
    }
    @media (max-width: 575px) {
        .page-wrapper {
            padding: 30px 15px 80px;
        }
    }

    .bg-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .bg-overlay img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.7);
    }

    .title {
        font-family: "Nasalization", sans-serif;
        font-size: 5rem;
        margin-top: 50px;
        margin-bottom: 40px;
        text-align: center;
        text-transform: uppercase;
        text-shadow:
            2px 2px 2px rgba(0, 0, 0, 0.5),
            -1px -1px 2px rgba(255, 255, 255, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.2);
        color: #f5ab1d;
        position: relative;
        z-index: 1;
    }
    @media (max-width: 1024px) and (min-width: 576px) {
        .title {
            font-size: 4rem;
            margin-bottom: 50px;
        }
    }
    @media (max-width: 575px) {
        .title {
            font-size: 3rem;
            margin-bottom: 20px;
            padding-top: 40px;
        }
    }

    .platform-card {
        position: relative;
        width: clamp(120px, 10vw, 150px);
        height: clamp(120px, 10vw, 150px);
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
        text-decoration: none;
    }
    @media (max-width: 575px) {
        .platform-card {
            width: 120px;
            height: 120px;
        }
    }
    @media (max-width: 1024px) and (min-width: 576px) {
        .platform-card {
            width: clamp(100px, 15vw, 160px);
            height: clamp(100px, 15vw, 160px);
        }
    }

    .card-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        z-index: 1;
    }

    .card-img-wrap {
        position: relative;
        width: 60%;
        height: 60%;
        z-index: 2;
    }
    .card-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
