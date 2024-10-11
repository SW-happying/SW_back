import express from 'express';
import ottController from "../controllers/ottController.js";
import takeoverController from "../controllers/takeoverController.js";

const router = express.Router();

//파티원 모집 섹션
router.get('/party/partylist', ottController.getAllRooms); //ott 파티 목록 조회
router.post('/party/addparty/:userId', ottController.createRoom); //ott 파티원 모집방 추가등록
router.get('/party/:id', ottController.getRoomInfo); //파티원 모집방 상세정보
router.get('/party/close/:roomId', ottController.closeParty); // 모집 마감
router.post('/party/likes/:roomId', ottController.ottLikeHandle); // ott방 좋아요
router.get('party/:id/enter', ottController.enterRoom); //채팅방 입장...해야함
router.post('/party/purchase/:userId',ottController.payingForOtt); //ott 서비스 결제하기

//이어받기 섹션
router.get('/takeover/ottlist', takeoverController.gettakeoverRooms); //이어받기 방 목록 불러오기
router.get('/takeover/:id', takeoverController.getTakeoverInfo); //이어받기 방 상세정보
router.post('/takeover/addroom/:userId', takeoverController.createTakeover); //이어받기 방 추가등록
router.post('/takeover/purchase/:userId',takeoverController.payingforTakeover); //ott 서비스 결제하기

export default router;