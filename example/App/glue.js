import { gluePair, createGlue } from '../../src/index';

const nameAction = (name) => {
  return name;
};
const nameReducer = (state = 'Initial value', action) => {
  if (action) {
    return action.data;
  }
  return state;
};

const app = createGlue({
  name: gluePair(nameAction, nameReducer),
  getName: (name = 'andrew') => () => {
    return app.name(name);
  },
});

export default app;
