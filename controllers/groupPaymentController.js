import groupPayment from '../models/paymentModel.js';
import User from '../models/userModel.js';
import GroupShopping from '../models/groupshoppingModel.js';

const transferToPlatform = async (userId, userName, price, productId) => {
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

    const payment = await groupPayment.create({
      userId,
      userName,
      price,
      productId,
      type: 'trans_to_platform',
      status: '결제완료',
    });

    return payment;
  } catch (error) {
    throw new Error(`포인트 전송 오류: ${error.message}`);
  }
};

const transferToLeader = async (productId) => {
  try {
    const product = await GroupShopping.findById(productId).populate('leaderId'); 
    if (!product || !product.leaderId) {
      throw new Error('해당 상품에 대한 리더를 찾을 수 없습니다.');
    }

    const leader = await User.findOne({ userId: product.leaderId });

    const purchases = await groupPayment.find({ productId }); 
    const totalPrice = purchases.reduce((sum, purchase) => sum + purchase.price, 0); 

    if (totalPrice <= 0) {
      throw new Error('유효한 결제 금액이 없습니다.');
    }

    leader.totalPoint += totalPrice;
    await leader.save();

  } catch (error) {
    throw new Error(`포인트 전송 오류: ${error.message}`);
  }
};



const getProductTotalPoints = async (req, res) => {
  const { productId } = req.params;

  try {
    const payments = await groupPayment.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId), type: 'trans_to_platform', status: '결제완료' } },
      { $group: { _id: '$productId', totalPoints: { $sum: '$price' } } }
    ]);

    if (payments.length === 0) {
      return res.status(404).json({ message: '해당 상품에 대한 포인트 정보가 없습니다.' });
    }

    const totalPoints = payments[0].totalPoints;
    res.status(200).json({ productId, totalPoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품별 총 포인트 조회 중 오류가 발생했습니다.' });
  }
};

export default {
  transferToLeader,
  transferToPlatform,
  getProductTotalPoints
}