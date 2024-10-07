import mongoose from 'mongoose';

const takeoverSchema = new mongoose.Schema({
  roomCode: { type: String, required: true },
  userName: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  paymentStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Takeover = mongoose.model('Takeover', takeoverSchema);
export default Takeover;
