import express from 'express';
import pointController from '../controllers/pointController.js';
import userController from '../controllers/userController.js'; 
import groupshoppingController from '../controllers/groupshoppingController.js'; 

const router = express.Router();

router.post('/new', userController.registerUser); // 계정 등록 
router.get('/:userId',userController.getUserInfo) // 내 정보 불러오기
router.get('/mypurchase/:userId', groupshoppingController.getPurchaseList); // 구매내역 조회 (공동구매)
router.get('/mypurchase/:purchaseId/confirm', groupshoppingController.confirmPurchase); //구매확정 누르기 (마지막 사람까지 완료하면 리더한테 포인트 전송됨)

router.get('/myparty/:productId', groupshoppingController.getBuyerList); //공동구매 구매자 리스트
router.post('/myparty/:productId/status', groupshoppingController.updatePurchaseStatus); // 공동구매 상태변경 
router.get('/myparty/:userId',userController.getLeaderRooms); //내 파티 불러오기 

router.get('/mypoint/:userId', pointController.getPoint); //내 포인트
router.get('/mypoint/list/:userId', pointController.getPointList); //내 포인트 거래 내역

export default router;
