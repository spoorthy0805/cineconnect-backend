import express from "express"
import fetch from "node-fetch"

const router = express.Router()

// OMDb API key (public)
const OMDB_KEY = "564727fa"
const OMDB_BASE = `https://www.omdbapi.com/?apikey=${OMDB_KEY}`

// Format OMDb movie
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

// ---------------------- TRENDING ----------------------
router.get("/trending", async (req, res) => {
  try {
    const ids = [
      "tt15398776", // Oppenheimer
      "tt1517268",  // Barbie
      "tt1877830",  // The Batman
      "tt4633694",  // Spider-Man: Into the Spider-Verse
      "tt7286456",  // Joker
      "tt1160419",  // Dune
      "tt0848228",  // Avengers
      "tt4154796",  // Endgame
      "tt1375666",  // Inception
      "tt0816692",  // Interstellar
    ]

    const movies = await Promise.all(
      ids.map(async (id) => {
        const r = await fetch(`${OMDB_BASE}&i=${id}&plot=short`)
        const d = await r.json()
        return d.Response === "True" ? mapMovie(d) : null
      })
    )

    return res.json(movies.filter(Boolean))
  } catch (err) {
    console.error("TRENDING ERROR:", err)
    return res.status(500).json({ error: err.toString() })
  }
})

// ---------------------- SEARCH ----------------------
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim()

    async function omdbSearch(term) {
      const r = await fetch(`${OMDB_BASE}&s=${encodeURIComponent(term)}`)
      const d = await r.json()
      return Array.isArray(d.Search) ? d.Search.map(mapMovie) : []
    }

    let results = []

    // 1. Try real search
    if (q) {
      results = await omdbSearch(q)
    }

    // 2. If empty, use fallback keywords
    if (results.length === 0) {
      const fallbacks = ["action", "romance", "thriller", "drama"]
      let fallbackResults = []

      for (const term of fallbacks) {
        const r = await omdbSearch(term)
        fallbackResults = fallbackResults.concat(r)
      }

      results = fallbackResults
    }

    // 3. Remove duplicates
    const unique = {}
    for (const m of results) {
      if (!unique[m.tmdbId]) unique[m.tmdbId] = m
    }

    return res.json(Object.values(unique).slice(0, 25))
  } catch (err) {
    console.error("SEARCH ERROR:", err)
    return res.status(500).json({ error: err.toString() })
  }
})

// ---------------------- TEST ROUTE ----------------------
router.get("/test", (req, res) => {
  res.json({ message: "router works" })
})

export default router
