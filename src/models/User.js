import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, proporciona el nombre del usuario'],
  },
  email: {
    type: String,
    required: [true, 'Por favor, proporciona el correo electrónico del usuario'],
    unique: true, // Asegura que cada correo electrónico sea único
    match: [/.+@.+\..+/, 'Por favor, proporciona un correo electrónico válido'], // Valida el formato del correo electrónico
  },
  password: {
    type: String,
    required: [true, 'Por favor, proporciona la contraseña del usuario'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'], // Valida la longitud mínima de la contraseña
  },
  phoneNumber: {
    type: String,
    required: [true, 'Por favor, proporciona el número de teléfono del usuario'],
    match: [/^\d{10}$/, 'Por favor, proporciona un número de teléfono válido'], // Valida que el número de teléfono contenga 10 dígitos
  },
  role: {
    type: String,
    enum: ['vendedor', 'administrador', 'cliente'], // Define los roles permitidos
    default: 'cliente', // Establece un rol por defecto
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, // Establece la fecha de creación por defecto
  },
});

export default mongoose.models.users || mongoose.model('users', UserSchema);
