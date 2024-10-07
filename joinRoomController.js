import Room from '../models/roomModel.js';

// 방 이어받기 (참가자 추가)
export const joinRoom = async (req, res) => {
  try {
    const { roomCode, participant } = req.body;

    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: '방을 찾을 수 없습니다.' });
    }

    // 중복 참가자 확인
    if (room.participants.includes(participant)) {
      return res.status(400).json({ message: '이미 참가한 사용자입니다.' });
    }

    room.participants.push(participant);
    await room.save();

    res.status(200).json({ message: '참가자가 추가되었습니다.', room });
  } catch (error) {
    res.status(500).json({ message: '방 참가에 실패했습니다.', error: error.message });
  }
};
