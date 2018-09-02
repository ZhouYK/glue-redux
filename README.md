# glue-redux

可组合的redux数据模型

## 可组合,实现同一数据结构的复用

> 需要注意的是，这里复用指的是结构，不是具体的某一个对象。一个对象只能被应用于一处，比如下例中的Sub模块的数据模型对象。
```jsx harmony
  // 定义一个Sub模块的数据模型
  import { gluer } from '../../../src/index';
  
  const height = gluer((state = 100, action) => {
    if (action) {
      return Number(action.data);
    }
    return state;
  });
  
  const sex = gluer((state = '薛定谔的猫', action) => {
    if (action) {
      return action.data;
    }
    return state;
  });
  
  const sub = {
    height,
    sex,
    asyncGetHeight: (params = { height: 100 }) => () => {
      setTimeout(() => {
        sub.height(params.height);
      }, 2000);
    },
  };
  
  export default sub;
  
  // 定义一个App模块的数据模型，其中包含Sub的数据
  import { gluer } from '../../src/index';
  import sub from './Sub/glue';
  
  const name = gluer((state = 'Initial value', action) => {
    if (action) {
      return action.data;
    }
    return state;
  });
  
  const app = {
    name,
    asyncGetName: (n = 'andrew') => () => app.name(n),
    age: 10,
    sub,
  };
  
  export default app;
  
  // 把数据模型传入store中
  import appGlue from './App/glue';
  const store = createStore(() => {}, {}, compose(applyMiddleware(thunk), DevTool.instrument()));
  
  const { dispatch } = store;
  
  const { reducers } = destruct({ dispatch })({ app: appGlue });
  store.replaceReducer(combineReducers(reducers));

  // 最后我们会得到这样的state数据结构
  {
    app: {
      name: 'Initial value',
      age: 10,
      sub: {
        sex: '薛定谔的猫',
        height: 100
      },
      height: 100,
      sex: "薛定谔的猫"
    }
  }
```
## 设计原理

> 把对象看成一棵树，利用从顶层节点到叶子节点路径的唯一性，来替代action type。每个叶子节点自带reducer函数，即通过gluer传入。
> 在叶子节点内部，会内嵌生成返回自身路径type的action creator函数。同时叶子节点自身的reducer函数，将作为该叶子节点的顶层节点的属性值：
> 以叶子节点路径type作为索引。
> 经过处理的对象模型，会得到一个封闭且完整的reducer函数，可使用于redux的任何地方。

## 数据对象模型的一些约定
以Sub模块的数据模型为例：
```jsx harmony
 const height = gluer((state = 100, action) => {
    if (action) {
      return Number(action.data);
    }
    return state;
  });
  
  const sex = gluer((state = '薛定谔的猫', action) => {
    if (action) {
      return action.data;
    }
    return state;
  });
const sub = {
    height,
    sex,
    asyncGetHeight: (params = { height: 100 }) => () => {
      setTimeout(() => {
        sub.height(params.height);
      }, 2000);
    },
  };
```
- 1，对象中某个节点需要进行数据维护，即需要有reducer来改变其值。那么可直接定义reducer函数，并且用gluer包装，赋值给该节点。
  - a，reducer需要遵守：当action为undefined，返回默认值state的约定。此举是为了得到初始化的state。
  - b，gluer函数针对传入的reducer函数进行包装，区别于普通函数
  - c，经过destruct后数据模型对象节点的值将变为action creator，在内部被包装为(params) => dispatch({type, data: params})
- 2，如果节点的值是函数fn，没有用gluer进行包装，那么将会被认为是一个action creator函数，经过destruct后会被包装成(...args) => dispatch(fn(...args));
- 3，节点其他类型的值，将原样输出，不做任何处理 
- 4，例子中sub经过destruct后，之前节点值为函数的，都可直接调用触发对应的action

## Author
[ZhouYK](https://github.com/ZhouYK)

## License
[MIT licensed](https://github.com/ZhouYK/glue-redux/blob/master/LICENSE) 