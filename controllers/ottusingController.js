import EnterRoom from '../models/ottenterModel.js';
import ottRoom from '../models/ottModel.js';

const getUsingRooms = async (req, res) => {
    const { userId } = req.params; 
    try {
        const joinedRooms = await EnterRoom.find({ userId }).populate('roomId');
        // const createdRooms = await ottRoom.find({ leaderId: userId }); 
        // const allRooms = [...joinedRooms, ...createdRooms];
        res.status(200).json(joinedRooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '방 목록을 가져오는 중 오류가 발생했습니다.' });
    }
};

export default { getUsingRooms };
