import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    tmdbId: { type: String, index: true, required: true },
    userId: { type: String },
    userName: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
