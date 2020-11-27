import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const getPlugins = function (environment, isDev) {
  return [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'app/index-dev.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.PROFILE':JSON.stringify('development'),
      __DEV__: isDev
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractCssChunks({
      filename: 'assets/[name]-[contenthash].css'
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
    app: [
      'webpack-hot-middleware/client?reload=true',
      path.join(__dirname, 'app/index.js')
    ]
  }
};

const getLoaders = function () {
    return [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        include: [
          path.join(__dirname, "app")
        ],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: [
              'transform-runtime',
              'add-module-exports',
              'transform-decorators-legacy',
              'babel-plugin-transform-strict-mode'
            ],
            presets: ['es2015', 'react', 'stage-0', 'react-hmre']
          }
        }
      },
      {test: /\.json$/, use: {loader: 'json-loader'}},
      {test: /\.css|scss$/, use: [ExtractCssChunks.loader, 'css-loader']},
      {test: /\.(ttf|eot|mp4)/, use: {loader: 'file-loader', options: {name: 'assets/[name]-[hash].[ext]', limit: 819200}}},
      {test: /\.(otf|woff|woff2)/, use: {loader: 'url-loader', options: {name: 'assets/[name]-[hash].[ext]', limit: 819200}}},
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {name: 'assets/[name]-[hash].[ext]', limit: 819200}
        }
      }];
  }
;

export default {
  name: 'app',
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: getEntry(),
  output: {
    path: path.join(__dirname, 'app/'),
    filename: 'assets/[name]-[hash].js',
    publicPath: '/'
  },
  module: {
    loaders: getLoaders()
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
    modules: [path.resolve(__dirname, "app"), "node_modules"],
    extensions: ['.json', '.js', '.jsx'],
    unsafeCache: true
  },
  plugins: getPlugins(),
  target: 'web'
};
