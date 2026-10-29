<script>
  import { onMount } from "svelte";
  import VideoBackground from "./VideoBackground.svelte";
  import WelcomeComponent from "./WelcomeComponent.svelte";

  let isMobile = $state(false);

  onMount(() => {
    const handleResize = () => {
      isMobile = window.innerWidth <= 768;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  function handleTouchStart(e) {
    e.currentTarget.style.transform = "scale(1.2)";
  }
  function handleTouchEnd(e) {
    e.currentTarget.style.transform = "scale(1)";
  }
  function handleMouseEnter(e) {
    if (!isMobile) e.currentTarget.style.transform = "scale(1.2)";
  }
  function handleMouseLeave(e) {
    if (!isMobile) e.currentTarget.style.transform = "scale(1)";
  }

  const socialLinks = [
    {
      href: "https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR",
      icon: "whatsapp",
    },
    {
      href: "https://www.instagram.com/hoklampung.official/",
      icon: "instagram",
    },
    { href: "https://www.facebook.com/honorofkings.og.id", icon: "facebook" },
    { href: "https://discord.com/invite/yM473crPms", icon: "discord" },
    { href: "https://twitter.com/honorofkings", icon: "twitter" },
    { href: "https://t.me/honorofkings_id", icon: "telegram" },
    {
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com",
      icon: "email",
    },
  ];
</script>

<div class="homepage">
  <h1 class="seo-h1">
    HOK Lampung Official - Komunitas Honor of Kings Lampung
  </h1>
  <header class="w-100 min-vh-100 d-flex align-items-center">
    <VideoBackground />
    <div class="container position-relative" style="z-index: 2;">
      <div
        class="row header-box d-flex flex-lg-row flex-column align-items-center"
      >
        <div
          class="col-lg-6"
          style="overflow: visible; min-height: auto; z-index: 3;"
        >
          <WelcomeComponent />
          <div class="social-icons">
            {#each socialLinks as link}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onmouseenter={handleMouseEnter}
                onmouseleave={handleMouseLeave}
                ontouchstart={handleTouchStart}
                ontouchend={handleTouchEnd}
              >
                {#if link.icon === "whatsapp"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 448 512"
                    fill="currentColor"
                    ><path
                      d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
                    /></svg
                  >
                {:else if link.icon === "instagram"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    ><path
                      d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z"
                    /><path
                      d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z"
                    /></svg
                  >
                {:else if link.icon === "facebook"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    ><path
                      fill-rule="evenodd"
                      d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6845806,22"
                    /></svg
                  >
                {:else if link.icon === "discord"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 640 512"
                    fill="currentColor"
                    ><path
                      d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
                    /></svg
                  >
                {:else if link.icon === "twitter"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    ><path
                      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9L389.2 48zm-24.8 373.8h39.1L151.1 88h-42l255.3 333.8z"
                    /></svg
                  >
                {:else if link.icon === "telegram"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 448 512"
                    fill="currentColor"
                    ><path
                      d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"
                    /></svg
                  >
                {:else if link.icon === "email"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 17 17"
                    fill="currentColor"
                    ><g /><path
                      d="M0 2v13h17v-13h-17zM8.494 9.817l-6.896-6.817h13.82l-6.924 6.817zM5.755 8.516l-4.755 4.682v-9.383l4.755 4.701zM6.466 9.219l2.026 2.003 1.996-1.966 4.8 4.744h-13.677l4.855-4.781zM11.201 8.555l4.799-4.725v9.467l-4.799-4.742z"
                    /></svg
                  >
                {/if}
              </a>
            {/each}
          </div>
        </div>
        <div
          class="col-lg-6 pt-lg-0 pt-5 d-flex justify-content-center"
          style="overflow: visible; z-index: 1;"
        >
          <img
            src="/assets/Home/logo 3D.avif"
            alt="LOGOHOK"
            class="logo3d float-animation"
            width="1000"
            height="1000"
            style="z-index: 1;"
          />
        </div>
      </div>
    </div>
  </header>
</div>
