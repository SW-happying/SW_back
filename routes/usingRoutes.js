import express from 'express';
import ottusingController from '../controllers/ottusingController.js';

const router = express.Router();

router.get('/:userId', ottusingController.getUsingRooms); // GET 요청으로 방 목록을 가져옵니다.

export default router;
