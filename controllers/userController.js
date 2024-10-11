import User from '../models/userModel.js';
import ottRoom from '../models/ottModel.js';
import GroupShopping from '../models/groupshoppingModel.js';

const registerUser = async (req, res) => {
  try {
    const { userId, userName, totalPoint } = req.body;

    const newUser = new User({
      userId,
      userName,
      totalPoint
    });

    await newUser.save();
    res.status(201).json({ message: '사용자가 등록되었습니다.', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '사용자 등록 중 오류가 발생하였습니다.' });
  }
};

const getUserInfo = async (req, res) => {
  const { userId } = req.params; 

  try {
    const user = await User.findOne( {userId} ); 
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(user); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '사용자 정보 조회 중 오류가 발생하였습니다.' });
  }
};

const getLeaderRooms = async (req, res) => {
  const { userId } = req.params; // URL의 userId 파라미터 가져오기

  try {
    // 공동구매 목록에서 leaderId가 userId인 항목 찾기
    const myGroupShoppingRooms = await GroupShopping.find({ leaderId: userId });

    // OTT 방 목록에서 leaderId가 userId인 항목 찾기
    const myOttRooms = await ottRoom.find({ leaderId: userId });

    // 두 목록을 결합
    const combinedRooms = {
      groupShopping: myGroupShoppingRooms,
      ottRooms: myOttRooms,
    };

    if (combinedRooms.groupShopping.length === 0 && combinedRooms.ottRooms.length === 0) {
      return res.status(404).json({ message: '등록된 방이 없습니다.' });
    }

    res.status(200).json(combinedRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '방 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

export default {
  registerUser,
  getUserInfo,
  getLeaderRooms
};
