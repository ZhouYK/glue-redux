import React, { Fragment } from 'react';
import { render } from 'react-dom';
import App from './App/index';
import DevTool from './DevTool';
import { store, wholeModel, referToState } from './store';

wholeModel.model.people({
  name: '娃哈哈',
  hobby: '哈哈哈',
});
console.log(referToState(wholeModel.model.people));

const DT = DevTool();
const root = document.getElementById('bd');
render(
  <Fragment>
    <App />
    <DT store={store} />
  </Fragment>, root,
);
