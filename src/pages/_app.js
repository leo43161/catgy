// pages/_app.js
import { Provider } from 'react-redux';
import store from '@/store/index'; // Asegúrate de que este archivo exista con la configuración de Redux
import Layout from '@/components/Layout';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Layout>
                <Navbar></Navbar>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    );
}

export default MyApp;