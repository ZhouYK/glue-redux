const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { commonConfig, contentPath } = require('./common.config');
const packageObj = require('../package.json');

const publicPath = '/'; // 可自定义
const entry = Object.assign({
  index: ['./example/index.jsx'],
}, commonConfig.entry);
const config = {
  devtool: 'eval-source-map',
  mode: 'development',
  entry,
  target: commonConfig.target,
  output: Object.assign({}, commonConfig.output, {
    path: contentPath,
    publicPath,
  }),
  module: {
    rules: [{
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    }, ...commonConfig.module.rules],
  },
  resolve: commonConfig.resolve,
  watchOptions: {
    aggregateTimeout: 400,
    poll: 1000,
    ignored: /node_modules/,
  },
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: '8888',
    disableHostCheck: true,
    contentBase: contentPath,
    historyApiFallback: true,
    stats: 'minimal',
    compress: true,
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({
      title: packageObj.name,
      template: './example/index.html',
      filename: 'index.html',
      inject: true,
    }),
    ...commonConfig.plugins,
  ],
};
module.exports = config;
