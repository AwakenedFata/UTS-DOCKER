<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import GalleryFrame from "./GalleryFrame.svelte";

  /** @type {any} */
  let swiperEl = $state(null);
  let screenSize = $state("desktop");
  let swiperInitialized = $state(false);
  let mounted = $state(false);
  /** @type {any[]} */
  let galleryData = $state([]);
  let loading = $state(true);
  /** @type {string | null} */
  let error = $state(null);

  onMount(async () => {
    mounted = true;

    // Fetch gallery data
    try {
      const res = await fetch("/api/seksi-galeri");
      const data = await res.json();
      galleryData = data?.data || [];
    } catch (e) {
      error = "Failed to load gallery data";
    } finally {
      loading = false;
    }

    // Init Swiper web components
    try {
      const { register } = await import("swiper/element/bundle");
      register();
      swiperInitialized = true;
    } catch (err) {
      console.error("Swiper init error:", err);
    }

    // Initial screen size check
    const width = window.innerWidth;
    if (width < 768) screenSize = "mobile";
    else if (width >= 768 && width <= 992) screenSize = "tablet";
    else screenSize = "desktop";
  });

  onMount(() => {
    // Screen size detection with cleanup
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) screenSize = "mobile";
      else if (width >= 768 && width <= 992) screenSize = "tablet";
      else screenSize = "desktop";
    };

    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScreenSize, 150);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  });

  $effect(() => {
    if (!mounted || !swiperInitialized || !galleryData.length || !swiperEl)
      return;

    let slidesPerView,
      spaceBetween,
      coverflowStretch,
      coverflowDepth,
      coverflowModifier;
    let initialSlide = 1;

    if (screenSize === "mobile") {
      slidesPerView = 1;
      spaceBetween = 0;
      coverflowStretch = 0;
      coverflowDepth = 20;
      coverflowModifier = 1;
      initialSlide = 0;
    } else if (screenSize === "tablet") {
      slidesPerView = 3;
      spaceBetween = 10;
      coverflowStretch = -20;
      coverflowDepth = 80;
      coverflowModifier = 1.8;
    } else {
      slidesPerView = 3;
      spaceBetween = -21;
      coverflowStretch = -51;
      coverflowDepth = 100;
      coverflowModifier = 2;
    }

    Object.assign(swiperEl, {
      slidesPerView,
      grabCursor: true,
      spaceBetween,
      centeredSlides: true,
      initialSlide,
      effect: "coverflow",
      coverflowEffect: {
        rotate: 0,
        stretch: coverflowStretch,
        depth: coverflowDepth,
        modifier: coverflowModifier,
        slideShadows: false,
      },
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      loop: false,
      injectStyles: [
        `
        .swiper-pagination {
          bottom: 10px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          z-index: 10;
          margin-top: 10px;
        }
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: white;
          opacity: 0.6;
          margin: 0 5px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: white;
          transform: scale(1.2);
        }
        .swiper-wrapper {
          overflow: visible;
        }
        .swiper-slide {
          display: flex;
          justify-content: center;
          transition: all 0.3s ease;
          padding: 40px 40px 80px;
        }
        .swiper-slide:not(.swiper-slide-active) {
          transform: scale(0.85);
          opacity: 0.7;
          z-index: 0;
        }
        .swiper-slide.swiper-slide-active {
          z-index: 1;
        }
        @media (min-width: 993px) {
          .swiper-slide { padding: 40px 40px 80px; }
        }
        @media (max-width: 992px) and (min-width: 768px) {
          .swiper-slide { padding: 0px 20px 30px; }
          .swiper-slide:not(.swiper-slide-active) { transform: scale(0.8); }
        }
        @media (max-width: 767px) {
          .swiper-slide {
            padding: 20px 10px 50px;
            transform: scale(1) !important;
            opacity: 1 !important;
          }
          .swiper-slide:not(.swiper-slide-active) { display: none; }
        }
        `,
      ],
    });

    swiperEl.initialize();

    setTimeout(() => {
      const bullets = document.querySelectorAll(".swiper-pagination-bullet");
      bullets.forEach((bullet, i) => {
        if (i >= 3) /** @type {HTMLElement} */ (bullet).style.display = "none";
      });
    }, 100);
  });

  async function handleImageClick(galleryItem) {
    try {
      const res = await fetch(
        `/api/artikel-public/by-gallery/${galleryItem._id}`,
      );
      const data = await res.json();

      if (data?.success && data?.article?.slug) {
        goto(`/article/${data.article.slug}`);
      } else {
        goto("/gallery");
      }
    } catch (e) {
      console.error("Error fetching article:", e);
      goto("/gallery");
    }
  }
</script>

<div class="gallery-section">
  <div class="gallery-bg-container">
    <img src="/assets/Gallery/bg.avif" alt="Background" />
  </div>

  <div class="container">
    <div
      class="gallery-title"
      data-aos="fade-down"
      data-aos-duration="400"
      data-aos-offset="0"
    >
      <h2>Gallery</h2>
      <h1>HOK Lampung Community</h1>
    </div>

    {#if loading}
      <div class="loading-container">Loading gallery...</div>
    {:else if error}
      <div class="error-container">{error}</div>
    {:else}
      <div
        class="gallery-carousel-container"
        data-aos="zoom-in"
        data-aos-duration="400"
        data-aos-offset="0"
      >
        {#if swiperInitialized && galleryData.length > 0}
          <swiper-container bind:this={swiperEl} init="false">
            {#each galleryData.slice(0, 3) as item, index (item._id || index)}
              <swiper-slide>
                <GalleryFrame
                  galleryItem={item}
                  onImageClick={handleImageClick}
                />
              </swiper-slide>
            {/each}
          </swiper-container>
        {/if}
        <div class="swiper-pagination"></div>
      </div>
    {/if}
  </div>
</div>

<style>
  .gallery-section {
    position: relative;
    padding: 20px 0;
    overflow-x: hidden;
    overflow-y: hidden;
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  @media (max-width: 1024px) and (min-width: 768px) {
    .gallery-section {
      min-height: 50vh;
      padding: 0;
    }
  }

  .gallery-bg-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .gallery-bg-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gallery-title {
    font-family: "Gilroy", sans-serif;
    text-shadow:
      1px 1px 2px rgba(0, 0, 0, 0.3),
      -1px -1px 2px rgba(255, 255, 255, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.2);
    padding-top: 60px;
    color: white;
    text-align: center;
    margin-bottom: 2rem;
  }

  .gallery-title h2 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0;
  }

  .gallery-title h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 15px;
  }

  @media (max-width: 1024px) {
    .gallery-title {
      padding-top: 0px;
    }
    .gallery-title h2 {
      font-size: 2rem;
    }
    .gallery-title h1 {
      font-size: 1.8rem;
    }
  }

  .gallery-carousel-container {
    padding: 0 0 20px;
    position: relative;
    overflow-x: hidden;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: white;
    font-size: 1.2rem;
  }

  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: #ff6b6b;
    font-size: 1.2rem;
    text-align: center;
  }
</style>
