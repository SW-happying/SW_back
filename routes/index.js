import express from 'express';
import mypageRoutes from './mypageRoutes.js';
import groupshoppingRoutes from './groupshoppingRoutes.js';
import likedRoutes from './likedRoutes.js'; 
import usingRoutes from './usingRoutes.js';
import likedController from '../controllers/likedController.js';
import ottRoutes from './ottRoutes.js';

const router = express.Router();


router.use('/mypage', mypageRoutes); //마이페이지 
router.use('/groupshopping', groupshoppingRoutes); //공동구매 페이지
router.use('/ott', ottRoutes); //ott 페이지
router.use('/mylikes', likedRoutes);  //관심목록
router.use('/myott', usingRoutes); //이용중
router.get('/home', likedController.getPopularList); //인기목록 불러오기
export default router;
