import { gluer } from '../../../src/index';

const users = gluer((data, state) => [data, ...state], []);
const profile = {
  date: gluer(1),
};

const app = {
  users,
  profile,
};
export default app;
