import mongoose from 'mongoose';

const ottRoomSchema = new mongoose.Schema({
  leaderId: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  ottPlatform: {
    type: String,
    enum: ['넷플릭스', '왓챠', '티빙', '웨이브', '라프텔', '디즈니플러스', '네이버멤버십'], 
    required: true,
  },
  plan: {
    type: String,
    enum: ['standard', 'basic', 'premium', 'monthly', 'annual'],
    required: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  leaderFee: {
    type: Number,
    required: true,
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  totalPurchasers: {
    type: Number,
    default: 0,
  },
  status: {
    type: String, 
    enum: ["진행중","마감"],
    default: "진행중"
  },
  startDate: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  userLiked: {
    type: Number,
    default: 0
  },
});

ottRoomSchema.pre('save', function(next) {
  if (this.roomName) {
    const name = new String(this.roomName);
    this.name = name;
  }
  next();
});

const ottRoom = mongoose.model('ottRoom', ottRoomSchema);
export default ottRoom;
