import devConfig from './webpack.config.dev.babel';
import prodConfig from './webpack.config.prod.babel';

const config = {
  development: devConfig,
  production: prodConfig,
};

export default (env = 'production') => config[env];
