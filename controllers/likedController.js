import Liked from '../models/likedModel.js';
import GroupShopping from '../models/groupshoppingModel.js'; 
import ottRoom from '../models/ottModel.js';

const getLikedList = async (req, res) => {
  const { userId } = req.params;

  try {
    const likedGroups = await Liked.find({ userId }).populate('productId');

    if (!likedGroups || likedGroups.length === 0) {
      return res.status(404).json({ message: '좋아요한 상품이 없습니다.' });
    }

    res.status(200).json(likedGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '좋아요한 상품 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

const getPopularList = async (req, res) => {
  try {
    const popularGroups = await GroupShopping.aggregate([
      {
        $project: {
          _id: 1,
          productName: 1,
          totalLikes: 1,
          category: { $literal: 'groupShopping' }, 
        },
      },
    ]);

    const popularOTTs = await ottRoom.aggregate([
      {
        $project: {
          _id: 1,
          roomName: 1,
          totalLikes: 1,
          category: { $literal: 'ott' }, // 카테고리 구분
        },
      },
    ]);

    const combinedList = [...popularGroups, ...popularOTTs];
    const sortedList = combinedList.sort((a, b) => b.totalLikes - a.totalLikes).slice(0, 10);

    if (sortedList.length === 0) {
      return res.status(404).json({ message: '인기 있는 상품이 없습니다.' });
    }

    res.status(200).json(sortedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '인기 상품 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

export default {getLikedList, getPopularList};
