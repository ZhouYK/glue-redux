import { gluer } from '../../../src/index';

const height = gluer(data => Number(data), 100);

const sex = gluer('薛定谔的猫');

const sub = {
  height,
  sex,
  asyncGetHeight: (params = { height: 100 }) => {
    setTimeout(() => {
      sub.height(params.height);
    }, 2000);
  },
};

export default sub;
