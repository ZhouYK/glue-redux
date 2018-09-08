import { gluer } from '../../src/index';
import sub from './Sub/glue';

const name = gluer((state = 'Initial value', action) => {
  if (action) {
    return action.data;
  }
  return state;
});

const app = {
  asyncGetName: (n = 'andrew') => {
    setTimeout(() => {
      app.name(n);
    }, 2000);
  },
  name,
  age: 10,
  sub,
  ...sub,
};

export default app;
