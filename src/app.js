import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import './config/db.js';
import reviewsRouter from './routes/reviews.js';
import cinemasRouter from './routes/cinemas.js';
import plansRouter from './routes/plans.js';
import moviesRouter from './routes/movies.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.type('text').send('CineConnect API server. Try GET /api/health');
});

app.get('/api', (req, res) => {
  res.json({ ok: true, message: 'CineConnect API root' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Feature routes
app.use('/api/reviews', reviewsRouter);
app.use('/api/cinemas', cinemasRouter);
app.use('/api/plans', plansRouter);
app.use('/api/movies', moviesRouter);

// Mock auth endpoint for profile demo
app.get('/api/auth/me', (req, res) => {
  // In real app, read from JWT. Here we return a placeholder if client passes userId via header (optional)
  const userId = req.headers['x-user-id'] || 'u_demo';
  res.json({ id: userId, name: 'Demo User' });
});

export default app;
