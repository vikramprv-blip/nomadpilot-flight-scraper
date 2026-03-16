{\rtf1\ansi\ansicpg1252\cocoartf2513
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\deftab720
\pard\pardeftab720

\f0\fs24 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 import express from "express";\
import cors from "cors";\
import \{ scrapeGoogleFlights \} from "./scrapers/google.js";\
import \{ scrapeKiwi \} from "./scrapers/kiwi.js";\
\
const app = express();\
app.use(cors());\
\
app.get("/", (req, res) => \{\
\'a0 res.send("NomadPilot Flight Scraper API is running.");\
\});\
\
// /search?from=LHR&to=DXB&date=2026-05-12\
app.get("/search", async (req, res) => \{\
\'a0 const \{ from, to, date \} = req.query;\
\
\'a0 if (!from || !to || !date) \{\
\'a0\'a0\'a0 return res.status(400).json(\{ error: "Missing from, to, or date" \});\
\'a0 \}\
\
\'a0 try \{\
\'a0\'a0\'a0 const [google, kiwi] = await Promise.all([\
\'a0\'a0\'a0\'a0\'a0 scrapeGoogleFlights(from, to, date),\
\'a0\'a0\'a0\'a0\'a0 scrapeKiwi(from, to, date)\
\'a0\'a0\'a0 ]);\
\
\'a0\'a0\'a0 const results = [...google, ...kiwi];\
\
\'a0\'a0\'a0 results.sort((a, b) => \{\
\'a0\'a0\'a0\'a0\'a0 const p1 = parseInt(a.price?.replace(/\\D/g, "")) || 9999999;\
\'a0\'a0\'a0\'a0\'a0 const p2 = parseInt(b.price?.replace(/\\D/g, "")) || 9999999;\
\'a0\'a0\'a0\'a0\'a0 return p1 - p2;\
\'a0\'a0\'a0 \});\
\
\'a0\'a0\'a0 res.json(\{ results \});\
\'a0 \} catch (err) \{\
\'a0\'a0\'a0 console.error("Scraper error:", err);\
\'a0\'a0\'a0 res.status(500).json(\{ error: "Scraping failed." \});\
\'a0 \}\
\});\
\
const PORT = process.env.PORT || 3001;\
app.listen(PORT, () => console.log(`Flight Scraper running on $\{PORT\}`));\
}