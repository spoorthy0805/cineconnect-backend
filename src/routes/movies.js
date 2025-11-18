import express from "express"

const router = express.Router()

// Using public OMDb API key
const OMDB_KEY = "564727fa"
const OMDB_BASE = `https://www.omdbapi.com/?apikey=${OMDB_KEY}`

function mapMovie(m) {
  return {
    tmdbId: m.imdbID || "",
    title: m.Title || "",
    year: m.Year || "",
    type: m.Type || "",
    posterUrl: m.Poster && m.Poster !== "N/A" ? m.Poster : "",
    overview: m.Plot && m.Plot !== "N/A" ? m.Plot : "",
  }
}

// ---- TRENDING MOVIES (always returns many movies) ----
router.get("/trending", async (req, res) => {
  try {
    const ids = [
      "tt15398776", // Oppenheimer
      "tt1517268",  // Barbie
      "tt1160419",  // Dune
      "tt1877830",  // The Batman
      "tt7286456",  // Joker
      "tt4633694",  // Spider-Verse
      "tt0458339",  // Captain America
      "tt4630562",  // Fate of the Furious
      "tt4154796",  // Avengers: Endgame
      "tt0848228",  // Avengers
      "tt1375666",  // Inception
      "tt0816692",  // Interstellar
    ]

    const results = await Promise.all(
      ids.map(async (id) => {
        const res = await fetch(`${OMDB_BASE}&i=${id}&plot=short`)
        const data = await res.json()
        if (data.Response === "True") return mapMovie(data)
        return null
      })
    )

    res.json(results.filter(Boolean))
  }} catch (err) {
  console.error("TRENDING ERROR:", err)
  return res.status(500).json({ error: err.toString() })
}

  }
})

// ---- SEARCH MOVIES (never empty) ----
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim()

  async function omdbSearch(term) {
    const r = await fetch(`${OMDB_BASE}&s=${encodeURIComponent(term)}`)
    const data = await r.json()
    if (!Array.isArray(data.Search)) return []
    return data.Search.map(mapMovie)
  }

  let results = []

  // 1. Try actual search
  if (q) results = await omdbSearch(q)

  // 2. If empty, add fallback searches
  if (!results.length) {
    const fallbackTerms = ["action", "thriller", "romance", "drama", "comedy"]
    let fallbackResults = []
    for (const term of fallbackTerms) {
      const r = await omdbSearch(term)
      fallbackResults = fallbackResults.concat(r)
    }
    results = fallbackResults
  }

  // 3. Remove duplicates
  const uniq = new Map()
  for (const m of results) {
    if (m.tmdbId && !uniq.has(m.tmdbId)) {
      uniq.set(m.tmdbId, m)
    }
    if (uniq.size >= 25) break
  }

  return res.json(Array.from(uniq.values()))
})
router.get("/test", (req, res) => {
  res.json({ message: "router works" })
})

router.get("/omdbtest", async (req, res) => {
  try {
    const r = await fetch("https://www.omdbapi.com/?apikey=564727fa&s=batman")
    const data = await r.json()
    res.json(data)
  } catch (err) {
    res.json({ error: err.toString() })
  }
})

export default router
