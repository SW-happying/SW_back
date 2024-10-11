import express from 'express';
import ottusingController from '../controllers/ottusingController.js';

const router = express.Router();

//이용중인 페이지 불러오기
router.get('/:userId', ottusingController.getUsingRooms); 

export default router;
