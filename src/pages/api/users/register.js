import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    await connectMongo();

    if (req.method === 'POST') {
      // Registrar usuario
      const { name, email, password, phoneNumber, role } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "El correo electrónico ya está registrado" });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear nuevo usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
      });

      await newUser.save();
      res.status(201).json({ message: "Usuario registrado exitosamente", user: newUser });
    } else if (req.method === 'GET') {
      // Obtener todos los usuarios
      const users = await User.find({});
      res.status(200).json(users);
    } else {
      res.status(405).json({ error: `Método HTTP ${req.method} no permitido` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
