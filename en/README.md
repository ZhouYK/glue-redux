# glue-redux | [中文](https://github.com/ZhouYK/glue-redux)

application layer based on redux
> simple, friendly, cohesive. make relevant code appear in close proximity

## check example
```bash
git clone https://github.com/ZhouYK/glue-redux.git
npm install
npm start

then visit http://localhost:8888
```


## Design principle

> each module has its own data model object,think of this model object as a tree.Take advantage of the uniqueness of the path from the top node to the leaf node to substitute action type.Each leaf node is provided with the reducer function,which passed in through gluer.
> inside the leaf node,the generation returns its own path as the type of action creator function.Meanwhile,the reducer function of the leaf node itself will be the attribute value of the top node of the leaf node,whose key is the leaf node path.
> the processed object model by destruct will produce a closed and full reducer function that can be used anywhere in redux.

## It can be combined to realize the reuse of the same data structure

> it is important to note that reuse here refers to structure, not to a specific object. An object can only be applied to one place
## destruct(store)(model) | [code](https://github.com/ZhouYK/glue-redux/blob/master/example/configStore.js)
> deconstruct the data object and connect with redux

### the ginseng
- store(necessary)
  > the dispatch function in store
- model(necessary)
  > the data object defined must be an object type
  
### return
- { reducers, actions, referToState }
  > object that contains the reducers and actions properties
   - reducers
      > object set for the reducer function in redux, which allows direct user combineReducers
   - actions
      > a collection of objects for the model
   - referToState 
      > Get the data corresponding to the model in store according to the model reference, enter the parameter as the model reference and return the corresponding state data   
## gluer([callback, initialValue])
> there are different treatments depending on the participation
### the ginseng
- callback (data processing function)
  > contains two parameters
   
   - data
      > source data passed in by the user
   - state
      > the value of the current node
   
   The return value
   > the value of the current node after processing
   
     
      
- initialValue (the initial value)
  > the initial value of the current node

### example
```jsx harmony
 // no parameters
 const name = gluer(); // equivalent to: const name =  gluer(data => data)
 
 // only one input parameter, type function, will be used for data processing
 const name = gluer((data, state) => data.substring(1,3));
 
 // only one input parameter, of a non-function type, which is treated as an initial value
 const name = gluer('initialValue'); // equivalent to: const name = gluer(data => data, 'initialValue')
 
 // two parameters, the first for the data processing function, the second for the initial value
 const name = gluer((data, state) => { ...state, ...data }, {name: 'initialValue'})
 
```


## Some conventions of the data object model | [code](https://github.com/ZhouYK/glue-redux/blob/master/example/glue/model.jsx)
```jsx harmony
// 定义model
  import { gluer } from '../../src';
  
  const users = gluer((data, state) => [data, ...state], []);
  
  const app = {
    users,
  };
  export default app;

```
- 1，A node in an object requires data maintenance, which requires the reducer to change its value. Then you can define the reducer function directly, and assign it to the node using the gluer wrapper.
- 2，If the value of the node is the function fn and not packed with gluer, do nothing.
- 3，Values of other types of nodes will be output as is without any processing.
- 4， In the example, after sub is processed, if the node value is returned as gluer, it can be called directly to trigger action.

## Author
[ZhouYK](https://github.com/ZhouYK)

## License
[MIT licensed](https://github.com/ZhouYK/glue-redux/blob/master/LICENSE) 
