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
const app = createGlue({
  name: gluePair(nameAction, nameReducer),
  getName: (name = '小明') => () => {
    console.log('app.name：', app.name.toString());
    return app.name(name);
  },
});

export default app;
