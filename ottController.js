import OTT from '../models/ottModel.js';

// 방 생성
export const createRoom = async (req, res) => {
  try {
    const { roomCode, ottService, plan, peopleCount, remainingDays, paymentAmount } = req.body;

    const newRoom = new OTT({
      roomCode,
      ottService,
      plan,
      peopleCount,
      remainingDays,
      paymentAmount
    });

    await newRoom.save();
    res.status(201).json({ message: '방이 성공적으로 생성되었습니다.', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: '방 생성에 실패했습니다.', error: error.message });
  }
};

// 방 리스트 가져오기
export const getRooms = async (req, res) => {
  try {
    const rooms = await OTT.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: '방 목록을 가져오는 데 실패했습니다.', error: error.message });
  }
};
