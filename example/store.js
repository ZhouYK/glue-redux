import {
  createStore, combineReducers,
} from 'redux';
import DevTool from './DevTool';
import { destruct } from '../src';
import model from './models';

const store = createStore(() => {}, {}, DevTool().instrument());
const wholeModel = {
  users: ['小明'],
  siblings: {
    person: '小红',
  },
  model,
};
const { reducers, referToState, hasModel } = destruct(store)(wholeModel);

store.replaceReducer(combineReducers(reducers));

export {
  store,
  referToState,
  hasModel,
  wholeModel,
};
