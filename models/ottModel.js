import mongoose from 'mongoose';

const ottSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  ottService: { type: String, required: true },
  plan: { type: String, required: true },
  peopleCount: { type: Number, required: true },
  remainingDays: { type: Number, required: true },
  paymentAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const OTT = mongoose.model('OTT', ottSchema);
export default OTT;
