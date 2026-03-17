import express from "express";
import cors from "cors";
import { scrapeGoogleFlights } from "./scrapers/google.js";

const app = express();
app.use(cors());

// Health route
app.get("/", (_req, res) => {
  res.send("NomadPilot Flight Scraper API is running.");
});

// Search route
app.get("/search", async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Missing from, to, or date" });
  }

  try {
    const results = await scrapeGoogleFlights(from, to, date);
    res.json({ results });
  } catch (err) {
    console.error("[server] Scraper error:", err);
    return res.status(500).json({ error: "Scraping failed." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Flight Scraper running on ${PORT}`);
});
