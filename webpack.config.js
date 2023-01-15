const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  devServer: {
    open: ['/public'],
  }
};
