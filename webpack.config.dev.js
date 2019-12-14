const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    chrome: "58",
                    ie: "11"
                  }
                }
              ],
            ]
          }
        }
      },
    ]
  },

};