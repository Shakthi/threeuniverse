var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    

    path: path.join(__dirname, 'build'),
    filename: 'universe.bundle.js',
    publicPath: "/build/",
    libraryTarget: 'umd',
    library: 'universe'

  }
};

