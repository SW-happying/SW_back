import Room from '../models/roomModel.js';

// 방 생성
export const createRoom = async (req, res) => {
  try {
    const { roomCode, ottPlatform, plan, numberOfPeople, remainingPeriod, totalAmount } = req.body;

    const newRoom = new Room({
      roomCode,
      ottPlatform,
      plan,
      numberOfPeople,
      remainingPeriod,
      totalAmount,
      participants: [], // 처음엔 참가자 없음
    });
 
    await newRoom.save();
    res.status(201).json({ message: '방이 성공적으로 생성되었습니다.', room: newRoom });
  } catch (error) {
    console.error(error);  // 에러가 발생하면 콘솔에 에러 로그 출력
    res.status(500).json({ message: '방 생성에 실패했습니다.', error: error.message });
  }    
};

// 방 리스트 가져오기
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: '방 리스트를 가져오는 데 실패했습니다.', error: error.message });
  }
};

// 방에 참가자 추가 (방 이어받기 기능을 구현하기 위해)
export const joinRoom = async (req, res) => {
  try {
    const { roomCode, participant } = req.body;

    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: '방을 찾을 수 없습니다.' });
    }

    room.participants.push(participant);
    await room.save();

    res.status(200).json({ message: '참가자가 추가되었습니다.', room });
  } catch (error) {
    res.status(500).json({ message: '방 참가에 실패했습니다.', error: error.message });
  }
};
