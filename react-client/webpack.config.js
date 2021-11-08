var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: [
    path.join(__dirname, './src/index.js')
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{ loader: 'babel-loader', options: { presets: ['@babel/preset-env', '@babel/react'] } }],
    },
    { 
      test: /\.(less|css|scss)$/, 
      use: ['style-loader', 'css-loader', 'less-loader',] 
    }
    ]
  },
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, '/public'),
    // historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
}