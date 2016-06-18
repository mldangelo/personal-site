import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

// All of our CSS
require('!style!css!sass!../public/css/main.scss');

ReactDOM.render(
    <div>
      <App/>
    </div>,
    document.getElementById('root')
);
