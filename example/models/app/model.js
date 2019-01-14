import { gluer } from '../../../src';

const users = gluer((data, state) => [data, ...state], []);
const profile = {
  date: gluer(1),
};

const country = gluer('');

const app = {
  users,
  country,
  profile,
};
export default app;
