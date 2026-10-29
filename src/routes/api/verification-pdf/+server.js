import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const config = {
  runtime: 'nodejs24.x'
};

let _browser = null;

async function getBrowser() {
  if (_browser && _browser.isConnected()) {
    return _browser;
  }
  _browser = null;

  // Deteksi environment: gunakan Chromium package hanya jika benar-benar di Linux
  const isLinux = process.platform === "linux";
  const isProduction = env.NODE_ENV === "production";

  // Gunakan @sparticuz/chromium hanya jika:
  // 1. Di production mode
  // 2. Di Linux (bukan Windows/Mac)
  const useChromiumPackage = isProduction && isLinux;

  if (useChromiumPackage) {
    // PRODUCTION di Linux/Serverless/Docker
    const puppeteerCore = await import("puppeteer-core");

    console.log("[PROD-LINUX] Starting browser launch");

    // 1. Cek environment variable atau chromium sistem terlebih dahulu (Docker / VPS)
    let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    let customArgs = [
      "--font-render-hinting=none",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ];

    if (!executablePath) {
      const fs = await import("fs");
      const fallbackPaths = [
        "/usr/bin/chromium-browser",
        "/usr/bin/chromium",
        "/usr/bin/google-chrome",
        "/snap/bin/chromium",
      ];

      for (const path of fallbackPaths) {
        if (fs.existsSync(path)) {
          console.log(`[PROD-LINUX] Found system chromium at: ${path}`);
          executablePath = path;
          break;
        }
      }
    }

    // 2. Jika tidak ada chromium sistem (misalnya di AWS Lambda / Vercel), fallback ke @sparticuz/chromium
    if (!executablePath) {
      try {
        const chromium = await import("@sparticuz/chromium");
        executablePath = await chromium.default.executablePath();
        customArgs = [...chromium.default.args, ...customArgs];
        console.log("[PROD-LINUX] Executable path from @sparticuz/chromium:", executablePath);
      } catch (error) {
        console.log("[PROD-LINUX] Failed to get executablePath from chromium package:", error.message);
      }
    }

    if (!executablePath) {
      throw new Error("Could not find chromium executable. Please install chromium-browser on your VPS or Docker container.");
    }

    _browser = await puppeteerCore.default.launch({
      args: customArgs,
      defaultViewport: {
        width: 794,
        height: 1123,
        deviceScaleFactor: 2,
      },
      executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    console.log("[PROD-LINUX] Browser launched successfully");
  } else {
    // DEVELOPMENT atau PRODUCTION di Windows/Mac (local build)
    const puppeteer = await import("puppeteer");

    console.log(`[LOCAL] Running on ${process.platform}, using puppeteer`);

    const launchOptions = {
      headless: "new",
      defaultViewport: {
        width: 794,
        height: 1123,
        deviceScaleFactor: 2,
      },
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--font-render-hinting=none",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-extensions",
        "--disable-sync",
        "--disable-background-networking",
        "--disable-default-apps",
        "--mute-audio",
        "--no-first-run",
      ],
    };

    const launchStrategies = [
      { name: "Chrome channel", options: { ...launchOptions, channel: "chrome" } },
      { name: "Default Puppeteer", options: launchOptions },
    ];

    for (const strategy of launchStrategies) {
      try {
        console.log(`[LOCAL] Trying to launch with: ${strategy.name}`);
        _browser = await puppeteer.default.launch(strategy.options);
        console.log(`[LOCAL] Browser launched successfully with: ${strategy.name}`);
        return _browser;
      } catch (err) {
        console.log(`[LOCAL] Failed with ${strategy.name}:`, err.message);
      }
    }

    // Fallback: cari Chrome manual
    const fs = await import("fs");
    const path = await import("path");

    const possiblePaths = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ];

    for (const chromePath of possiblePaths) {
      try {
        if (chromePath && fs.existsSync(chromePath)) {
          console.log(`[LOCAL] Found Chrome at: ${chromePath}`);
          _browser = await puppeteer.default.launch({
            ...launchOptions,
            executablePath: chromePath,
          });
          console.log(`[LOCAL] Browser launched with manual path: ${chromePath}`);
          return _browser;
        }
      } catch (err) {
        console.log(`[LOCAL] Failed with path ${chromePath}:`, err.message);
      }
    }

    throw new Error(
      "Could not launch browser. Please install Google Chrome or run: npx puppeteer browsers install chrome",
    );
  }

  return _browser;
}

export async function GET({ url }) {
  let page = null;

  try {
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response(JSON.stringify({ error: "Missing code" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const isDev = env.NODE_ENV === "development";
    let targetUrl;

    if (isDev && env.PDF_PAGE_URL_DEV) {
      targetUrl = `${env.PDF_PAGE_URL_DEV}?${url.searchParams.toString()}`;
    } else {
      const origin = publicEnv.PUBLIC_APP_URL || url.origin || "http://localhost:5173";
      targetUrl = `${origin}/pdfpage?${url.searchParams.toString()}`;
    }

    console.log("[PDF] Rendering:", targetUrl);

    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.setCacheEnabled(true);
    await page.setJavaScriptEnabled(true);
    await page.setBypassCSP(true);

    // Request Interception for speed
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      // Allow only essential resources
      if (["document", "script", "stylesheet", "image", "font"].includes(resourceType)) {
        req.continue();
      } else {
        req.abort();
      }
    });

    console.log("[PDF] Navigating to page...");

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    console.log("[PDF] Page loaded, waiting for assets...");

    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
        console.log("[Puppeteer] Fonts ready");
      }

      const images = Array.from(document.images || []);
      await Promise.all(
        images
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = img.onerror = resolve;
                setTimeout(resolve, 5000);
              }),
          ),
      );
      console.log("[Puppeteer] Images loaded");

      await new Promise((resolve) => {
        const startTime = Date.now();
        const checkReady = () => {
          if (window.pdfReady === true) {
            console.log("[Puppeteer] PDF ready signal received");
            resolve();
          } else if (Date.now() - startTime > 15000) {
            console.log("[Puppeteer] Timeout waiting for pdfReady signal");
            resolve();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      });
    });

    console.log("[PDF] All assets loaded, generating PDF...");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      displayHeaderFooter: false,
      scale: 1,
    });

    console.log("[PDF] PDF generated successfully, size:", pdfBuffer.length, "bytes");

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Certificate of Authenticity.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err) {
    console.error("[PDF ERROR]", err);
    console.error("[PDF ERROR] Stack:", err.stack);

    if (page) {
      try {
        await page.close();
      } catch (_) { }
    }

    return new Response(JSON.stringify({
      error: "Failed to generate PDF",
      detail: String(err.message),
      stack: env.NODE_ENV === "development" ? err.stack : undefined,
      hint: "Pastikan Google Chrome terinstall atau jalankan: npx puppeteer browsers install chrome"
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    if (page && !page.isClosed()) {
      try {
        await page.close();
      } catch (_) { }
    }
  }
}

const cleanup = async () => {
  if (_browser) {
    try {
      console.log("[PDF] Closing browser...");
      await _browser.close();
      _browser = null;
      console.log("[PDF] Browser closed");
    } catch (err) {
      console.error("[PDF] Error closing browser:", err);
    }
  }
};

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
process.on("beforeExit", cleanup);
