import {
  forPurposeKey,
  forPurposeValue,
  uniqueTypeConnect,
  defaultValueKey,
  glueActionFnFlag,
  glueActionFnFlagValue,
  distinguishPrefix,
} from './contants';
import { getType } from './getType';
import { glueAction } from './glueAction';
import { genReferencesMap } from './genProxy';

const defineTopNodeDefaultValue = (topNode, defaultValue) => {
  try {
    Object.defineProperty(topNode, defaultValueKey, {
      value: defaultValue,
      enumerable: false,
      writable: false,
      configurable: false,
    });
  } catch (e) {
    console.trace();
    throw new Error('该对象已被引用，请勿将同一对象应用到两个或者两个以上地方');
  }
};

/**
 * 生成顶层节点的reducer函数：将叶子节点的fnc进行重新包装成返回相应嵌套结构的state
 * @param k
 * @param redu
 * @returns {function(*, *=): {[p: string]: *}}
 */
const transformReducerToNestFnc = (k, redu) => {
  const kArr = k.split(uniqueTypeConnect);
  // 去除顶层节点，因为顶层节点会在 generateRealReducer进行函数包装
  kArr.shift();
  return kArr.reduceRight((pre, cur) => (state, ac) => {
    // 这里做了一个优化，如果节点返回值与传入state一致则不更新
    // return { ...state, [`${cur}`]: pre(state[`${cur}`], ac) }
    const curValue = state[cur];
    const temp = pre(curValue, ac);
    if (Object.is(temp, curValue)) {
      return state;
    }
    return { ...state, [cur]: temp };
  }, redu);
};

/**
 * 判断action creator是否已经处理过
 * @param actionFn
 * @returns {boolean}
 */
const isGlueAction = actionFn => actionFn[glueActionFnFlag] === glueActionFnFlagValue;
const actionError = (actionFn, obj) => {
  if (isGlueAction(actionFn)) {
    console.trace();
    console.error(obj);
    throw new Error('action creator 重复处理，请勿将同一对象应用到两个或者两个以上地方');
  }
};
/**
 * 递归对象，生成标准的action以及链接reducer对象的键值与action的type
 * @param msg
 * @param target
 * @returns {function(*=, *=, *=): {}}
 */
const degrade = (dispatch) => {
  const referencesMap = genReferencesMap();
  const fn = (curObj, keyStr = [], topNode = curObj, df = {}) => {
    if (getType(curObj) === '[object Object]') {
      // 设置整个对象的索引
      if (curObj === topNode && keyStr.length === 0) {
        referencesMap.set(curObj, '');
      }
      const keys = Object.keys(curObj);
      keys.forEach((key) => {
        const value = curObj[key];
        keyStr.push(key);
        const str = keyStr.join(uniqueTypeConnect);
        // 如果节点为function
        if (typeof value === 'function') {
          let newValue = value;
          actionError(value, curObj);
          // 如果该函数是节点维护函数，则获取对应的action creator和reducer function
          // 其他函数不做处理
          if (value[forPurposeKey] === forPurposeValue) {
            const iterator = value();
            const reducerStatus = iterator.next();
            const actionStatus = iterator.next(reducerStatus.value);
            const initStateStatus = iterator.next(actionStatus.value);
            const resultStatus = iterator.next(initStateStatus.value);
            const { action: actionFn, reducer, initState } = resultStatus.value;
            const tempType = key === str ? `${distinguishPrefix}${key}` : str;
            // 进行类似bindActionCreators的动作
            // 此处向action函数添加其对应的type属性，以便可以和其他以type为判断条件的中间件协同工作，比如redux-saga
            const action = glueAction({
              type: tempType,
              action: actionFn,
              dispatch,
            });
            newValue = action;
            // 重新赋值
            /* eslint no-param-reassign:0 */
            curObj[key] = action;
            /* eslint-disable no-param-reassign */
            // 设置初始值
            df[key] = initState;
            // topNode为顶层对象引用
            // 属性名连接形成的字符串作为对象键值赋值
            // 这里如果为第一级，curObj和topNode为同一个，则action和reducer相互覆盖了
            // 所以需要加以区分
            // 如果相等，则把reducer定义到action函数上
            const nodeReducer = transformReducerToNestFnc(str, reducer);
            if (key === str) {
              defineTopNodeDefaultValue(action, initState);
              Object.defineProperty(action, tempType, {
                value: nodeReducer,
                writable: false,
                enumerable: false,
                configurable: false,
              });
            } else {
              topNode[str] = nodeReducer;
            }
          }
          // 索引引用的键值路径
          referencesMap.set(newValue, str);
        } else if (getType(value) === '[object Object]') {
          // 索引引用的键值路径
          referencesMap.set(value, str);
          // p在此处作为是否为顶层节点的属性的标识
          let p = topNode;
          let deValue = df;
          let nextDefaultValue;
          // 如果是第一层键值
          if (p === curObj && keyStr.length === 1) {
            // 顶层节点引用
            p = value;
            // 顶层节点的默认值
            deValue = {};
            defineTopNodeDefaultValue(p, deValue);
            nextDefaultValue = deValue;
          } else {
            if (!deValue[key]) {
              deValue[key] = {};
            }
            nextDefaultValue = deValue[key];
          }
          fn(value, [...keyStr], p, nextDefaultValue);
        } else {
          // 索引引用的键值路径
          referencesMap.set(value, str);
          // 这里如果是顶层节点，会交给generateRealReducer包装成对应的顶层reducer
          if (df) {
            df[key] = value;
          }
        }
        // 中止后返回上一节点检索
        keyStr.pop();
      });
    } else {
      throw new Error('传入的待处理数据必须是对象!');
    }
    return {
      stagedStructure: curObj,
      referencesMap,
    };
  };
  return fn;
};
export { degrade };
export default degrade;
