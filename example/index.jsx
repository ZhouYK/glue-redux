import React, { Fragment } from 'react';
import { render } from 'react-dom';
import {
  createStore, combineReducers,
} from 'redux';
import { Provider } from 'react-redux';
import App from './App/index';
import { model as app } from './glue';
import DevTool from './DevTool';
import { destruct } from '../src';

const store = createStore(() => {}, {}, DevTool.instrument());
const { dispatch } = store;
const { reducers } = destruct({ dispatch })({ app });
store.replaceReducer(combineReducers(reducers));

const root = document.getElementById('bd');
render(
  <Provider store={store}>
    <Fragment>
      <App />
      <DevTool />
    </Fragment>
  </Provider>, root,
);
