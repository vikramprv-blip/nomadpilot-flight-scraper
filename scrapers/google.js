import { chromium } from "playwright";

export async function scrapeGoogleFlights(from, to, date) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const query = `flights from ${from} to ${to} on ${date}`;
  const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("div[role='listitem']");

  const flights = await page.evaluate(() => {
    return [...document.querySelectorAll("div[role='listitem']")]
      .slice(0, 10)
      .map(card => {
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

  await browser.close();
  return flights;
}
