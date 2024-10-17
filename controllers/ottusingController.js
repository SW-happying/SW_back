import EnterRoom from '../models/ottenterModel.js';
import ottRoom from '../models/ottModel.js';

const getUsingRooms = async (req, res) => {
    const { userId } = req.params; 
    try {
        // Find rooms the user is in or rooms they created
        const joinedRooms = await EnterRoom.find({ userId }).populate('roomId');
        const createdRooms = await ottRoom.find({ creatorId: userId }); // Fetch rooms created by the user

        // Combine the two lists
        const allRooms = [...joinedRooms, ...createdRooms];

        res.status(200).json(allRooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '방 목록을 가져오는 중 오류가 발생했습니다.' });
    }
};

export default { getUsingRooms };
