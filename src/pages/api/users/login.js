import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import { sign, verify } from "jsonwebtoken";
import { serialize } from "cookie";

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
      const { name, role } = user;
      const token = sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        usuario: name,
        role,
      }, process.env.NEXT_PUBLIC_SECRET_JWT);

      const serialized = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'production',
        sameSite: 'strict',
        path: '/',
        [recordar ? 'maxAge' : 'expires']: recordar ? (1000 * 60 * 60 * 24 * 30) : 0,
      });
      res.setHeader('Set-Cookie', serialized);
      return res.status(200).json({
        usuario: name,
        role,
        token
      });
    } else {
      res.status(405).json({ error: `Método HTTP ${req.method} no permitido` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
