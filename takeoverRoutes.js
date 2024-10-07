import express from 'express';
import { takeoverService } from '../controllers/takeoverController.js';

const router = express.Router();

// 이어받기 라우트
router.post('/takeover', takeoverService);

export default router;
