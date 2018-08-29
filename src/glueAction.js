import { glueActionFnFlag, glueActionFnFlagValue } from './contants';

export const glueAction = (actionCreator) => {
  if (typeof actionCreator !== 'function') throw new Error('请传入action生成函数');
  Object.defineProperty(actionCreator, glueActionFnFlag, {
    value: glueActionFnFlagValue,
    configurable: false,
    writable: false,
    enumerable: false,
  });
  return actionCreator;
};

export default glueAction;
