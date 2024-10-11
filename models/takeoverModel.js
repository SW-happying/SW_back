import mongoose from 'mongoose';
import ottRoom from './ottModel.js'; 

const takeoverRoomSchema = new mongoose.Schema({
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ottRoom',
      required: true,
    },
    leaderId: {
      type: String,
      required: true,
    },
    remainingDuration: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number, 
      required: true,
    },
    status: {
      type: String, 
      enum: ["진행중","마감"],
      default: "진행중"
    }
});

const takeoverRoom = mongoose.model('takeoverRoom', takeoverRoomSchema);
export default takeoverRoom;
