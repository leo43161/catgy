import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide the name of the product'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide the price of the product'],
  },
  description: {
    type: String,
    required: false,
  },
  categoryIDs: {
    type: [String],
    required: true,
  },
  imageURL: {
    type: String,
    required: false,
  },
  offer: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  visible: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.models.products || mongoose.model('products', ProductSchema);
