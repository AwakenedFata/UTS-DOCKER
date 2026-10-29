<script>
  import HeroComponent from '$lib/components/HeroComponent.svelte';
  import CommunityComponent from '$lib/components/CommunityComponent.svelte';
  import SponsorsComponent from '$lib/components/SponsorsComponent.svelte';
  import JoinUsComponent from '$lib/components/JoinUsComponent.svelte';
  import ContactFormComponent from '$lib/components/ContactFormComponent.svelte';
  import GalleryComponent from '$lib/components/GalleryComponent.svelte';
</script>

<svelte:head>
  <title>HOK Lampung Official - Komunitas Honor of Kings Lampung</title>
  <meta name="description" content="HOK Lampung Official adalah website resmi dari komunitas Honor of Kings Lampung. Event, turnamen, dan info komunitas." />
</svelte:head>

<div class="main-background">
  <h1 class="seo-h1">
    HOK Lampung Official - Komunitas Honor of Kings Lampung
  </h1>
  <HeroComponent />
  <CommunityComponent />
  <GalleryComponent />
  <JoinUsComponent />
  <SponsorsComponent />
  <ContactFormComponent />
</div>
