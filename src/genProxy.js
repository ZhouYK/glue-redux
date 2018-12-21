const genProxy = (obj, handler) => new Proxy(obj, handler);

export const genReferencesMap = () => {
  const map = new Map();
  const handler = {
    get(target, prop) {
      if (prop === 'set') {
        return function set(key, value) {
          if (target.has(key)) {
            console.trace();
            throw new Error(`reference: the value of "${value}" is duplicated.please confirm the reference is applied in only one place!`);
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
