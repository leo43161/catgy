// pages/_app.js 
import { Provider, useDispatch } from 'react-redux';
import store from '@/store/index';
import Layout from '@/components/Layout';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { verifyUserLogged } from '@/helpers/helpers';
import { setUser, clearUser } from '@/features/user/userSlice';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AppContent Component={Component} pageProps={pageProps} />
        </Provider>
    );
}

function AppContent({ Component, pageProps }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [logged, setLogged] = useState(false);

    const checkUser = async () => {
        const userLogged = await verifyUserLogged();
        console.log(userLogged);
        if (userLogged) {
            dispatch(setUser(userLogged));
            setLogged(true);
        } else {
            dispatch(clearUser()); // Limpiar el usuario si no está logueado
            setLogged(false);
        }
    };

    useEffect(() => {
        checkUser();
        // Ejecutar checkUser cada vez que cambie la ruta
        router.events.on('routeChangeComplete', checkUser);
        // Limpiar el evento cuando se desmonte el componente
        return () => {
            router.events.off('routeChangeComplete', checkUser);
        };
    }, [router]);

    return (
        <Layout>
            {/* Solo muestra la Navbar si hay un usuario */}
            {logged && <Navbar />}
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
