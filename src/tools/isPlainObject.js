import getType from './getType';

const isPlainObject = target => getType(target) === '[object Object]';
export default isPlainObject;
