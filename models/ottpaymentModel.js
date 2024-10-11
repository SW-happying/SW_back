import mongoose from 'mongoose';

const ottPaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  roomId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ottRoom',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['trans_to_platform', 'trans_to_leader'],
    required: true,
  },
  status: {
    type: String,
    enum: ['결제완료', '구매완료'],
    default: '구매완료',
  },
}, { timestamps: true });

const ottPayment = mongoose.model('ottPayment', ottPaymentSchema);

export default ottPayment;
