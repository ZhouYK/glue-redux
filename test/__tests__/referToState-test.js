import { referToState, wholeModel } from '../../example/store';
import appModel from '../../example/models/app/model';
import testModel from '../../example/models/test/model';
import peopleModel from '../../example/models/people/model';

test('referToState test', () => {
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
    name: '小明'
  });

  expect(referToState(wholeModel.model.people.name)).toEqual('小明');
});
