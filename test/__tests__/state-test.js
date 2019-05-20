import {
  referToState, wholeModel, store,
} from '../../example/store';
import appModel from '../../example/models/app/model';
import testModel from '../../example/models/test/model';
import people from '../../example/models/people/model';

import { createStore } from 'redux';
import gluer from '../../src/gluer';
import destruct from '../../src/index';
import { mapTracedError } from '../constants';
import family from '../../example/models/wiki/model';

describe('state normal test',  () => {
  // state的常见情况测试
  test('the state of example', () => {
    const initialState = store.getState();
    const initialApp = referToState(appModel);
    const initialProfile = referToState(appModel.profile);
    const initialUsers = referToState(appModel.users);
    const initialPeople = referToState(wholeModel.model.people);
    let tempState = referToState(wholeModel);
    expect(initialState).toBe(tempState);

    appModel.users({
      name: '小红',
    });
    expect(referToState(appModel.users)).toEqual([{
      name: '小红',
    }]);
    expect(initialPeople).toEqual({
      name: '小明',
      hobby: '敲代码',
      age: 10,
      family: {
        papa: '我的父亲',
        mama: '我的母亲',
        count: 3,
        child: {
          name: '小明',
          age: 10,
          nickeyName: '小小'
        },
        address: {
          street: '东城根街'
        }
      }
    });

    wholeModel.model.people({
      name: '娃哈哈',
      hobby: '哈哈哈',
      age: 8
    });

    expect(referToState(wholeModel.model.people)).toEqual({
      ...initialPeople,
      name: '我是娃哈哈',
      hobby: '哈哈哈',
      age: 80,
    });

    wholeModel.model.people({
      family: {
        papa: '小次郎'
      }
    });

    expect(referToState(wholeModel.model.people.family.papa)).toBe('我的小次郎');

    wholeModel.model.people.family({
      papa: '夸父'
    });

    expect(referToState(wholeModel.model.people.family.papa)).toBe('我的夸父');

    wholeModel.model.people.family.child.name('小绵羊');
    expect(referToState(wholeModel.model.people.family.child.name)).toBe('我是小绵羊');

    const state = store.getState();
    tempState = referToState(wholeModel);
    expect(state).toBe(tempState);


    const currentApp = referToState(appModel);
    const currentProfilx = referToState(appModel.profile);
    const currentUsers = referToState(appModel.users);
    const currentPeople = referToState(wholeModel.model.people);
    expect(Object.is(initialPeople, currentPeople)).toBe(false);
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
    expect(() => destruct(store)(model)).toThrow(mapTracedError);

    const peopleModel = {
      people
    };
    const model_1 = {
      people: peopleModel
    };

    model_1.shadow = peopleModel;
    expect(() => destruct(store)(model_1)).toThrow(mapTracedError);
  });
  // 两个或两个以上的地方使用了同一个model的reference
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
    expect(() => destruct(store)(wholeModel)).toThrow(mapTracedError);
  });

  test('initialState as model, used in more than one state', () => {
    const store = createStore(() => ({}));
    destruct(store)({ family });
    destruct(store)({ family })
  });
});
