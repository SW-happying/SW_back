import mongoose from 'mongoose';

const grouplikeSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupShopping', 
    required: true,
  },
}, { timestamps: true });

const groupLike = mongoose.model('groupLike', grouplikeSchema);

export default groupLike;

