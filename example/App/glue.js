import { gluer } from '../../src/index';
import sub from './Sub/glue';

const name = gluer((state = 'Initial value', action) => {
  if (action) {
    return action.data;
  }
  return state;
});

const app = {
  name,
  asyncGetName: (n = 'andrew') => () => app.name(n),
  age: 10,
  sub,
  ...sub,
};

export default app;
