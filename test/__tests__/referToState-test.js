import { referToState, wholeModel } from '../../example/store';
import appModel from '../../example/models/app/model';
import testModel from '../../example/models/test/model';
import people from '../../example/models/people/model';

test('referToState test', () => {

  expect(referToState(people)).toBe(undefined);

  expect(referToState(appModel)).toEqual({
    country: '',
    users: [],
    profile: {
      date: 1,
    },
  });
  // the return of gluer is an abstraction, not the final reference or called "instance".
  expect(referToState(testModel)).toBe(undefined);
  // here is test final reference or called "instance"
  expect(referToState(wholeModel.model.test)).toEqual(['test']);

  expect(referToState(wholeModel.siblings)).toEqual({
    person: '小红',
  });
  expect(referToState(wholeModel.siblings.person)).toBeUndefined();
  expect(referToState(wholeModel.users)).toBeUndefined();

  expect(referToState(wholeModel.model.people)).toEqual({
    name: '小明',
    age: undefined,
    hobby: '敲代码',
    family: {
      papa: '我的父亲',
      mama: '我的母亲',
      count: 3,
      child: {
        name: '小明',
        age: undefined,
        nickeyName: '小小'
      }
    }
  });

  expect(referToState(wholeModel.model.people.family.child)).toEqual({
    name: '小明',
    age: undefined,
    nickeyName: '小小'
  });

  expect(referToState(wholeModel.model.people.name)).toEqual('小明');
});
