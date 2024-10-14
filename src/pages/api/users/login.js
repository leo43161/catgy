import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    await connectMongo();

    if (req.method === 'POST') {
      const { email, password } = req.body;

      // Buscar usuario por correo electrónico
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Credenciales inválidas" });
      }

      // Comparar contraseñas
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Credenciales inválidas" });
      }

      res.status(200).json({ message: "Inicio de sesión exitoso", user });
    } else {
      res.status(405).json({ error: `Método HTTP ${req.method} no permitido` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
