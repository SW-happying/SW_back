import mongoose from 'mongoose';

const enterRoomSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true
    }
});

const EnterRoom = mongoose.model('EnterRoom', enterRoomSchema);
export default EnterRoom;
