# glue-redux | [en](https://github.com/ZhouYK/glue-redux)

可组合的redux数据模型
> 每个模块对应自身数据模型对象

## 设计原理

> 每一个模块有自己的数据模型对象，把这个对象看成一棵树，利用从顶层节点到叶子节点路径的唯一性，来替代action type。每个叶子节点自带reducer函数，即通过gluer传入。
> 在叶子节点内部，会内嵌生成返回自身路径type的action creator函数。同时叶子节点自身的reducer函数，将作为该叶子节点的顶层节点的属性值：
> 以叶子节点路径type作为索引。
> 经过处理的对象模型，会得到一个封闭且完整的reducer函数，可使用于redux的任何地方。

## 可组合,实现同一数据结构的复用

> 需要注意的是，这里复用指的是结构，不是具体的某一个对象。一个对象只能被应用于一处，比如下例中的Sub模块的数据模型对象。
```jsx harmony
  // 定义一个Sub模块的数据模型
  import { gluer } from '../../../src/index';
  
  const height = gluer(data => Number(data), 100);
    
  const sex = gluer('薛定谔的猫');
  
  const sub = {
    height,
    sex,
    asyncGetHeight: (params = { height: 100 }) => {
      setTimeout(() => {
        sub.height(params.height);
      }, 2000);
    },
  };
  
  export default sub;
  
  // 定义一个App模块的数据模型，其中包含Sub的数据
  import { gluer } from '../../src/index';
  import sub from './Sub/glue';
  
  const name = gluer('Initial value');
  
  const app = {
    name,
    asyncGetName: (n = 'andrew') => app.name(n),
    age: 10,
    sub,
    ...sub,
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
## gluer([callback, initialValue])
> 根据入参会有不同的处理
### 入参
- callback (数据处理函数)
  > 包含两个参数
   
   - data
      > 用户传入的源数据
   - state
      > 当前节点的值
   
   返回值
   > 经过处理后的当前节点的值
   
     
      
- initialValue (初始值)
  > 当前节点的初始值

### 例子
```js
 // 不传参数
 const name = gluer(); // 等价于 const name =  gluer(data => data)
 
 // 只有一个入参，类型为函数，该函数会用于数据处理
 const name = gluer((data, state) => data.substring(1,3));
 
 // 只有一个入参，类型为非函数，该参数会被当做初始值
 const name = gluer('initialValue'); // 等价于 const name = gluer(data => data, 'initialValue')
 
 // 两个参数，第一个为数据处理函数，第二个为初始值
 const name = gluer((data, state) => { ...state, ...data }, {name: 'initialValue'})
 
```

## 数据模型分析
以Sub模块的数据模型为例：
```jsx harmony
// 定义一个Sub模块的数据模型
  import { gluer } from '../../../src/index';
  
  const height = gluer(data => Number(data), 100);
    
  const sex = gluer('薛定谔的猫');
  
  const sub = {
    height,
    sex,
    asyncGetHeight: (params = { height: 100 }) => {
      setTimeout(() => {
        sub.height(params.height);
      }, 2000);
    },
  };
  
  export default sub;
```

- 1，对象中某个节点需要进行数据维护，即需要有reducer来改变其值。那么可直接定义数据处理函数，并且用gluer包装，赋值给该节点。
- 2，如果节点的值是函数fn，没有用gluer进行包装，不做任何处理(比如:sub.asyncGetHeight);
- 3，节点其他类型的值，将原样输出，不做任何处理;
- 4，例子中sub经过处理后，节点值为gluer返回值得，都可直接调用该节点(sub.height(100))触发action,内部会调用数据处理函数(gluer的入参),更新state;


## Author
[ZhouYK](https://github.com/ZhouYK)

## License
[MIT licensed](https://github.com/ZhouYK/glue-redux/blob/master/LICENSE) 
