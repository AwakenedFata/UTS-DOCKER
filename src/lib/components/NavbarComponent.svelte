<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { navLinks } from '../../data/index.js';

  let changeColor = $state(false);
  let expanded = $state(false);
  let hasMounted = $state(false);
  let isMobile = $state(false);
  let navbarEl = $state(null);

  $effect(() => {
    if (!hasMounted) return;

    const pathname = $page.url.pathname;
    const isHomePage = pathname === '/';

    const changeBackgroundColor = () => {
      if (isMobile && expanded) {
        changeColor = true;
        return;
      }

      if (isHomePage && window.scrollY <= 10) {
        changeColor = false;
      } else {
        changeColor = true;
      }
    };

    if (isHomePage) {
      changeColor = window.scrollY > 10 || (isMobile && expanded);
      window.addEventListener('scroll', changeBackgroundColor);
      return () => window.removeEventListener('scroll', changeBackgroundColor);
    } else {
      changeColor = true;
    }
  });

  onMount(() => {
    hasMounted = true;

    const checkMobile = () => {
      isMobile = window.innerWidth <= 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleClickOutside = (event) => {
      if (window.innerWidth >= 992) return;
      if (expanded && navbarEl && !navbarEl.contains(event.target)) {
        expanded = false;
        const pathname = $page.url.pathname;
        if (pathname === '/' && window.scrollY <= 10) {
          changeColor = false;
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  function handleLinkClick() {
    expanded = false;
  }

  function toggleNavbar() {
    if (!expanded && isMobile) {
      changeColor = true;
    } else if (!expanded && $page.url.pathname === '/' && window.scrollY <= 10) {
      changeColor = false;
    }
    expanded = !expanded;
  }
</script>

{#if hasMounted}
  <nav class="navbar navbar-expand-lg {changeColor ? 'color-active' : ''}" bind:this={navbarEl}>
    <div class="container">
      <a href="/" class="navbar-brand logo-navbar">
        <img
          src="/assets/Home/logo.avif"
          alt="Logo Komunitas HOK Lampung"
          width="100"
          height="31"
          class="d-inline-block align-top logo-navbar"
        />
      </a>
      <button
        class="navbar-toggler custom-toggler"
        type="button"
        aria-controls="basic-navbar-nav"
        aria-expanded={expanded}
        aria-label="Toggle navigation"
        onclick={toggleNavbar}
      >
        <span class="navbar-toggler-icon">
          <span></span>
        </span>
      </button>
      <div class="collapse navbar-collapse {expanded ? 'show' : ''}" id="basic-navbar-nav">
        <div class="navbar-nav ms-auto">
          {#each navLinks as link (link.id)}
            {@const isMerchandise = link.path === '/merchan'}
            {@const pathname = $page.url.pathname}
            {@const isActive = link.path === '/' ? pathname === '/' : pathname === link.path || pathname.startsWith(`${link.path}/`)}
            <a
              href={link.path}
              class="nav-link {isActive ? 'nav-active' : ''} {isMerchandise ? 'merch-button' : ''}"
              onclick={handleLinkClick}
            >
              <span class={isMerchandise ? 'merch-text' : ''}>{link.text}</span>
            </a>
          {/each}
        </div>
      </div>
    </div>
  </nav>
{/if}
