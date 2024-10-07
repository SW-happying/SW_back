import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true, // 방 코드가 고유해야 함
  },
  ottPlatform: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
  },
  remainingPeriod: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  participants: {
    type: [String], // 참가자 목록 (문자열 배열)
    default: [], // 기본값은 빈 배열
  },
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
