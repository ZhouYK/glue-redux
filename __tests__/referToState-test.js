import { referToState, wholeModel } from '../example/store';
import appModel from '../example/glue/model';
import testModel from '../example/glue/modelTest';

test('referToState test', () => {
  expect(referToState(appModel)).toEqual({
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
  expect(referToState(wholeModel.siblings.person)).toBe('小红');
  expect(referToState(wholeModel.users)).toEqual(['小明']);
});
