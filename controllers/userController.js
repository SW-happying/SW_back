import User from '../models/userModel.js';

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

export default {
  registerUser,
  getUserInfo
};
