<script>
    import { page } from "$app/stores";
    import { Turnstile } from "svelte-turnstile";
    import { env } from "$env/dynamic/public";
    
    let { children } = $props();

    let isVerified = $state(false);
    let isLoading = $state(true);
    let rayId = $state("");

    $effect(() => {
        if (!rayId) {
            rayId = Math.random().toString(36).substring(2, 14);
        }
        
        const pathname = $page.url.pathname;
        // Bypass verification for PDF page and admin routes
        if (pathname === "/pdfpage" || pathname.startsWith("/admin")) {
            isVerified = true;
            isLoading = false;
            return;
        }

        // Check if user has already been verified in this session
        const verified = sessionStorage.getItem("turnstile_verified");
        if (verified === "true") {
            isVerified = true;
            isLoading = false;
        } else {
            isLoading = false;
        }
    });

    async function handleVerify(e) {
        const token = e.detail.token;
        try {
            const response = await fetch("/api/verify-turnstile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem("turnstile_verified", "true");
                isVerified = true;
            } else {
                console.error("Turnstile verification failed");
            }
        } catch (error) {
            console.error("Error verifying turnstile:", error);
        }
    }
</script>

{#if isLoading}
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5;">
        <div style="text-align: center;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
{:else if !isVerified}
    <div style="min-height: 100vh; background-color: #1a1a1a; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; display: flex; flex-direction: column;">
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
            <div style="max-width: 480px; width: 100%;">
                <h1 style="font-size: 28px; font-weight: 400; margin-bottom: 8px; letter-spacing: -0.5px;">
                    hoklampung.com
                </h1>
                
                <p style="font-size: 16px; font-weight: 500; margin-bottom: 24px; color: #ffffff;">
                    Verify you are human by completing the action below.
                </p>
                
                <div style="margin-bottom: 40px;">
                    <Turnstile
                        siteKey={env.PUBLIC_TURNSTILE_SITE_KEY}
                        on:turnstile-callback={handleVerify}
                        theme="light"
                    />
                </div>
                
                <p style="font-size: 16px; color: #a0a0a0; line-height: 1.6; margin-top: 60px;">
                    hoklampung.com needs to review the security of your connection before proceeding.
                </p>
            </div>
        </div>
        
        <div style="border-top: 1px solid #333; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <div style="margin-bottom: 4px;">
                Ray ID: {rayId}
            </div>
            <div>
                Performance & security by <span style="color: #888; font-weight: 500;">Cloudflare</span>
            </div>
        </div>
    </div>
{:else}
    {@render children()}
{/if}
