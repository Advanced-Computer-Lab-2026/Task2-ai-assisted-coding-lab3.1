import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set');
    return false;
  }
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error', err.message);
    process.exit(1);
  }
}
