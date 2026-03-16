{\rtf1\ansi\ansicpg1252\cocoartf2513
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\deftab720
\pard\pardeftab720

\f0\fs24 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 import \{ chromium \} from "playwright";\
\
export async function scrapeGoogleFlights(from, to, date) \{\
\'a0 const browser = await chromium.launch(\{ headless: true \});\
\'a0 const page = await browser.newPage();\
\
\'a0 const query = `flights from $\{from\} to $\{to\} on $\{date\}`;\
\'a0 const url = `https://www.google.com/travel/flights?q=$\{encodeURIComponent(query)\}`;\
\
\'a0 await page.goto(url, \{ waitUntil: "networkidle" \});\
\'a0 await page.waitForSelector("div[role='listitem']");\
\
\'a0 const flights = await page.evaluate(() => \{\
\'a0\'a0\'a0 return [...document.querySelectorAll("div[role='listitem']")]\
\'a0\'a0\'a0\'a0\'a0 .slice(0, 10)\
\'a0\'a0\'a0\'a0\'a0 .map(card => \{\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 const airline = card.querySelector("img[alt]")?.alt || "";\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 const price = card.querySelector("span[jscontroller] span")?.textContent?.trim() || null;\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 const times = [...card.querySelectorAll("div[aria-label*='flight']")].map(t => t.textContent);\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 return \{\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0 airline,\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0 price,\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0 departure: times[0] || "",\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0 arrival: times[1] || "",\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0 source: "Google Flights"\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 \};\
\'a0\'a0\'a0\'a0\'a0 \});\
\'a0 \});\
\
\'a0 await browser.close();\
\'a0 return flights;\
\}\
}