import { chromium } from "playwright";

/**
 * Scrape Kiwi.com search results.
 * @param {string} from - IATA (e.g., LHR)
 * @param {string} to   - IATA (e.g., DXB)
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<Array<{airline:string, price:string, departure:string, arrival:string, source:string}>>}
 */
export async function scrapeKiwi(from, to, date) {
  const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

  // small random delay (helps avoid soft-blocks and gives page time to settle)
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    });

    // Kiwi uses YYYY-MM-DD; keep the raw value but ensure it’s safe in a URL
    const safeFrom = encodeURIComponent(from.trim().toUpperCase());
    const safeTo   = encodeURIComponent(to.trim().toUpperCase());
    const safeDate = encodeURIComponent(date.trim()); // expected: 2026-05-12

    const url = `https://www.kiwi.com/en/search/results/${safeFrom}/${safeTo}/${safeDate}`;

    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

    // handle potential cookie / consent banners if present (best-effort, no throw)
    try {
      await page.locator('[data-test="CookiesPopup-Accept"]', { hasText: /accept/i }).click({ timeout: 3000 });
    } catch {}

    // wait for result cards (or time out and return empty)
    await page.waitForSelector('[data-test="ResultCardWrapper"]', { timeout: 30_000 });
    await sleep(500 + Math.random() * 700);

    const flights = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-test="ResultCardWrapper"]')).slice(0, 10);

      return cards.map(card => {
        const airline =
          card.querySelector('[data-test="AirlineLogo"]')?.getAttribute("alt")?.trim() || "";

        const price =
          card.querySelector('[data-test="ResultCardPrice"]')?.textContent?.trim() || "";

        const timesNodes = Array.from(card.querySelectorAll('[data-test="SegmentTimes"]'));
        const times = timesNodes.map(t => t.textContent?.trim() || "");
        const departure = times[0] || "";
        const arrival   = times[1] || "";

        return { airline, price, departure, arrival, source: "Kiwi.com" };
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
