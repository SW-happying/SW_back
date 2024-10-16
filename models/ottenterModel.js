import mongoose from 'mongoose';

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
      type: String,
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
    }
});

enterRoomSchema.pre('save', function(next) {
  if (this.startDate && this.duration) {
    const durationInt = parseInt(this.duration, 10);
    const endDate = new Date(this.startDate);
    endDate.setMonth(endDate.getMonth() + durationInt);
    this.endDate = endDate; 
  }
  next();
});

const EnterRoom = mongoose.model('EnterRoom', enterRoomSchema);
export default EnterRoom;
