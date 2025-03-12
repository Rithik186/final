import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for farmers
    required: true,
  },
  products: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
      finalPrice: { type: Number, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bill = mongoose.model('Bill', BillSchema);

export default Bill;