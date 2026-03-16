import { chromium } from "playwright";

export async function scrapeKiwi(from, to, date) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const url = `https://www.kiwi.com/en/search/results/${from}/${to}/${date}`;

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-test='ResultCardWrapper']");

  const flights = await page.evaluate(() => {
    return [...document.querySelectorAll("[data-test='ResultCardWrapper']")]
      .slice(0, 10)
      .map(card => {
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

  await browser.close();
  return flights;
}
