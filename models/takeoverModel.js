import mongoose from 'mongoose';

const takeoverRoomSchema = new mongoose.Schema({
  leadId: {
    type: String,
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ottRoom',
    required: true,
  },
  roomName: {
    type: String,
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
      required: true
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

takeoverRoomSchema.pre('save', function(next) {
  if (this.startDate && this.duration) {
    const durationInt = parseInt(this.duration, 10);
    const endDate = new Date(this.startDate);
    endDate.setMonth(endDate.getMonth() + durationInt);
    this.endDate = endDate; 
  }
  next();
});

const TakeoverRoom = mongoose.model('TakeoverRoom', takeoverRoomSchema);
export default TakeoverRoom;
