import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ottRoom', 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;