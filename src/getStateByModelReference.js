import { uniqueTypeConnect } from './constants';

const getStateByModelReference = (referencesMap, getState) => (model) => {
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
