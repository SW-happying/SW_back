import express from 'express';
import { createChatRoom, getChatRooms, joinChatRoom, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.post('/create', createChatRoom);
router.get('/', getChatRooms);
router.post('/join', joinChatRoom);
router.post('/message', sendMessage); // 메시지 전송 경로 추가

export default router;
