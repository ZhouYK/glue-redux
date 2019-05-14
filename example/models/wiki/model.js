/* eslint-disable */
import { gluer } from '../../../src';

const papa = gluer((data, state) => {
  // 为了简化示例，传入数据即为最新数据
  // 下同
  return data;
}, { name: '张明', age: 48 });

const mama = gluer((data, state) => {
  return data;
}, { name: '李娟', age: 48 });

const me = gluer((data, state) => {
  return data;
}, { name: '张小飞', age: 19 });

const family = gluer((data, state) => {
  return { ...state, count: data.count };
}, {
  papa,
  mama,
  me,
  count: 3
});

export default family;
