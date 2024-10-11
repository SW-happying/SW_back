import mongoose from 'mongoose';

const groupProductSchema = new mongoose.Schema({
  leaderId: {
  type: String,
  required: true
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  options: {
    type: [
      {
        name: {
          type: String, 
          required: true,
        },
        values: {
          type: [String], 
          required: true,
        },
      },
    ],
    required: false, 
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  leaderFee: {
    type: Number,
    required: true,
  },
  maxMember: {
    type: Number,
    required: true,
  },
  totalPurchasers: { 
    type: Number,
    default: 0, 
  },
  totalLikes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String, 
    enum: ["진행중","마감"],
    default: "진행중"
  } 
}, { timestamps: true });

const GroupShopping = mongoose.model('GroupShopping', groupProductSchema);
export default GroupShopping;
