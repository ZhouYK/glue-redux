/* eslint-disable */
import { hasModel, referToState, wholeModel, store} from '../example/store'
import appModel from '../example/glue/model';
import testModel from '../example/glue/modelTest';

test('state test', () => {
  let initialState = store.getState();
  let initialApp = referToState(appModel);
  let initialProfile = referToState(appModel.profile);
  let initialUsers = referToState(appModel.users);
  let tempState = referToState(wholeModel);
  expect(initialState).toBe(tempState);

  store.subscribe(() => {
    expect(referToState(appModel.users)).toEqual([{
      name: '小红'
    }]);
  });

  appModel.users({
    name: '小红'
  });

  let state = store.getState();
  tempState = referToState(wholeModel);
  expect(state).toBe(tempState);

  let currentApp = referToState(appModel);
  let currentProfilx = referToState(appModel.profile);
  let currentUsers = referToState(appModel.users);
  expect(Object.is(currentApp, initialApp)).toBe(false);
  expect(currentProfilx).toBe(initialProfile);
  expect(Object.is(currentUsers, initialUsers)).toBe(false);
  expect(Object.is(initialState, state)).toBe(false);

  expect(referToState(testModel)).toBe(undefined);

});
