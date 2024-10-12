import Message from '../models/chatModel.js';

const getChatMessages = async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await Message.find({ roomId }).populate('sender receiver');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error });
    }
};

const saveMessage = async (req, res) => {
    const { text, sender, receiver, roomId } = req.body;
    try {
        const message = new Message({ text, sender, receiver, roomId });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error });
    }
};

export default {
  saveMessage,
  getChatMessages,
}