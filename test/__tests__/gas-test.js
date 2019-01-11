import { createStore, combineReducers } from 'redux';
import { gas, gluer, destruct } from '../../src';
import { asyncActionTypeSuffix, distinguishPrefix } from '../../src/constants';

const name = gas(async newName => newName, gluer('小明'));
const age = gas(async a => a);
const user = {
  name,
  age,
};

const store = createStore(() => {});
const {
  reducers,
  hasModel,
  referToState,
} = destruct(store)(user);
store.replaceReducer(combineReducers(reducers));

test('gas test', () => {
  expect(hasModel(user.name)).toBe(true);
  expect(hasModel(user.age)).toBe(false);
  expect(referToState(user)).toEqual({
    name: '小明',
  });
  expect(referToState(user.name)).toBe('小明');
  expect(user.name.actionType).toBe(`${distinguishPrefix}name${asyncActionTypeSuffix}`);
  return user.name('小刚').then((data) => {
    expect(data).toBe('小刚');
    expect(referToState(user.name)).toBe('小刚');
  });
});

test('gas exception test', () => {
  const testedGas = (...args) => () => gas(...args);
  expect(testedGas()).toThrow('at least one param needed');
  expect(testedGas(gluer('123'))).toThrow('Error：the return of "gluer" should be placed in second param');
  expect(testedGas('123')).toThrow('Error: the first param should be a function');
  expect(testedGas('123', gluer('12'))).toThrow('Error: the first param should be a function');
  expect(testedGas(() => ({}), () => {})).toThrow('Error：the second param should be the return of "gluer"');
  expect(testedGas('123', () => {})).toThrow('Error: the first param should be a function');
});
