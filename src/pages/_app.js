// pages/_app.js
import { Provider } from 'react-redux';
import store from '@/store/index';
import Layout from '@/components/Layout';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { loginVerify } from '@/helpers';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AppContent Component={Component} pageProps={pageProps} />
        </Provider>
    );
}

function AppContent({ Component, pageProps }) {
    const [logged, setLogged] = useState(false);
    const [loggedReload, setLoggedReload] = useState(true);

    /* Verifica si el usuario ya inició sesión */
    useEffect(() => {
        if (loggedReload) {
            checkLogged();
            setLoggedReload(false);
        }
    }, [loggedReload]);

    const checkLogged = async () => {
        const isLogged = await loginVerify();
        setLogged(isLogged);
    };

    return (
        <Layout>
            {/* Solo muestra la Navbar si hay un usuario */}
            {logged && <Navbar />}
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
