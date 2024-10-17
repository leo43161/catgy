// pages/_app.js
import { Provider } from 'react-redux';
import store from '@/store/index'; // Asegúrate de que este archivo exista con la configuración de Redux
import Layout from '@/components/Layout';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import { useSelector } from 'react-redux';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AppContent Component={Component} pageProps={pageProps} />
        </Provider>
    );
}

function AppContent({ Component, pageProps }) {
    const { user } = useSelector((state) => state.userReducer);
    console.log(user);
    return (
        <Layout>
            {/* Solo muestra la Navbar si hay un usuario */}
            {user && <Navbar />}
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
