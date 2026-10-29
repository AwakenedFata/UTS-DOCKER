<script>
  import { onMount } from 'svelte';

  let isMobile = $state(false);

  onMount(() => {
    const handleResize = () => {
      isMobile = window.innerWidth <= 768;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  function handleTouchStart(e) {
    e.currentTarget.style.transform = 'scale(1.05)';
  }
  function handleTouchEnd(e) {
    e.currentTarget.style.transform = 'scale(1)';
  }
  function handleMouseEnter(e) {
    if (!isMobile) e.currentTarget.style.transform = 'scale(1.03)';
  }
  function handleMouseLeave(e) {
    if (!isMobile) e.currentTarget.style.transform = 'scale(1)';
  }
</script>

<div class="joinus-section d-flex align-items-center">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6 left-content" data-aos="fade-up" data-aos-duration="400" data-aos-offset="20">
        <div class="logo-container mb-4">
          <img
            src="/assets/JoinAndFollow/logo-hok-1.avif"
            alt="HOK Logo"
            class="hok-logo"
            width="300"
            height="100"
            style="width: auto; height: auto;"
          />
        </div>

        <div class="joinus-text">
          <h1 class="main-title">Join & Follow Us</h1>
          <h2 class="hashtag">#ourallcommunity</h2>
        </div>

        <div class="qr-container">
          <div class="button-container mb-3">
            <img
              src="/assets/JoinAndFollow/click.avif"
              alt="Click QR Here"
              class="click-button"
              width="220"
              height="50"
              style="width: auto; height: auto;"
            />
          </div>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="qr-code-container"
            onmouseenter={handleMouseEnter}
            onmouseleave={handleMouseLeave}
            ontouchstart={handleTouchStart}
            ontouchend={handleTouchEnd}
          >
            <a href="https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR" target="_blank" rel="noopener noreferrer">
              <img
                src="/assets/JoinAndFollow/qr-code.avif"
                alt="QR Code"
                class="qr-code"
                width="220"
                height="220"
                style="width: auto; height: auto;"
              />
            </a>
          </div>
        </div>
      </div>

      <div class="col-lg-6 right-content" data-aos="fade-up" data-aos-duration="400" data-aos-offset="20">
        <div class="phone-container float-animation">
          <img
            src="/assets/JoinAndFollow/iphone.avif"
            alt="Phone Preview"
            class="phone-image"
            width="500"
            height="600"
            style="width: auto; height: auto;"
          />
        </div>
      </div>
    </div>
  </div>
</div>
