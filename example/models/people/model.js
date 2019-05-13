import { gluer } from '../../../src';

const name = gluer(data => `我是${data}`, '小明');
const age = gluer(data => 10 * data);

const people = gluer((data, state) => ({
  ...state,
  hobby: data.hobby,
}), {
  name,
  age,
  hobby: '敲代码',
});

export default people;
