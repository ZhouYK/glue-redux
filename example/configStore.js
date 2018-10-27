import {
  createStore, combineReducers,
} from 'redux';
import { model as app } from './glue';
import DevTool from './DevTool';
import { destruct } from '../src';

const store = createStore(() => {}, {}, DevTool.instrument());
const { reducers, referToState } = destruct(store)({ app });
store.replaceReducer(combineReducers(reducers));

export {
  store,
  referToState,
};
