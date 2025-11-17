import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.warn('MONGODB_URI is not set. Set it in your backend .env to enable database.');
}

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  if (!MONGODB_URI) return;
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || 'cineconnect' });
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Immediately connect on import
connectDB();
