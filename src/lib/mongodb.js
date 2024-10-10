import mongoose from 'mongoose';

const connectMongo = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI, {
        dbName: 'catgy2024',
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to MongoDB');
    }
  } else {
    console.log('MongoDB already connected');
  }
};

export default connectMongo;