import express from 'express';
import groupshoppingController from '../controllers/groupshoppingController.js';

const router = express.Router();

router.get('/productlist', groupshoppingController.getProductList); // 공동구매 상품 목록
router.get('/product/:id', groupshoppingController.getProductInfo); // 상품 상세 조회 
router.post('/product/purchase/:userId', groupshoppingController.registPurchase); // 상품 구매 
router.post('/addproduct/:userId', groupshoppingController.addProduct); // 공동 구매 상품 등록 
router.post('/product/likes/:productId', groupshoppingController.groupLikeHandle); // 좋아요 누르기 
router.get('/closegroup/:productId', groupshoppingController.closeGroup); //모집 마감 

export default router;
