<script>
  import '../styles/main.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'animate.css';
  import 'aos/dist/aos.css';
  import { onMount } from 'svelte';
  import AOS from 'aos';
  import TurnstileGate from '$lib/components/TurnstileGate.svelte';

  let { children } = $props();

  onMount(() => {
    AOS.init({
      once: true,
      offset: 0,
      throttleDelay: 50,
    });
  });
</script>

<svelte:head>
  <title>HOK Lampung Official</title>
  <meta name="description" content="HOK Lampung Official adalah website resmi dari komunitas Honor of Kings Lampung. Event, turnamen, dan info komunitas." />

  <!-- Open Graph -->
  <meta property="og:title" content="HOK Lampung Official" />
  <meta property="og:description" content="HOK Lampung Official adalah website resmi dari komunitas Honor of Kings Lampung. Event, turnamen, dan info komunitas." />
  <meta property="og:url" content="https://hoklampung.com" />
  <meta property="og:site_name" content="HOK Lampung Official" />
  <meta property="og:image" content="https://hoklampung.com/logosearch.png" />
  <meta property="og:image:width" content="834" />
  <meta property="og:image:height" content="834" />
  <meta property="og:image:alt" content="HOK Lampung Logo" />
  <meta property="og:locale" content="id_ID" />
  <meta property="og:type" content="website" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="HOK Lampung Official" />
  <meta name="twitter:description" content="HOK Lampung Official adalah website resmi dari komunitas Honor of Kings Lampung. Event, turnamen, dan info komunitas." />
  <meta name="twitter:image" content="https://hoklampung.com/logosearch.png" />

  <!-- Schema Organization -->
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HOK Lampung",
    url: "https://hoklampung.com",
    logo: "https://hoklampung.com/logosearch.png",
    sameAs: ["https://www.instagram.com/hoklampung.official"],
  })}</script>`}
</svelte:head>

<TurnstileGate>
  {@render children()}
</TurnstileGate>
