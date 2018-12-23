import { gluer, gas } from '../../../src';

const users = gluer((data, state) => [data, ...state], []);
const profile = {
  date: gluer(1),
};

const country = gas(async count => count, gluer(''));

const app = {
  users,
  country,
  profile,
};
export default app;
