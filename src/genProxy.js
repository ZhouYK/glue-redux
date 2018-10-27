const genProxy = (obj, handler) => new Proxy(obj, handler);

export const genReferencesMap = () => {
  const map = new Map();
  const handler = {
    get(target, prop) {
      if (prop === 'set') {
        return function set(key, value) {
          if (target.has(key)) {
            throw new Error(`reference: ${value} duplicated，index path: ${key}.please confirm the reference is applied in only one place!`);
          }
          return target.set(key, value);
        };
      }
      return target[prop];
    },
  };
  return genProxy(map, handler);
};
