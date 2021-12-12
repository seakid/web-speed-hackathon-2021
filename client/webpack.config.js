const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const webpack = require('webpack');

const SRC_PATH = path.resolve(__dirname, './src');
const PUBLIC_PATH = path.resolve(__dirname, '../public');
const UPLOAD_PATH = path.resolve(__dirname, '../upload');
const DIST_PATH = path.resolve(__dirname, '../dist');

/** @type {import('webpack').Configuration} */
const config = {
  devServer: {
    static: [
      {
        directory: PUBLIC_PATH,
      },
      {
        directory: UPLOAD_PATH,
      },
    ],
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
    static: [PUBLIC_PATH, UPLOAD_PATH],
  },
  entry: {
    main: [
      'regenerator-runtime/runtime',
      path.resolve(SRC_PATH, './index.css'),
      path.resolve(SRC_PATH, './index.jsx'),
    ],
    corejs: 'core-js',
    jquerybinarytransport: 'jquery-binarytransport',
    buildinfo: path.resolve(SRC_PATH, './buildinfo.js'),
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
  output: {
    filename: 'scripts/[name].js',
    path: DIST_PATH,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      AudioContext: ['standardized-audio-context', 'AudioContext'],
      Buffer: ['buffer', 'Buffer'],
      'window.jQuery': 'jquery',
    }),
    new webpack.EnvironmentPlugin({
      BUILD_DATE: new Date().toISOString(),
      // Heroku では SOURCE_VERSION 環境変数から commit hash を参照できます
      COMMIT_HASH: process.env.SOURCE_VERSION || '',
      NODE_ENV: process.env.NODE_ENV,
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: "styles/[id].css",
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(SRC_PATH, './index.html'),
      scriptLoading: 'defer',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(SRC_PATH, '_redirects'),
          to: '',
        },
        {
          from: '../public/fonts',
          to: 'fonts'
        },
        {
          from: '../public/sprites',
          to: 'sprites'
        },
        {
          from: '../public/robots.txt',
          to: ''
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
    },
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
};

if (process.env.NODE_ENV !== 'production'){
  module.exports.devtool = 'inline-source-map';
}

module.exports = config;
