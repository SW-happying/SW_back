import EnterRoom from '../models/ottenterModel.js';
import ottRoom from '../models/ottModel.js';
import ottPaymentController from './ottPaymentController.js';

const createRoom = async (req, res) => {
  const { userId } = req.params;
  const { roomName, ottPlatform, plan, maxParticipants, duration, adminFee } = req.body;

  if (!roomName || !ottPlatform || !plan || !maxParticipants || !duration || !adminFee) {
      return res.status(400).json({ error: '모든 필드를 입력해야 합니다.' });
  }

  const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

  try {
      const newRoom = new ottRoom({
          leaderId: userId,
          roomName,
          ottPlatform,
          plan,
          maxParticipants,
          duration,
          leaderFee,
      });

      const savedRoom = await newRoom.save();
      res.status(201).json(savedRoom); 
  } catch (err) {
      console.error(err); 
      res.status(500).json({ error: '방 생성 중 오류가 발생했습니다.' });
  }
};

const getAllRooms = async (req, res) => {
  try {
      const rooms = await ottRoom.find({ status: { $ne: '마감' } }, { name: 1, plan: 1, price: 1, _id: 1, image: 1, deadline: 1 });

      if (!rooms || rooms.length === 0) {
          return res.status(404).json({ error: '현재 등록된 방이 없습니다.' });
      }

      res.status(200).json(rooms);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: '방 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

//채팅방과 연결...
const enterRoom = async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    try {
        const room = await ottRoom.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: '해당 방을 찾을 수 없습니다.' });
        }

        // 현재 참여자 수를 가져옵니다
        const currentParticipants = await EnterRoom.countDocuments({ roomId });

        // 인원이 가득 찼는지 확인
        if (room.maxParticipants <= currentParticipants) {
            return res.status(400).json({ error: '해당 방은 이미 인원이 가득 찼습니다.' });
        }

        // 방에 입장한 정보를 저장
        const enterRoomData = new EnterRoom({
            roomId,
            userId
        });

        await enterRoomData.save();

        // 성공적으로 저장 후 채팅방으로 이동할 URL 응답
        res.status(200).json({ message: '방에 입장하였습니다.', chatRoomURL: `/chat/${roomId}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '방 입장 중 오류가 발생했습니다.' });
    }
};

const getRoomInfo = async (req, res) => {
  const { id } = req.params; 
  try {
    const product = await ottRoom.findById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '공동구매 상품 상세정보를 불러오지 못했습니다.' });
  }
};

const payingForOtt = async (req, res) => {
  const { userId } = req.params;
  const { roomId:roomIdFromBody } = req.body;

  try {
    const user = await User.findOne({ userId }); 
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const product = await ottRoom.findById(roomIdFromBody);
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    product.totalPurchasers += 1; 
    await product.save();

    const totalPrice = product.price + product.leaderFee;

    await ottPaymentController.transferToPlatform(userId, totalPrice, roomIdFromBody);

    res.status(201).json({ message: '구매가 완료되었습니다.', newPurchase });
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
      return res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' });
    }

    product.status = '마감';
    await product.save();

    res.status(200).json({ message: '모집이 마감되었습니다.', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '모집 마감 처리 중 오류가 발생하였습니다.' });
  }
};

export default {
  createRoom,
  enterRoom,
  getAllRooms,
  getRoomInfo,
  payingForOtt,
  closeParty
};
