// pages/_app.js
import { Provider } from 'react-redux';
import store from '@/store/index'; // Asegúrate de que este archivo exista con la configuración de Redux
import Layout from '@/components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    );
}

export default MyApp;
