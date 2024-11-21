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
      return await loginHandler(req, res);
    case "PUT":
      return await putOrdenDetalle(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getLogin = (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }
  try {
    const decodedUser = verify(token, process.env.NEXT_PUBLIC_SECRET_JWT);
      return res.status(200).json(decodedUser);
  } catch (error) {
      return res.status(401).json({ error: 'Token not found' });
  }
}

const loginHandler = async (req, res) => {
  try {
    await connectMongo();
    const values = req.body;
    const { email: emailLogin, password } = JSON.parse(values);
    // Buscar usuario por correo electrónico
    const user = await User.findOne({ email: emailLogin });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Contraseña invalida" });
    }

    const { name, role, phoneNumber, email, _id } = user;
    const token = sign({
      id: _id,
      usuario: name,
      email,
      phoneNumber,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    }, process.env.NEXT_PUBLIC_SECRET_JWT);
    const serialized = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });
    res.setHeader('Set-Cookie', serialized);
    return res.status(200).json({
      usuario: name,
      email,
      phoneNumber,
      role
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}