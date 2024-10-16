import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function Home() {
    const router = useRouter();
    const user = false;
    /* const user = useSelector((state) => state.auth.user); */

    useEffect(() => {
        if (user) {
            router.push('/dashboard/products'); // Redirige al dashboard si el usuario ya está autenticado
        } else {
            router.push('/auth/login'); // Redirige al login si no está autenticado
        }
    }, [user, router]);

    return null;
}