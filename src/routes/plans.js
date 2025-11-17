import express from 'express';
import { plans, messages } from '../store/memory.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// POST /api/plans -> create plan
router.post('/', (req, res) => {
  const { movieId, cinemaId, timeOptions, userId, userName } = req.body || {};
  if (!movieId || !cinemaId) return res.status(400).json({ error: 'movieId and cinemaId required' });
  const times = typeof timeOptions === 'string' ? timeOptions.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(timeOptions) ? timeOptions : []);
  const plan = {
    id: `pl_${randomUUID()}`,
    movieId,
    cinemaId,
    times,
    status: 'open',
    inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    owner: { userId: userId || null, userName: userName || 'Anonymous' },
    members: userId ? [{ userId, userName: userName || 'Anonymous' }] : [],
    createdAt: Date.now(),
  };
  plans.push(plan);
  res.status(201).json(plan);
});

// GET /api/plans/mine?userId=...
router.get('/mine', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.json({ plans: [] });
  const list = plans.filter(p => p.owner?.userId === userId || p.members.some(m => m.userId === userId));
  res.json({ plans: list });
});

// GET /api/plans/:planId/messages -> chat history
router.get('/:planId/messages', (req, res) => {
  const { planId } = req.params;
  res.json({ planId, messages: messages[planId] || [] });
});

export default router;
