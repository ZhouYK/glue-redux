import {
  referToState, wholeModel, store,
} from '../../example/store';
import appModel from '../../example/models/app/model';
import testModel from '../../example/models/test/model';

import { createStore } from 'redux';
import gluer from '../../src/gluer';
import destruct from '../../src/index';
import { duplicatedError } from '../constants';

describe('state normal test',  () => {
  test('the state of example', () => {
    const initialState = store.getState();
    const initialApp = referToState(appModel);
    const initialProfile = referToState(appModel.profile);
    const initialUsers = referToState(appModel.users);
    let tempState = referToState(wholeModel);
    expect(initialState).toBe(tempState);

    store.subscribe(() => {
      expect(referToState(appModel.users)).toEqual([{
        name: '小红',
      }]);
    });

    appModel.users({
      name: '小红',
    });

    const state = store.getState();
    tempState = referToState(wholeModel);
    expect(state).toBe(tempState);

    const currentApp = referToState(appModel);
    const currentProfilx = referToState(appModel.profile);
    const currentUsers = referToState(appModel.users);
    expect(Object.is(currentApp, initialApp)).toBe(false);
    expect(currentProfilx).toBe(initialProfile);
    expect(Object.is(currentUsers, initialUsers)).toBe(false);
    expect(Object.is(initialState, state)).toBe(false);

    expect(referToState(testModel)).toBe(undefined);
  });
});

describe('state edge case test', () => {
  // 主要测试不能使用in操作符的属性类型
  test('some property is undefined', () => {
    const store = createStore(() => ({}));
    const model = {
      hobby: gluer('football'),
      name: undefined // null也同理
    };
    expect(destruct(store)(model)).toMatchObject(
      expect.objectContaining({
        reducers: expect.objectContaining({
          hobby: expect.any(Function),
          name: expect.any(Function),
        }),
        actions: expect.objectContaining({
          hobby: expect.any(Function),
          name: undefined
        }),
        referToState: expect.any(Function),
        hasModel: expect.any(Function)
      })
    )
  });
  // 对象循环引用的问题
  test('circular reference in model', () => {
    const store = createStore(() => ({}));
    const model = {
      hobby: 'football',
      name: undefined
    };
    model.person = model;
    expect(() => destruct(store)(model)).toThrow(duplicatedError);
  });
  //
  test('one model is used more than one place', () => {
    const store = createStore(() => ({}));
    const person = {
      age: gluer(1)
    };
    const model = {
      hobby: 'football',
      name: undefined,
      person
    };
    const human = {
      person
    };
    const wholeModel = { model, human };
    expect(() => destruct(store)(wholeModel)).toThrow(duplicatedError);
  });
});
