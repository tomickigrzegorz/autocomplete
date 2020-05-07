const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function prodPlugin(plugin, mode) {
  return mode === 'development' ? () => { } : plugin;
}

module.exports = (env, { mode }) => {
  const inDev = mode === 'development';
  return {
    devtool: inDev ? 'source-map' : 'none',
    entry: {
      Autosuggest: './sources/js/Autosuggest.js',
    },
    output: {
      path: path.resolve(__dirname, 'docs'),
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
            inDev ? 'style-loader' : MiniCssExtractPlugin.loader,
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
        mode
      ),
      prodPlugin(
        new CopyPlugin([
          {
            from: 'static/_country.json',
            to: './'
          },
          {
            from: 'static/_persons.json',
            to: './'
          },
        ]),
        mode
      ),
      new MiniCssExtractPlugin({
        filename: './[name].css',
      }),
      new HtmlWebPackPlugin({
        filename: 'index.html',
        template: './sources/index.html',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        },
      }),
      // prodPlugin(
      //   new BundleAnalyzerPlugin({
      //     openAnalyzer: true,
      //     // generateStatsFile: true,
      //   }),
      //   mode
      // ),
    ],
  };
};
