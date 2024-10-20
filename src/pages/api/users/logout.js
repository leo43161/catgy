import { verify } from "jsonwebtoken";
import { serialize } from "cookie";

export default function logoutHandler(req, res) {
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }
    
    try {
        verify(token, process.env.NEXT_PUBLIC_SECRET_JWT);  // Verifica el token
        
        // Serializar la cookie para eliminar el token
        const serialized = serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Esto hace que la cookie expire inmediatamente
            path: '/'
        });

        res.setHeader('Set-Cookie', serialized);
        return res.status(200).json({ message: 'Logout successfully' });
    } catch (error) {
        console.error("Error durante la verificación del token:", error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
