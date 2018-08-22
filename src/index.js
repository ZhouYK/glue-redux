import { uniqueTypeConnect } from './contants';
import { degrade } from './degrade';

/**
 * 解构glue对象，生成对应的reducer以及action的调用函数
 * @param dispatch
 * @returns {function(*=): {reducers: *, actions: (function(*=, *=, *=): {})}}
 */
const destruct = ({ dispatch }) => {
  /**
   * 复制并删除原始对象中的衍生属性，保留原生属性
   * 这里衍生属性主要是type和对应的reducer
   * @param obj
   * @param tk
   * @returns {*}
   */
  const deleteDerivedProps = (obj, tk) => {
    /* eslint-disable no-param-reassign */
    Object.keys(obj).forEach((key) => {
      if (key.startsWith(`${tk}${uniqueTypeConnect}`)) {
        delete obj[key];
      }
    });
  };
  /**
   * 根据原始的reducer对象去生成函数reducer，处理顶层节点
   * @param originReducer
   * @returns {{[p: string]: *}}
   */
  const generateRealReducer = originReducer => Object.keys(originReducer).reduce((pre, key) => {
    // 原型上的属性无法扩展复制
    const targetGlue = originReducer[key];
    let fnc;
    if (typeof targetGlue === 'function') {
      // todo 顶层节点为函数时会被作为reducer，此reducer没有特定的action，会被所有的触发
      fnc = targetGlue;
    } else if (typeof targetGlue === 'object') {
      const value = { ...targetGlue };
      const { defaultValue } = targetGlue;
      // 定义顶层reducer，根据action type调用对应的子reducer
      fnc = (state = defaultValue, ac) => {
        const { type } = ac;
        // 顶层节点存储着每个叶子节点的reducer
        // 每个叶子节点的action保留着对应的type
        const reducerFnc = value[type];
        if (reducerFnc) {
          // 一但调用，会返回新的值
          return reducerFnc(state, ac);
        }
        // 没有对应的reducer，直接返回原值
        return state;
      };
    } else {
      fnc = () => targetGlue;
    }
    deleteDerivedProps(targetGlue, key);
    return { ...pre, [`${key}`]: fnc };
  }, {});

  const deriveActionsAndReducers = (structure) => {
    const stagedStructure = degrade(dispatch)(structure);
    // reducer组成的对象，将来传给combinereducers
    const reducers = generateRealReducer(stagedStructure);
    const actions = stagedStructure;
    return {
      reducers,
      actions,
    };
  };
  return deriveActionsAndReducers;
};

export { default as createGlue } from './createGlue';
export { default as gluePair } from './gluePair';
export { default as gluer } from './gluer';
export { destruct };
export default destruct;
