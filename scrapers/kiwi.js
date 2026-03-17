import { chromium } from "playwright";

export async function scrapeKiwi(from, to, date) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    });

    const url = `https://www.kiwi.com/en/search/results/${from}/${to}/${date}`;

    // Load page
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 90000
    });

    // Handle cookie popup (best effort)
    try {
      await page.click("[data-test='CookiesPopup-Accept']", { timeout: 5000 });
    } catch {}

    // Wait for price elements (more stable)
    await page.waitForSelector("[data-test='ResultCardPrice']", {
      timeout: 90000
    });

    const flights = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("[data-test='ResultCardWrapper']")].slice(0, 10);

      return cards.map(card => {
        const airline = card.querySelector("[data-test='AirlineLogo']")?.getAttribute("alt") || "";
        const price = card.querySelector("[data-test='ResultCardPrice']")?.textContent?.trim() || "";
        const times = [...card.querySelectorAll("[data-test='SegmentTimes']")].map(t => t.textContent);

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
