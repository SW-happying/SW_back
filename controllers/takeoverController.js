import TakeoverRoom from '../models/takeoverModel.js'; 
import ottRoom from '../models/ottModel.js';
import User from '../models/userModel.js';
import TakeoverLike from '../models/takeoverlikeModel.js';
import EnterRoom from '../models/ottenterModel.js';

const createTakeover = async (req, res) => {

  const { userId, roomId, roomName, price, description } = req.body;

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
      leadId: userId,
      roomId,
      roomName,
      price,
      description,
      ottPlatform: room.ottPlatform,  
      plan: room.plan,              
      maxParticipants: room.maxParticipants, 
      duration: room.duration,        
      startDate: room.startDate,                   
      leaderFee: room.leaderFee, 
    });

    await takeoverRoomData.save();

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


const gettakeoverRooms = async (req, res) => {
  const { userId } = req.params;

  try {
    const takeoverRooms = await TakeoverRoom.find().populate('roomId'); 
    if (!takeoverRooms || takeoverRooms.length === 0) {
      return res.status(404).json({ error: '현재 등록된 이어받기 방이 없습니다.' });
    }

    const roomsWithLikes = await Promise.all(takeoverRooms.map(async (room) => {
      const likeCount = await TakeoverLike.countDocuments({ roomId: room._id }); 
      const userLiked = await TakeoverLike.exists({ roomId: room._id, userId }); 

      return {
        ...room.toObject(),
        likeCount,
        userLiked: userLiked ? 1 : 0, 
      };
    }));
    //
    res.status(200).json(roomsWithLikes); // 변수 이름 수정
  } catch (error) {    
    console.error(error);
    res.status(500).json({ error: '이어받기 방 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};


const payingforTakeover = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const takeoverRoom = await TakeoverRoom.findById(id);
    if (!takeoverRoom) {
      return res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' });
    }

    const { price, leadId, roomId } = takeoverRoom;

    const buyer = await User.findOne({ userId });
    const leader = await User.findOne({ userId: leadId });

    if (!buyer) {
      return res.status(404).json({ error: '구매자를 찾을 수 없습니다.' });
    }

    if (!leader) {
      return res.status(404).json({ error: '리더를 찾을 수 없습니다.' });
    }

    if (buyer.points < price) {
      return res.status(400).json({ error: '포인트가 부족합니다.' });
    }

    buyer.points -= price;
    leader.points += price;

    await buyer.save();
    await leader.save();

    const newEnterRoom = new EnterRoom({
      roomId: roomId,
      userId: buyer.userId,
      ottPlatform: takeoverRoom.ottPlatform,
      plan: takeoverRoom.plan,
      maxParticipants: takeoverRoom.maxParticipants,
      duration: takeoverRoom.duration,
      price: takeoverRoom.price,
      leaderFee: takeoverRoom.leaderFee,
      startDate: takeoverRoom.startDate
    });

    await newEnterRoom.save();
    await EnterRoom.findOneAndUpdate(
      { roomId: roomId, userId: leader.userId },
      { $set: { status: '판매완료' } },
      { new: true }
    );

    // const socket = req.app.get('socketio');
    // socket.to(roomId).emit('leaveRoom', { roomId, userId: leaderId });
    // socket.to(roomId).emit('joinRoom', { roomId, userId });

    res.status(200).json({
      message: `구매자 ${buyer.userId}의 포인트가 ${price}만큼 차감되고, 리더 ${leader.userId}에게 포인트가 전송되었습니다.`,
      newEnterRoom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '포인트 전송 및 구매 처리 중 오류가 발생했습니다.' });
  }
};

const takeoverLikeHandle = async (req, res) => {
  const { roomId } = req.params; 
  const { userId } = req.body; 
  
  try {
    // 이미 좋아요가 있는지 확인
    const takeoverExistingLike = await TakeoverLike.findOne({ userId, roomId });
    console.log('Existing like:', takeoverExistingLike);
    if (takeoverExistingLike) {
      // 좋아요 취소
      await TakeoverLike.findByIdAndDelete(takeoverExistingLike._id); 
      await TakeoverRoom.findByIdAndUpdate(roomId, { $inc: { totalLikes: -1 }, $set: { userLiked: 0 } }); 
      return res.status(200).json({ message: '좋아요가 취소되었습니다.' }); 
    } else {
      // 새로운 좋아요 추가
      const newTakeoverLike = new TakeoverLike({ userId, roomId }); 
      await newTakeoverLike.save(); 

      await TakeoverRoom.findByIdAndUpdate(roomId, { $inc: { totalLikes: 1 }, $set: { userLiked: 1 } }); 
      return res.status(201).json({ message: '좋아요가 추가되었습니다.', newTakeoverLike }); 
    }
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: '좋아요 처리 중 오류가 발생하였습니다.' }); 
  }
};

export default {
  createTakeover,
  gettakeoverRooms, 
  getTakeoverInfo,
  payingforTakeover,
  takeoverLikeHandle
};
