import { glueActionFnFlag, glueActionFnFlagValue } from './contants';

const glueAction = (actionCreator) => {
  if (typeof actionCreator) throw new Error('请传入action生成函数');
  Object.defineProperty(actionCreator, glueActionFnFlag, {
    value: glueActionFnFlagValue,
    configurable: false,
    writable: false,
    enumerable: false,
  });
};

export default glueAction;
