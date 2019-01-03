import { hasModel, wholeModel } from '../../example/store';
import appModel from '../../example/models/app/model';
import testModel from '../../example/models/test/model';

test('hasModel test', () => {
  expect(hasModel(appModel)).toBe(true);
  // the return of gluer is an abstraction, not the final reference or called "instance".
  expect(hasModel(testModel)).toBe(false);
  // here is test final reference or called "instance"
  expect(hasModel(wholeModel.model.test)).toBe(true);

  expect(hasModel(wholeModel.siblings)).toBe(true);
  expect(hasModel(wholeModel.siblings.person)).toBe(true);
  expect(hasModel(wholeModel.users)).toBe(true);
  const tempModel = {};
  expect(hasModel(tempModel)).toBe(false);
});
