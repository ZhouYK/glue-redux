import { gluer } from '../../../src';

const profile = {
  date: gluer(1),
};
const users = gluer((data, state) => [data, ...state], []);

const country = gluer('');

const app = {
  users,
  country,
  profile,
};
export default app;
