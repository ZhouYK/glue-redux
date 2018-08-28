const glueActionFnFlag = 'glueActionFnFlag';
const glueActionFnFlagValue = 'glueActionFnFlagValue';

const glueAction = (actionCreator) => {
  if (typeof actionCreator !== 'function') throw new Error('请传入action生成函数');
  Object.defineProperty(actionCreator, glueActionFnFlag, {
    value: glueActionFnFlagValue,
    configurable: false,
    writable: false,
    enumerable: false,
  });
};

export default glueAction;
