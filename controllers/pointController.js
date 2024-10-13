import User from '../models/userModel.js';
import groupPayment from '../models/grouppaymentModel.js';
import ottPayment from '../models/ottpaymentModel.js';

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
  const { userId } = req.params;  
  try {
    const groupOutgoingPoints = await groupPayment.find({
      type: 'trans_to_platform',
      userId : userId
    }).populate({
      select: 'leaderId productName', 
      path: 'productId',
    }).sort({ createdAt: -1 });

    const ottOutgoingPoints = await ottPayment.find({
      type: 'trans_to_platform',
      userId : userId
    }).populate({
      select: 'leaderId roomName',
      path: 'roomId',
    }).sort({ createdAt: -1 });

    const groupIncomingPoints = await groupPayment.find({
      type: 'trans_to_leader',
    }).populate({
      path: 'productId',
      select: 'leaderId productName', 
      match: { leaderId: userId },
    }).sort({ createdAt: -1 });

    const ottIncomingPoints = await ottPayment.find({
      type: 'trans_to_leader',
    }).populate({
      path: 'roomId',
      select: 'leaderId roomName', 
      match: { leaderId: userId },
    }).sort({ createdAt: -1 });

    const filteredGroupOutgoingPoints = groupOutgoingPoints.filter(groupPayment => groupPayment.productId !== null);
    const filteredOttOutgoingPoints = ottOutgoingPoints.filter(ottPayment => ottPayment.roomId !== null);
    const filteredGroupIncomingPoints = groupIncomingPoints.filter(groupPayment => groupPayment.productId !== null);
    const filteredOttIncomingPoints = ottIncomingPoints.filter(ottPayment => ottPayment.roomId !== null);

    const allPoints = [
      ...filteredGroupOutgoingPoints.map(point => ({
        ...point._doc, 
        name: point.productId.productName
      })),
      ...filteredOttOutgoingPoints.map(point => ({
        ...point._doc, 
        name: point.roomId.roomName 
      })),
      ...filteredGroupIncomingPoints.map(point => ({
        ...point._doc, 
        name: point.productId.productName 
      })),
      ...filteredOttIncomingPoints.map(point => ({
        ...point._doc, 
        name: point.roomId.roomName 
      })),
    ];

    const sortedAllPoints = allPoints.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(sortedAllPoints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getPoint,
  getPointList,
};
