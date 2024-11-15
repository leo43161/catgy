import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import rolesJson from './roles.json';

export async function middleware(request) {
    /* Obtener el token del cookie */
    const jwt = request.cookies.get("token");
    const currentPath = request.nextUrl.pathname;

    // Permitir solicitudes GET sin autenticación en `/api/categories` y `/api/products`
    if ((currentPath.startsWith('/api/categories') || currentPath.startsWith('/api/products')) && request.method === 'GET') {
        const res = NextResponse.next();
        res.headers.append('Access-Control-Allow-Credentials', 'true');
        res.headers.append('Access-Control-Allow-Origin', '*');
        res.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.headers.append('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
        return res;
    }

    /* Verifica si existe un token */
    if (jwt === undefined) {
        /* Si no existe un token, redirige a la página de inicio de sesión */
        if (currentPath === '/auth/login') {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    try {
        /* Verificar si el token es válido */
        const { payload } = await jwtVerify(jwt.value, new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_JWT));
        const userRole = payload.role;

        // Buscar el rol en el JSON de roles y rutas
        const role = rolesJson.roles.find(role => role.id === userRole);

        // Verificar si el usuario tiene acceso a la ruta actual
        const isApiRequest = currentPath.startsWith('/api');
        const allowedPaths = isApiRequest ? role?.api : role?.rutas;

        if (!role || !allowedPaths.includes(currentPath)) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Redirigir al usuario a la ruta correspondiente si intenta acceder a la página de login
        if (currentPath === '/auth/login') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error(error);
        if (currentPath === '/auth/login') {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: [
        '/',
        '/dashboard/products',
        '/dashboard/users',
        '/auth/login',
        '/api/users/register',
        '/api/users',
        '/api/products/:path*',
        '/api/categories/:path*'
    ],
};
