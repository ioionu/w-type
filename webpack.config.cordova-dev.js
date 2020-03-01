const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'cordova/www'),
  },
  plugins: [
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
    }),
    new CopyPlugin([{
      from: 'src/index-cordova.html',
      to: 'index.html',
    },
    {
      from: 'src/index-cordova.js',
      to: 'index-cordova.js',
    }]),
  ],
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    chrome: '58',
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },

};
