import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

// See https://reactjs.org/docs/strict-mode.html
const StrictApp = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const rootElement = document.getElementById('root');

// hydrate is required by react-snap.
if (rootElement && rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <StrictApp />);
} else if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<StrictApp />);
} else {
  throw new Error();
}
