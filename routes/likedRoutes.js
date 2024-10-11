import express from 'express';
import likedController from '../controllers/likedController.js';

const router = express.Router();

// 관심 목록 불러오기
router.get('/:userId', likedController.getLikedList);

export default router;
