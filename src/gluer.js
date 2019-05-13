import { gluerUniqueFlagKey, gluerUniqueFlagValue, development } from './constants';

const defaultReducer = (state, action) => action.data;
const genReducer = rd => (state, action) => rd(action.data, state);
const warning = 'highly recommend setting initial state';
/**
 * 同步节点生成函数
 * @param rd 非必需
 * @param initialState 非必需
 * @returns {function(): {action: *, reducer: *, initState: *}}
 */
const gluer = (...args) => {
  const [rd, initialState] = args;
  // 默认生成action creator
  const actionCreator = (...params) => {
    if (process.env.NODE_ENV === development) {
      if (params.length === 0) {
        console.warn('you have dispatched an action whose data is undefined！');
      } else if (params.length > 1) {
        console.warn(`you have passed "${params}" into the action, only the first param is needed`);
      }
    }
    return params[0];
  };
  let reducerFnc;
  let initState = initialState;
  // 没有传入任何参数则默认生成一个reducer
  if (args.length === 0) {
    // 默认值reducer
    reducerFnc = defaultReducer;
    console.warn(warning);
  } else if (args.length === 1) {
    // 会被当做初始值处理
    if (typeof rd !== 'function') {
      // 默认生成一个reducer
      reducerFnc = defaultReducer;
      // 初始值
      initState = rd;
    } else {
      reducerFnc = genReducer(rd);
      console.warn(warning);
    }
  } else {
    if (typeof rd !== 'function') {
      throw new Error('first argument must be function');
    }
    reducerFnc = genReducer(rd);
    if (process.env.NODE_ENV === development) {
      if (initialState === undefined) {
        console.warn(warning);
      }
    }
  }
  // rd不是reducer函数格式，尽量减少redux概念直接暴露给glue-redux使用者
  // 为了和最终的使用行为保持一致，所以返回一个普通函数
  const gf = () => ({
    reducer: reducerFnc,
    action: actionCreator,
    initState,
  });
  Object.defineProperty(gf, gluerUniqueFlagKey, {
    value: gluerUniqueFlagValue,
    writable: false,
    configurable: false,
    enumerable: false,
  });
  return gf;
};
export default gluer;
