<script>
    import HotspotLogoComponent from "$lib/components/HotspotLogoComponent.svelte";
</script>

<svelte:head>
    <title>Makna Logo - HOK Lampung</title>
</svelte:head>

<div class="aboutus-page w-100 min-vh-100">
    <div class="main-container">
        <div class="left-section">
            <HotspotLogoComponent />

            <div class="info-container">
                <div class="info-item">
                    <h3 class="info-title">Nama Logo</h3>
                    <p class="info-text">HOK LAMPUNG{"\n"}OFFICIAL</p>
                </div>

                <div class="info-item">
                    <h3 class="info-title">Slogan</h3>
                    <p class="info-text">#OURALLCOMMUNITY</p>
                </div>

                <div class="info-item">
                    <h3 class="info-title">Warna</h3>
                    <p class="info-text">HEX : #F5A81D{"\n"}RGB : 245, 171, 29{"\n"}CMYK : 0, 30, 88, 4</p>
                </div>
            </div>
        </div>

        <div class="right-section">
            <p class="description-text">
                Logo Honor of Kings Lampung Official Community ini menggabungkan
                tiga elemen penting yang penuh makna. Di bagian atas terdapat
                Siger, lambang khas Provinsi Lampung yang melambangkan
                kehormatan, kebanggaan, dan identitas daerah. Kehadiran Siger
                menggambarkan bahwa komunitas ini lahir dari semangat masyarakat
                Lampung yang menjunjung tinggi nilai lokal namun tetap terbuka
                pada perkembangan global. Warna oranye keemasan yang digunakan
                juga mencerminkan semangat, keberanian, dan energi positif,
                sesuai dengan karakter para pemain yang kompetitif dan berjiwa
                juang tinggi.
            </p>

            <p class="description-text">
                Sementara itu, di bagian tengah terdapat huruf HOK yang menjadi
                identitas utama komunitas, mewakili semangat kebersamaan dan
                kekompakan untuk pemain Honor of Kings. Logo Honor of Kings
                Official di bagian bawah menandakan bahwa komunitas ini resmi
                dan diakui secara global, bukan sekadar perkumpulan biasa,
                melainkan bagian dari ekosistem esports yang besar dan
                profesional. Secara keseluruhan, logo ini mencerminkan
                kebanggaan daerah, semangat komunitas, dan pengakuan resmi -
                menunjukkan bahwa komunitas HOK Lampung berdiri dengan karakter
                kuat, bersatu, dan siap berkembang bersama dunia esports
                internasional.
            </p>
        </div>
    </div>
</div>

<style>
    .main-container {
        display: flex;
        background-color: #ffffff;
        padding: 60px;
        gap: 80px;
        min-height: 100vh;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    @media (min-width: 1200px) {
        .main-container {
            padding: 60px 80px;
            gap: 100px;
        }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
        .main-container {
            flex-direction: column;
            padding: 30px 0;
            padding-top: 140px;
            justify-content: flex-start;
            gap: 25px;
            min-height: auto;
        }
    }

    @media (max-width: 768px) {
        .main-container {
            flex-direction: column;
            padding: 30px 20px;
            justify-content: flex-start;
            gap: 25px;
            padding-top: 80px;
            min-height: auto;
        }
    }

    @media (max-width: 480px) {
        .main-container {
            padding: 25px 20px;
            padding-top: 60px;
            gap: 20px;
        }
    }

    @media (max-width: 420px) {
        .main-container {
            padding: 25px 24px;
            padding-top: 60px;
            gap: 18px;
        }
    }

    @media (max-width: 380px) {
        .main-container {
            padding: 20px 20px;
            padding-top: 55px;
            gap: 16px;
        }
    }

    .left-section {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 320px;
    }

    @media (min-width: 1200px) {
        .left-section {
            min-width: 400px;
        }
    }

    @media (max-width: 1024px) {
        .left-section {
            width: 100%;
            max-width: 500px;
            min-width: unset;
        }
    }

    @media (max-width: 480px) {
        .left-section {
            width: 100%;
            max-width: 100%;
        }
    }

    .right-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    @media (min-width: 1200px) {
        .right-section {
            max-width: 650px;
        }
    }

    @media (max-width: 1024px) {
        .right-section {
            width: 100%;
            max-width: 700px;
        }
    }

    @media (max-width: 480px) {
        .right-section {
            padding: 0 10px;
        }
    }

    @media (max-width: 420px) {
        .right-section {
            padding: 0 8px;
        }
    }

    @media (max-width: 380px) {
        .right-section {
            padding: 0 5px;
        }
    }

    .info-container {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        padding-top: 0px;
        text-align: center;
        width: 100%;
        justify-content: space-between;
    }

    @media (max-width: 768px) {
        .info-container {
            gap: 15px;
        }
    }

    @media (max-width: 480px) {
        .info-container {
            gap: 8px;
        }
    }

    @media (max-width: 360px) {
        .info-container {
            gap: 6px;
        }
    }

    .info-item {
        flex: 1;
        min-width: 80px;
    }

    @media (max-width: 360px) {
        .info-item {
            min-width: 70px;
        }
    }

    .info-title {
        font-family: "Calibri-Bold", sans-serif;
        color: #949494;
        font-weight: 600;
        margin-bottom: 8px;
        margin-top: 0;
    }

    @media (min-width: 1024px) {
        .info-title {
            font-size: 14px;
        }
    }

    @media (max-width: 1023px) {
        .info-title {
            font-size: 16px;
        }
    }

    @media (max-width: 768px) {
        .info-title {
            font-size: 14px;
        }
    }

    @media (max-width: 480px) {
        .info-title {
            font-size: 12px;
            margin-bottom: 5px;
        }
    }

    @media (max-width: 360px) {
        .info-title {
            font-size: 11px;
            margin-bottom: 4px;
        }
    }

    .info-text {
        font-family: "Calibri-Regular", sans-serif;
        font-size: 11px;
        color: #949494;
        line-height: 1.2;
        margin: 0;
        margin-top: 2px;
        white-space: pre-line;
    }

    @media (max-width: 768px) {
        .info-text {
            font-size: 10px;
        }
    }

    @media (max-width: 480px) {
        .info-text {
            font-size: 8px;
            line-height: 1.3;
        }
    }

    @media (max-width: 360px) {
        .info-text {
            font-size: 7px;
        }
    }

    .description-text {
        font-family: "Calibri-Regular", sans-serif;
        font-size: 14px;
        color: #949494;
        line-height: 1.8;
        text-align: justify;
        margin-bottom: 10px;
        margin-top: 0;
    }

    @media (min-width: 1200px) {
        .description-text {
            font-size: 15px;
            line-height: 1.9;
        }
    }

    @media (max-width: 768px) {
        .description-text {
            font-size: 12px;
            line-height: 1.6;
        }
    }

    @media (max-width: 480px) {
        .description-text {
            font-size: 13px;
        }
    }

    @media (max-width: 380px) {
        .description-text {
            font-size: 12px;
        }
    }

    @media (max-width: 360px) {
        .description-text {
            font-size: 10px;
            line-height: 1.5;
        }
    }
</style>
