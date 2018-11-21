import {
  referToState, wholeModel, store,
} from '../example/store';
import appModel from '../example/models/app/model';
import testModel from '../example/models/test/model';

test('state test', () => {
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
