import EnterRoom from '../models/ottenterModel.js';

const getUsingRooms = async (req, res) => {
    const {userId} = req.params; 
    try {
        const rooms = await EnterRoom.find({ userId }).populate('roomId');
        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '방 목록을 가져오는 중 오류가 발생했습니다.' });
    }
};

export default { getUsingRooms };
