import React, { Fragment } from 'react';
import { render } from 'react-dom';
import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './App/index';
import DevTool from './DevTool';
import appGlue from './App/glue';
import { destruct } from '../src';

const store = createStore(() => {}, {}, compose(applyMiddleware(thunk), DevTool.instrument()));

const { dispatch } = store;

const { reducers } = destruct({ dispatch })({ app: appGlue });

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
