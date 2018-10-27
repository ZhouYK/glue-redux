import { uniqueTypeConnect } from './contants';

const getStateByModelReference = (referencesMap, getState) => (model) => {
  const pathStr = referencesMap.get(model);
  const keys = pathStr.split(uniqueTypeConnect);
  const currentState = getState();
  return keys.reduce((pre, cur) => pre[cur], currentState);
};

export default getStateByModelReference;
