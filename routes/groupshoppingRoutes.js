import express from 'express';
import groupshoppingController from '../controllers/groupshoppingController.js';

const router = express.Router();

// 공동구매 상품 목록
router.get('/productlist', groupshoppingController.getProductList);

// 상품 상세 조회 
router.get('/product/:id', groupshoppingController.getProductInfo); 

// 상품 구매 
router.post('/product/purchase/:userId', groupshoppingController.registPurchase); 

// 공동 구매 상품 등록 
router.post('/addproduct/:userId', groupshoppingController.addProduct); 

// 좋아요 누르기 
router.post('/product/likes/:productId', groupshoppingController.groupLikeHandle);

//모집 마감 
router.get('/product/close/:productId', groupshoppingController.closeGroup);

export default router;
