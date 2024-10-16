import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import { sign, verify } from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getLogin(req, res);
    case "POST":
      return loginHandler(req, res);
    case "PUT":
      return await putOrdenDetalle(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  try {

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
  } catch (error) {
    return res.status(500).json({ error });
  }
}