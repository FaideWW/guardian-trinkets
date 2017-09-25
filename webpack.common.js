const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: [
      'react-hot-loader/patch',
      './src/index.js',
    ],
    print: './src/print.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname),
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'], include: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader?modules'], exclude: /node_modules/ },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
    }),
    new CleanWebpackPlugin(['dist']),
  ],
};
