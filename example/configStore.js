import {
  createStore, combineReducers,
} from 'redux';
import DevTool from './DevTool';
import { destruct } from '../src';
import model from './model';

const store = createStore(() => {}, {}, DevTool().instrument());
const { reducers, referToState, hasModel } = destruct(store)(model);
store.replaceReducer(combineReducers(reducers));

export {
  store,
  referToState,
  hasModel,
};
