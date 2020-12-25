import React from 'react';
import { hydrate, render } from 'react-dom';
import App from './App';
// All of our CSS
import './static/css/main.scss';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
