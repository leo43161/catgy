// pages/_app.js 
import { Provider, useDispatch } from 'react-redux';
import store from '@/store/index';
import Layout from '@/components/Layout';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { verifyUserLogged } from '@/helpers/helpers';
import { setUser } from '@/features/user/userSlice';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AppContent Component={Component} pageProps={pageProps} />
        </Provider>
    );
}

function AppContent({ Component, pageProps }) {
    const dispatch = useDispatch();
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const userLogged = await verifyUserLogged();
            if (userLogged) {
                dispatch(setUser(userLogged));
                setLogged(true);
            } else {
                setLogged(false);
            }
        };
        checkUser();
    }, [dispatch]);

    return (
        <Layout>
            {/* Solo muestra la Navbar si hay un usuario */}
            {logged && <Navbar />}
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
