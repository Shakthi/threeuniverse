var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    universe:'./src/index.js',
    parts:'./src/partBundle.js'
  },
  output: {
    

    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: "/build/",
    libraryTarget: 'umd',
    library: '[name]'

  }
};

