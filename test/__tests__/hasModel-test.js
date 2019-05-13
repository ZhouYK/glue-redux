import { hasModel, wholeModel } from '../../example/store';
import appModel from '../../example/models/app/model';
import testModel from '../../example/models/test/model';
import people from '../../example/models/people/model';

test('hasModel test', () => {
  expect(hasModel(appModel)).toBe(true);
  // the return of gluer is an abstraction, not the final reference or called "instance".
  expect(hasModel(testModel)).toBe(false);
  expect(hasModel(people)).toBe(false);
  // here is test final reference or called "instance"
  expect(hasModel(wholeModel.model.test)).toBe(true);

  expect(hasModel(wholeModel.model.people)).toBe(true);
  expect(hasModel(wholeModel.model.people.family.child)).toBe(true);
  expect(hasModel(wholeModel.model.people.family.child.nickeyName)).toBe(false);

  expect(hasModel(wholeModel.siblings)).toBe(true);
  expect(hasModel(wholeModel.siblings.person)).toBe(false);
  expect(hasModel(wholeModel.users)).toBe(false);
  const tempModel = {};
  expect(hasModel(tempModel)).toBe(false);
});
