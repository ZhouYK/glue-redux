import { forPurposeKey, forPurposeValue } from './contants';

const defaultReducer = (state, action) => action.data;
const genReducer = rd => (state, action) => rd(action.data, state);
const warning = 'highly recommend setting initial state';
/**
 * gluePair升级版
 * @param rd 非必需
 * @param initialState 非必需
 * @returns {function(): {action: *, reducer: *, initState: *}}
 */
const gluer = function (rd, initialState) {
  // 默认生成action creator
  const actionCreator = data => data;
  let reducerFnc;
  let inState = initialState;
  // 没有传入任何参数则默认生成一个reducer
  if (arguments.length === 0) {
    // 默认值reducer
    reducerFnc = defaultReducer;
    console.warn(warning);
  } else if (arguments.length === 1) {
    // 会被当做初始值处理
    if (typeof rd !== 'function') {
      // 默认生成一个reducer
      reducerFnc = defaultReducer;
      // 初始值
      inState = rd;
    } else {
      reducerFnc = genReducer(rd);
      console.warn(warning);
    }
  } else {
    if (typeof rd !== 'function') {
      console.trace();
      throw new Error('first argument must be function');
    }
    reducerFnc = genReducer(rd);
    if (initialState === undefined) {
      console.warn(warning);
    }
  }
  // rd不是reducer函数格式，尽量减少redux概念直接暴露给glue-redux使用者
  const gf = function* () {
    const reducer = yield reducerFnc;
    const action = yield actionCreator;
    const initState = yield inState;
    return {
      reducer,
      action,
      initState,
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
