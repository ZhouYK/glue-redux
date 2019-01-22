const genProxy = (obj, handler) => new Proxy(obj, handler);

export const genReferencesMap = () => {
  const map = new Map();
  const handler = {
    get(target, prop) {
      if (prop === 'set') {
        return function set(key, value) {
          if (target.has(key)) {
            throw new Error(`this node [path: ${value}, value: ${key}] had been traced, please check it whether it is used in more than one place or it is circular reference!`);
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
};
