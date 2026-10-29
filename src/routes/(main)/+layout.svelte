<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import NavbarComponent from '$lib/components/NavbarComponent.svelte';
  import FooterComponent from '$lib/components/FooterComponent.svelte';
  import WelcomePopup from '$lib/components/WelcomePopup.svelte';
  import SecurityProtection from '$lib/components/SecurityProtection.svelte';

  let { children } = $props();

  let showPopup = $state(false);
  let isClient = $state(false);

  $effect(() => {
    if (!isClient) return;

    const pathname = $page.url.pathname;
    if (pathname === '/') {
      const isPageRefresh = !sessionStorage.getItem('navigationOccurred');
      const popupClosed = sessionStorage.getItem('welcomePopupShown');

      if (isPageRefresh || !popupClosed) {
        showPopup = true;
      } else {
        showPopup = false;
      }

      sessionStorage.setItem('navigationOccurred', 'true');
    } else {
      showPopup = false;
      sessionStorage.setItem('navigationOccurred', 'true');
    }
  });

  onMount(() => {
    isClient = true;

    const handleBeforeUnload = () => {
      sessionStorage.removeItem('navigationOccurred');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });
</script>

<SecurityProtection />
<NavbarComponent />
{#if isClient && showPopup && $page.url.pathname === '/'}
  <WelcomePopup />
{/if}
<main>{@render children()}</main>
<FooterComponent />
