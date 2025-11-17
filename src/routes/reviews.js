import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// GET /api/reviews/:tmdbId -> list reviews + average rating
router.get('/:tmdbId', async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const reviews = await Review.find({ tmdbId }).sort({ createdAt: -1 }).lean();
    const count = reviews.length;
    const avg = count ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / count).toFixed(1) : null;
    res.json({ tmdbId, count, average: avg ? Number(avg) : null, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews/:tmdbId -> create review
router.post('/:tmdbId', async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { rating, comment, userId, userName } = req.body || {};
    if (!rating) return res.status(400).json({ error: 'rating required' });

    const doc = await Review.create({ tmdbId, rating, comment: comment || '', userId: userId || null, userName: userName || 'Anonymous' });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export default router;
