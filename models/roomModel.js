import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true }, // 방 코드
  ottPlatform: { type: String, required: true }, // OTT 플랫폼 (예: Netflix, Disney 등)
  plan: { type: String, required: true }, // 플랜 정보
  numberOfPeople: { type: Number, required: true }, // 인원수
  remainingPeriod: { type: Number, required: true }, // 남은 기간
  totalAmount: { type: Number, required: true }, // 결제 금액
  participants: [{ type: String }], // 참가자 리스트 (optional)
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
