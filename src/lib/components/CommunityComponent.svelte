<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import AboutUsCard from "./cards/AboutUsCard.svelte";

  let isClient = $state(false);
  let isMobile = $state(false);

  let memberCount = tweened(0, { duration: 2000, easing: cubicOut });
  let teamCount = tweened(0, { duration: 2000, easing: cubicOut });
  let memberAnimated = $state(false);
  let teamAnimated = $state(false);

  let memberEl = $state(/** @type {HTMLDivElement | undefined} */ (undefined));
  let teamEl = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

  onMount(() => {
    isClient = true;

    const handleResize = () => {
      isMobile = window.innerWidth <= 768;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === memberEl && !memberAnimated) {
              memberAnimated = true;
              memberCount.set(250);
            }
            if (entry.target === teamEl && !teamAnimated) {
              teamAnimated = true;
              teamCount.set(20);
            }
          }
        });
      },
      { rootMargin: "-50px" },
    );

    if (memberEl) observer.observe(memberEl);
    if (teamEl) observer.observe(teamEl);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  });

  /** @param {Event} e */
  function handleTouchStart(e) {
    /** @type {HTMLElement} */ (e.currentTarget).style.transform =
      "scale(1.05)";
  }
  /** @param {Event} e */
  function handleTouchEnd(e) {
    /** @type {HTMLElement} */ (e.currentTarget).style.transform = "scale(1)";
  }
  /** @param {Event} e */
  function handleMouseEnter(e) {
    if (!isMobile)
      /** @type {HTMLElement} */ (e.currentTarget).style.transform =
        "scale(1.05)";
  }
  /** @param {Event} e */
  function handleMouseLeave(e) {
    if (!isMobile)
      /** @type {HTMLElement} */ (e.currentTarget).style.transform = "scale(1)";
  }
</script>

<div id="community" class="aboutus-section d-flex align-items-center">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-5 about-card-col">
        <AboutUsCard />
      </div>

      <div class="col-lg-7 right-content-col">
        <div class="logo-container">
          <img
            src="/assets/aboutus/community-logo.avif"
            alt="Community Logo"
            class="community-logo"
            style="width: 100%; height: 100%; object-fit: contain;"
          />
        </div>

        <div class="community-image-container">
          <img
            src="/assets/aboutus/community-members.avif"
            alt="Community Members"
            class="community-image img-fluid"
            width="800"
            height="450"
            style="width: 100%; height: auto;"
          />
        </div>

        <div class="row stat-cards-row">
          <div class="col-auto stat-card-col">
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="stat-card-container hover-zoom"
              onmouseenter={handleMouseEnter}
              onmouseleave={handleMouseLeave}
              ontouchstart={handleTouchStart}
              ontouchend={handleTouchEnd}
            >
              <img
                src="/assets/aboutus/stat-left.avif"
                alt="Stat 1"
                class="statcard1 img-fluid"
                width="150"
                height="200"
                style="width: 100%; height: auto;"
              />
              <div class="count-wrappermember" bind:this={memberEl}>
                <div class="count-text">{Math.round($memberCount)}</div>
              </div>
            </div>
          </div>

          <div class="col-auto stat-card-col">
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="stat-card-container hover-zoom"
              onmouseenter={handleMouseEnter}
              onmouseleave={handleMouseLeave}
              ontouchstart={handleTouchStart}
              ontouchend={handleTouchEnd}
            >
              <img
                src="/assets/aboutus/stat-center.avif"
                alt="Stat 2"
                class="statcard2 img-fluid"
                width="150"
                height="200"
                style="width: 100%; height: auto;"
              />
              <div class="count-wrapperteam" bind:this={teamEl}>
                <div class="count-text">{Math.round($teamCount)}</div>
              </div>
            </div>
          </div>

          <div class="col-auto stat-card-col">
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="stat-card-container hover-zoom"
              onmouseenter={handleMouseEnter}
              onmouseleave={handleMouseLeave}
              ontouchstart={handleTouchStart}
              ontouchend={handleTouchEnd}
            >
              <img
                src="/assets/aboutus/stat-right.avif"
                alt="Stat 3"
                class="statcard3 img-fluid"
                width="150"
                height="200"
                style="width: 100%; height: auto;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
