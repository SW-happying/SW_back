import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB에 연결되었습니다.');
  } catch (error) {
    console.error('MongoDB 연결 오류:', error);
    process.exit(1);
  }
};

export default connectDB;
