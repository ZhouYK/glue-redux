const devConfig = require('./webpack.config.dev');
const prodConfig = require('./webpack.config.prod');

const config = {
  development: devConfig,
  production: prodConfig,
};

module.exports = (env = 'production') => config[env];
