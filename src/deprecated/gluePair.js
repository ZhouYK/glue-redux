import { forPurposeKey, forPurposeValue } from '../contants';

/**
 * @deprecated 请使用gluer替代
 * 生成一对action和reducer
 * @param actionCreator
 * @param reducerFnc
 * @returns {function(): {action: *, reducer: *}}
 */
const gluePair = (actionCreator, reducerFnc) => {
  const gf = function* () {
    let errorMsg = '';
    if (typeof actionCreator !== 'function') {
      errorMsg = 'actionCreator必须为函数';
    }
    if (typeof reducerFnc !== 'function') {
      errorMsg = `${errorMsg}，reducer必须为函数`;
    }
    if (errorMsg) {
      throw new Error(errorMsg);
    }
    const action = yield actionCreator;
    const reducer = yield reducerFnc;
    return {
      action,
      reducer,
    };
  };
  Object.defineProperty(gf, forPurposeKey, {
    value: forPurposeValue,
    writable: false,
    configurable: false,
    enumerable: false,
  });
  return gf;
};
export default gluePair;
