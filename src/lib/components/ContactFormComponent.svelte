<script>
  let formData = $state({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  let loading = $state(false);
  let buttonStatus = $state("idle");
  let fieldErrors = $state({});

  function handleChange(e) {
    const { name, value } = e.target;
    formData[name] = value;
    fieldErrors[name] = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    loading = true;
    buttonStatus = "idle";
    fieldErrors = {};

    try {
      const response = await fetch("/api/contact-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        buttonStatus = "success";
        formData = { name: "", email: "", subject: "", message: "" };
        setTimeout(() => {
          buttonStatus = "idle";
        }, 3000);
      } else {
        const data = await response.json();
        throw { response: { data } };
      }
    } catch (err) {
      const zodErrors = err.response?.data?.errors;

      if (zodErrors && Array.isArray(zodErrors)) {
        const formattedErrors = {};
        zodErrors.forEach((e) => {
          if (e.path?.length > 0) {
            formattedErrors[e.path[0]] = e.message;
          }
        });
        fieldErrors = formattedErrors;
      }

      buttonStatus = "error";
      setTimeout(() => {
        buttonStatus = "idle";
      }, 3000);
    } finally {
      loading = false;
    }
  }
</script>

<div id="contact-us" class="contact-us-section">
  <div class="container">
    <div class="row justify-content-center text-center mb-4">
      <div class="col-md-10 col-lg-8">
        <h5 class="contact-heading">CONTACT US</h5>
        <h1 class="contact-title">
          Hubungi Kami untuk <br /> Informasi Lebih Lanjut
        </h1>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h3 class="contact-subtitle mb-4">Tulis pesan kepada kami</h3>
            <form onsubmit={handleSubmit}>
              <div class="form-container" style="width: 270px;">
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control contact-input {fieldErrors.name
                      ? 'is-invalid'
                      : ''}"
                    placeholder="Nama"
                    name="name"
                    value={formData.name}
                    oninput={handleChange}
                    disabled={loading}
                  />
                  {#if fieldErrors.name}
                    <div class="invalid-feedback d-block">
                      {fieldErrors.name}
                    </div>
                  {/if}
                </div>

                <div class="mb-3">
                  <input
                    type="email"
                    class="form-control contact-input {fieldErrors.email
                      ? 'is-invalid'
                      : ''}"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    oninput={handleChange}
                    disabled={loading}
                  />
                  {#if fieldErrors.email}
                    <div class="invalid-feedback d-block">
                      {fieldErrors.email}
                    </div>
                  {/if}
                </div>

                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control contact-input {fieldErrors.subject
                      ? 'is-invalid'
                      : ''}"
                    placeholder="Subjek"
                    name="subject"
                    value={formData.subject}
                    oninput={handleChange}
                    disabled={loading}
                  />
                  {#if fieldErrors.subject}
                    <div class="invalid-feedback d-block">
                      {fieldErrors.subject}
                    </div>
                  {/if}
                </div>

                <div class="mb-4">
                  <textarea
                    rows="5"
                    class="form-control contact-input {fieldErrors.message
                      ? 'is-invalid'
                      : ''}"
                    placeholder="Mulai menulis pesan di sini"
                    name="message"
                    value={formData.message}
                    oninput={handleChange}
                    disabled={loading}
                  ></textarea>
                  {#if fieldErrors.message}
                    <div class="invalid-feedback d-block">
                      {fieldErrors.message}
                    </div>
                  {/if}
                </div>
              </div>

              <button
                type="submit"
                class="kontak-button d-flex justify-content-center text-align-center {buttonStatus ===
                'success'
                  ? 'btn-success'
                  : buttonStatus === 'error'
                    ? 'btn-danger'
                    : ''}"
                disabled={loading}
              >
                {#if loading}
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Mengirim...
                {:else if buttonStatus === "success"}
                  Berhasil
                {:else if buttonStatus === "error"}
                  Gagal
                {:else}
                  Kirim Pesan
                {/if}
              </button>
            </form>
          </div>

          <div class="col-lg-6 contact-info-col">
            <div class="contact-info-text">
              <p>
                Apabila Kamu memiliki pertanyaan, saran, kerja sama ataupun
                ingin bergabung dalam komunitas, jangan ragu untuk menghubungi
                kami. Kami siap memberikan informasi yang kamu butuhkan.
              </p>
            </div>

            <div class="contact-info-items">
              <div class="contact-info-item">
                <div class="contact-icon">
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
                <div class="contact-detail">
                  <h5>Whatsapp</h5>
                  <p>0857-09346-954</p>
                </div>
              </div>

              <div class="contact-info-item">
                <div class="contact-icon">
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
                      viewBox="0 0 448 512"
                      fill="currentColor"
                      ><path
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                      /><path
                        d="M377.33 162.67a28 28 0 1 1 28-28 27.94 27.94 0 0 1-28 28zM256 181.33A74.67 74.67 0 1 1 181.33 256 74.75 74.75 0 0 1 256 181.33m0-37.33a112 112 0 1 0 112 112 112 112 0 0 0-112-112z"
                      /></svg
                    >
                  </a>
                </div>
                <div class="contact-detail">
                  <h5>Instagram</h5>
                  <p>hoklampung.official</p>
                </div>
              </div>

              <div class="contact-info-item">
                <div class="contact-icon-email">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=hoklampung.official@gmail.com&su=kritik dan saran untuk hok lampung"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kirim Email ke HOK Lampung"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      ><path
                        d="M460.6 147.3L353 256.9c-.8.8-.8 2 0 2.8l75.3 80.2c5.1 5.1 5.1 13.3 0 18.4-2.5 2.5-5.9 3.8-9.2 3.8s-6.7-1.3-9.2-3.8l-75-79.9c-.8-.8-2.1-.8-2.9 0L313.7 297c-15.3 15.5-35.6 24.1-57.4 24.2-22.1.1-43.1-9.2-58.6-24.9l-17.6-17.9c-.8-.8-2.1-.8-2.9 0l-75 79.9c-2.5 2.5-5.9 3.8-9.2 3.8s-6.7-1.3-9.2-3.8c-5.1-5.1-5.1-13.3 0-18.4l75.3-80.2c.7-.8.7-2 0-2.8L51.4 147.3c-1.3-1.3-3.4-.4-3.4 1.4V368c0 17.6 14.4 32 32 32h352c17.6 0 32-14.4 32-32V148.7c0-1.8-2.2-2.6-3.4-1.4z"
                      /><path
                        d="M256 295.1c14.8 0 28.7-5.8 39.1-16.4L452 119c-5.5-4.4-12.3-7-19.8-7H79.9c-7.5 0-14.4 2.6-19.8 7L217 278.7c10.3 10.5 24.2 16.4 39 16.4z"
                      /></svg
                    >
                  </a>
                </div>
                <div class="contact-detail">
                  <h5>Email</h5>
                  <p>hoklampung.official@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .form-container {
    width: 270px;
  }
</style>
