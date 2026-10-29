<script>
    import { onMount } from "svelte";
    import axios from "axios";

    let pinCode = $state("");
    let idGame = $state("");
    let nama = $state("");
    let isLoading = $state(false);
    let isMobile = $state(false);
    let windowWidth = $state(0);
    let mounted = $state(false);

    let errors = $state({
        emptyFields: false,
        invalidPin: false,
        usedPin: false,
        lowercasePin: false,
        invalidLength: false,
        invalidFormat: false,
    });

    function resetErrors() {
        errors = {
            emptyFields: false,
            invalidPin: false,
            usedPin: false,
            lowercasePin: false,
            invalidLength: false,
            invalidFormat: false,
        };
    }

    onMount(() => {
        mounted = true;
        const handleResize = () => {
            windowWidth = window.innerWidth;
            isMobile = windowWidth <= 768;
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    function validatePinFormat(pin) {
        if (/[a-z]/.test(pin)) return false;
        if (!/^[A-Z0-9]+$/.test(pin)) return false;
        return true;
    }

    function validatePinLength(pin) {
        return pin.length > 0;
    }

    function handlePinCodeChange(e) {
        pinCode = e.target.value.toUpperCase().replace(/-/g, "").trim();
        resetErrors();
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!pinCode || !idGame || !nama) {
            errors = { ...errors, emptyFields: true };
            return;
        }

        if (!validatePinLength(pinCode)) {
            errors = { ...errors, invalidLength: true };
            return;
        }

        if (!validatePinFormat(pinCode)) {
            if (/[a-z]/.test(pinCode)) {
                errors = { ...errors, lowercasePin: true };
            } else {
                errors = { ...errors, invalidFormat: true };
            }
            return;
        }

        isLoading = true;
        try {
            const response = await axios.post("/api/pin-public/redeem", {
                pinCode,
                idGame,
                nama,
            });
            if (response.data.message === "PIN code berhasil digunakan") {
                const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "628997878546";
                const formattedPhone = phoneNumber.replace(/-/g, "").replace(/\s/g, "");
                const message = `*Saya ingin meredeem giftcard dengan keterangan*\nPIN Code: ${pinCode}\nID Game: ${idGame}\nNickname: ${nama}`;
                window.location.href = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
            }
        } catch (err) {
            const errMsg = err.response?.data?.error || "Terjadi kesalahan server";
            errors = {
                emptyFields: false,
                invalidPin: errMsg === "PIN code tidak ditemukan",
                usedPin: errMsg === "PIN code sudah digunakan",
                lowercasePin: errMsg === "PIN code harus huruf kapital semua",
                invalidLength: false,
                invalidFormat: false,
            };
            if (
                !["PIN code tidak ditemukan", "PIN code sudah digunakan", "PIN code harus huruf kapital semua"].includes(errMsg) &&
                !errMsg.includes("Validation failed")
            ) {
                alert("Terjadi kesalahan server. Coba lagi nanti.");
            }
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <title>Redeem - HOK Lampung</title>
</svelte:head>

{#if mounted}
    <div class="page-wrapper">
        <div class="bg-abs">
            <img src="/assets/Redeem/background.avif" alt="Background Limitless" loading="eager" />
        </div>

        <div class="redeem-container">
            <div class="redeem-bg-abs">
                <img
                    src={isMobile ? "/assets/Redeem/2.avif" : "/assets/Redeem/1.avif"}
                    alt="Redeem Box Background"
                    loading="eager"
                    style="object-fit: contain; width: 100%; height: 100%; display: block;"
                />
            </div>

            <div class="form-side">
                <h1 class="title">
                    {#if windowWidth <= 768}
                        Redeem your tokens now!
                    {:else}
                        Redeem your<br />tokens now!
                    {/if}
                </h1>

                <form onsubmit={handleSubmit}>
                    <div class="mb-3">
                        <input
                            type="text"
                            class="form-control styled-input"
                            placeholder="PIN code"
                            value={pinCode}
                            oninput={handlePinCodeChange}
                            maxlength={21}
                        />
                        {#if errors.invalidLength && !errors.emptyFields}
                            <p class="error-msg">*Panjang PIN code tidak valid</p>
                        {/if}
                        {#if errors.invalidFormat && !errors.emptyFields && !errors.invalidLength && !errors.lowercasePin}
                            <p class="error-msg">*PIN code hanya boleh berisi huruf kapital dan angka</p>
                        {/if}
                        {#if errors.lowercasePin && !errors.emptyFields && !errors.invalidLength && !errors.invalidFormat}
                            <p class="error-msg">*PIN code harus huruf kapital semua</p>
                        {/if}
                        {#if errors.invalidPin && !errors.emptyFields && !errors.invalidLength && !errors.lowercasePin && !errors.invalidFormat}
                            <p class="error-msg">*PIN code tidak valid</p>
                        {/if}
                        {#if errors.usedPin && !errors.emptyFields && !errors.invalidPin && !errors.invalidLength && !errors.lowercasePin && !errors.invalidFormat}
                            <p class="error-msg">*PIN code sudah pernah digunakan</p>
                        {/if}
                    </div>

                    <div class="mb-3">
                        <input
                            type="text"
                            class="form-control styled-input"
                            placeholder="ID game"
                            bind:value={idGame}
                        />
                    </div>

                    <div class="mb-3">
                        <input
                            type="text"
                            class="form-control styled-input"
                            placeholder="Nickname"
                            bind:value={nama}
                        />
                    </div>

                    {#if errors.emptyFields}
                        <p class="error-msg" style="margin-bottom:10px;margin-top:-5px;">
                            *Semua kolom harus diisi terlebih dahulu
                        </p>
                    {/if}

                    <button type="submit" class="btn btn-primary submit-btn" disabled={isLoading}>
                        {isLoading ? "Processing..." : "Submit"}
                    </button>

                    <p class="form-note">
                        {#if windowWidth <= 992}
                            *pastikan semua yang dimasukkan sudah benar termasuk PIN code
                        {:else}
                            *pastikan semua yang dimasukkan<br />sudah benar terutama PIN code
                        {/if}
                    </p>
                </form>
            </div>
        </div>
    </div>
{/if}

<style>
    /* ===================== PAGE WRAPPER ===================== */
    .page-wrapper {
        width: 100%;
        min-height: 100vh;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 70px 20px 20px 20px;
    }
    @media (max-width: 768px) { .page-wrapper { padding: 100px 20px 80px 20px; } }
    @media (max-width: 576px) { .page-wrapper { padding: 80px 15px 60px 15px; } }
    @media (max-width: 480px) { .page-wrapper { padding: 70px 15px 50px 15px; } }
    @media (max-width: 410px) { .page-wrapper { padding: 60px 15px 40px 15px; } }
    @media (max-width: 380px) { .page-wrapper { padding: 100px 15px 40px 15px; } }

    /* ===================== BG ===================== */
    .bg-abs, .redeem-bg-abs {
        position: absolute;
        inset: 0;
        z-index: -1;
    }
    .bg-abs img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* ===================== REDEEM CONTAINER ===================== */
    /* Base Props */
    .redeem-container {
        width: 90%;
        max-width: 1000px;
        height: 700px;
        min-height: auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
    }
    /* Dynamic Prop: $isMobile */
    @media (max-width: 768px) {
        .redeem-container {
            width: 100%;
            max-width: 450px;
            height: auto;
            min-height: 700px;
            align-items: flex-end;
        }
    }
    /* NextJS Media Queries */
    @media (min-width: 1200px) {
        .redeem-container {
            width: 65%;
            max-width: 1024px;
            height: 512px;
        }
    }
    @media (min-width: 1024px) and (max-width: 1199px) {
        .redeem-container {
            width: 65%;
            max-width: 1016px;
            height: 500px;
        }
    }
    @media (max-width: 1023px) {
        .redeem-container {
            max-width: 800px;
            height: 500px;
            background-size: contain;
        }
    }
    @media (max-width: 768px) {
        .redeem-container {
            width: 95%;
            max-width: 420px;
            min-height: 800px;
            height: auto;
        }
    }
    @media (max-width: 576px) {
        .redeem-container {
            width: 100%;
            max-width: 380px;
            min-height: 750px;
        }
    }
    @media (max-width: 480px) {
        .redeem-container {
            max-width: 350px;
            min-height: 700px;
        }
    }
    @media (max-width: 410px) {
        .redeem-container {
            max-width: 320px;
            min-height: 650px;
        }
    }
    @media (max-width: 360px) {
        .redeem-container {
            max-width: 300px;
            min-height: 620px;
        }
    }

    /* ===================== FORM SIDE ===================== */
    /* Base Props */
    .form-side {
        width: 35%;
        position: absolute;
        left: 25%;
        top: 50%;
        bottom: auto;
        transform: translate(-50%, -50%);
        padding: 0;
    }
    /* Dynamic Prop: $windowWidth <= 992 */
    @media (max-width: 992px) {
        .form-side { top: 53%; }
    }
    /* Dynamic Prop: $windowWidth <= 768 ($isMobile) */
    @media (max-width: 768px) {
        .form-side {
            width: 85%;
            left: 50%;
            top: auto;
            bottom: 60px;
            transform: translateX(-50%);
        }
    }
    /* NextJS Media Queries */
    @media (min-width: 1200px) {
        .form-side {
            width: 36%;
            left: 26%;
        }
    }
    @media (min-width: 1024px) and (max-width: 1199px) {
        .form-side {
            width: 37%;
            left: 25%;
            top: 51%;
        }
    }
    @media (min-width: 1024px) {
        .form-side { width: 37%; }
    }
    @media (max-width: 1023px) {
        .form-side {
            width: 37%;
            top: 51%;
        }
    }
    @media (max-width: 768px) {
        .form-side {
            width: 80%;
            bottom: 80px;
        }
    }
    @media (max-width: 576px) {
        .form-side {
            width: 82%;
            bottom: 70px;
        }
    }
    @media (max-width: 480px) {
        .form-side {
            width: 83%;
            bottom: 60px;
        }
    }
    @media (max-width: 410px) {
        .form-side {
            width: 85%;
            bottom: 55px;
        }
    }

    /* ===================== TITLE ===================== */
    /* Base Props */
    .title {
        font-size: 2.2rem;
        font-weight: bold;
        text-align: center;
        color: #000;
        font-family: "Poppins-Light", sans-serif;
        filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
    }
    /* Dynamic Props */
    @media (max-width: 992px) {
        .title { font-size: 1.5rem; }
    }
    @media (max-width: 320px) {
        .title { font-size: 1.5rem; }
    }
    /* NextJS Media Queries */
    @media (min-width: 1200px) {
        .title { font-size: 1.6rem; margin-top: 15px; }
    }
    @media (min-width: 1024px) and (max-width: 1199px) {
        .title { font-size: 1.2rem; margin-top: 18px; }
    }
    @media (max-width: 1023px) {
        .title { font-size: 1.3rem; margin-top: 0px; }
    }
    @media (max-width: 878px) {
        .title { font-size: 1.2rem; }
    }
    @media (max-width: 768px) {
        .title { font-size: 1.4rem; margin-bottom: 18px; }
    }
    @media (max-width: 576px) {
        .title { font-size: 1.35rem; margin-bottom: 16px; }
    }
    @media (max-width: 480px) {
        .title { margin-top: 10px; margin-bottom: 15px; font-size: 1.3rem; }
    }
    @media (max-width: 410px) {
        .title { font-size: 1.25rem; margin-bottom: 14px; }
    }
    @media (max-width: 380px) {
        .title { font-size: 1.1rem; margin-bottom: 10px; }
    }

    /* ===================== INPUT ===================== */
    /* Base Props */
    .styled-input {
        padding: 12px 20px;
        border-radius: 30px;
        border: none;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        font-size: 1rem;
        font-family: "Poppins-Semibold", sans-serif;
        background-color: #f6f8fd;
        filter: drop-shadow(2px 5px 2px rgba(0, 0, 0, 0.2));
    }
    .styled-input::placeholder { color: rgba(0, 0, 0, 0.333); }
    .styled-input:focus {
        color: rgba(0, 0, 0, 0.333);
        background-color: #f6f8fd;
        border: none;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        outline: none;
    }
    /* Dynamic Props */
    @media (max-width: 320px) {
        .styled-input { padding: 10px 15px; font-size: 0.9rem; }
    }
    /* NextJS Media Queries */
    @media (min-width: 1200px) { .styled-input { font-size: 0.85rem; padding: 10px 18px; } }
    @media (min-width: 1024px) and (max-width: 1199px) { .styled-input { font-size: 0.6rem; padding: 6px 16px; } }
    @media (max-width: 1016px) { .styled-input { padding: 8px 20px; font-size: 0.8rem; } }
    @media (max-width: 878px) { .styled-input { font-size: 0.7rem; } }
    @media (max-width: 768px) { .styled-input { padding: 11px 18px; font-size: 0.95rem; } }
    @media (max-width: 576px) { .styled-input { padding: 10px 16px; font-size: 0.9rem; } }
    @media (max-width: 480px) { .styled-input { padding: 8px 16px; font-size: 0.8rem; } }
    @media (max-width: 410px) { .styled-input { padding: 7px 15px; font-size: 0.8rem; } }
    @media (max-width: 380px) { .styled-input { padding: 8px 13px; font-size: 0.6rem; } }

    /* ===================== ERROR MSG ===================== */
    .error-msg {
        color: red;
        font-size: 0.8rem;
        margin-left: 10px;
        font-family: "Poppins-Medium", sans-serif;
        margin-top: 5px;
    }
    @media (min-width: 1200px) { .error-msg { font-size: 0.75rem; } }
    @media (min-width: 1024px) and (max-width: 1199px) { .error-msg { font-size: 0.5rem; } }
    @media (max-width: 1023px) { .error-msg { font-size: 0.7rem; } }
    @media (max-width: 878px) { .error-msg { font-size: 0.65rem; } }
    @media (max-width: 768px) { .error-msg { font-size: 0.78rem; margin-bottom: 0; } }
    @media (max-width: 576px) { .error-msg { font-size: 0.75rem; } }
    @media (max-width: 480px) { .error-msg { font-size: 0.7rem; } }
    @media (max-width: 410px) { .error-msg { font-size: 0.6rem; } }

    /* ===================== SUBMIT BUTTON ===================== */
    /* Base Props */
    .submit-btn {
        width: 100%;
        padding: 12px;
        border-radius: 30px;
        background-color: #f5ab1d;
        border: none;
        font-weight: bold;
        margin-top: 10px;
        font-size: 1rem;
        color: white;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .submit-btn:hover:not(:disabled),
    .submit-btn:focus:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(255, 161, 99, 0.594);
        background-color: #f5ab1d;
        color: white;
    }
    .submit-btn:active {
        background-color: #f5ab1d !important;
        border: none !important;
        box-shadow: 0 8px 20px rgba(255, 161, 99, 0.594) !important;
    }
    .submit-btn:disabled {
        background-color: #f5ab1d;
        border: none;
        opacity: 0.7;
        cursor: not-allowed;
    }
    /* Dynamic Props */
    @media (max-width: 320px) {
        .submit-btn { padding: 10px; font-size: 0.9rem; }
    }
    /* NextJS Media Queries */
    @media (min-width: 1200px) { .submit-btn { padding: 11px 14px; font-size: 0.85rem; margin-top: 0px; } }
    @media (min-width: 1024px) and (max-width: 1199px) { .submit-btn { padding: 6px 10px; margin-top: 0px; font-size: 0.6rem; } }
    @media (max-width: 1023px) { .submit-btn { padding: 8px 20px; font-size: 0.8rem; margin-top: 0; } }
    @media (max-width: 768px) { .submit-btn { padding: 11px 18px; font-size: 0.95rem; margin-top: 5px; } }
    @media (max-width: 576px) { .submit-btn { padding: 10px 16px; font-size: 0.9rem; } }
    @media (max-width: 480px) { .submit-btn { padding: 8px 16px; font-size: 0.8rem; } }
    @media (max-width: 410px) { .submit-btn { padding: 7px 15px; font-size: 0.8rem; } }
    @media (max-width: 380px) { .submit-btn { margin-top: 0px; } }

    /* ===================== FORM NOTE ===================== */
    .form-note {
        color: white;
        text-align: center;
        text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
        font-family: "Poppins-Semibold", sans-serif;
    }
    @media (min-width: 1200px) { .form-note { font-size: 0.7rem; margin-top: 10px; } }
    @media (min-width: 1024px) and (max-width: 1199px) { .form-note { margin-top: 10px; font-size: 0.5rem; } }
    @media (max-width: 1023px) { .form-note { font-size: 0.7rem; margin-top: 10px; } }
    @media (max-width: 878px) { .form-note { margin-top: 10px; font-size: 0.65rem; } }
    @media (max-width: 768px) { .form-note { margin-top: 15px; font-size: 0.78rem; } }
    @media (max-width: 576px) { .form-note { margin-top: 12px; font-size: 0.75rem; } }
    @media (max-width: 480px) { .form-note { margin-top: 10px; padding-top: 0; font-size: 0.7rem; } }
    @media (max-width: 410px) { .form-note { margin-top: 8px; font-size: 0.6rem; } }
</style>
