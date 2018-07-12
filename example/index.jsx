import React, { Fragment } from 'react';
import { render } from 'react-dom';
import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './components/App';
import DevTool from './components/DevTool';
import appGlue from './glue';
import { destruct } from '../src';

const store = createStore(() => {}, {}, compose(applyMiddleware(thunk), DevTool.instrument()));
const { dispatch } = store;
// 传入一个对象，键自定义，值为glue对象
// 会返回一个对象 包含 和传入同结构的reducers和actions
// reducers 的结构形同 { app: f(state, action) }，
// actions 的结构形同 { app: <appGlue>{ name: action fn(), getName: action fn() } }
// appGlue对象一但被destruct过后，会被转化为action的调用对象
// 后续使用action有两种途径：1，从destruct返回的actions里去调用，或者从对应的模块的glue对象调用
const { reducers } = destruct({ dispatch })({ app: appGlue });
// reducers直接传给combineReducers
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
