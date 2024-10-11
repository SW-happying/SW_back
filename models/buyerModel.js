import mongoose from 'mongoose';

// 공동구매 상품 구매자 정보 
const purchaseUserSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupShopping',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  selectOptions: {
    type: [
      {
        name: {
          type: String, 
          required: true,
        },
        value: {
          type: String, 
          required: true,
        },
      },
    ],
  }, 
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['결제완료', '상품 준비중','배송중','구매완료'],
    default: '결제완료',
  },
}, { timestamps: true });

const PurchaseUser = mongoose.model('Purchase', purchaseUserSchema);
export default PurchaseUser;
