const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = env => {
  const environment = env.environment;

  return {
    mode: environment,
    entry: './app/index.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'index_bundle.[hash].js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader' // creates style nodes from JS strings
            },
            {
              loader: 'css-loader' // translates CSS into CommonJS
            },
            {
              loader: 'less-loader' // compiles Less to CSS
            }
          ]
        },
        {
          test: /\.(jpe?g|png|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
          loader: 'url-loader?limit=100000'
        }
      ]
    },
    devServer: {
      historyApiFallback: true
    },
    plugins: [
      new CleanWebpackPlugin(),
      new Dotenv(),
      new HtmlWebpackPlugin({
        template: './app/index.html'
      })
    ]
  };
};
