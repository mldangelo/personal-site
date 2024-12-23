import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import { useThemeStore } from './stores/useThemeStore';

const Root = () => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  );
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
