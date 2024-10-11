import express from 'express';
import pointController from '../controllers/pointController.js';
import userController from '../controllers/userController.js'; 
import groupshoppingController from '../controllers/groupshoppingController.js'; 

const router = express.Router();

router.get('/:userId',userController.getUserInfo) // 내 정보 불러오기
router.get('/mypurchase/:userId', groupshoppingController.getPurchaseList); // 구매내역 조회 (공동구매)
router.get('/mypurchase/confirm/:purchaseId', groupshoppingController.confirmPurchase); //구매확정 누르기 (마지막 사람까지 완료하면 리더한테 포인트 전송됨)
router.get('/myparty/group/:productId', groupshoppingController.getBuyerList); //공동구매 구매자 리스트
router.get('/myparty/:userId',userController.getLeaderRooms);
router.post('/myparty/:productId/status', groupshoppingController.updatePurchaseStatus); // 공동구매 상태변경 
router.get('/points/:userId', pointController.getPoint); //내 포인트
router.get('/pointlist/:userId', pointController.getPointList); //내 포인트 거래 내역

export default router;
