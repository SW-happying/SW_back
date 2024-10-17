import express from 'express';
import groupshoppingController from '../controllers/groupshoppingController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); 
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + path.extname(file.originalname); 
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
  },
});

router.post('/products', upload.single('image'), groupshoppingController.addProduct);

router.get('/productlist/:userId', groupshoppingController.getProductList); // 상품 목록
router.get('/products/:productId', groupshoppingController.getProductInfo); // 상세 조회
router.post('/products/:productId', groupshoppingController.registPurchase); // 상품 구매
router.post('/products/:productId/addlike', groupshoppingController.groupLikeHandle); // 좋아요
router.get('/products/:productId/close', groupshoppingController.closeGroup); // 마감/ 판매자 돈 받음

export default router;