<script>
  import { onMount } from 'svelte';
  import { partners } from '../../data/index.js';

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

  function getPartnerClass(id) {
    if (id === 1) return 'partner-logo-special1';
    if (id === 2) return 'partner-logo-special2';
    if (id === 4) return 'partner-logo-special4';
    if (id === 5) return 'partner-logo-special5';
    return '';
  }

  const firstRow = partners.slice(0, 3);
  const secondRow = partners.slice(3);
</script>

<div id="partners" class="sponsors-section d-flex align-items-center position-relative overflow-container">
  <div class="container">
    <div class="sponsors-title text-center" data-aos="fade-down" data-aos-duration="600" data-aos-offset="20">
      <h1>SPONSOR & PARTNER</h1>
      <div class="title-underline"></div>
    </div>

    <div class="partners-container">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="row justify-content-center top-row">
            {#each firstRow as partner (partner.id)}
              <div
                class="col-lg-4 col-md-4 col-sm-6 col-12 partner-col"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-offset="20"
              >
                <div class="partner-card-wrapper">
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="partner-card"
                    onmouseenter={handleMouseEnter}
                    onmouseleave={handleMouseLeave}
                    ontouchstart={handleTouchStart}
                    ontouchend={handleTouchEnd}
                  >
                    <img
                      src="/assets/SponsorAndPartner/persegi-panjang.png"
                      alt="Card Background"
                      class="sponsor-card-bg"
                      width="350"
                      height="200"
                      style="width: 100%; height: auto;"
                    />
                    <a href={partner.url} target="_blank" rel="noopener noreferrer">
                      <div class="partner-logo-container">
                        <img
                          src={partner.image || '/placeholder.svg'}
                          alt={partner.name}
                          class="partner-logo {getPartnerClass(partner.id)}"
                          width="200"
                          height="100"
                          style="width: auto; height: auto;"
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        {#if secondRow.length > 0}
          <div class="col-12">
            <div class="row justify-content-center bottom-row">
              {#each secondRow as partner (partner.id)}
                <div
                  class="col-lg-4 col-md-4 col-sm-6 col-12 partner-col"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-offset="20"
                >
                  <div class="partner-card-wrapper">
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                      class="partner-card"
                      onmouseenter={handleMouseEnter}
                      onmouseleave={handleMouseLeave}
                      ontouchstart={handleTouchStart}
                      ontouchend={handleTouchEnd}
                    >
                      <img
                        src="/assets/SponsorAndPartner/persegi-panjang.png"
                        alt="Card Background"
                        class="sponsor-card-bg"
                        width="350"
                        height="200"
                        style="width: 100%; height: auto;"
                      />
                      <a href={partner.url} target="_blank" rel="noopener noreferrer">
                        <div class="partner-logo-container">
                          <img
                            src={partner.image || '/placeholder.svg'}
                            alt={partner.name}
                            class="partner-logo {getPartnerClass(partner.id)}"
                            width="200"
                            height="100"
                            style="width: auto; height: auto;"
                          />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
