import { glueActionFnFlag, glueActionFnFlagValue, actionType } from './contants';
import { getType } from './getType';

export const glueAction = (params) => {
  const { action, dispatch, type } = params;
  if (typeof action !== 'function') throw new Error('请传入action生成函数');
  const actionCreator = function (...args) {
    const actionEntity = action(...args);
    // v3.x版本将会去除掉这个兼容gluePair的东西
    if (getType(actionEntity) === '[object Function]') {
      return dispatch(actionEntity);
    }
    // 组装action实体，触发action
    dispatch({ type, data: actionEntity });
    return actionEntity;
  };
  Object.defineProperties(actionCreator, {
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
  return actionCreator;
};
export default glueAction;
