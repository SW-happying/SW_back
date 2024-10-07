import express from 'express';
import { createRoom, getRooms } from '../controllers/ottController.js';

const router = express.Router();

// 방 생성 라우트
router.post('/create', createRoom);

// 방 리스트 가져오기
router.get('/list', getRooms);

export default router;
