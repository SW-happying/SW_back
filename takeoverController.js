import Takeover from '../models/takeoverModel.js';

// OTT 서비스 이어받기
export const takeoverService = async (req, res) => {
  try {
    const { roomCode, userName, amountPaid } = req.body;

    const newTakeover = new Takeover({
      roomCode,
      userName,
      amountPaid,
      paymentStatus: true // 기본적으로 결제 완료 상태
    });

    await newTakeover.save();
    res.status(201).json({ message: 'OTT 서비스를 이어받았습니다.', takeover: newTakeover });
  } catch (error) {
    res.status(500).json({ message: '이어받기에 실패했습니다.', error: error.message });
  }
};
