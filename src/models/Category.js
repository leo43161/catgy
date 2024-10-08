import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  categoryID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide the name of the category'],
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
  products: {
    type: [String], // Array de IDs de productos
    default: [],
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

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
