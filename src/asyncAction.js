import { asyncActionFnFlag, asyncActionFnFlagValue, actionType } from './constants';

export const asyncAction = ({
  sync, async, dispatch,
}) => {
  const {
    type: asyncType,
    function: asyncFunction,
  } = async;
  let finalAsyncHandler;
  // 如果存在同步更新的数据处理逻辑，那么异步处理函数将在完成时调用，并传入返回的数据
  if (sync) {
    const {
      action: syncAction,
    } = sync;
    finalAsyncHandler = async function (...args) {
      dispatch({ type: asyncType, data: { ...args } });
      const result = await asyncFunction(...args);
      return syncAction(result);
    };
  } else {
    finalAsyncHandler = async function (...args) {
      dispatch({ type: asyncType, data: { ...args } });
      const result = await asyncFunction(...args);
      return result;
    };
  }

  Object.defineProperties(finalAsyncHandler, {
    [asyncActionFnFlag]: {
      value: asyncActionFnFlagValue,
      configurable: false,
      writable: false,
      enumerable: false,
    },
    [actionType]: {
      value: asyncType,
      configurable: false,
      writable: false,
      enumerable: true,
    },
  });
  return finalAsyncHandler;
};
export default asyncAction;
