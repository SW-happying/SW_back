import mongoose from 'mongoose';

const userSchema = new mongoose.Schema( {
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true
  },
  totalPoint: {
    type: Number,
    required: true
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;
