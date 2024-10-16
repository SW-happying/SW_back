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
        categoryName: {
          type: String,
          required: false, 
        },
        options: [
          {
            name: {
              type: String,
              required: false, 
            },
            values: {
              type: String,
              required: false, 
            },
          },
        ],
      },
    ],
    required: false, 
  },
  image: {
    type: [String],
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
  },
  name: {
      type: String,
      required:false,
    },
  userLiked: {
    type: Number,
    default: 0,
  }
 }, { timestamps: true });
  
  groupProductSchema.pre('save', function(next) {
    if (this.productName) {
      const name = new String(this.productName);
      this.name = name;
    }
    next();
  });


const GroupShopping = mongoose.model('GroupShopping', groupProductSchema);
export default GroupShopping;
