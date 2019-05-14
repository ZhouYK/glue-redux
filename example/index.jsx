import React, { Fragment } from 'react';
import { render } from 'react-dom';
import App from './App/index';
import DevTool from './DevTool';
import { store, wholeModel, referToState } from './store';

const { family } = wholeModel.model;

// 获取family的数据
console.log(JSON.stringify(referToState(family)));

// 获取papa
console.log(JSON.stringify(referToState(family.papa)));

// 获取mama
console.log(JSON.stringify(referToState(family.mama)));

// 获取me
console.log(JSON.stringify(referToState(family.me)));

// /更新papa
family.papa({
  name: '慕容雪村',
  age: 34,
});

console.log(JSON.stringify(referToState(family.papa)));

// 更新mama
family.mama({
  name: '王二丫',
  age: 33,
});

console.log(JSON.stringify(referToState(family.mama)));

// 更新me
family.me({
  name: '慕容小冰',
  age: 10,
});

console.log(JSON.stringify(referToState(family.me)));

// 更新人数
family({
  count: 30,
});

console.log(JSON.stringify(referToState(family)));

const DT = DevTool();
const root = document.getElementById('bd');
render(
  <Fragment>
    <App />
    <DT store={store} />
  </Fragment>, root,
);
