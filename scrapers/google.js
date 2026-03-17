import { chromium } from "playwright";

export async function scrapeGoogleFlights(from, to, date) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    });

    const q = encodeURIComponent(`flights from ${from} to ${to} on ${date}`);
    const url = `https://www.google.com/travel/flights?q=${q}`;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 90000
    });

    // Wait for price elements
    await page.waitForSelector("span[jscontroller] span", {
      timeout: 90000
    });

    const flights = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("div[role='listitem']")].slice(0, 8);

      return cards.map(card => {
        const airline = card.querySelector("img[alt]")?.alt || "";
        const price = card.querySelector("span[jscontroller] span")?.textContent?.trim() || null;
        const times = [...card.querySelectorAll("div[aria-label*='flight']")].map(t => t.textContent);

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
  } catch (err) {
    console.error("[scrapeGoogleFlights] failed:", err);
    return [];
  } finally {
    await browser.close().catch(() => {});
  }
}
