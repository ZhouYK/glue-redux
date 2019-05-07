<a href="https://996.icu"><img src="https://img.shields.io/badge/link-996.icu-red.svg"></a>
[![build](https://img.shields.io/travis/com/ZhouYK/glue-redux.svg)](https://travis-ci.com/ZhouYK/glue-redux)
[![codecov](https://codecov.io/gh/ZhouYK/glue-redux/branch/master/graph/badge.svg)](https://codecov.io/gh/ZhouYK/glue-redux)
[![NPM version](https://img.shields.io/npm/v/glue-redux.svg?style=flat)](https://www.npmjs.com/package/glue-redux)
[![NPM downloads](http://img.shields.io/npm/dm/glue-redux.svg?style=flat)](https://www.npmjs.com/package/glue-redux)
[![package size](https://img.shields.io/bundlephobia/minzip/glue-redux.svg)]()
[![license](https://img.shields.io/github/license/ZhouYK/glue-redux.svg)]()

# glue-redux
基于redux的应用层
> 简单、友好、内聚，让相关代码在相近的位置出现

---

## 查看示例
```bash
git clone https://github.com/ZhouYK/glue-redux.git
npm install
npm start

然后访问 http://localhost:8888
```

## API
* gluer
* destruct

## gluer([updater, initialValue]) | [代码](https://github.com/ZhouYK/glue-redux/blob/master/example/models/app/model.js)
> 声明同步节点，根据入参会有不同的处理
### 入参

| 参数名 | 类型 | 用途 | 示例
| :---- | :---- | :---- | :----
| updater | 函数 | 用于处理数据，强烈建议数据处理的情况不要有超过两种，超过了应提取出来放置别处 | function (data, state) {}
| initialValue | 任意值 | 节点初始值，表明节点的数据结构和数据类型 | any

### 使用 | [代码](https://github.com/ZhouYK/glue-redux/blob/master/example/models/app/model.js)

```js
// 定义model
  import { gluer } from 'glue-redux';
  
  const users = gluer((data, state) => [data, ...state], []);
  const profile = {
    date: gluer(1),
  };
  
  const country = gluer('');
  
  const app = {
    users,
    country,
    profile,
  };
  export default app;

```
关于gluer的入参选择，可以有多种模式

```jsx
 // 不传参数
 const name = gluer(); // 等价于 const name =  gluer(data => data)
 
 // 只有一个入参，类型为函数，该函数会用于数据处理
 const name = gluer((data, state) => data.substring(1,3));
 
 // 只有一个入参，类型为非函数，该参数会被当做初始值
 const name = gluer('initialValue'); // 等价于 const name = gluer(data => data, 'initialValue')
 
 // 两个参数，第一个为数据处理函数，第二个为初始值
 const name = gluer((data, state) => { ...state, ...data }, {name: 'initialValue'})
 
```

## destruct(store)(models)
> 解构数据对象，与redux进行连接

### 入参
| 参数名 | 类型 | 用途 | 示例
| :----: | :----: | :----: | :----:
| store | redux的store | 供数据模型使用 | - 
| models | object | 数据模型 | { [index: string]: GluerReturn or any} 
  
### 返回
- { reducers, actions, referToState, hasModel }
  > 包含reducers和actions属性的对象
  
| 属性名 | 类型 | 用途 | 示例
| :----: | :----: | :----: | :----:
| reducers | object | reducer组成的对象 | { name: (state, action) => {}, ... } 
| actions | object | dispatcher组成的对象 | { name: GluerReturn, ... }
| referToState | function | 用于从state中索引出数据 | referToState(index:any)
| hasModel | function | 用于判断传入的内容是否被索引了 | hasModel(index: any)
      
### 如何使用  | [代码](https://github.com/ZhouYK/glue-redux/blob/master/example/store.js)
```js
// store.js
import {
  createStore, combineReducers,
} from 'redux';
import { destruct } from 'glue-redux';
import model from './model';

const store = createStore(() => {});
const { reducers, referToState, hasModel } = destruct(store)(model);
store.replaceReducer(combineReducers(reducers));

export {
  store,
  referToState, // 根据reference 获取store中对应的数据，如果没有则返回undefined
  hasModel, // 判断reference 是否在store中有对应的数据
};
```

## 使用model进行数据更新

```js
// service.js
import app from './model';

const register = (data) => {
  // any operation about data
  app.users(data);
};
const service = {
  register,
};
export default service;
```

```js
import { referToState } from './store';
import app from './model';
import service from './service';

service.register({
  name: '小明',
  age: 18,
  pet: '猫'
});
console.log('app model的数据为：', referToState(app));
// { users: [{name: '小明', age: 18, pet: '猫'}] }
console.log('app model中的users为：', referToState(app.users));
// [{name: '小明', age: 18, pet: '猫'}]
```

## 扩展文档

| 地址 | 摘要
| :----: | :----:
| [说明文档](https://github.com/ZhouYK/glue-redux/wiki/%E8%AF%B4%E6%98%8E%E6%96%87%E6%A1%A3) | 更加详细说明glue-redux的原理
| [实践说明](https://github.com/ZhouYK/glue-redux/wiki/%E8%BF%9B%E9%98%B6%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97) | 处理异步问题以及如何组织代码
| [react-glux](https://github.com/ZhouYK/react-glux) | 与react的连接库，HOC方式
| [react-glue-redux-hook](https://github.com/ZhouYK/react-glue-redux-hook) | 与react的连接库，包含HOC和hook两种方式

## Author
[ZhouYK](https://github.com/ZhouYK)

## License
[MIT licensed](https://github.com/ZhouYK/glue-redux/blob/master/LICENSE) 
