import { getType } from './getType';

/**
 * @deprecated 造成性能额外的消耗，作用不大，在未来版本会去掉
 * @param module
 * @param defaultValue
 * @returns {any}
 */
const createGlue = (module, defaultValue = {}) => {
  console.warn('通过createGlue传入的defaultValue将不会生效，请在reducer里面设置State的默认值');
  if (getType(module) !== '[object Object]') throw new Error('请传入结构对象');
  const no = Object.create({
    defaultValue,
    ...module,
  }, Object.keys(module).reduce((pre, cur) => {
    /* eslint-disable no-param-reassign */
    const value = module[cur];
    // 如果顶层属性类型为generator函数，则必须有默认值
    pre[cur] = {
      writable: true,
      configurable: true,
      value,
      enumerable: true,
    };
    return pre;
  }, {}));
  return no;
};

export default createGlue;
