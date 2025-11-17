const express = require('express')
const router = express.Router()

const TMDB_BASE = 'https://api.themoviedb.org/3'

function mapMovie(m) {
  return {
    tmdbId: m.id ? m.id.toString() : '',
    title: m.title || '',
    overview: m.overview || '',
    posterUrl: m.poster_path
      ? 'https://image.tmdb.org/t/p/w500' + m.poster_path
      : ''
  }
}

router.get('/trending', async (req, res) => {
  try {
    const url = `${TMDB_BASE}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
    const r = await fetch(url)
    const data = await r.json()
    const results = (data.results || []).map(mapMovie)
    res.json(results)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'TMDB error' })
  }
})

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || ''
    const page = parseInt(req.query.page || '1', 10) || 1
    const url = `${TMDB_BASE}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(
      q
    )}&page=${page}`
    const r = await fetch(url)
    const data = await r.json()
    const results = (data.results || []).map(mapMovie)
    res.json(results)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'TMDB error' })
  }
})

module.exports = router
