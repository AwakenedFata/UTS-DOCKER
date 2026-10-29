<script>
  import { onMount } from 'svelte';

  let isClient = $state(false);

  onMount(() => {
    isClient = true;
  });
</script>

{#if isClient}
  <video
    autoplay
    muted
    loop
    playsinline
    class="video-background"
    src="/assets/Home/herobackground_compressedsmall.mp4"
  ></video>
{:else}
  <div class="video-background-placeholder"></div>
{/if}
