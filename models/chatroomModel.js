import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId, // 채팅방을 구분하기 위한 roomId
    ref: 'ottRoom', // 채팅방 모델과 연결
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId, // 메시지를 보낸 사용자의 ID
    ref: 'User', // User 모델과 연결
    required: true,
  },
  text: {
    type: String, // 메시지 내용
    required: true,
  },
  timestamp: {
    type: Date, // 메시지가 전송된 시간
    default: Date.now, // 기본값으로 현재 시간
  },
}, {
  versionKey: false, // __v 필드를 사용하지 않도록 설정
});

// Message 모델 생성
const Message = mongoose.model('Message', messageSchema);

export default Message;
