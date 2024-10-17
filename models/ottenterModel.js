import mongoose from 'mongoose';
import ottRoom from './ottModel.js';

const enterRoomSchema = new mongoose.Schema({
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ottRoom',
      required: true,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true
    },
    ottPlatform: {
      type: String,
      ref: 'ottRoom',
      required: true,
    },
    plan: {
      type: String,
      ref: 'ottRoom',
      required: true,
    },
    maxParticipants: {
      type: Number,
      ref: 'ottRoom',
      required: true,
    },
    duration: {
      type: String,
      ref: 'ottRoom',
      required: true,
    },
    price: {
      type: Number,
      ref: 'ottRoom',
      required: true,
    },
    leaderFee: {
      type: Number,
      ref: 'ottRoom',
      required: true,
    },
    startDate: {
      type: Date,  
      ref: 'ottRoom',
      required: false
    },
    endDate: {
      type: Date,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: false
    }
});

enterRoomSchema.pre('save', async function(next) {
  console.log('Pre-save middleware is running...');
  if (!this.startDate) {
    const OttRoom = await ottRoom.findById(this.roomId);
    if (OttRoom && OttRoom.startDate) {
      this.startDate = OttRoom.startDate;
    }
  }

  console.log(`startDate: ${this.startDate}, duration: ${this.duration}`);

  if (this.startDate && this.duration) {
    const startDate = new Date(this.startDate);
    const durationInt = parseInt(this.duration, 10);
    if (!isNaN(startDate) && !isNaN(durationInt)) {  
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + durationInt);
      this.endDate = endDate;
    } else {
      console.log('Invalid startDate or duration');
    }
  } else {
    console.log('startDate or duration is missing');
  }
  next();
});

const EnterRoom = mongoose.model('EnterRoom', enterRoomSchema);
export default EnterRoom;
