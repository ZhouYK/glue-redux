import { glueActionFnFlag, glueActionFnFlagValue, actionType } from './contants';

export const glueAction = (params) => {
  const { action, dispatch, type } = params;
  if (typeof action !== 'function') throw new Error('请传入action生成函数');
  const actionDispatch = function (...args) {
    const actionEntity = action(...args);
    // 组装action实体，触发action
    dispatch({ type, data: actionEntity });
    return actionEntity;
  };
  Object.defineProperties(actionDispatch, {
    [glueActionFnFlag]: {
      value: glueActionFnFlagValue,
      configurable: false,
      writable: false,
      enumerable: false,
    },
    [actionType]: {
      value: type,
      configurable: false,
      writable: false,
      enumerable: true,
    },
  });
  return actionDispatch;
};
export default glueAction;
