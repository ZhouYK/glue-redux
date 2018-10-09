import { gluer } from '../../src';

const users = gluer((data, state) => [data, ...state], []);

const app = {
  users,
};
export default app;
