const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

function prodPlugin(plugin, argv) {
  return argv.mode === 'production' ? plugin : () => {};
}

module.exports = (env, argv) => {
  return {
    devtool: argv.mode === 'production' ? 'none' : 'eval-source-map',
    entry: {
      Autosuggest: './sources/js/Autosuggest.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: './[name].js',
      library: '[name]',
      libraryExport: 'default',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            argv.mode === 'development'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new Dotenv(),
      prodPlugin(
        new CleanWebpackPlugin({
          verbose: true,
        }),
        argv
      ),
      new MiniCssExtractPlugin({
        filename: './[name].css',
      }),
      new HtmlWebPackPlugin({
        filename: 'index.html',
        template: './sources/index.html',
      }),
    ],
  };
};
