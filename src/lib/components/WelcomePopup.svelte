<script>
  import { onMount } from 'svelte';
  import '../../styles/WelcomePopup.css';

  let show = $state(false);
  let closing = $state(false);
  let isClient = $state(false);
  let overlayEl = $state(null);
  let popupEl = $state(null);

  onMount(() => {
    isClient = true;
    const timer = setTimeout(() => {
      show = true;
    }, 300);

    return () => clearTimeout(timer);
  });

  $effect(() => {
    if (!isClient) return;

    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  });

  function closePopup() {
    closing = true;
    sessionStorage.setItem('welcomePopupShown', 'true');
    setTimeout(() => {
      show = false;
      closing = false;
    }, 500);
  }

  function handleOverlayClick(e) {
    if (!popupEl?.contains(e.target) || e.target.classList.contains('popup-overlay')) {
      closePopup();
    }
  }
</script>

{#if isClient && (show || closing)}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="popup-overlay {closing ? 'closing' : ''}"
    onclick={handleOverlayClick}
    bind:this={overlayEl}
  >
    <div class="popup-wrapper">
      <div class="popup-container {closing ? 'closing' : ''}" bind:this={popupEl}>
        <button class="popup-close" onclick={closePopup} aria-label="Close">
          <span class="close-icon">×</span>
        </button>
        <div class="popup-content">
          <a
            href="https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/assets/join-follow-popup.avif"
              alt="join-and-follow"
              width="400"
              height="400"
              class="popup-image"
              style="width: 100%; height: auto;"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
