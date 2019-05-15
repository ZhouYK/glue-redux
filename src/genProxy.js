const genProxy = (obj, handler) => new Proxy(obj, handler);
const errorTips = (key, value) => `this node [path: ${value}, value: ${key}] had been traced！the [value: ${key}] as a key in the inner map already exists! please check it whether it is used in more than one place`;

export const genReferencesMap = () => {
  const map = new Map();
  if ((window || global).Proxy) {
    const handler = {
      get(target, prop) {
        if (prop === 'set') {
          return function set(key, value) {
            if (target.has(key)) {
              throw new Error(errorTips(key, value));
            }
            return target.set(key, value);
          };
        }
        if (typeof target[prop] === 'function') {
          return target[prop].bind(target);
        }
        return target[prop];
      },
    };
    return genProxy(map, handler);
  }
  const wrapMap = {};
  wrapMap.set = function (key, value) {
    if (map.has(key)) {
      throw new Error(errorTips(key, value));
    }
    return map.set(key, value);
  };
  wrapMap.get = function (key) {
    return map.get(key);
  };
  wrapMap.has = function (key) {
    return map.has(key);
  };
  return wrapMap;
};
