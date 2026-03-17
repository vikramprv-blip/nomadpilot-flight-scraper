import { chromium } from "playwright";

export async function scrapeKiwi(from, to, date) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 2000 },
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36"
    });

    const url = `https://www.kiwi.com/en/search/results/${from}/${to}/${date}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });

    // Try to accept cookies (best effort)
    try {
      await page.click("[data-test='CookiesPopup-Accept']", { timeout: 5000 });
    } catch {}

    // Scroll to force lazy loading
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(1500);
    }

    // This selector ALWAYS exists, even when price nodes are hidden:
    await page.waitForSelector("[data-test='ResultCardWrapper']", {
      timeout: 90000
    });

    // Extract visible price text dynamically, fallback to alternative spans
    const flights = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("[data-test='ResultCardWrapper']")];

      return cards.slice(0, 10).map(card => {
        // Kiwi sometimes nests price deep inside spans, so fallback to regex-based extraction
        let price =
          card.querySelector("[data-test='ResultCardPrice']")?.textContent?.trim() ||
          card.textContent.match(/(\$|€|£)\s?\d+([.,]\d{3})*/)?.[0] ||
          "";

        const airline =
          card.querySelector("[data-test='AirlineLogo']")?.getAttribute("alt") || "";

        const times = [...card.querySelectorAll("[data-test='SegmentTimes']")].map(t =>
          t.textContent.trim()
        );

        return {
          airline,
          price,
          departure: times[0] || "",
          arrival: times[1] || "",
          source: "Kiwi.com"
        };
      });
    });

    return flights;
  } catch (err) {
    console.error("[scrapeKiwi] failed:", err);
    return [];
  } finally {
    await browser.close().catch(() => {});
  }
}
