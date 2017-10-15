import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Redirect } from 'react-router';

import App from './App';
import printMe from './print';

printMe();
ReactDOM.render(
  <AppContainer>
    <Router>
      <Route path="/" component={App} />
    </Router>
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
