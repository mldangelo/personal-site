import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import useThemeStore, { applyTheme } from '../store/theme-store';
import { geistMono, geistSans } from '../styles/fonts';
import '../styles/theme.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  // While the preference is 'system', track OS changes live.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (useThemeStore.getState().preference === 'system') {
        applyTheme('system');
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <React.StrictMode>
      <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </React.StrictMode>
  );
};

export default MyApp;
