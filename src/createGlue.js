import { getType } from './getType';

const createGlue = (module, defaultValue = {}) => {
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
  console.log('新对象', no);
  return no;
};

export default createGlue;
