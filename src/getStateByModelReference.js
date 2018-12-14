import { uniqueTypeConnect } from './contants';

const getStateByModelReference = (referencesMap, getState) => (model) => {
  console.log(referencesMap.has(1));
  if (!referencesMap.has(model)) {
    return undefined;
  }
  const pathStr = referencesMap.get(model);
  const currentState = getState();
  // 返回整个state
  if (pathStr === '') {
    return currentState;
  }
  const keys = pathStr.split(uniqueTypeConnect);
  return keys.reduce((pre, cur) => pre[cur], currentState);
};

export default getStateByModelReference;
