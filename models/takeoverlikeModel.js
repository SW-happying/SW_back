import mongoose from 'mongoose';

const takeoverlikeSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TakeoverRoom', 
    required: true,
  },
}, { timestamps: true });

const TakeoverLike = mongoose.model('TakeoverLike', takeoverlikeSchema);

export default TakeoverLike;
