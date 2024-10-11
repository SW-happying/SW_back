import GroupShopping from '../models/groupshoppingModel.js';
import groupPaymentController from './groupPaymentController.js'
import PurchaseUser from '../models/buyerModel.js';
import User from '../models/userModel.js';
import groupLike from '../models/likedModel.js';

const addProduct = async (req, res) => {
  try {
    const { userId }  = req.params;
    const { productName, maxMember, price, options, image, description, deadline, leaderFee } = req.body;

    const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const newProduct = new GroupShopping({
      productName,
      leaderId: userId,
      price,
      options,
      image,
      description,
      deadline,
      maxMember,
      leaderFee
    });

    await newProduct.save();
    res.status(201).json({ message: '상품이 추가되었습니다.', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품 추가 중 오류가 발생하였습니다.' });
  }
};


const getProductList = async (req, res) => {
  try {
    const products = await GroupShopping.find({ status: { $ne: '마감' } }, { productName: 1, price: 1, _id: 1, image: 1, deadline: 1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: '공동구매 상품목록을 불러오지 못했습니다.' });
  }
};

const getProductInfo = async (req, res) => {
  const { id } = req.params; 
  try {
    const product = await GroupShopping.findById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '공동구매 상품 상세정보를 불러오지 못했습니다.' });
  }
};

const registPurchase = async (req, res) => {
  const { userId } = req.params;

  try {
    const { productId: productIdFromBody, userName, address, phone, selectOptions } = req.body;

    const user = await User.findOne({ userId }); // User 모델에서 사용자 정의 userId로 조회
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const product = await GroupShopping.findById(productIdFromBody);
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    product.totalPurchasers += 1; 
    await product.save();

    const newPurchase = new PurchaseUser({
      productId: productIdFromBody,
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

    await groupPaymentController.transferToPlatform(userId, userName, totalPrice, productIdFromBody);

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

    const product = await GroupShopping.findById(purchase.productId);
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    const allPurchases = await PurchaseUser.find({ productId: purchase._id });
    const allConfirmed = allPurchases.every(purchase => purchase.status === '구매완료');

    if (allConfirmed) {
      const totalAmount = product.totalPurchasers * (product.price + product.leaderFee);
      console.log(totalAmount)
      await groupPaymentController.transferToLeader(product._id);

      res.status(200).json({ message: '모든 구매가 완료되었으며, 판매자에게 포인트가 전송되었습니다.' });
    } else {
      res.status(200).json({ message: '구매가 완료되었습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '구매 중 오류가 발생하였습니다.', details: error.message });
  }
};


const getPurchaseList = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId }); 
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const purchases = await PurchaseUser.find( {userId: user._id}  );
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
    const purchases = await PurchaseUser.findOne( {productId} );
    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ error: '이 상품에 대한 구매자가 없습ㄴ다.' });
    }

    res.status(200).json(purchases);
  } catch (error) {
    console.error(error)
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

// 좋아요 토글 기능 구현
const groupLikeHandle = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  try {
    // 해당 유저가 해당 상품에 대해 좋아요를 눌렀는지 확인
    const existingLike = await groupLike.findOne({ userId, productId });

    if (existingLike) {
      await groupLike.findByIdAndDelete(existingLike._id);

      await GroupShopping.findByIdAndUpdate(productId, { $inc: { totalLikes: -1 } });
      return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    } else {
   
      const newLike = new groupLike({ userId, productId });
      await newLike.save();
  
      await GroupShopping.findByIdAndUpdate(productId, { $inc: { totalLikes: 1 } });
      return res.status(201).json({ message: '좋아요가 추가되었습니다.', newLike });
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

    res.status(200).json({ message: '모집이 마감되었습니다.', product });
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