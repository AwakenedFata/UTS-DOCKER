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
</script>

<div class="welcome-container">
  <div class="welcome-text">
    Welcome to<br />
    Honor Of Kings<br />
    Lampung Official
  </div>
  <div class="hashtag-container">
    <span class="hashtag">#OURALLCOMMUNITY</span>
    <span class="hashtag">#HONOROFKINGS</span>
  </div>
</div>

<style>
  .welcome-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 100%;
    margin: 100px auto 0 40px;
    padding: 0 20px;
  }

  @media (max-width: 991.33px) {
    .welcome-container {
      margin: 0 auto;
      align-items: center;
      text-align: center;
      padding: 25px 15px;
    }
  }

  .welcome-text {
    font-family: "Overpass", sans-serif;
    font-weight: 800;
    font-size: clamp(3rem, 6vw, 4rem);
    color: #f5ab1d;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin: 0;
    padding: 0;
    text-align: left;
    word-spacing: 0.1em;
  }

  @media (max-width: 1199.9px) {
    .welcome-text { font-size: clamp(3rem, 6vw, 2rem); }
  }
  @media (max-width: 991.33px) {
    .welcome-text { text-align: center; font-size: clamp(2.5rem, 10vw, 5rem); }
  }
  @media (max-width: 768px) {
    .welcome-text { font-size: clamp(3.8rem, 5vw, 5rem); }
  }
  @media (max-width: 576px) {
    .welcome-text { font-size: clamp(3rem, 6vw, 3.5rem); }
  }
  @media (max-width: 443.33px) {
    .welcome-text { font-size: clamp(2.65rem, 4vw, 2.5rem); }
  }
  @media (max-width: 400px) {
    .welcome-text { font-size: clamp(2.3rem, 5.5vw, 2.4rem); }
  }
  @media (max-width: 356px) {
    .welcome-text { font-size: clamp(1.8rem, 5vw, 2rem); }
  }

  .hashtag-container {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  @media (max-width: 991.33px) {
    .hashtag-container { justify-content: center; gap: 1.5rem; margin-top: 1.2rem; }
  }
  @media (max-width: 768px) {
    .hashtag-container { gap: 1.2rem; margin-top: 1.2rem; }
  }
  @media (max-width: 576px) {
    .hashtag-container { gap: 1rem; margin-top: 1rem; }
  }
  @media (max-width: 425px) {
    .hashtag-container { gap: 0.8rem; margin-top: 0.8rem; }
  }
  @media (max-width: 375px) {
    .hashtag-container { gap: 0.6rem; margin-top: 0.6rem; }
  }

  .hashtag {
    font-family: "Roboto", sans-serif;
    font-size: clamp(1.2rem, 4vw, 1.33rem);
    color: #000000;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
  }

  @media (max-width: 1199.9px) {
    .hashtag { font-size: clamp(1rem, 3.5vw, 1rem); }
  }
  @media (max-width: 991.33px) {
    .hashtag { font-size: clamp(1rem, 3.5vw, 1.5rem); }
  }
  @media (max-width: 768px) {
    .hashtag { font-size: clamp(1.2rem, 3vw, 1.3rem); }
  }
  @media (max-width: 576px) {
    .hashtag { font-size: clamp(1rem, 2.5vw, 1.2rem); }
  }
  @media (max-width: 428.33px) {
    .hashtag { font-size: clamp(0.9rem, 2vw, 1rem); }
  }
  @media (max-width: 390px) {
    .hashtag { font-size: clamp(0.8rem, 1.8vw, 0.9rem); }
  }
  @media (max-width: 340px) {
    .hashtag { font-size: clamp(0.6rem, 1.5vw, 0.8rem); }
  }
</style>
