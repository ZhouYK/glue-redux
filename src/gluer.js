import { forPurposeKey, forPurposeValue } from './contants';

/**
 * gluePair升级版
 * 生成一对action和reducer
 * @param reducerFnc 必需
 * @param actionCreator 非必需
 * @returns {function(): {action: *, reducer: *}}
 */
const gluer = (reducerFnc, actionCreator = data => data) => {
  const gf = function* () {
    let errorMsg = '';
    if (typeof reducerFnc !== 'function') {
      errorMsg = '第一个参数reducer必须为函数';
    }
    if (typeof actionCreator !== 'function') {
      errorMsg = `${errorMsg}，第二个参数actionCreator必须为函数`;
    }
    if (errorMsg) {
      console.trace();
      throw new Error(errorMsg);
    }
    const reducer = yield reducerFnc;
    const action = yield actionCreator;
    return {
      reducer,
      action,
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
export default gluer;
