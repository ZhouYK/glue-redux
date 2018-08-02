# glue-redux

结构化redux数据模型。

## 当我们使用redux时，我们需要做什么？
```
  1，定义type，创建action creator
  2，创建reducer，并且判断action type进行数据处理
  3，定义组织全局store的state结构
  4，将组件与redux连接，获取属性
  5，组件内触发action，需要显示调用dispatch或者bindActionCreators来将action对象注入
```
以上步骤中，
```
  1，定义type，创建action creator
```
> 需要定义很多唯一type，维护和命名会有一些负担；

```
  2，创建reducer，并且判断action type进行数据处理
```
> 会有很多模板代码，需要根据action type处理数据，这里会有第二次对action type的认知负担
```
  3，定义组织全局store的state结构
```
> 这里需要清楚reducer的返回，将reducer进行组织，这又增加了对reducer和state的认知负担

```
  5，组件内触发action，需要显示调用dispatch或者bindActionCreators来将action对象注入
```
> 组件内触发action需要做包装和注入，这些代码也是一类的模板代码

## 使用glue-redux会减少哪些事？

glue-redux推荐以模块为单位，对模块的数据模型进行定义；

- 不用自定义action type了，再也不用在一堆字符串变量中翻滚
- reducer专一化，不再在内部与action type关联，代码会变得很纯净
- 数据模型即为模块在state中的数据结构，一目了然
- 需要触发action，只用导入数据模型，像调用方法一样即可触发

## 如何使用？
- 1，创建模块数据模型
 ```js
 /**
 * gluePair 绑定action creator和对应的reducer
 * createGlue 创建Glue对象
*/
 import { gluePair, createGlue } from 'glue-redux';
 
 
 const nameAction = (name) => {
   return name;
 };
 const nameReducer = (state = 'Initial value', action) => {
   if (action) {
     return action.data;
   }
   return state;
 };
 
 const app = createGlue({
   name: gluePair(nameAction, nameReducer),
   getName: (name = 'andrew') => () => {
     return app.name(name);
   },
   age: 10
 });
 // 传入createGlue的对象
 // 属性值为函数直接量的，会被当做action creator处理，可以直接调用触发action
 // 属性值为gluePair返回的，会被当做state的结构，值为传入reducer的返回；可以直接调用触发action，从而调用reducer改变数据
 // 属性值为其他的，会直接作为state的数据，不会改变
 // app最终会在state中呈现的数据结构为: { name: 'Initial value', age: 10 }
 // app最终的结构为：{ name: action creator function, getName: async actionCreator function }
 
 export default app;
 ```
- 2，传入store
```jsx harmony
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
  // 用来注入store以及结构Glue对象，返回 { actions, reducers }
  import { destruct } from 'glue-redux';
  const store = createStore(() => {}, {}, compose(applyMiddleware(thunk), DevTool.instrument()));
  const { dispatch } = store;
  
  // 定义store state结构，解构Glue对象
  // 最终 state的结构会是 { app: { name: 'Initial value', age: 10 } }
  const { reducers } = destruct({ dispatch })({
   app: appGlue
  });
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

``` 

- 3，在组件内使用
```jsx harmony
import PT from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent, Fragment } from 'react';
import appGlue from './glue';

class Index extends PureComponent {
  static propTypes = {
    name: PT.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleClick = (evt) => {
    evt.preventDefault();
    appGlue.getName(this.ref.current.value);
  }

  render() {
    return (
      <Fragment>
        <form action="/" method="get">
          <label htmlFor="name">
            Input your name：
            <input ref={this.ref} type="text" id="name" />
          </label>
          <button type="button" onClick={this.handleClick}>
            Submit
          </button>
        </form>
        your name is：
        { this.props.name }
      </Fragment>
    );
  }
}

/**
* 
* @param state { app: { name: 'Initial value', age: 10 } }
* @returns {{name: *}}
*/
const mapStateToProps = (state) => {
  const { app } = state;
  const { name } = app;
  return {
    name,
  };
};

export default connect(mapStateToProps)(Index);

```

## Author
. [ZhouYK](https://github.com/ZhouYK)

## License
[MIT licensed](https://github.com/ZhouYK/glue-redux/blob/master/LICENSE) 