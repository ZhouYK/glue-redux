import { gluer } from '../../src/index';

const name = gluer((state = 'Initial value', action) => {
  if (action) {
    return action.data;
  }
  return state;
});

const app = {
  name,
  getName: (n = 'andrew') => () => app.name(n),
  age: 10,
};

export default app;
