<script>
    import { onMount, tick } from "svelte";
    import { fade, scale } from "svelte/transition";

    let code = $state(["", "", "", "", "", ""]);
    let isVerifying = $state(false);
    let result = $state(null);
    let inputRefs = $state([]);
    let fingerprint = $state("");
    let locked = $state(false);
    const cacheKey = "verificationCache";
    let pdfUrl = $state(null);
    let isPreparingPdf = $state(false);
    const STORAGE_KEY = "verification_state_v1";

    // For keeping track of the blob URL
    let currentObjectUrl = null;

    onMount(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const {
                    code: savedCode,
                    result: savedResult,
                    timestamp,
                } = JSON.parse(saved);
                if (savedCode && savedResult) {
                    code = savedCode;
                    result = savedResult;
                    locked = true;
                }
            }
        } catch (err) {
            console.error("Failed to restore state", err);
        }

        async function compute() {
            try {
                const ua = navigator.userAgent || "";
                const lang = navigator.language || "";
                const plat = navigator.platform || "";
                const vendor = navigator.vendor || "";
                const mem = (navigator.deviceMemory || 0).toString();
                const cores = (navigator.hardwareConcurrency || 0).toString();
                const tz = (new Date().getTimezoneOffset() || 0).toString();
                const color =
                    window.screen && window.screen.colorDepth
                        ? window.screen.colorDepth.toString()
                        : "0";
                const res = window.screen
                    ? `${window.screen.width}x${window.screen.height}`
                    : "0x0";
                const seed = [
                    ua,
                    lang,
                    plat,
                    vendor,
                    mem,
                    cores,
                    tz,
                    color,
                    res,
                ].join("|");

                const enc = new TextEncoder();
                const data = enc.encode(seed);
                const hash = await crypto.subtle.digest("SHA-256", data);
                fingerprint = Array.from(new Uint8Array(hash))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("");
            } catch {
                fingerprint = "unknown";
            }
        }
        compute();

        return () => {
            if (currentObjectUrl) {
                URL.revokeObjectURL(currentObjectUrl);
            }
        };
    });

    $effect(() => {
        const preparePdf = async () => {
            if (!result || !result.success || !result.data) {
                if (currentObjectUrl) {
                    URL.revokeObjectURL(currentObjectUrl);
                    currentObjectUrl = null;
                }
                pdfUrl = null;
                isPreparingPdf = false;
                return;
            }

            const fullCode = (
                result.data.code || code.join("").toUpperCase()
            ).toUpperCase();

            let locationParam = "";
            if (result?.data?.verificationLocation) {
                const loc = result.data.verificationLocation;
                if (
                    loc.denied !== true &&
                    loc.fullLocation &&
                    loc.fullLocation.trim() !== ""
                ) {
                    locationParam = loc.fullLocation;
                }
            }

            const params = new URLSearchParams({
                code: fullCode,
                issuedOn: result?.data?.verifiedAt || new Date().toISOString(),
                location: locationParam,
            });

            const url = `/api/verification-pdf?${params.toString()}`;

            isPreparingPdf = true;
            pdfUrl = null;

            try {
                const res = await fetch(url, {
                    method: "GET",
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to generate PDF");
                const blob = await res.blob();

                if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
                currentObjectUrl = URL.createObjectURL(blob);
                pdfUrl = currentObjectUrl;
            } catch (err) {
                console.error("Error preparing PDF", err);
                pdfUrl = null;
            } finally {
                isPreparingPdf = false;
            }
        };

        // We run preparePdf whenever result changes to a success state
        if (result && result.success) {
            preparePdf();
        } else if (result === null) {
            pdfUrl = null;
            isPreparingPdf = false;
        }
    });

    async function getBrowserLocation() {
        try {
            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        try {
                            const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
                            const res = await fetch(url);
                            const data = await res.json();
                            const addr = data.address || {};
                            resolve({
                                region: addr.state || "",
                                country: addr.country || "",
                            });
                        } catch {
                            resolve(null);
                        }
                    },
                    () => {
                        console.log("[Location] User denied permission");
                        resolve(null);
                    },
                    { enableHighAccuracy: false, timeout: 3000 },
                );
            });
        } catch {
            return null;
        }
    }

    const handleChange = (index, value) => {
        const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        if (sanitizedValue.length <= 1) {
            code[index] = sanitizedValue;
            result = null;
            locked = false;
            pdfUrl = null;
            if (sanitizedValue && index < 5) {
                inputRefs[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (!code[index] && index > 0) {
                inputRefs[index - 1]?.focus();
            } else {
                code[index] = "";
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputRefs[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData("text")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase();
        if (pastedData) {
            for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
                code[i] = pastedData[i];
            }
            const nextEmptyIndex = code.findIndex((c) => !c);
            const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
            inputRefs[focusIndex]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join("").toUpperCase();

        if (fullCode.length !== 6) {
            result = {
                success: false,
                message: "Mohon masukkan kode verifikasi lengkap (6 karakter)",
            };
            locked = true;
            return;
        }

        try {
            isVerifying = true;
            pdfUrl = null;
            isPreparingPdf = false;

            const browserLocation = await getBrowserLocation();

            const res = await fetch("/api/verify-serial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: fullCode,
                    fingerprint,
                    browserLocation,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                result = {
                    success: false,
                    message:
                        data?.message ||
                        (res.status === 403
                            ? "Kode ini sudah digunakan."
                            : res.status === 404
                              ? "Kode tidak ditemukan atau tidak aktif."
                              : "Verifikasi gagal. Coba lagi."),
                };
                locked = true;
            } else {
                result = {
                    success: true,
                    message: data.message,
                    product: data.product,
                    data: data.data,
                };
                locked = true;
                try {
                    localStorage.setItem(
                        cacheKey,
                        JSON.stringify({ fingerprint, at: Date.now() }),
                    );
                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify({
                            code,
                            result,
                            timestamp: Date.now(),
                        }),
                    );
                } catch {}
            }
        } catch (e) {
            result = {
                success: false,
                message: "Terjadi kesalahan jaringan. Coba lagi.",
            };
            locked = true;
        } finally {
            isVerifying = false;
        }
    };

    const handleClear = () => {
        code = ["", "", "", "", "", ""];
        result = null;
        locked = false;
        pdfUrl = null;
        isPreparingPdf = false;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {}
        tick().then(() => {
            inputRefs[0]?.focus();
        });
    };

    let isComplete = $derived(code.every((c) => c !== ""));
    let showForm = $derived(!result);
</script>

<div class="page-container">
    <div class="bg-layer">
        <img
            src="/assets/serialnumber/serialnumber.avif"
            alt="Originality Background"
        />
    </div>
    <div class="content-wrapper">
        <div class="card-box">
            <h1 class="title">Verifikasi Keaslian Produk</h1>

            {#if showForm}
                <p class="description">
                    <span>Masukkan 6 kode Serial Number yang terdapat pada</span
                    ><br />
                    <span
                        >hangtag produk Anda untuk memastikan keasliannya.</span
                    >
                </p>

                <div class="input-container">
                    {#each code as digit, index}
                        <input
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            autocomplete="one-time-code"
                            maxlength="1"
                            class="code-input"
                            bind:value={code[index]}
                            bind:this={inputRefs[index]}
                            oninput={(e) => handleChange(index, e.target.value)}
                            onkeydown={(e) => handleKeyDown(index, e)}
                            onpaste={handlePaste}
                            disabled={isVerifying || locked}
                        />
                    {/each}
                </div>

                <div class="button-row">
                    <button
                        class="primary-button"
                        onclick={handleVerify}
                        disabled={!isComplete || isVerifying || locked}
                    >
                        {isVerifying ? "Memverifikasi..." : "Verifikasi Produk"}
                    </button>
                    <button
                        class="secondary-button"
                        onclick={handleClear}
                        disabled={isVerifying}
                    >
                        Bersihkan
                    </button>
                </div>
            {:else}
                <div
                    class="result-overlay {result.success
                        ? 'success-overlay'
                        : 'error-overlay'}"
                    in:fade={{ duration: 250 }}
                >
                    <div
                        class="icon-circle {result.success
                            ? 'variant-success'
                            : 'variant-error'}"
                        in:scale={{ duration: 400, start: 0, opacity: 0 }}
                    >
                        {#if result.success}
                            <svg
                                class="check-svg"
                                width="38"
                                height="38"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    class="check-path"
                                    d="M20 6L9 17l-5-5"
                                    stroke="#fff"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        {:else}
                            <svg
                                class="cross-svg"
                                width="38"
                                height="38"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    class="cross-path-1"
                                    d="M18 6L6 18"
                                    stroke="#fff"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    class="cross-path-2"
                                    d="M6 6l12 12"
                                    stroke="#fff"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        {/if}
                    </div>

                    <h3 class="overlay-title">
                        {result.success ? "Produk Asli" : "Verifikasi Gagal"}
                    </h3>
                    <p class="overlay-text">
                        {#if result.success}
                            Produk ini terverifikasi keasliannya! Dokumen keterangan asli sedang/sudah disiapkan untuk diunduh.
                        {:else}
                            {result.message || "Serial number salah, sudah digunakan, tidak ditemukan, atau tidak aktif."}
                        {/if}
                    </p>

                    {#if isPreparingPdf}
                        <p class="overlay-text">Sedang menyiapkan dokumen PDF... Mohon tunggu sebentar.</p>
                    {/if}

                    <div class="actions-row">
                        {#if result.success}
                            <a
                                href={pdfUrl || "#"}
                                download="Certificate of Authenticity.pdf"
                                class="download-link"
                                class:disabled={!pdfUrl}
                                onclick={(e) => { if (!pdfUrl) e.preventDefault(); }}
                            >
                                {pdfUrl ? "Unduh Dokumen" : "Menyiapkan Dokumen..."}
                            </a>
                        {/if}
                        <button
                            class="overlay-secondary-button"
                            onclick={handleClear}
                        >
                            Serial Number Baru
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .page-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 75px clamp(24px, 5vw, 80px) 40px;
    }

    @media (max-width: 1024px) {
        .page-container {
            padding: 75px 24px 40px;
        }
    }

    .bg-layer {
        position: absolute;
        inset: 0;
        z-index: -1;
    }

    .bg-layer img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .content-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 1400px;
    }

    .card-box {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50px;
        padding: 40px 40px;
        max-width: 600px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
        .card-box {
            padding: 32px 32px;
        }
    }

    @media (max-width: 484px) {
        .card-box {
            border-radius: 30px;
            padding: 24px 24px;
        }
    }

    .title {
        font-family: "Poppins-Bold", sans-serif;
        font-size: 32px;
        font-weight: 700;
        color: #1a1a1a;
        margin-top: -15px;
        margin-bottom: 10px;
        text-align: center;
    }

    @media (max-width: 768px) {
        .title {
            font-size: 28px;
        }
    }
    @media (max-width: 484px) {
        .title {
            font-size: 24px;
        }
    }
    @media (max-width: 426px) {
        .title {
            margin-top: -10px;
        }
    }

    .description {
        font-family: "Poppins-Reguler", sans-serif;
        font-size: 16px;
        color: #000;
        text-align: center;
        margin-bottom: 25px;
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        .description {
            font-size: 14px;
        }
    }
    @media (max-width: 484px) {
        .description {
            font-size: 11px;
        }
    }
    @media (max-width: 426px) {
        .description {
            font-size: 12px;
            margin-bottom: 15px;
        }
    }

    @media (max-width: 768px) {
        .description {
            font-size: 14px;
        }
    }
    @media (max-width: 484px) {
        .description {
            font-size: 11px;
        }
    }
    @media (max-width: 426px) {
        .description {
            font-size: 12px;
            margin-bottom: 15px;
        }
    }

    .input-container {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-bottom: 32px;
    }

    .code-input {
        font-family: "Poppins-Semibold", sans-serif;
        width: 56px;
        height: 56px;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        outline: none;
        transition: all 0.2s ease;
        text-transform: uppercase;
        color: #1a1a1a;
    }

    .code-input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .code-input:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .code-input {
            font-size: 20px;
            width: 48px;
            height: 48px;
        }
    }
    @media (max-width: 484px) {
        .code-input {
            width: 40px;
            height: 40px;
        }
    }

    .button-row {
        display: flex;
        gap: 12px;
        justify-content: center;
        align-items: stretch;
    }

    .primary-button {
        font-family: "Poppins-Semibold", sans-serif;
        flex: 1;
        max-width: 240px;
        padding: 16px;
        font-size: 16px;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, #f5ab1d 0%, #f5ab1d 100%);
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .primary-button:hover:not(:disabled) {
        transform: scale(1.03);
        box-shadow: 0 8px 20px rgba(34, 197, 94, 0.35);
    }

    .primary-button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .secondary-button {
        font-family: "Poppins-Semibold", sans-serif;
        flex: 1;
        max-width: 240px;
        padding: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #f59e0b;
        background: #fff;
        border: 2px solid #f59e0b33;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .secondary-button:hover:not(:disabled) {
        transform: scale(1.03);
    }

    @media (max-width: 768px) {
        .primary-button,
        .secondary-button {
            padding: 12px 12px;
            max-width: 210px;
            flex: 0 0 210px;
            font-size: 14px;
        }
    }
    @media (max-width: 540px) {
        .primary-button,
        .secondary-button {
            padding: 10px 10px;
            font-size: 12px;
            max-width: 180px;
            flex: 0 0 180px;
        }
    }
    @media (max-width: 484px) {
        .primary-button,
        .secondary-button {
            padding: 10px 10px;
            font-size: 12px;
            max-width: 145px;
            flex: 0 0 145px;
        }
    }

    .result-overlay {
        margin-top: 8px;
        padding: 28px 22px;
        border-radius: 16px;
        text-align: center;
    }

    .success-overlay {
        background: #f0fdf4;
        border: 2px solid #10b981;
        color: #065f46;
    }

    .error-overlay {
        background: #fef2f2;
        border: 2px solid #ef4444;
        color: #7f1d1d;
    }

    .icon-circle {
        width: 72px;
        height: 72px;
        border-radius: 9999px;
        margin: 0 auto 14px;
        display: grid;
        place-items: center;
    }

    .variant-success {
        background: #10b981;
        box-shadow: 0 10px 18px rgba(16, 185, 129, 0.35);
    }

    .variant-error {
        background: #ef4444;
        box-shadow: 0 10px 18px rgba(239, 68, 68, 0.35);
    }

    .check-path {
        stroke-dasharray: 30;
        stroke-dashoffset: 30;
        animation: drawCheck 0.6s ease-out forwards;
    }

    @keyframes drawCheck {
        to {
            stroke-dashoffset: 0;
        }
    }

    .cross-path-1 {
        stroke-dasharray: 20;
        stroke-dashoffset: 20;
        animation: drawCross1 0.4s ease-out forwards;
    }

    .cross-path-2 {
        stroke-dasharray: 20;
        stroke-dashoffset: 20;
        animation: drawCross2 0.4s ease-out 0.2s forwards;
    }

    @keyframes drawCross1 {
        to {
            stroke-dashoffset: 0;
        }
    }
    @keyframes drawCross2 {
        to {
            stroke-dashoffset: 0;
        }
    }

    .overlay-title {
        font-family: "Poppins-Bold", sans-serif;
        font-size: 22px;
        font-weight: 800;
        margin-bottom: 6px;
    }

    .overlay-text {
        font-family: "Poppins-Reguler", sans-serif;
        font-size: 14px;
        line-height: 1.6;
        margin: 0 auto 12px;
        max-width: 460px;
    }

    .actions-row {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 16px;
        flex-wrap: wrap;
    }

    @media (max-width: 768px) {
        .actions-row {
            gap: 10px;
        }
    }
    @media (max-width: 548px) {
        .actions-row {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .download-link {
        font-family: "Poppins-Semibold", sans-serif;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 10px;
        background: #111827;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        box-shadow: 0 8px 18px rgba(17, 24, 39, 0.25);
        flex: 1;
        max-width: 240px;
        min-width: 180px;
    }

    .download-link.disabled {
        opacity: 0.6;
        cursor: default;
        box-shadow: none;
    }

    .download-link:hover:not(.disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(17, 24, 39, 0.35);
    }

    .overlay-secondary-button {
        font-family: "Poppins-Semibold", sans-serif;
        flex: 1;
        max-width: 240px;
        padding: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #f59e0b;
        background: #fff;
        border: 2px solid #f59e0b33;
        border-radius: 12px;
        cursor: pointer;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        box-shadow: 0 8px 18px rgba(245, 158, 11, 0.25);
    }

    .overlay-secondary-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(245, 158, 11, 0.35);
    }

    .overlay-secondary-button:disabled {
        opacity: 0.6;
        cursor: default;
        transform: none;
        box-shadow: none;
    }

    @media (max-width: 768px) {
        .download-link,
        .overlay-secondary-button {
            padding: 12px 12px;
            font-size: 14px;
            max-width: 210px;
            flex: 1 1 calc(50% - 6px);
        }
        .download-link {
            min-width: 160px;
        }
    }

    @media (max-width: 548px) {
        .download-link,
        .overlay-secondary-button {
            max-width: 100%;
            flex: 1;
        }
    }

    @media (max-width: 484px) {
        .download-link,
        .overlay-secondary-button {
            padding: 10px 10px;
            font-size: 12px;
        }
    }
</style>
