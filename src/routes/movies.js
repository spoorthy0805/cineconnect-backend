import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function httpFetch(url, options) {
  if (typeof fetch === 'function') {
    return await fetch(url, options);
  }
  const mod = await import('node-fetch');
  const nf = mod.default || mod;
  return await nf(url, options);
}

// Minimal real fallback suggestions to avoid empty homepage when TMDB key is missing
const fallbackSuggestions = [
  {
    tmdbId: '27205',
    title: 'Inception',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg',
    overview: 'A skilled thief who infiltrates dreams is tasked with planting an idea into a CEO’s mind.'
  },
  {
    tmdbId: '157336',
    title: 'Interstellar',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
    overview: 'A team of explorers travels through a wormhole in space to ensure humanity’s survival.'
  },
  {
    tmdbId: '238',
    title: 'The Godfather',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
    overview: 'The powerful Corleone crime family navigates loyalty, power, and legacy.'
  }
];

function mapMovie(m) {
  return {
    tmdbId: m.id?.toString(),
    title: m.title,
    posterUrl: m.poster_path ? 'https://image.tmdb.org/t/p/w500' + m.poster_path : '',
    overview: m.overview || ''
  };
}

router.get('/trending', async (req, res) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.json(fallbackSuggestions);
    }
    const page = Math.max(1, Math.min(parseInt(req.query.page || '1', 10) || 1, 5));
    const url = `${TMDB_BASE}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const r = await httpFetch(url);
    const data = await r.json();
    const items = (data.results || []).map(mapMovie);

    try {
      for (const m of items) {
        await Movie.updateOne(
          { tmdbId: m.tmdbId },
          { $set: { ...m, cachedAt: new Date() } },
          { upsert: true }
        );
      }
    } catch (_) {
      // ignore caching errors (e.g., DB not connected)
    }

    res.json(items);
  } catch (e) {
    // Fallback to static list on failure
    return res.json(fallbackSuggestions);
  }
});

router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const page = Math.max(1, Math.min(parseInt(req.query.page || '1', 10) || 1, 5));
    const url = `${TMDB_BASE}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q)}&page=${page}`;
    const r = await httpFetch(url);
    const data = await r.json();
    res.json((data.results || []).map(mapMovie));
  } catch (e) {
    res.status(500).json({ error: 'TMDB error' });
  }
});

export default router;
