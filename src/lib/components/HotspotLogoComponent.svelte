<script>
    let activeHotspot = $state(null);

    const hotspots = [
        {
            id: 1,
            x: 35,
            y: 14.7,
            title: "Lingkaran HOK",
            description: "Sebagai logo utama dari honor of kings",
            direction: "top",
        },
        {
            id: 2,
            x: 63,
            y: 42,
            title: "HOK",
            description: "Singkatan Honor of Kings",
            direction: "top",
        },
        {
            id: 3,
            x: 45,
            y: 68,
            title: "Mahkota",
            description: "Sebagai simbol secara elemental",
            direction: "bottom",
        },
        {
            id: 4,
            x: 50,
            y: 56,
            title: "Siger",
            description: "Karena berasal dari Lampung, sebagai ikonik bangunan",
            direction: "top",
        },
        {
            id: 5,
            x: 84.7,
            y: 65,
            title: "Warna Orange",
            description:
                "Melambangkan Kehangatan, dan kemenangan yang gemilang",
            direction: "bottom",
        },
    ];

    function handleHotspotClick(hotspot, e) {
        e.stopPropagation();
        activeHotspot = activeHotspot === hotspot.id ? null : hotspot.id;
    }

    function closePopup() {
        activeHotspot = null;
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="hotspot-wrapper" onclick={closePopup}>
    <div class="hotspot-logo-container">
        <img
            src="/assets/aboutus/logo1.avif"
            alt="HOK Logo"
            loading="eager"
            style="width:100%;height:100%;object-fit:contain;"
        />

        <div class="hotspot-overlay">
            {#each hotspots as hotspot (hotspot.id)}
                <div>
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="hotspot-button"
                        style="left:{hotspot.x}%;top:{hotspot.y}%;"
                        onclick={(e) => handleHotspotClick(hotspot, e)}
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="plus-icon"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </div>

                    {#if activeHotspot === hotspot.id}
                        <div
                            class="hotspot-popup"
                            style="
                left:{hotspot.x}%;
                top:{hotspot.direction === 'top'
                                ? `calc(${hotspot.y}% - 28px)`
                                : `calc(${hotspot.y}% + 28px)`};
                transform:{hotspot.direction === 'top'
                                ? 'translate(-50%, -100%)'
                                : 'translate(-50%, 0%)'};
              "
                        >
                            {#if hotspot.direction === "top"}
                                <div class="popup-tail-bottom"></div>
                            {:else}
                                <div class="popup-tail-top"></div>
                            {/if}

                            <div class="popup-title">{hotspot.title}</div>
                            <div class="popup-description">
                                {hotspot.description}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .hotspot-wrapper {
        flex: 0 0 auto;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 400px;
    }

    .hotspot-logo-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hotspot-overlay {
        position: absolute;
        inset: 0;
    }

    .hotspot-button {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 33px;
        height: 33px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        border: 7px solid rgba(100, 100, 100, 0.01);
    }

    .hotspot-popup {
        position: absolute;
        background: #ebe9e9ff;
        padding: 4px 10px 8px;
        border-radius: 8px;
        width: 240px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        z-index: 10005;
    }

    .popup-tail-bottom {
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #edededff;
    }

    .popup-tail-top {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #edededff;
    }

    .popup-title {
        font-family: "Gilroy-Bold", sans-serif;
        font-size: 14px;
        color: #949494;
        margin-bottom: 6px;
        padding-bottom: 6px;
        border-bottom: 1.5px solid #949494;
        text-align: center;
    }

    .popup-description {
        font-family: "Gilroy-Medium", sans-serif;
        font-size: 12px;
        color: #949494;
        line-height: 1.4;
        text-align: center;
    }

    @media (max-width: 480px) {
        .hotspot-logo-container {
            max-width: 320px !important;
        }
        .hotspot-button {
            width: 24px !important;
            height: 24px !important;
            border: 5px solid rgba(100, 100, 100, 0.01) !important;
        }
        .plus-icon {
            width: 10px !important;
            height: 10px !important;
        }
        .hotspot-popup {
            width: 180px !important;
            padding: 3px 8px 6px !important;
            border-radius: 6px !important;
        }
        .popup-title {
            font-size: 11px !important;
            margin-bottom: 4px !important;
            padding-bottom: 4px !important;
        }
        .popup-description {
            font-size: 9px !important;
            line-height: 1.3 !important;
        }
    }

    @media (max-width: 420px) {
        .hotspot-logo-container {
            max-width: 300px !important;
        }
        .hotspot-button {
            width: 24px !important;
            height: 24px !important;
            border: 5px solid rgba(100, 100, 100, 0.01) !important;
        }
        .plus-icon {
            width: 10px !important;
            height: 10px !important;
        }
        .hotspot-popup {
            width: 170px !important;
            padding: 3px 8px 6px !important;
            border-radius: 6px !important;
        }
        .popup-title {
            font-size: 11px !important;
            margin-bottom: 4px !important;
            padding-bottom: 4px !important;
        }
        .popup-description {
            font-size: 9px !important;
            line-height: 1.3 !important;
        }
    }

    @media (max-width: 380px) {
        .hotspot-logo-container {
            max-width: 280px !important;
        }
        .hotspot-button {
            width: 22px !important;
            height: 22px !important;
        }
        .plus-icon {
            width: 9px !important;
            height: 9px !important;
        }
        .hotspot-popup {
            width: 165px !important;
        }
        .popup-title {
            font-size: 10px !important;
        }
        .popup-description {
            font-size: 8px !important;
        }
    }

    @media (max-width: 360px) {
        .hotspot-logo-container {
            max-width: 260px !important;
        }
        .hotspot-button {
            width: 20px !important;
            height: 20px !important;
        }
        .plus-icon {
            width: 8px !important;
            height: 8px !important;
        }
        .hotspot-popup {
            width: 150px !important;
        }
        .popup-title {
            font-size: 9px !important;
        }
        .popup-description {
            font-size: 7px !important;
        }
    }
</style>
