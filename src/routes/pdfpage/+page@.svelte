<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let serialNumber = $state("");
    let issuedOn = $state("");
    let location = $state("");
    let assetsLoaded = $state(false);
    let fontsLoaded = $state(false);

    onMount(() => {
        const url = new URL(window.location.href);
        serialNumber =
            url.searchParams.get("code") ||
            url.searchParams.get("serialNumber") ||
            "";
        issuedOn = url.searchParams.get("issuedOn") || "";
        location = url.searchParams.get("location") || "";

        const imagesToPreload = [
            "/assets/serialnumber/Surat Originalitas ver 2.png",
        ];
        let loadedCount = 0;
        const total = imagesToPreload.length;
        const checkLoaded = () => {
            loadedCount++;
            if (loadedCount === total) assetsLoaded = true;
        };
        imagesToPreload.forEach((src) => {
            const img = new Image();
            img.onload = checkLoaded;
            img.onerror = checkLoaded;
            img.src = src;
        });

        const loadFonts = async () => {
            try {
                if (document.fonts?.ready) {
                    await document.fonts.ready;
                    await new Promise((r) => setTimeout(r, 300));
                    fontsLoaded = true;
                    if (window.parent) window.pdfReady = true;
                } else {
                    setTimeout(() => {
                        fontsLoaded = true;
                        if (window.parent) window.pdfReady = true;
                    }, 1000);
                }
            } catch {
                setTimeout(() => {
                    fontsLoaded = true;
                    if (window.parent) window.pdfReady = true;
                }, 1000);
            }
        };
        loadFonts();
    });

    const serialToShow = $derived(
        String(serialNumber || "")
            .trim()
            .padStart(6, "0"),
    );

    const issuedOnString = $derived.by(() => {
        try {
            if (issuedOn) {
                const d = new Date(issuedOn);
                if (!isNaN(d.getTime()))
                    return d.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });
            }
        } catch {}
        return "—";
    });

    const locationString = $derived.by(() => {
        if (
            location &&
            String(location).trim() &&
            String(location).trim() !== "undefined" &&
            String(location).trim() !== "null"
        ) {
            return String(location).trim();
        }
        return "—";
    });

    const allReady = $derived(assetsLoaded && fontsLoaded);
</script>

<svelte:head>
    <title>Certificate of Authenticity</title>
    <style>
        @font-face {
            font-family: "Corrupted File";
            src: url("/fonts/CORRUPTED FILE.TTF") format("truetype");
            font-weight: normal;
            font-style: normal;
            font-display: block;
        }
        @font-face {
            font-family: "Bahnschrift";
            src: url("/fonts/BAHNSCHRIFT.TTF") format("truetype");
            font-weight: normal;
            font-style: normal;
            font-display: block;
        }
        * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    </style>
</svelte:head>

<!-- Preload container (invisible) -->
<div
    style="position:absolute;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;"
>
    <img src="/assets/serialnumber/Surat Originalitas ver 2.png" alt="" />
    <span style="font-family:'Bahnschrift',sans-serif;">.</span>
    <span style="font-family:'Corrupted File',monospace;">.</span>
</div>

<div class="page-wrapper">
    {#if !allReady}
        <div class="loading-overlay">
            <div style="font-size:14px;color:#666;">Loading assets...</div>
        </div>
    {/if}

    <img
        class="bg-image"
        src="/assets/serialnumber/Surat Originalitas ver 2.png"
        alt="Certificate Background"
    />

    <div class="content-overlay" style:opacity={allReady ? 1 : 0}>
        <h1 class="cert-title">CERTIFICATE OF AUTHENTICITY</h1>

        <p class="paragraph paragraph-top">
            This document verifies that the item associated with the serial
            number below<br />
            is an <b>authentic and original product of HLO</b>.
        </p>

        <p class="paragraph paragraph-middle">
            Each certified piece represents the brand's dedication to
            craftsmanship,<br />
            detail, and originality — no reproductions, no replicas, no compromises.
        </p>

        <div class="serial-section">
            <p class="serial-label">SERIAL NUMBER:</p>
            <span class="serial-number">{serialToShow}</span>
        </div>

        <div class="info-section">
            <p class="info-line issued-by"><b>Issued by:</b> HLO STORE ID</p>
            <p class="info-line issued-on">
                <b>Issued on:</b>
                {issuedOnString}
            </p>
            <p class="info-line location-line">
                <b>Location:</b>
                {locationString}
            </p>
        </div>

        <p class="paragraph paragraph-bottom-1">
            This certificate confirms that the product listed under the serial
            number above<br />
            has been reviewed, approved, and released under the supervision of
        </p>

        <p class="paragraph paragraph-bottom-2">
            <b>HLO's Authenticity &amp; Quality Control Division.</b>
        </p>

        <p class="paragraph paragraph-bottom-3">
            Any duplication, modification, or reproduction of this certificate<br
            />
            is strictly prohibited and will void its authenticity status.
        </p>

        <p class="auth-signature">Authorized Signature &amp; Official Seal</p>

        <footer class="footer">
            <div>© 2025 HLO</div>
            <div>All Rights Reserved Worldwide</div>
            <div>www.hoklampung.com</div>
        </footer>
    </div>
</div>

<style>
    .page-wrapper {
        position: relative;
        width: 794px;
        height: 1123px;
        margin: 0 auto;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        background: white;
    }

    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bg-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }

    .content-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        pointer-events: none;
        color: #111;
        font-family: "Bahnschrift", sans-serif;
        transition: opacity 0.3s ease;
    }

    .cert-title {
        font-size: 15.5px;
        text-align: center;
        font-weight: 600;
        margin: 0;
        position: absolute;
        top: 209px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        font-family: "Bahnschrift", sans-serif;
    }

    .paragraph {
        text-align: center;
        font-size: 16px;
        line-height: 1.2;
        width: 590px;
        margin: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-family: "Bahnschrift", sans-serif;
    }

    .paragraph-top {
        top: 247px;
    }
    .paragraph-middle {
        top: 301px;
    }
    .paragraph-bottom-1 {
        top: 596px;
    }
    .paragraph-bottom-2 {
        top: 635px;
    }
    .paragraph-bottom-3 {
        top: 673px;
    }

    .serial-section {
        text-align: center;
        position: absolute;
        top: 398px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .serial-label {
        font-size: 15.5px;
        margin: 0;
        font-weight: 700;
        font-family: "Bahnschrift", sans-serif;
    }

    .serial-number {
        font-family: "Corrupted File", monospace;
        font-size: 20px;
        color: #da1b1b;
    }

    .info-section {
        text-align: center;
        font-size: 16px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        font-family: "Bahnschrift", sans-serif;
    }

    .info-line {
        margin: 0;
        line-height: 1.4;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-family: "Bahnschrift", sans-serif;
    }

    .issued-by {
        top: 479px;
    }
    .issued-on {
        top: 501px;
    }
    .location-line {
        top: 523px;
    }

    .auth-signature {
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        margin: 0;
        position: absolute;
        top: 766px;
        left: 50%;
        transform: translateX(-50%);
        font-family: "Bahnschrift", sans-serif;
    }

    .footer {
        position: absolute;
        bottom: 140px;
        width: 100%;
        text-align: center;
        font-size: 15px;
        line-height: 1.2;
        color: #000;
        font-family: "Bahnschrift", sans-serif;
    }

    .footer div {
        margin: 2px 0;
    }
</style>
