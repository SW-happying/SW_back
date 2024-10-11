import TakeoverRoom from '../models/takeoverModel.js'; 
import ottRoom from '../models/ottModel.js';
import User from '../models/userModel.js';

// 이어받기 방 생성 함수
const createTakeover = async (req, res) => {

  const { userId } = req.params;
  const { roomId, remainingDuration, paymentAmount } = req.body;

  try {
    const room = await ottRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: '해당 방을 찾을 수 없습니다.' });
    }

    const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const takeoverRoomData = new TakeoverRoom({
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
    const takeoverRoom = await TakeoverRoom.findById(id); 
    if (!takeoverRoom) {
      return res.status(404).json({ error: '해당 방을 찾을 수 없습니다.' });
    }

    const { roomId } = takeoverRoom;

    const ottRoomInfo = await ottRoom.findById(roomId);
    if (!ottRoomInfo) {
      return res.status(404).json({ error: '해당 roomId에 대한 OTT 정보를 찾을 수 없습니다.' });
    }

    res.status(200).json({
      takeoverRoom,
      ottRoomInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '이어받기 방 상세정보를 불러오는 중 오류가 발생했습니다.' });
  }
};


// 이어받기 방 목록 조회 함수
const gettakeoverRooms = async (req, res) => {
  try {
    const takeoverRooms = await TakeoverRoom.find().populate('roomId'); 
    if (!takeoverRooms || takeoverRooms.length === 0) {
      return res.status(404).json({ error: '현재 등록된 이어받기 방이 없습니다.' });
    }
    
    res.status(200).json(takeoverRooms);
  } catch (error) {    
    console.error(error);
    res.status(500).json({ error: '이어받기 방 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

const payingforTakeover = async (req, res) => {
  const { userId } = req.params;
  const { id } = req.body;

  try {
    const takeoverRoom = await TakeoverRoom.findById(id);
    if (!takeoverRoom) {
      return res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' });
    }

    const { paymentAmount, leaderId } = takeoverRoom; 

    const buyer = await User.findOne({userId});
    const leader = await User.findOne({userId: leaderId});

    if (!buyer) {
      return res.status(404).json({ error: '구매자를 찾을 수 없습니다.' });
    }

    if (!leader) {
      return res.status(404).json({ error: '리더를 찾을 수 없습니다.' });
    }

    if (buyer.points < paymentAmount) {
      return res.status(400).json({ error: '포인트가 부족합니다.' });
    }

    buyer.points -= paymentAmount; 
    leader.points += paymentAmount; 

    await buyer.save();
    await leader.save();

    res.status(200).json({
      message: `구매자 ${buyer.userId}의 포인트가 ${paymentAmount}만큼 차감되고, 리더 ${leader.userId}에게 포인트가 전송되었습니다.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '포인트 전송 중 오류가 발생했습니다.' });
  }
};

export default {
  createTakeover,
  gettakeoverRooms, 
  getTakeoverInfo,
  payingforTakeover
};
