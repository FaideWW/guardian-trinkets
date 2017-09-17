import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { AppContainer } from 'react-hot-loader';

import App from './App';
import printMe from './print';
import './styles.css';

printMe();
ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
      <App />
      </AppContainer>,
      document.getElementById('app')
    );
  });
  // module.hot.accept('./print.js', () => {
  //   console.log('Hot update');
  //   printMe();
  // });
}
