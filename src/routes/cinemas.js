import express from 'express';

const router = express.Router();

// Simple static Bengaluru cinemas list (seed-like)
const cinemas = [
  { id: 'cin_1', name: 'PVR Orion Mall', address: 'Dr Rajkumar Rd, Rajajinagar, Bengaluru' },
  { id: 'cin_2', name: 'INOX Garuda Mall', address: 'Magrath Rd, Ashok Nagar, Bengaluru' },
  { id: 'cin_3', name: 'PVR Koramangala', address: 'Koramangala, Bengaluru' },
  { id: 'cin_4', name: 'Cinepolis ETA Mall', address: 'Binny Pete, Bengaluru' },
  { id: 'cin_5', name: 'PVR Phoenix Marketcity', address: 'Whitefield Main Rd, Mahadevpura, Bengaluru' },
];

// GET /api/cinemas/nearby -> returns list
router.get('/nearby', (req, res) => {
  res.json({ count: cinemas.length, cinemas });
});

export default router;
