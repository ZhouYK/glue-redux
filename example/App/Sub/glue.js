import { gluer } from '../../../src/index';

const height = gluer((state = 100, action) => {
  if (action) {
    return Number(action.data);
  }
  return state;
});

const sex = gluer((state = '薛定谔的猫', action) => {
  if (action) {
    return action.data;
  }
  return state;
});

const sub = {
  height,
  sex,
  asyncGetHeight: (params = { height: 100 }) => () => {
    setTimeout(() => {
      sub.height(params.height);
    }, 2000);
  },
};

export default sub;
