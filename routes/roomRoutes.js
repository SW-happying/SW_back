import express from 'express';
import { createRoom, getRooms, joinRoom } from '../controllers/roomController.js';

const router = express.Router();

// 방 생성 라우트
router.post('/create', createRoom);

// 방 리스트 가져오기
router.get('/list', getRooms);

// 방에 참가자 추가 (이어받기 기능)
router.post('/join', joinRoom);

export default router;
