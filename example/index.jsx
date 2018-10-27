import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App/index';
import DevTool from './DevTool';
import { store } from './configStore';

const root = document.getElementById('bd');
render(
  <Provider store={store}>
    <Fragment>
      <App />
      <DevTool />
    </Fragment>
  </Provider>, root,
);
