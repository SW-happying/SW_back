import express from "express";
import ottController from "../controllers/ottController.js";
import takeoverController from "../controllers/takeoverController.js";

const router = express.Router();

//파티원 모집 섹션
router.get('/party/ottlist', ottController.getAllRooms);
router.post('/party/addparty/:userId', ottController.createRoom);
router.get('/party/:id', ottController.getRoomInfo);
router.get('/party/close/:id', ottController.closeParty);



//이어받기 섹션
router.get('/takeover/ottlist', takeoverController.gettakeoverRooms);
router.get('/takeover/:id', takeoverController.getTakeoverInfo);
router.get('/takeover/addroom/:userId', takeoverController.createTakeover);