import express from 'express';
import groupshoppingController from '../controllers/groupshoppingController.js';

const router = express.Router();

router.get('/products', groupshoppingController.getProductList); // 공동구매 상품 목록
router.post('/products', groupshoppingController.addProduct); // 공동 구매 상품 등록 

//productId = groupshopping모델의 _id
router.get('/products/:productId', groupshoppingController.getProductInfo); // 상품 상세 조회
router.post('/products/:productId', groupshoppingController.registPurchase); // 상품 구매 
router.post('/products/:productId/addlike', groupshoppingController.groupLikeHandle); // 좋아요 누르기 
router.get('/products/:productId/close', groupshoppingController.closeGroup); //모집 마감 

export default router;
