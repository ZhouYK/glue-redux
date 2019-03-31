import { duplicatedError } from '../constants';
import { genReferencesMap } from '../../src/genProxy';

describe('Proxy polyfill test', () => {
  test('when Proxy is not supported', () => {
    (window || global).Proxy = undefined;
    const map = genReferencesMap();
    map.set('name', 'lily');
    // 这里jest和Node以及浏览器运行结果不一样
    // 在node和浏览器中，对map做原型链延伸会报当前对象和map的方法不兼容
    // 而在jest中则不会有这个问题
    expect(map.get('name')).toBe('lily');
    expect(() => map.set('name', 'lilei')).toThrow(duplicatedError);
  });
  test('when Proxy is supported', () => {
    const map = genReferencesMap();
    map.set('name', 'lily');
    expect(map.get('name')).toBe('lily');
    expect(() => map.set('name', 'lilei')).toThrow(duplicatedError);
  });
});
