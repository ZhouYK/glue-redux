import { gluer, createGlue } from '../../src/index';

const nameReducer = (state = 'Initial value', action) => {
  if (action) {
    return action.data;
  }
  return state;
};

const app = createGlue({
  name: gluer(nameReducer),
  getName: (name = 'andrew') => () => app.name(name),
  age: 10,
});

export default app;
