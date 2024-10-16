import ChatRoom from "../models/chatroomModel.js";

// 채팅방 생성
export const createChatRoom = async (req, res) => {
  const { roomName, userId } = req.body;
  
  try {
      const newRoom = new ChatRoom({ name: roomName, participants: [userId] });
      await newRoom.save();
      res.status(201).json(newRoom);
  } catch (error) {
    console.error(error);
      res.status(500).json({ message: '채팅방 생성 중 오류 발생' });
  }
};

// 채팅방 목록 가져오기
export const getChatRooms = async (req, res) => {
  try {
      const rooms = await ChatRoom.find();
      res.status(200).json(rooms);
  } catch (error) {
      res.status(500).json({ message: '채팅방 목록을 가져오는 중 오류 발생' });
  }
};

// 특정 채팅방에 입장
export const joinChatRoom = async (req, res) => {
  const { roomId, userId } = req.body;

  try {
      const room = await ChatRoom.findById(roomId);
      if (room) {
          if (!room.participants.includes(userId)) {
              room.participants.push(userId);
              await room.save();
          }
          const messages = await Message.find({ roomId }); // 채팅 내역 가져오기
          res.status(200).json({ room, messages });
      } else {
          res.status(404).json({ message: '채팅방을 찾을 수 없습니다.' });
      }
  } catch (error) {
      res.status(500).json({ message: '채팅방에 입장 중 오류 발생' });
  }
};

// 메시지 전송
export const sendMessage = async (req, res) => {
  const { roomId, sender, content } = req.body;

  try {
      const newMessage = new Message({ roomId, sender, content });
      await newMessage.save();
      res.status(201).json(newMessage);
  } catch (error) {
      res.status(500).json({ message: '메시지 전송 중 오류 발생' });
  }
};