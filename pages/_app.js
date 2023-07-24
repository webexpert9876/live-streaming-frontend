import styleFrontEnd from './Assets/styleFrontEnd.css'
import style from "../src/content/Overview/Slider/style.css"
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Provider } from "react-redux";
import { wrapper } from '../store/index';
// import TawkTo from 'tawkto-react';
// import TawkTo from 'tawkto-react';
// import { useEffect } from 'react';



// import authReducer from '../slices/authSlice';

const clientSideEmotionCache = createEmotionCache();

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

function TokyoApp({ Component, ...rest }) {
  const { emotionCache = clientSideEmotionCache } = rest;
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  

  // useEffect(() => {
  //   const propertyId = "64be6d6f94cf5d49dc661220";
  //   const tawkId = "1h63tmv5k"
  //   var tawk = new TawkTo(propertyId, tawkId)

  //   tawk.onStatusChange((status) => {
  //     // console.log(status)
  //   })

  // }, [])

  return (

    <Provider store={store}>

      <CacheProvider value={emotionCache}>
        <Head>
          <title>Tokyo Free Black NextJS Javascript Admin Dashboard</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />

        </Head>

        <SidebarProvider>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
            </LocalizationProvider>
          </ThemeProvider>
        </SidebarProvider>
      </CacheProvider>
    </Provider>
  );
}

export default TokyoApp;
