import { gluer } from '../../../src';

const name = gluer(data => `我是${data}`, '小明');
const age = gluer(data => 10 * data, 10);

const papa = gluer(data => `我的${data}`, '我的父亲');
const mama = gluer(data => `我的${data}`, '我的母亲');
const child = gluer({
  name,
  age,
  nickeyName: '小小',
});

const family = gluer((data, state) => {
  let result = state;
  if ('count' in data && data.count !== state.count) {
    result = {
      ...result,
      count: data.count,
    };
  }
  if ('address' in data && data.address !== state.address) {
    result = {
      ...result,
      address: data.address,
    };
  }
  return result;
}, {
  papa,
  mama,
  child,
  count: 3,
  address: {
    street: '东城根街',
  },
});

const people = gluer((data, state) => ({
  ...state,
  hobby: data.hobby,
}), {
  name,
  age,
  hobby: '敲代码',
  family,
});

export default people;
