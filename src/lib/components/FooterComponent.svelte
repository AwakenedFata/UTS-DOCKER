<script>
  import { onMount } from "svelte";

  let currentYear = $state(2023);
  let email = $state("");
  let status = $state("");

  onMount(() => {
    currentYear = new Date().getFullYear();
  });

  async function handleSubscribe() {
    if (!email) {
      status = "Email tidak boleh kosong.";
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      status = data.message || data.error;
      email = "";
    } catch (error) {
      status = "Terjadi kesalahan. Coba lagi.";
    }
  }
</script>

<footer class="footer">
  <div class="container">
    <!-- Main Footer Content -->
    <div class="row main-footer-row">
      <!-- Left Column - Logo and Newsletter -->
      <div class="col-lg-4 col-md-12 footer-left-col">
        <div class="footer-logo-container">
          <img
            src="/assets/newlogowhite.avif"
            alt="HOK Lampung Community"
            class="footer-logo"
            width="80"
            height="80"
            style="width: auto; height: auto;"
          />
        </div>
        <p class="footer-text">
          Jangan lewatkan info terbaru seputar event, turnamen, dan kabar
          menarik dari HOK Lampung! Masukkan email kamu untuk tetap terhubung
          bersama komunitas kami.
        </p>
        <div class="newsletter-form">
          <div class="input-group">
            <input
              type="email"
              class="form-control"
              placeholder="Submit email"
              bind:value={email}
            />
            <button
              class="btn btn-submit"
              type="button"
              aria-label="Subscribe newsletter"
              onclick={handleSubscribe}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="currentColor"
                ><path
                  d="M1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14a1.75 1.75 0 0 1-1.75 1.75H1.75A1.75 1.75 0 0 1 0 18.75v-14C0 3.784.784 3 1.75 3ZM1.5 7.412V18.75c0 .138.112.25.25.25h20.5a.25.25 0 0 0 .25-.25V7.412l-9.52 6.433c-.592.4-1.368.4-1.96 0Zm0-2.662v.852l10.36 7a.25.25 0 0 0 .28 0l10.36-7V4.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Z"
                /></svg
              >
            </button>
          </div>
          {#if status}
            <p class="mt-2">{status}</p>
          {/if}
        </div>
      </div>

      <!-- Middle Column - About Links -->
      <div class="col-lg-2 col-md-4 col-sm-6 footer-col">
        <h5 class="footer-heading">About</h5>
        <ul class="footer-links">
          <li><a href="/#community">Tentang Kami</a></li>
          <li><a href="/aboutus/maknalogo">Profile Logo</a></li>
          <li><a href="/#partners">Partner &amp; Sponsor</a></li>
          <li><a href="/#contact-us">Bantuan &amp; Dukungan</a></li>
        </ul>
      </div>

      <!-- Middle Column - Service Links -->
      <div class="col-lg-2 col-md-4 col-sm-6 footer-col">
        <h5 class="footer-heading">Service</h5>
        <ul class="footer-links">
          <li>
            <a
              href="https://whatsapp.com/channel/0029Vb7zKjz1SWt5WHmcWB31"
              target="_blank"
              rel="noopener noreferrer"
            >
              Event &amp; Turnamen
            </a>
          </li>
          <li>
            <a
              href="https://wa.me/6285709346954"
              target="_blank"
              rel="noopener noreferrer"
            >
              Daftar Member
            </a>
          </li>
          <li>
            <a
              href="https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR"
              target="_blank"
              rel="noopener noreferrer"
            >
              Forum Diskusi
            </a>
          </li>
          <li><a href="/gallery">Gallery</a></li>
        </ul>
      </div>

      <!-- Right Column - Contact Info -->
      <div class="col-lg-4 col-md-4 col-sm-12 footer-col">
        <h5 class="footer-heading">Contact</h5>
        <ul class="contact-info-footer">
          <li>
            <div class="contact-icon-footer whatsapp-icon">
              <a
                href="https://wa.me/6285709346954"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi via WhatsApp"
              >
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
              </a>
            </div>
            <div class="contact-details-footer">
              <p>+62 857-0934-6954</p>
            </div>
          </li>
          <li>
            <div class="contact-icon-footer instagram-icon">
              <a
                href="https://www.instagram.com/hoklampung.official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kunjungi Instagram HOK Lampung"
              >
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
              </a>
            </div>
            <div class="contact-details-footer">
              <p>hoklampung.official</p>
            </div>
          </li>
          <li>
            <div class="contact-icon-footer email-icon">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com&su=kritik dan saran untuk hok lampung&body=kritik dan saran untuk hok lampung"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kirim email ke HOK Lampung"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 17 17"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.6"
                  ><g /><path
                    d="M0 2v13h17v-13h-17zM8.494 9.817l-6.896-6.817h13.82l-6.924 6.817zM5.755 8.516l-4.755 4.682v-9.383l4.755 4.701zM6.466 9.219l2.026 2.003 1.996-1.966 4.8 4.744h-13.677l4.855-4.781zM11.201 8.555l4.799-4.725v9.467l-4.799-4.742z"
                  /></svg
                >
              </a>
            </div>
            <div class="contact-details-footer">
              <p>hoklampung.official@gmail.com</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Social Media Links and Copyright -->
    <div class="row bottom-footer-row">
      <div class="col-lg-6 col-md-12 social-media-col">
        <div class="social-media-container-footer">
          <span class="follow-us-footer">Follow Us</span>
          <div class="social-icons-footer">
            <a
              href="https://chat.whatsapp.com/CDyNXvgyxwMG0c7idouoQR"
              class="social-icon-footer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gabung grup WhatsApp HOK Lampung"
            >
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
            </a>
            <a
              href="https://www.instagram.com/hoklampung.official/"
              class="social-icon-footer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram HOK Lampung"
            >
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
            </a>
            <a
              href="https://twitter.com/honorofkings"
              class="social-icon-footer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X Honor of Kings"
            >
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
            </a>
            <a
              href="https://www.facebook.com/honorofkings.og.id"
              class="social-icon-footer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Honor of Kings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 320 512"
                fill="currentColor"
                ><path
                  d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                /></svg
              >
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com"
              class="social-icon-footer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email HOK Lampung"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 17 17"
                fill="none"
                stroke="currentColor"
                stroke-width="0.6"
                ><g /><path
                  d="M0 2v13h17v-13h-17zM8.494 9.817l-6.896-6.817h13.82l-6.924 6.817zM5.755 8.516l-4.755 4.682v-9.383l4.755 4.701zM6.466 9.219l2.026 2.003 1.996-1.966 4.8 4.744h-13.677l4.855-4.781zM11.201 8.555l4.799-4.725v9.467l-4.799-4.742z"
                /></svg
              >
            </a>
            <a
              href="https://t.me/honorofkings_id"
              class="social-icon-footer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram Honor of Kings"
            >
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
            </a>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-12 copyright-col">
        <div class="copyright-text">
          <p>
            All rights reserved &copy; HOK Lampung Community {currentYear}
          </p>
        </div>
      </div>
    </div>
  </div>
</footer>
