import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, proporciona el nombre de la categoría'],
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
    type: mongoose.Schema.Types.ObjectId, // ObjectId para coincidir con el valor en la base de datos
    required: true,
    ref: 'User', // Hace referencia a la colección 'User' (si es aplicable)
  },
  createdAt: {
    type: String, // String en formato ISODate como en la base de datos
    required: true,
  },
});

export default mongoose.models.categories || mongoose.model('categories', CategorySchema);
