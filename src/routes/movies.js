import express from 'express'

const router = express.Router()

// Public OMDb key for small projects
const OMDB_KEY = '564727fa'
const OMDB_BASE = `https://www.omdbapi.com/?apikey=${OMDB_KEY}`

function mapMovie(m) {
  return {
    tmdbId: m.imdbID || '',
    title: m.Title || '',
    overview: m.Plot || '',
    posterUrl: m.Poster && m.Poster !== 'N/A' ? m.Poster : '',
    year: m.Year || '',
    type: m.Type || ''
  }
}

// "Trending" = curated popular movies from different genres
router.get('/trending', async (req, res) => {
  try {
    const ids = [
      'tt15398776', // Oppenheimer
      'tt1517268',  // Barbie
      'tt1160419',  // Dune
      'tt1375666',  // Inception
      'tt0816692',  // Interstellar
      'tt7286456',  // Joker
      'tt4633694',  // Spider-Man: Into the Spider-Verse
      'tt4154796',  // Avengers: Endgame
      'tt1853728',  // Django Unchained
      'tt4630562'   // The Fate of the Furious
    ]

    const results = await Promise.all(
      ids.map(async id => {
        const r = await fetch(`${OMDB_BASE}&i=${id}&plot=short`)
        const data = await r.json()
        if (data && data.Response === 'True') return mapMovie(data)
        return null
      })
    )

    res.json(results.filter(Boolean))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'OMDb error' })
  }
})

// Search anything: "leo", "kgf", "batman", "iron man" etc.
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || ''
    const page = parseInt(req.query.page || '1', 10) || 1

    if (!q.trim()) return res.json([])

    const r = await fetch(
      `${OMDB_BASE}&s=${encodeURIComponent(q)}&page=${page}`
    )
    const data = await r.json()
    if (!data || data.Response !== 'True') return res.json([])

    const list = (data.Search || []).map(m => ({
      tmdbId: m.imdbID || '',
      title: m.Title || '',
      overview: '',
      posterUrl: m.Poster && m.Poster !== 'N/A' ? m.Poster : '',
      year: m.Year || '',
      type: m.Type || ''
    }))

    res.json(list)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'OMDb error' })
  }
})

export default router
