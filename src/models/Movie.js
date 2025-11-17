import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  tmdbId: { type: String, index: true, unique: true },
  title: { type: String, required: true },
  posterUrl: { type: String, default: '' },
  overview: { type: String, default: '' },
  cachedAt: { type: Date }
}, { timestamps: true });

const Movie = mongoose.model('Movie', MovieSchema);
export default Movie;
