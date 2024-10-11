import User from '../models/userModel.js';
import groupPaymentModel from '../models/paymentModel.js'; 
import ottPaymentModel from '../models/paymentModel.js';   

// 포인트 조회 함수 (사용자의 총 포인트 반환)
const getPoint = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: '사용자 정보를 찾지 못했습니다.' });
    }

    return res.status(200).json({ points: user.totalPoint });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 포인트 내역 조회 함수 (나간/들어온 내역 통합 및 정렬)
const getAllPoints = async (req, res) => {
  try {
    const userId = req.userId; // API로 받은 userId

    // 나간 포인트 (type이 'trans_to_platform')
    const groupOutgoingPoints = await groupPaymentModel.groupPayment.find({
      userId,
      type: 'trans_to_platform',
    }).sort({ createdAt: -1 });

    const ottOutgoingPoints = await ottPaymentModel.ottPayment.find({
      userId,
      type: 'trans_to_platform',
    }).sort({ createdAt: -1 });

    // 들어온 포인트 (type이 'trans_to_leader' && leaderId가 내 userId인 경우)
    const groupIncomingPoints = await groupPaymentModel.groupPayment.find({
      type: 'trans_to_leader',
    }).populate({
      path: 'productId',
      select: 'leaderId', // GroupShopping에서 leaderId만 가져옴
      match: { leaderId: userId }, // leaderId가 내 userId와 일치하는 경우만
    }).sort({ createdAt: -1 });

    const ottIncomingPoints = await ottPaymentModel.ottPayment.find({
      type: 'trans_to_leader',
    }).populate({
      path: 'roomId',
      select: 'leaderId', // ottRoom에서 leaderId만 가져옴
      match: { leaderId: userId }, // leaderId가 내 userId와 일치하는 경우만
    }).sort({ createdAt: -1 });

    // leaderId가 일치하는 내역 필터링
    const filteredGroupIncomingPoints = groupIncomingPoints.filter(groupPayment => groupPayment.productId !== null);
    const filteredOttIncomingPoints = ottIncomingPoints.filter(ottPayment => ottPayment.roomId !== null);

    // 모든 포인트 내역을 하나로 결합
    const allPoints = [
      ...groupOutgoingPoints,
      ...ottOutgoingPoints,
      ...filteredGroupIncomingPoints,
      ...filteredOttIncomingPoints,
    ];

    // 결합된 내역을 createdAt 기준으로 정렬 (최신 순서)
    const sortedAllPoints = allPoints.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(sortedAllPoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 모든 함수 export
export default {
  getPoint,
  getAllPoints,
};
