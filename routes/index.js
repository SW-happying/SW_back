import express from 'express';
import mypageRoutes from './mypageRoutes.js';
import groupshoppingRoutes from './groupshoppingRoutes.js';
import likedRoutes from './likedRoutes.js'; 
import usingRoutes from './usingRoutes.js';
import likedController from '../controllers/likedController.js';

const router = express.Router();


router.use('/mypage', mypageRoutes);
router.use('/groupshopping', groupshoppingRoutes);
router.use('/mylikes', likedRoutes);  
router.use('/myott', usingRoutes); 
router.get('/home', likedController.getPopularList);
export default router;
