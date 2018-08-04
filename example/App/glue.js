import { gluePair, createGlue } from '../../src/index';

const nameAction = name => name;
const nameReducer = (state = 'Initial value', action) => {
  if (action) {
    return action.data;
  }
  return state;
};

const app = createGlue({
  name: gluePair(nameAction, nameReducer),
  getName: (name = 'andrew') => () => app.name(name),
});

export default app;
