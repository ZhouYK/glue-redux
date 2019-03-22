import { duplicatedError } from '../constants';
import { genReferencesMap } from '../../src/genProxy';

describe('Proxy polyfill test', () => {
  test('when Proxy is not supported', () => {
    (window || global).Proxy = undefined;
    const map = genReferencesMap();
    map.set('name', 'lily');
    expect(() => map.set('name', 'lilei')).toThrow(duplicatedError);
  });
  test('when Proxy is supported', () => {
    const map = genReferencesMap();
    map.set('name', 'lily');
    expect(() => map.set('name', 'lilei')).toThrow(duplicatedError);
  });
});
