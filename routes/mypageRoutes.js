import express from 'express';
import pointController from '../controllers/pointController.js';
import userController from '../controllers/userController.js'; 
import groupshoppingController from '../controllers/groupshoppingController.js'; 

const router = express.Router();

router.get('/:userId',userController.getUserInfo) //내 userId로 가져옴 
router.get('/purchaselist/:userId', groupshoppingController.getPurchaseList); // 구매내역 조회 (공동구매)
router.get('/mypurchase/confirm/:purchaseId', groupshoppingController.confirmPurchase); //구매확정 누르기
router.get('/myparty/:productId', groupshoppingController.getBuyerList); //내 파티 
router.post('/myparty/:productId/status', groupshoppingController.updatePurchaseStatus); //상태변경 
router.get('/points/:userId', pointController.getPoint); //포인트 내역 (충전/교환..) 

export default router;
