import express from "express";
import cors from "cors";
import { scrapeGoogleFlights } from "./scrapers/google.js";

const app = express();
app.use(cors());

// Health
app.get("/", (_req, res) => {
  res.send("NomadPilot Flight Scraper API is running.");
});

app.get("/search", async (req, res) => {
  const { from, to, date } = req.query;

  // Basic validation
  if (
    !from || typeof from !== "string" ||
    !to   || typeof to   !== "string" ||
    !date || typeof date !== "string"
  ) {
    return res.status(400).json({ error: "Missing from, to, or date" });
  }

  try {
    // Run both sources in parallel
   const google = await scrapeGoogleFlights(from, to, date);
const results = google;
    ]);

    // Combine and sort by numeric price (fallback very high if not parseable)
    const results = [...google, ...kiwi].sort((a, b) => {
      const p1 = parseInt(String(a.price ?? "").replace(/\D/g, ""), 10) || 9_999_999;
      const p2 = parseInt(String(b.price ?? "").replace(/\D/g, ""), 10) || 9_999_999;
      return p1 - p2;
    });

    res.json({ results });
  } catch (err) {
    console.error("Scraper error:", err);
    res.status(500).json({ error: "Scraping failed." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Flight Scraper running on ${PORT}`));
