import groupLike from '../models/grouplikeModel.js';
import ottLike from '../models/ottlikeModel.js';
import GroupShopping from '../models/groupshoppingModel.js'; 
import ottRoom from '../models/ottModel.js';

const getLikedList = async (req, res) => {
  const { userId } = req.params;

  try {
    const likedGroups = await groupLike.find({ userId }).populate({
      path: 'productId',
      model: 'GroupShopping',
      match: { status: { $ne: '마감' } },
      select: { productName: 1, price: 1, _id: 1, image: 1, deadline: 1, leaderFee: 1, userLiked: 1, totalLike: 1 }
    });

    const likedOTTs = await ottLike.find({ userId }).populate({
      path: 'roomId',
      model: 'ottRoom', 
      match: { status: { $ne: '마감' } },
      select: { roomName: 1, ottPlatform: 1, plan: 1, price: 1, _id: 1, duration: 1, leaderFee: 1, maxParticipants:1, userLiked: 1, totalLike: 1 }
    });

    const filteredLikedGroups = likedGroups.filter(group => group.productId);
    const filteredLikedOTTs = likedOTTs.filter(ott => ott.roomId);

    const combinedLikes = [...filteredLikedGroups, ...filteredLikedOTTs];

    if (combinedLikes.length === 0) {
      return res.status(404).json({ message: '좋아요한 상품이 없습니다.' });
    }

    res.status(200).json(combinedLikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '좋아요한 상품 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};


const getPopularList = async (req, res) => {
  try {
    const popularGroups = await GroupShopping.find(
      { status: { $ne: '마감' } }, 
      { productName: 1, price: 1, _id: 1, image: 1, deadline: 1, leaderFee: 1 } 
    );

    const popularOTTs = await ottRoom.find(
      { status: { $ne: '마감' } }, 
      { roomName: 1, ottPlatform: 1, plan: 1, price: 1, _id: 1, duration: 1, leaderFee: 1, maxParticipants: 1 }
    );

    const popularGroupsWithCategory = popularGroups.map(group => ({
      ...group.toObject(),
      category: 'GroupShopping', 
    }));

    const popularOTTsWithCategory = popularOTTs.map(ott => ({
      ...ott.toObject(),
      category: 'ott',
    }));

    const combinedList = [...popularGroupsWithCategory, ...popularOTTsWithCategory];
    const sortedList = combinedList.slice(0, 10); 

    if (sortedList.length === 0) {
      return res.status(404).json({ message: '인기 있는 상품이 없습니다.' });
    }

    res.status(200).json(sortedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '인기 상품 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};


export default {
  getLikedList,
  getPopularList,
};
