import { chromium } from "playwright";

export async function scrapeGoogleFlights(from, to, date) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled"
    ]
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 2000 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_8) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/123.0.0.0 Safari/537.36"
    });

    const q = encodeURIComponent(`flights from ${from} to ${to} on ${date}`);
    const url = `https://www.google.com/travel/flights?q=${q}`;

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    await page.waitForTimeout(3000);

    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(1000);
    }

    await page.waitForSelector("div[role='listitem']", { timeout: 90000 });

    const flights = await page.evaluate(() => {
      const cards = Array.from(
        document.querySelectorAll("div[role='listitem']")
      ).slice(0, 10);

      return cards.map(card => {
        const airline = card.querySelector("img[alt]")?.alt || "";
        const price =
          card.querySelector("span[jscontroller] span")?.textContent?.trim() ||
          (card.textContent.match(/(\$|€|£)\s?\d+[.,]?\d*/) || [])[0] ||
          "";
        const times = Array.from(
          card.querySelectorAll("div[aria-label*='flight']")
        ).map(el => el.textContent.trim());

        return {
          airline,
          price,
          departure: times[0] || "",
          arrival: times[1] || "",
          source: "Google Flights"
        };
      });
    });

    return flights;
  } catch (error) {
    console.error("[scrapeGoogleFlights] failed:", error);
    return [];
  } finally {
    await browser.close().catch(() => {});
  }
}
