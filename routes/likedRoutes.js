import express from 'express';
import likedController from '../controllers/likedController.js';

const router = express.Router();

router.get('/:userId', likedController.getLikedList);

export default router;
