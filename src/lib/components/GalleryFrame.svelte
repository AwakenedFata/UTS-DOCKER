<script>
  let { galleryItem, onImageClick = () => {} } = $props();

  function handleImageClick() {
    if (onImageClick) {
      onImageClick(galleryItem);
    }
  }
</script>

<div class="frame-container">
  {#if galleryItem.frame}
    <div class="frame-overlay-wrapper">
      <img src={galleryItem.frame.imageUrl} alt="Frame" loading="eager" />
    </div>
  {/if}

  <div class="frame-wrapper">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="gallery-image-wrapper" onclick={handleImageClick}>
      <img
        src={galleryItem.imageUrl || "/placeholder.svg"}
        alt={galleryItem.title}
        loading="eager"
      />
    </div>
  </div>
</div>

<style>
  .frame-container {
    position: relative;
    width: 100%;
    max-width: 350px;
    aspect-ratio: 3/4;
    display: flex;
    justify-content: center;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-radius: 42px;
    margin: 0 auto;
  }

  .frame-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .gallery-image-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 50px;
    overflow: hidden;
    z-index: 1;
    transition: transform 0.3s ease;
    will-change: transform;
  }

  .gallery-image-wrapper:hover {
    transform: scale(1.05);
    cursor: pointer;
  }

  .gallery-image-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  @media (max-width: 992px) {
    .gallery-image-wrapper {
      border-radius: 28px !important;
    }
  }
  @media (max-width: 575px) {
    .gallery-image-wrapper {
      border-radius: 45px !important;
    }
  }
  @media (max-width: 480px) {
    .gallery-image-wrapper {
      border-radius: 48px !important;
    }
  }
  @media (max-width: 380px) {
    .gallery-image-wrapper {
      border-radius: 45px !important;
    }
  }

  .frame-overlay-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    transition: transform 0.3s ease;
    will-change: transform;
  }

  .frame-container:hover .frame-overlay-wrapper {
    transform: scale(1.05);
  }

  .frame-overlay-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-position: center;
  }
</style>
