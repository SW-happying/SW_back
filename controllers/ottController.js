import EnterRoom from '../models/ottenterModel.js';
import ottRoom from '../models/ottModel.js';
import ottPaymentController from './ottPaymentController.js';
import ottLike from '../models/ottlikeModel.js';
import User from '../models/userModel.js';
import ChatMessage from '../models/messageModel.js';

const createRoom = async (req, res) => {
  const { userId, roomName, ottPlatform, plan, maxParticipants, duration, leaderFee, price, startDate } = req.body;

  if (!roomName || !ottPlatform || !plan || !maxParticipants || !duration || !leaderFee || !price || !startDate) {
    return res.status(400).json({ error: '모든 필드를 입력해야 합니다.' });
  }

  try {
    const newRoom = new ottRoom({
      leaderId: userId,
      roomName,
      ottPlatform,
      plan,
      maxParticipants,
      duration,
      price,
      leaderFee,
      startDate,
    });

    const savedRoom = await newRoom.save();
    res.status(201).json({ roomId: savedRoom._id, message: '방이 생성되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '방 생성 중 오류가 발생했습니다.' });
  }
}

const enterRoom = async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  try {
    const room = await ottRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: '해당 방을 찾을 수 없습니다.' });
    }

    const currentParticipants = await EnterRoom.countDocuments({ roomId });
    if (room.maxParticipants <= currentParticipants) {
      return res.status(400).json({ error: '해당 방은 이미 인원이 가득 찼습니다.' });
    }

    const enterRecord = new EnterRoom({ roomId, userId, ottPlatform: room.ottPlatform, plan: room.plan, 
      maxParticipants: room.maxParticipants, duration: room.duration, price: room.price, leaderFee: room.leaderFee 
    });

    await enterRecord.save();
    res.status(200).json({ message: '방에 입장했습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '방 입장 중 오류가 발생했습니다.' });
  }
};

const getAllRooms = async (req, res) => {
  const {userId} = req.params;

  try {
    const rooms = await ottRoom.find({ status: { $ne: '마감' } }, { 
      roomName: 1, 
      ottPlatform: 1, 
      plan: 1, 
      price: 1, 
      _id: 1, 
      duration: 1, 
      leaderFee: 1, 
      maxParticipants: 1,
      startDate: 1
    });

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ error: '현재 등록된 방이 없습니다.' });
    }

    const roomsWithLikes = await Promise.all(rooms.map(async (room) => {
      const likeCount = await ottLike.countDocuments({ roomId: room._id }); 
      const userLiked = await ottLike.exists({ roomId: room._id, userId }); 

      return {
        ...room.toObject(),
        likeCount,
        userLiked: userLiked ? 1 : 0, 
      };
    }));

    res.status(200).json(roomsWithLikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '방 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

const getRoomInfo = async (req, res) => {
  const { roomId } = req.params; 
  try {
    const product = await ottRoom.findById(roomId);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ott 파티원 모집방 상세정보를 불러오지 못했습니다.' });
  }
};

const payingForOtt = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    const user = await User.findOne({ userId }); 
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const product = await ottRoom.findById(roomId);
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    product.totalPurchasers += 1; 
    await product.save();

    const totalPrice = product.price + product.leaderFee;

    await ottPaymentController.transferToPlatform(userId, totalPrice, roomId);

    res.status(201).json({ message: '구매가 완료되었습니다.'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '구매 과정에서 오류가 발생하였습니다.' });
  }
};

const closeParty = async (req, res) => {
  const { roomId } = req.params;

  try {
    const product = await ottRoom.findById(roomId);

    if (!product) {
      return res.status(404).json({ error: '해당 방을 찾을 수 없습니다.' });
    }

    product.status = '마감';
    await product.save();

    res.status(200).json({ message: '모집이 마감되었습니다.', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '모집 마감 처리 중 오류가 발생하였습니다.' });
  }
};

const ottLikeHandle = async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  try {
    const ottExistingLike = await ottLike.findOne({ userId, roomId });

    if (ottExistingLike) {
      await ottLike.findByIdAndDelete(ottExistingLike._id);

      await ottRoom.findByIdAndUpdate(roomId, { $inc: { totalLikes: -1 } });
      await ottRoom.findByIdAndUpdate(roomId, { $set: { userLiked: 0 } });
      return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    } else {
   
      const newOttLike = new ottLike({ userId, roomId });
      await newOttLike.save();
  
      await ottRoom.findByIdAndUpdate(roomId, { $inc: { totalLikes: 1 } });
      await ottRoom.findByIdAndUpdate(roomId, { $set: { userLiked: 1 } });
      return res.status(201).json({ message: '좋아요가 추가되었습니다.', newOttLike });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '좋아요 처리 중 오류가 발생하였습니다.' });
  }
};

export default {
  createRoom,
  enterRoom,
  getAllRooms,
  getRoomInfo,
  payingForOtt,
  closeParty,
  ottLikeHandle,
};
