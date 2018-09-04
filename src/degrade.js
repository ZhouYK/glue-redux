import {
  forPurposeKey,
  forPurposeValue,
  uniqueTypeConnect,
  defaultValueKey,
  glueActionFnFlag,
  glueActionFnFlagValue,
} from './contants';
import { getType } from './getType';
import { glueAction } from './glueAction';

/**
 * 获取倒数第二层对象
 * @param keyStr
 * @param targetObj
 * @returns {*}
 */
const findActionParent = (keyStr, targetObj) => {
  const arr = keyStr.slice(1);
  let obj = targetObj;
  for (let i = 0; i < arr.length - 1; i += 1) {
    obj = obj[arr[i]];
  }
  return obj;
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
  return kArr.reduceRight((pre, cur) => (state, ac) => ({ ...state, [`${cur}`]: pre(state[`${cur}`], ac) }), redu);
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
  const fn = (obj, keyStr = [], parent, df) => {
    if (getType(obj) === '[object Object]') {
      const keys = Object.keys(obj);
      keys.forEach((key) => {
        const value = obj[key];
        keyStr.push(key);
        // if (getType(value) === '[object Function]') {
        // 如果是generator函数则检索中止
        if (typeof value === 'function') {
          if (parent) {
            actionError(value, obj);
            const str = keyStr.join(uniqueTypeConnect);
            let actionFn;
            let reducerFn;
            // generator函数是默认
            if (value[forPurposeKey] === forPurposeValue) {
              const iterator = value();
              const stepOne = iterator.next();
              const stepTwo = iterator.next(stepOne.value);
              const stepThree = iterator.next(stepTwo.value);
              const { action, reducer } = stepThree.value;
              actionFn = action;
              reducerFn = reducer;
              if (typeof action !== 'function') {
                console.trace();
                throw new Error('传入的action必须是函数');
              }
              if (typeof reducerFn !== 'function') {
                console.trace();
                throw new Error('传入的reducer必须是函数');
              }
            } else {
              // 普通函数会被当成单纯的action
              actionFn = value;
            }
            // 找到原始actions对象中，当前key值所在的对象
            const upperNode = findActionParent(keyStr, parent);
            // 如果为action，则进行类似bindActionCreators的动作
            const action = glueAction((...args) => {
              const actionEntity = actionFn(...args);
              if (getType(actionEntity) === '[object Function]') {
                return dispatch(actionEntity);
              }
              // 组装action实体，触发action
              return dispatch({ type: str, data: actionEntity });
            });
            upperNode[key] = action;
            if (reducerFn) {
              // 如果为reducer，则直接用属性联结行程的字符串作为对象键值赋值
              // parent为顶层对象引用
              /* eslint-disable no-param-reassign */
              df[key] = reducerFn();
              parent[str] = transformReducerToNestFnc(str, reducerFn);
            }
          }
          // 中止后返回上一节点检索
          keyStr.pop();
        } else if (getType(value) === '[object Object]') {
          // p在此处作为是否为顶层节点的属性的标识
          let p = parent;
          let deValue = df;
          let nextDefaultValue;
          if (!p && !deValue) {
            // 顶层节点引用
            p = value;
            // 顶层节点的默认值
            deValue = p.defaultValue || {};
            try {
              Object.defineProperty(p, defaultValueKey, {
                value: deValue,
                enumerable: false,
                writable: false,
                configurable: false,
              });
            } catch (e) {
              console.trace();
              throw new Error('该对象已被引用，请勿将同一对象应用到两个或者两个以上地方');
            }
            nextDefaultValue = deValue;
          } else {
            if (!deValue[key]) {
              deValue[key] = {};
            }
            nextDefaultValue = deValue[key];
          }
          fn(value, [...keyStr], p, nextDefaultValue);
          // 返回到顶层节点后，推出节点重新检索兄弟顶层节点
          keyStr.shift();
        } else {
          // 这里如果是顶层节点，会交给generateRealReducer包装成对应的顶层reducer
          if (df) {
            df[key] = value;
          }
          keyStr.pop();
        }
      });
    } else {
      throw new Error('传入的待处理数据必须是对象!');
    }
    return obj;
  };
  return fn;
};
export { degrade };
export default degrade;
