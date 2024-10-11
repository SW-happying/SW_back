import mongoose from 'mongoose';

const ottlikeSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ottRoom', 
    required: true,
  },
}, { timestamps: true });

const ottLike = mongoose.model('ottLike', ottlikeSchema);

export default ottLike;
