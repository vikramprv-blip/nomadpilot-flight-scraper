import express from "express";
import cors from "cors";
import { scrapeGoogleFlights } from "./scrapers/google.js";
import { scrapeKiwi } from "./scrapers/kiwi.js";

const app = express();
app.use(cors());

app.get("/", (_req, res) => {
  res.send("NomadPilot Flight Scraper API is running.");
});

app.get("/search", async (req, res) => {
  const { from, to, date } = req.query;
  if (!from || !to || !date) return res.status(400).json({ error: "Missing from, to, or date" });

  try {
    const [google, kiwi] = await Promise.all([
      scrapeGoogleFlights(from, to, date),
      scrapeKiwi(from, to, date),
    ]);
    const results = [...google, ...kiwi].sort((a, b) => {
      const p1 = parseInt(a.price?.replace(/\D/g, "")) || 9999999;
      const p2 = parseInt(b.price?.replace(/\D/g, "")) || 9999999;
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
