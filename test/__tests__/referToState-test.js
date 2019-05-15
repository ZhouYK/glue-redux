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

  const peopleData = {
    name: '小明',
    age: 10,
    hobby: '敲代码',
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
    },
  }
  expect(referToState(wholeModel.model.people)).toEqual(peopleData);

  expect(referToState(wholeModel.model.people.family.child)).toEqual({
    name: '小明',
    age: 10,
    nickeyName: '小小'
  });

  expect(referToState(wholeModel.model.people.family.address.street)).toBe(undefined);
  expect(referToState(wholeModel.model.people.family.address)).toEqual({
    street: '东城根街'
  });

  wholeModel.model.people.family({ count: 4, address: { street: '大田路' } });

  expect(referToState(wholeModel.model.people.family.address)).toEqual({
    street: '大田路'
  });

  expect(referToState(wholeModel.model.people.family)).toEqual({
    ...peopleData.family,
    count: 4,
    address: {
      street: '大田路'
    }
  })

  expect(referToState(wholeModel.model.people.name)).toEqual('小明');

  expect(referToState(wholeModel.model.people.hobby)).toBe(undefined);

  expect(referToState(wholeModel.model.family.count)).toBe(undefined);
});
