# glue-redux | [中文](https://github.com/ZhouYK/glue-redux/blob/master/zh-cn/README.md)

composible model for redux
> one model to one module

## Design principle

> Each module has its own data model object,think of this model object as a tree.Take advantage of the uniqueness of the path from the top node to the leaf node to substitute action type.Each leaf node is provided with the reducer function,which passed in through gluer.
> Inside the leaf node,the generation returns its own path as the type of action creator function.Meanwhile,the reducer function of the leaf node itself will be the attribute value of the top node of the leaf node,whose key is the leaf node path.
> The processed object model by destruct will produce a closed and full reducer function that can be used anywhere in redux.

## It can be combined to realize the reuse of the same data structure

> It is important to note that reuse here refers to structure, not to a specific object. An object can only be applied to one place, such as the data model object of the Sub module in the example below
```jsx harmony
  // Define a data model of a Sub module
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
  
  // Define the data model of an App module, which contains data of Sub
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
    ...sub,
  };
  
  export default app;
  
  // Pass the data model into the store
  import appGlue from './App/glue';
  const store = createStore(() => {}, {}, compose(applyMiddleware(thunk), DevTool.instrument()));
  
  const { dispatch } = store;
  
  // destruct data model
  const { reducers } = destruct({ dispatch })({ app: appGlue });
  store.replaceReducer(combineReducers(reducers));

  // Finally, we get state data structures like this
  {
    app: {
      name: "Initial value",
      age: 10,
      sub: {
        sex: '薛定谔的猫',
        height: 100
      },
      height: 100,
      sex: '薛定谔的猫'
    }
  }
```

## Some conventions of the data object model
Take data model of Sub module as an example:
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
- 1，A node in an object requires data maintenance, which requires the reducer to change its value. Then you can define the reducer function directly, and assign it to the node using the gluer wrapper.
  - a，Reducer needs to follow the convention that returns the default state when action is undefined. This is to get the state initialized.
  - b，The gluer function is packaged for the incoming reducer function, unlike the regular function.
  - c，After the destruct, the value of the data model object node will become action creator, which is internally wrapped as (params) => dispatch({type, data: params}).
- 2，If the value of the node is the function fn and not packed with gluer, <del>it will be considered as an action creator function and will be packed with (... The args) = > dispatch (fn (... The args))</del><strong>it keeps</strong>.
- 3，Values of other types of nodes will be output as is without any processing.
- 4，In the example, after the sub passes the destruct, if the node value is a function before, the corresponding action can be triggered directly.

## Author
[ZhouYK](https://github.com/ZhouYK)

## License
[MIT licensed](https://github.com/ZhouYK/glue-redux/blob/master/LICENSE) 
