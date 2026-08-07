import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import useThemeStore, { applyTheme } from '../store/theme-store';
// Imported for its side effect: this is what pulls the next/font stylesheets
// into the page bundle. The class names themselves are applied to <html> in
// _document.tsx — see the comment there.
import '../styles/fonts';
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

  // Font variables are applied to <html> in _document.tsx; the base layer in
  // theme.css sets body's font-family from them.
  return (
    <React.StrictMode>
      <Component {...pageProps} />
    </React.StrictMode>
  );
};

export default MyApp;
