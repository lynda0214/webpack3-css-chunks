const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const getPlugins = function () {
  return [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'app/index-demo.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: Infinity,
      filename: 'assets/common-[chunkhash].js'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        PROFILE: JSON.stringify('demo'),
        WEB_ROUTE: JSON.stringify(process.env.webRoute),
        SCM_INFO: JSON.stringify(process.env.scminfo),
        WEB_VER: JSON.stringify(process.env.webver)
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new ExtractCssChunks({
      filename: 'assets/[name]-[contenthash].css'
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      mangle: true,
      sourcemap: false,
      debug: false,
      minimize: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    })];
};


const getEntry = function () {
  return {
    common: ['core-js', 'raf', 'react', 'react-dom', 'isomorphic-fetch', 'react-router', 'redux', 'react-redux', 'redux-thunk', 'react-router-redux', 'redux-persist', 'react-lazyload', 'react-loader', 'react-intl'],
    app: [path.join(__dirname, 'app/index.js')]
  }
};

const getLoaders = function (isDev) {
  return [
    {
      test: /\.(js|jsx)?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        plugins: [
          'transform-runtime',
          'add-module-exports',
          'transform-decorators-legacy',
          'babel-plugin-transform-strict-mode',
          'transform-react-constant-elements',
          'transform-react-remove-prop-types',
          'transform-react-pure-class-to-function'
        ],
        presets: ['es2015', 'react', 'stage-0']
      }
    },
    {test: /\.json$/, loader: 'json-loader'},
    {test: /\.css|scss$/, use: [ExtractCssChunks.loader, 'css-loader']},
    {test: /\.(ttf|eot|mp4)/, loader: 'file-loader', query: {name: 'assets/[name]-[hash].[ext]', limit: 8192}},
    {test: /\.(otf|woff|woff2)/, loader: 'url-loader', query: {name: 'assets/[name]-[hash].[ext]', limit: 8192}},
    {
      test: /\.(png|jpg|jpeg|gif|svg)/,
      loader: 'url-loader',
      query: {name: 'assets/[name]-[hash].[ext]', limit: 8192}
    }
  ];
};

module.exports = {
  name: 'app',
  devtool: 'hidden-source-map',
  entry: getEntry(),
  output: {
    path: path.join(__dirname, process.env.webRoute ? process.env.webRoute + '/' : 'web/'),
    filename: 'assets/[name]-[chunkhash]-bundle.js',
    chunkFilename: "assets/[name]-[chunkhash]-chunk.js",
    publicPath: process.env.assetsCdn ? (process.env.assetsCdn + '/') : '/web/'
  },
  module: {
    loaders: getLoaders()
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
    modules: [path.resolve(__dirname, "app"), "node_modules"],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: getPlugins(),
  target: 'web'
};
