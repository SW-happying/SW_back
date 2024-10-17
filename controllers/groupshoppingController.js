import GroupShopping from '../models/groupshoppingModel.js';
import PurchaseUser from '../models/buyerModel.js';
import User from '../models/userModel.js';
import groupLike from '../models/grouplikeModel.js';
import groupPaymentController from './groupPaymentController.js';

const addProduct = async (req, res) => {
  try {
    let { userId, productName, price, options, description, deadline, leaderFee } = req.body;

    if (typeof options === 'string') {
      try {
        options = JSON.parse(options); 
      } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'options 필드의 JSON 파싱에 실패했습니다.' });
      }
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 이미지 경로 설정
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new GroupShopping({
      productName,
      leaderId: userId,
      price,
      options,
      image: imagePath, // 이미지 경로 저장
      description,
      deadline,
      leaderFee,
    });

    await newProduct.save();

    // 이미지 경로를 포함한 응답 반환
    res.status(201).json({ 
      message: '상품이 추가되었습니다.', 
      product: newProduct // product 객체에 이미지 경로 포함됨
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품 추가 중 오류가 발생하였습니다.', details: error.message });
  }
};

const getProductList = async (req, res) => {
  const { userId } = req.params;

  try {
    const products = await GroupShopping.find({ status: { $ne: '마감' } }, { 
      productName: 1, 
      price: 1, 
      _id: 1, 
      image: 1,  // 이미지 경로 포함
      deadline: 1, 
      leaderFee: 1 
    });

    const productsWithLikes = await Promise.all(products.map(async (product) => {
      const likeCount = await groupLike.countDocuments({ productId: product._id });
      const userLiked = await groupLike.exists({ productId: product._id, userId });

      return {
        ...product.toObject(),
        likeCount,
        userLiked: userLiked ? 1 : 0, 
        image: product.image, // 이미지 경로 반환
      };
    }));

    res.status(200).json(productsWithLikes);
  } catch (error) {
    res.status(500).json({ error: '공동구매 상품 목록을 불러오지 못했습니다.' });
  }
};

const getProductInfo = async (req, res) => {
  const { productId } = req.params; 
  try {
    const product = await GroupShopping.findById(productId);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '공동구매 상품 상세 정보를 불러오지 못했습니다.' });
  }
};

const registPurchase = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, userName, address, phone, selectOptions } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const product = await GroupShopping.findById(productId);
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    product.totalPurchasers += 1;
    await product.save();

    const newPurchase = new PurchaseUser({
      productId,
      userId: user._id,
      userName,
      address,
      phone,
      selectOptions,
      leaderId: product.leaderId,
      maxMember: product.maxMember,
      status: "결제완료"
    });

    await newPurchase.save();

    const totalPrice = product.price + product.leaderFee;

    try {
      await groupPaymentController.transferToPlatform(userId, userName, totalPrice, productId);
    } catch (error) {
      await PurchaseUser.deleteOne({ _id: newPurchase._id });
      product.totalPurchasers -= 1;
      await product.save();

      return res.status(500).json(console.error(error));
    }

    res.status(201).json({ message: '구매가 완료되었습니다.', newPurchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '구매 과정에서 오류가 발생하였습니다.' });
  }
};

const confirmPurchase = async (req, res) => {
  const { purchaseId } = req.params;

  try {
    const purchase = await PurchaseUser.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ error: '구매 기록을 찾을 수 없습니다.' });
    }

    purchase.status = '구매완료';
    await purchase.save();

    res.status(200).json({ message: '구매가 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '구매 중 오류가 발생하였습니다.', details: error.message });
  }
};

const getPurchaseList = async (req, res) => {
  const { userId } = req.params;

  try {
    // userId로 단일 유저를 찾음
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // user._id와 일치하는 모든 PurchaseUser 기록을 찾음
    const purchases = await PurchaseUser.find({ userId: user._id });
    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ error: '구매 기록이 없습니다.' });
    }

    res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '구매 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};


const getBuyerList = async (req, res) => {
  const { productId } = req.params;

  try {
    const purchases = await PurchaseUser.find({ productId });
    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ error: '이 상품에 대한 구매자가 없습니다.' });
    }

    res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '구매자 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

const updatePurchaseStatus = async (req, res) => {
  const { productId } = req.params;
  const { newStatus } = req.body;

  try {
    const purchases = await PurchaseUser.find({ productId });
    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ error: '구매 기록을 찾을 수 없습니다.' });
    }

    await Promise.all(
      purchases.map(async (purchase) => {
        purchase.status = newStatus;
        await purchase.save();
      })
    );

    res.status(200).json({ message: '모든 구매자 정보가 업데이트되었습니다.', purchases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '구매자 정보 업데이트 중 오류가 발생하였습니다.', details: error.message });
  }
};

const groupLikeHandle = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  try {
    const groupExistingLike = await groupLike.findOne({ userId, productId });

    if (groupExistingLike) {
      await groupLike.findByIdAndDelete(groupExistingLike._id);

      await GroupShopping.findByIdAndUpdate(productId, { $inc: { totalLikes: -1 } });
      await GroupShopping.findByIdAndUpdate(productId, { $set: { userLiked: 0 } });
      return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    } else {
      const newGroupLike = new groupLike({ userId, productId });
      await newGroupLike.save();

      await GroupShopping.findByIdAndUpdate(productId, { $inc: { totalLikes: 1 } });
      await GroupShopping.findByIdAndUpdate(productId, { $set: { userLiked: 1 } });
      return res.status(201).json({ message: '좋아요가 추가되었습니다.', newGroupLike });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '좋아요 처리 중 오류가 발생하였습니다.' });
  }
};

const closeGroup = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await GroupShopping.findById(productId);

    if (!product) {
      return res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' });
    }

    product.status = '마감';
    await product.save();

    const totalAmount = product.totalPurchasers * (product.price + product.leaderFee);
    await groupPaymentController.transferToLeader(product._id, totalAmount);

    res.status(200).json({ message: '모집이 마감되었으며, 판매자에게 포인트가 전송되었습니다.', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '모집 마감 처리 중 오류가 발생하였습니다.' });
  }
};

export default {
  getPurchaseList,
  getProductList,
  getProductInfo,
  registPurchase,
  confirmPurchase,
  addProduct,
  getBuyerList,
  updatePurchaseStatus,
  groupLikeHandle,
  closeGroup
};