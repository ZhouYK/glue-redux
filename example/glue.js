import { gluePair, createGlue } from '../src';

const nameAction = (name) => {
  console.log('name：', name);
  return name;
};
const nameReducer = (state = '初始值', action) => {
  if (action) {
    return action.data;
  }
  return state;
};
const app = {
  name: gluePair(nameAction, nameReducer),
  sex: '男',
  homemade: {
    name: 123,
    height: 190,
  },
};

export default createGlue(app);
