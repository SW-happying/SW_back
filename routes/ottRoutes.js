import express from 'express';
import ottController from "../controllers/ottController.js";
import takeoverController from "../controllers/takeoverController.js";

const router = express.Router();

//파티원 모집 섹션
router.get('/partylist/:userId', ottController.getAllRooms); //ott 파티 목록 조회
router.post('/party', ottController.createRoom); //ott 파티원 모집방 추가등록
router.get('/party/:roomId', ottController.getRoomInfo); //파티원 모집방 상세정보 (파티방 _id로)
router.get('/party/:roomId/close', ottController.closeParty); // 모집 마감
router.post('/party/:roomId/addlike', ottController.ottLikeHandle); // ott방 좋아요
router.post('/party/:roomId/chat', ottController.enterRoom); //채팅방 입장...해야함
router.get('/party/:roomId/chat/:userId',ottController.payingForOtt); //ott 서비스 결제하기

//이어받기 섹션
router.get('/takeover/:userId', takeoverController.gettakeoverRooms); //이어받기 방 목록 불러오기
router.post('/takeover/', takeoverController.createTakeover); //이어받기 방 추가등록
router.get('/takeover/:id', takeoverController.getTakeoverInfo); //이어받기 방 상세정보 (이어받기 방 _id로)
router.post('/takeover/:id',takeoverController.payingforTakeover); //ott 서비스 결제하기
router.post('/takeover/:id/addlike', takeoverController.takeoverLikeHandle); // ott방 좋아요

export default router;