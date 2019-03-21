/**
 * Created by ink on 2018/4/4.
 */
const path = require('path');


const contentPath = path.resolve(__dirname, '../umd');
// 这里可以路径前一个名称作为页面区分
const entry = {
};
const rules = [{
  enforce: 'pre',
  test: /\.(jsx?)|(tsx?)$/,
  exclude: /node_modules/,
  use: ['eslint-loader'],
}, {
  enforce: 'pre',
  test: /\.js?$/,
  exclude: /node_modules/,
  use: ['source-map-loader'],
}, {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: ['babel-loader'],
}];
const plugins = [

];
const config = {
  entry,
  target: 'web',
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins,
};
module.exports = { commonConfig: config, contentPath };
