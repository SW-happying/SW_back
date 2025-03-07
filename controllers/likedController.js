import groupLike from '../models/grouplikeModel.js';
import ottLike from '../models/ottlikeModel.js';
import TakeoverLike from '../models/takeoverlikeModel.js';
import GroupShopping from '../models/groupshoppingModel.js'; 
import ottRoom from '../models/ottModel.js';
import TakeoverRoom from '../models/takeoverModel.js';

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
      select: { roomName: 1, ottPlatform: 1, plan: 1, price: 1, _id: 1, duration: 1, leaderFee: 1, maxParticipants: 1, userLiked: 1, totalLike: 1 }
    });

    const likedTakeovers = await TakeoverLike.find({ userId }).populate({
      path: 'roomId', 
      model: 'TakeoverRoom', 
      match: { status: { $ne: '마감' } },
      select: { roomName: 1, totalLikes: 1, userLiked: 1, ottPlatform: 1, plan: 1, price: 1, _id: 1, duration: 1, leaderFee: 1, maxParticipants: 1 } 
    });

    const filteredLikedGroups = likedGroups.filter(group => group.productId);
    const filteredLikedOTTs = likedOTTs.filter(ott => ott.roomId);
    const filteredLikedTakeovers = likedTakeovers.filter(takeover => takeover.roomId); 

    const combinedLikes = [
      ...filteredLikedGroups,
      ...filteredLikedOTTs,
      ...filteredLikedTakeovers, 
    ];

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
      { roomName: 1, ottPlatform: 1, plan: 1, price: 1, _id: 1, duration: 1, leaderFee: 1, maxParticipants: 1, startDate: 1 }
    );

    const popularTakeovers = await TakeoverRoom.find(
      { status: { $ne: '마감' } },
      { roomName: 1, totalLikes: 1, userLiked: 1, image: 1 } 
    );

    const popularGroupsWithCategory = popularGroups.map(group => ({
      ...group.toObject(),
      category: 'GroupShopping', 
    }));

    const popularOTTsWithCategory = popularOTTs.map(ott => ({
      ...ott.toObject(),
      category: 'ott',
    }));

    const popularTakeoversWithCategory = popularTakeovers.map(takeover => ({
      ...takeover.toObject(),
      category: 'TakeoverRoom', 
    }));

    const combinedList = [
      ...popularGroupsWithCategory,
      ...popularOTTsWithCategory,
      ...popularTakeoversWithCategory, 
    ];
    
    const sortedList = combinedList.slice(0, 10); 

    res.status(200).json(sortedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '인기 상품 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

const getAllList = async (req, res) => {
  const { searchTerm } = req.body; // 요청의 body에서 searchTerm을 가져옵니다.

  try {
    // 검색어가 존재하면 정규 표현식을 사용하여 검색합니다.
    const searchQuery = searchTerm ? {
      $or: [
        // GroupShopping에서 여러 필드 검색
        {
          productName: { $regex: searchTerm, $options: 'i' },
        },
        // OTT에서 여러 필드 검색
        {
          roomName: { $regex: searchTerm, $options: 'i' },
        },
        {
          ottPlatform: { $regex: searchTerm, $options: 'i' },
        },
        // TakeoverRoom에서 여러 필드 검색
        {
          roomName: { $regex: searchTerm, $options: 'i' },
        },
      ]
    } : {};

    const groups = await GroupShopping.find(
      { ...searchQuery, status: { $ne: '마감' } }, 
      { productName: 1, price: 1, image: 1, deadline: 1, leaderFee: 1, totalLikes: 1, userLiked: 1 } 
    );

    const otts = await ottRoom.find(
      { ...searchQuery, status: { $ne: '마감' } }, 
      { roomName: 1, ottPlatform: 1, price: 1, duration: 1, leaderFee: 1, maxParticipants: 1, startDate: 1, image: 1, userLiked: 1, totalLikes: 1 }
    );

    const takeovers = await TakeoverRoom.find(
      { ...searchQuery, status: { $ne: '마감' } },
      { roomName: 1, totalLikes: 1, userLiked: 1, image: 1, ottPlatform: 1, price: 1, leaderFee: 1, endDate: 1 } 
    );

    const combinedList = [
      ...groups,
      ...otts,
      ...takeovers, 
    ];

    res.status(200).json(combinedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '전체 목록을 가져오는 중 오류가 발생했습니다.' });
  }
};


export default {
  getLikedList,
  getPopularList,
  getAllList,
};
