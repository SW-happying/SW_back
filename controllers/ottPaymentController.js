import ottPayment from '../models/ottpaymentModel.js';
import User from '../models/userModel.js';
import ottRoom from '../models/ottModel.js';

const transferToPlatform = async (userId, price, roomId) => {
  try {
    const user = await User.findOne({ userId});
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (user.totalPoint < price) {
      throw new Error('포인트가 부족합니다.');
    }

    user.totalPoint -= price;
    await user.save();

    const payment = await ottPayment.create({
      userId,
      price,
      roomId,
      type: 'trans_to_platform',
      status: '결제완료',
    });

    return payment;
  } catch (error) {
    throw new Error(`포인트 전송 오류: ${error.message}`);
  }
};

const transferToLeader = async (roomId) => {
  try {
    const product = await ottRoom.findById(roomId).populate('leaderId'); 
    if (!product || !product.leaderId) {
      throw new Error('해당 상품에 대한 리더를 찾을 수 없습니다.');
    }

    const leader = await User.findOne({ userId: product.leaderId });

    const purchases = await ottPayment.find({ roomId }); 
    const totalPrice = purchases.reduce((sum, purchase) => sum + purchase.price, 0); 

    if (totalPrice <= 0) {
      throw new Error('유효한 결제 금액이 없습니다.');
    }

    leader.totalPoint += totalPrice;
    await leader.save();

    const payment = await ottPayment.create({
      userId,
      price,
      roomId,
      type: 'trans_to_leader',
      status: '구매완료',
    });

  } catch (error) {
    throw new Error(`포인트 전송 오류: ${error.message}`);
  }
};

const getRoomTotalPoints = async (req, res) => {
  const { roomId } = req.params;

  try {
    const payments = await ottPayment.aggregate([
      { $match: { roomId: mongoose.Types.ObjectId(roomId), type: 'trans_to_platform', status: '결제완료' } },
      { $group: { _id: '$roomId', totalPoints: { $sum: '$price' } } }
    ]);

    if (payments.length === 0) {
      return res.status(404).json({ message: '해당 상품에 대한 포인트 정보가 없습니다.' });
    }

    const totalPoints = payments[0].totalPoints;
    res.status(200).json({ roomId, totalPoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품별 총 포인트 조회 중 오류가 발생했습니다.' });
  }
};

export default {
  transferToLeader,
  transferToPlatform,
  getRoomTotalPoints
}