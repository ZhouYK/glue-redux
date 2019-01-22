import {
  uniqueTypeConnect, defaultValueKey,
} from './constants';
import getStateByModelReference from './getStateByModelReference';
import { degrade } from './degrade';
import validateInOperator from './validate/inOperatorValidate';

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
  // 拥有默认标识的则为可处理节点
  if (validateInOperator(defaultValueKey, targetGlue)) {
    let value;
    const getReducer = type => value[type];
    const defaultValue = targetGlue[defaultValueKey];
    if (typeof targetGlue === 'function') {
      value = targetGlue;
    } else if (typeof targetGlue === 'object') {
      // 如果不展开复制的话，会被deleteDerivedProps 删掉 reducer
      value = { ...targetGlue };
      deleteDerivedProps(targetGlue, key);
    }
    // 定义顶层reducer，根据action type调用对应的子reducer
    fnc = (state = defaultValue, ac) => {
      const { type } = ac;
      // 顶层节点存储着每个叶子节点的reducer
      // 每个叶子节点的action保留着对应的type
      // 如果value为函数，那么需要用额外type去索引reducer

      const reducerFnc = getReducer(type);
      if (reducerFnc) {
        // 一但调用，会返回新的值
        return reducerFnc(state, ac);
      }
      // 没有对应的reducer，直接返回原值
      return state;
    };
  } else if (typeof targetGlue === 'function') {
    // 顶层节点为函数时会被作为reducer，此reducer没有特定的action，会被所有的触发
    fnc = targetGlue;
  } else {
    fnc = () => targetGlue;
  }
  return { ...pre, [`${key}`]: fnc };
}, {});

/**
 * 解构glue对象，生成对应的reducer以及action的调用函数
 * @param dispatch
 * @returns {function(*=): {reducers: *, actions: (function(*=, *=, *=): {})}}
 */
const destruct = store => (structure) => {
  const { dispatch, getState } = store;
  const { stagedStructure, referencesMap } = degrade(dispatch)(structure);
  // reducer组成的对象，将来传给combinereducers
  const reducers = generateRealReducer(stagedStructure);
  // 经过degrade的模型对象
  const actions = stagedStructure;
  const referToState = getStateByModelReference(referencesMap, getState);
  const hasModel = model => referencesMap.has(model);
  return {
    reducers,
    actions,
    referToState,
    hasModel,
  };
};

export { default as gluer } from './gluer';
export { destruct };
export default destruct;
