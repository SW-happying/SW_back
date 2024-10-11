import User from '../models/userModel.js';
import groupPayment from '../models/grouppaymentModel.js';
import ottPayment from '../models/ottpaymentModel.js';

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

const getPointList = async (req, res) => {
  try {
    const userId = req.userId; 

    const groupOutgoingPoints = await groupPayment.find({
      userId,
      type: 'trans_to_platform',
    }).sort({ createdAt: -1 });

    const ottOutgoingPoints = await ottPayment.find({
      userId,
      type: 'trans_to_platform',
    }).sort({ createdAt: -1 });

    const groupIncomingPoints = await groupPayment.find({
      type: 'trans_to_leader',
    }).populate({
      path: 'productId',
      select: 'leaderId',
      match: { leaderId: userId },
    }).sort({ createdAt: -1 });

    const ottIncomingPoints = await ottPayment.find({
      type: 'trans_to_leader',
    }).populate({
      path: 'roomId',
      select: 'leaderId', 
      match: { leaderId: userId }, 
    }).sort({ createdAt: -1 });

    const filteredGroupIncomingPoints = groupIncomingPoints.filter(groupPayment => groupPayment.productId !== null);
    const filteredOttIncomingPoints = ottIncomingPoints.filter(ottPayment => ottPayment.roomId !== null);

    const allPoints = [
      ...groupOutgoingPoints,
      ...ottOutgoingPoints,
      ...filteredGroupIncomingPoints,
      ...filteredOttIncomingPoints,
    ];

    const sortedAllPoints = allPoints.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(sortedAllPoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export default {
  getPoint,
  getPointList,
};
