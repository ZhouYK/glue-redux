import { gluer, gas } from '../../../cj';

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
