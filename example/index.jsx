import React, { Fragment } from 'react';
import { render } from 'react-dom';
import App from './App/index';
import DevTool from './DevTool';
import { store } from './store';

const DT = DevTool();
const root = document.getElementById('bd');
render(
  <Fragment>
    <App />
    <DT store={store} />
  </Fragment>, root,
);
