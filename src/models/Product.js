import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, proporciona el nombre del producto'],
  },
  price: {
    type: Number,
    required: [true, 'Por favor, proporciona el precio del producto'],
  },
  description: {
    type: String,
    required: false,
  },
  categoryIDs: [
    {
      type: mongoose.ObjectId,
      ref: 'categories',
    },
  ],
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
