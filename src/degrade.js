import {
  gluerUniqueFlagKey,
  gluerUniqueFlagValue,
  uniqueTypeConnect,
  defaultValueKey,
  syncActionFnFlag,
  syncActionFnFlagValue,
  glueStatePrefix,
  development,
} from './constants';
import { glueAction } from './glueAction';
import { genReferencesMap } from './genProxy';
import isPlainObject from './tools/isPlainObject';

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
    throw new Error(`the defaultValue of "${topNode}" is duplicated defined!`);
  }
};
/**
 * 从action.data中筛选出，kes对应的数据
 * @param actionData
 * @param kes
 * @returns {{result: null, flag: boolean}}
 */
const getSubState = (actionData, kes) => {
  let result = actionData;
  const final = {
    flag: false,
    result: null,
  };
  const { length } = kes;
  for (let i = 0; i < length; i += 1) {
    if (isPlainObject(result)) {
      const keys = Object.keys(result);
      if (keys.includes(kes[i])) {
        result = result[kes[i]];
        if (i === length - 1) {
          final.flag = true;
          final.result = result;
        }
      }
    }
  }
  return final;
};

/**
 * 生成顶层节点的reducer函数：将叶子节点的fnc进行重新包装成返回相应嵌套结构的state
 * @param k
 * @param redu
 * @returns {function(*, *=): {[p: string]: *}}
 */
const transformReducerToNestFnc = (k, redu, shift = true) => {
  const kArr = k.split(uniqueTypeConnect);
  if (shift) {
    // 去除顶层节点，因为顶层节点会在 generateRealReducer进行函数包装
    kArr.shift();
  }
  return kArr.reduceRight((pre, cur) => (state, ac) => {
    // 这里做了一个优化，如果节点返回值与传入state一致则不更新
    // return { ...state, [`${cur}`]: pre(state[`${cur}`], ac) }
    const curValue = state[cur];
    const temp = pre(curValue, ac);
    if (process.env.NODE_ENV === development) {
      if (Object.is(temp, undefined)) {
        console.error(`Warning：the reducer handling "${ac.type}" has returned "undefined"！`);
      }
    }
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
const isGlueAction = actionFn => (actionFn[syncActionFnFlag] === syncActionFnFlagValue);
const actionError = (actionFn, obj, key) => {
  if (isGlueAction(actionFn)) {
    console.trace();
    throw new Error(`the "${key}" of ${obj}, which only can be processed only once, is already processed`);
  }
};
/**
 * 递归对象，生成标准的action以及链接reducer对象的键值与action的type
 * @returns {function(*=, *=, *=): {}}
 * @param dispatch
 */
const degrade = (dispatch) => {
  const referencesMap = genReferencesMap();
  const fn = (curObj, keyStr = [], topNode = curObj, df = {}, originalTopNode = null, originalAcType = '') => {
    if (isPlainObject(curObj)) {
      // 设置整个对象的索引
      // 整个model的引用
      // 第一次执行时
      if (curObj === topNode && keyStr.length === 0) {
        referencesMap.set(curObj, '');
      }
      const keys = Object.keys(curObj);
      keys.forEach((key) => {
        const value = curObj[key];
        if (!Object.is(value, undefined) && !Object.is(value, null)) {
          if (process.env.NODE_ENV === development) {
            // ⚠️
            actionError(value, curObj, key);
          }
          keyStr.push(key);
          const str = keyStr.join(uniqueTypeConnect);
          // 如果是同步节点，则获取对应的action creator和reducer function
          if (value[gluerUniqueFlagKey] === gluerUniqueFlagValue) {
            const { action: actionFn, reducer, initState } = value();
            const syncActionType = key === str ? key : str;
            // 进行类似bindActionCreators的动作
            // 此处向action函数添加其对应的type属性，以便可以和其他以type为判断条件的中间件协同工作，比如redux-saga
            const acType = `${glueStatePrefix}${syncActionType}`;
            const action = glueAction({
              type: acType,
              action: actionFn,
              dispatch,
            });
            // 重新赋值
            /* eslint no-param-reassign:0 */
            curObj[key] = action;
            /* eslint-disable no-param-reassign */
            // 设置初始值
            // 当初始值作为数据来源时，引用会冲突，需要进行复制
            df[key] = isPlainObject(initState) ? { ...initState } : initState;
            // topNode为顶层对象引用
            // 属性名连接形成的字符串作为对象键值赋值
            // 这里如果为第一级，curObj和topNode为同一个，则action和reducer相互覆盖了
            // 所以需要加以区分
            // 如果相等，则把reducer定义到action函数上
            const nodeReducer = transformReducerToNestFnc(str, reducer);
            if (key === str) {
              defineTopNodeDefaultValue(action, df[key]);
              Object.defineProperty(action, acType, {
                value: nodeReducer,
                writable: false,
                enumerable: false,
                configurable: false,
              });
            } else if (!originalTopNode) {
              topNode[acType] = nodeReducer;
            } else {
              originalTopNode[acType] = nodeReducer;
              const originalNodeReducer = originalTopNode[originalAcType];
              // eslint-disable-next-line no-useless-escape
              const subKeysStr = acType.replace(new RegExp(`${originalAcType}\.`), '');
              const keyArr = subKeysStr.split(uniqueTypeConnect);
              // 重写reducer
              originalTopNode[originalAcType] = (state, ac) => {
                const { flag, result } = getSubState(ac.data, keyArr);
                let stateInit = state;
                if (flag) {
                  stateInit = nodeReducer(state, { ...ac, data: result });
                }
                return originalNodeReducer(stateInit, ac);
              };
            }
            // 索引引用的键值路径
            referencesMap.set(action, str);
            // 遍历初始值，获取初始值中的结构信息
            // eslint-disable-next-line max-len
            const initStateDestructure = fn(initState, [...keyStr], initState, df[key], originalTopNode || topNode, acType);
            if (initStateDestructure) {
              // 在gluer中已经进行了一次赋值，这次是真的生效
              Object.keys(initState).forEach((propName) => {
                Object.defineProperty(action, propName, {
                  value: initState[propName],
                  writable: false,
                  enumerable: true,
                  configurable: true,
                });
              });
            }
          } else if (isPlainObject(value)) {
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
            if (process.env.NODE_ENV === development) {
              console.error('Warning: the constant node: state.%s, %O.Directly placing constants in model is discouraged, because this leads data management to be confused. Leaf nodes except defined By "gluer" will not be traced. So please wrap it with "gluer".', keyStr.join('.'), value);
            }
            // 不追踪非普通对象且非gluer声明的叶子节点
            // 索引引用的键值路径
            // referencesMap.set(value, str);
            if (df) {
              df[key] = value;
            }
          }
          // 中止后返回上一节点检索
          keyStr.pop();
        }
      });
    } else if (!originalTopNode) {
      throw new Error('the argument muse be plain object!');
    } else {
      // 非普通对象的initialState暂不处理
      return null;
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
