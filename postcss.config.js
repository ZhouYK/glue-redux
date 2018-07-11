const autoprefixer = require('autoprefixer');
const fixFlexBugs = require('postcss-flexbugs-fixes');

module.exports = {
  plugins: [
    autoprefixer,
    fixFlexBugs,
  ],
};
