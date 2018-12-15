# glue-redux
基于redux的应用层
> 简单、友好、内聚，让相关代码在相近的位置出现

## 查看示例
```bash
git clone https://github.com/ZhouYK/glue-redux.git
npm install
npm start

然后访问 http://localhost:8888
```

## Api
* gluer
* destruct

## gluer([updater, initialValue]) | [代码](https://github.com/ZhouYK/glue-redux/blob/master/example/glue/model.js)
> 根据入参会有不同的处理
### 入参
- updater (数据处理函数)
  > 包含两个参数
   
   - data
      > 用户传入的源数据
   - state
      > 当前节点的值
   
   返回值
   > 经过处理后的当前节点的值
   
     
      
- initialValue (初始值)
  > 当前节点的初始值

### 重载
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

### 如何使用 | [代码](https://github.com/ZhouYK/glue-redux/blob/master/example/glue/model.js)

```js
// 定义model
  import { gluer } from 'glue-redux';
  
  const users = gluer((data, state) => [data, ...state], []);
  
  const app = {
    users,
  };
  export default app;

```
### 注意
<strong>gluer定义的节点是一种抽象，可以进行复用。其生效并能使用需要满足两个条件：</strong>
* 1，节点需要挂载在某个对象上传入destruct
* 2，经过destruct处理后，只能通过被挂载的对象来使用节点函数

## destruct(store)(model)
> 解构数据对象，与redux进行连接

### 入参
- store(必传)
  > store中的dispatch函数
- model(必传)
  > 定义的数据对象，必须是对象类型
  
### 返回
- { reducers, actions, referToState }
  > 包含reducers和actions属性的对象
  
   - reducers
      > redux中的reducer函数的对象集合，可直接用于combineReducers
   - actions
      > model的一个对象集合
   - referToState 
      > 根据model的引用获取其在store对应的数据, 入参为model引用，返回对应的state数据
   - hasModel
      > 判断传入的reference是否存在于store中            
      
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
<strong>gluer定义的节点是一种抽象，可以进行复用。其生效并能使用需要满足两个条件：</strong>
* 1，节点需要挂载在某个对象上传入destruct
* 2，经过destruct处理后，只能通过被挂载的对象来使用节点函数

### [与react搭配](https://github.com/ZhouYK/react-glux)

<strong>详情请见[react-glux](https://github.com/ZhouYK/react-glux)</strong>  
## Author
[ZhouYK](https://github.com/ZhouYK)

## License
[MIT licensed](https://github.com/ZhouYK/glue-redux/blob/master/LICENSE) 
