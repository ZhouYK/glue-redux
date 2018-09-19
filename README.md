# glue-redux | [中文](https://github.com/ZhouYK/glue-redux/blob/master/zh-cn/README.md)

composible model for redux
> Each module corresponds to its own data model object

## Design principle

> Each module has its own data model object,think of this model object as a tree.Take advantage of the uniqueness of the path from the top node to the leaf node to substitute action type.Each leaf node is provided with the reducer function,which passed in through gluer.
> Inside the leaf node,the generation returns its own path as the type of action creator function.Meanwhile,the reducer function of the leaf node itself will be the attribute value of the top node of the leaf node,whose key is the leaf node path.
> The processed object model by destruct will produce a closed and full reducer function that can be used anywhere in redux.

## It can be combined to realize the reuse of the same data structure

> It is important to note that reuse here refers to structure, not to a specific object. An object can only be applied to one place, such as the data model object of the Sub module in the example below
```jsx harmony
  // Define a data model of a Sub module
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
  
  // Define the data model of an App module, which contains data of Sub
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
## gluer([callback, initialValue])
> There are different treatments depending on the participation
### The ginseng
- callback (data processing function)
  > Contains two parameters
   
   - data
      > Source data passed in by the user
   - state
      > The value of the current node
   
   The return value
   > The value of the current node after processing
   
     
      
- initialValue (the initial value)
  > The initial value of the current node

### example
```js
 // no parameters
 const name = gluer(); // 等价于 const name =  gluer(data => data)
 
 // only one input parameter, type function, will be used for data processing
 const name = gluer((data, state) => data.substring(1,3));
 
 // only one input parameter, of a non-function type, which is treated as an initial value
 const name = gluer('initialValue'); // 等价于 const name = gluer(data => data, 'initialValue')
 
 // two parameters, the first for the data processing function, the second for the initial value
 const name = gluer((data, state) => { ...state, ...data }, {name: 'initialValue'})
 
```


## Some conventions of the data object model
Take data model of Sub module as an example:
```jsx harmony
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
```
- 1，A node in an object requires data maintenance, which requires the reducer to change its value. Then you can define the reducer function directly, and assign it to the node using the gluer wrapper.
- 2，If the value of the node is the function fn and not packed with gluer, do nothing(sub. AsyncGetHeight etc).
- 3，Values of other types of nodes will be output as is without any processing.
- 4， In the example, after sub is processed, if the node value is returned as gluer, it can be called directly (sub-height (100)) to trigger action.

## Author
[ZhouYK](https://github.com/ZhouYK)

## License
[MIT licensed](https://github.com/ZhouYK/glue-redux/blob/master/LICENSE) 
