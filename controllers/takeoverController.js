import takeoverRoom from '../models/takeoverModel.js'; 
import ottRoom from '../models/ottModel.js';

// 이어받기 방 생성 함수
const createTakeover = async (req, res) => {

  const { userId } = req.params;
  const { roomId, remainingDuration, paymentAmount } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: '해당 방을 찾을 수 없습니다.' });
    }

    const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const takeoverRoomData = new takeoverRoom({
      leaderId: userId,
      roomId,
      remainingDuration,
      paymentAmount,
    });

    await takeoverRoomData.save();

        // 성공적으로 이어받기 방 추가 후 응답
    res.status(201).json({ message: '이어받기 방이 추가되었습니다.', takeoverRoomData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '방 이어받기 중 오류가 발생했습니다.' });
  }
};

const getTakeoverInfo = async (req, res) => {
  const { id } = req.params; 
  try {
    const product = await takeoverRoom.findById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '공동구매 상품 상세정보를 불러오지 못했습니다.' });
  }
}

// 이어받기 방 목록 조회 함수
const gettakeoverRooms = async (req, res) => {
  try {
    const takeoverRooms = await TakeoverRoom.find().populate('roomId'); // 방 정보 포함
    if (!takeoverRooms || takeoverRooms.length === 0) {
      return res.status(404).json({ error: '현재 등록된 이어받기 방이 없습니다.' });
    }
    
    res.status(200).json(takeoverRooms);
  } catch (error) {    
    console.error(error);
    res.status(500).json({ error: '이어받기 방 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

export default {
  createTakeover,
  gettakeoverRooms, 
  getTakeoverInfo
};
