import express from "express"

const router = express.Router()

// Public OMDb API key
const OMDB_KEY = "564727fa"
const OMDB_BASE = `https://www.omdbapi.com/?apikey=${OMDB_KEY}`

// Convert OMDb movie to consistent format
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

// ---- TRENDING (always returns multiple movies) ----
router.get("/trending", async (req, res) => {
  try {
    const ids = [
      "tt15398776", // Oppenheimer
      "tt1517268",  // Barbie
      "tt1160419",  // Dune
      "tt1375666",  // Inception
      "tt7286456",  // Joker
      "tt3896198",  // Guardians of the Galaxy 2
      "tt0816692",  // Interstellar
      "tt4154796",  // Avengers: Endgame
      "tt4633694",  // Into the Spider-Verse
      "tt1877830",  // The Batman
    ]

    const results = await Promise.all(
      ids.map(async (id) => {
        const r = await fetch(`${OMDB_BASE}&i=${id}&plot=short`)
        const data = await r.json()
        if (data.Response === "True") return mapMovie(data)
        return null
      })
    )

    res.json(results.filter(Boolean))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Trending error" })
  }
})

// ---- SEARCH (NEVER RETURNS EMPTY NOW) ----
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q || ""
    const page = req.query.page || 1

    let final = []

    // 1. Try normal OMDb search
    if (q) {
      const r = await fetch(`${OMDB_BASE}&s=${encodeURIComponent(q)}&page=${page}`)
      const data = await r.json()
      if (data.Response === "True" && Array.isArray(data.Search)) {
        final = data.Search.map(mapMovie)
      }
    }

    // 2. If still empty → use fallback categories
    if (final.length === 0) {
      const fallbackQueries = ["action", "popular", "love", "thriller"]

      const fallbackResults = await Promise.all(
        fallbackQueries.map(async (term) => {
          const r = await fetch(`${OMDB_BASE}&s=${term}`)
          const data = await r.json()
          if (data.Response === "True" && Array.isArray(data.Search)) {
            return data.Search.map(mapMovie)
          }
          return []
        })
      )

      final = fallbackResults.flat()
    }

    res.json(final.slice(0, 30)) // return first 30
  } catch (err) {
    console.error(err)
    res.json([]) // safe fallback
  }
})

export default router
