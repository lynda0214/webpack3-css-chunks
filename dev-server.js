import express from "express";
import http from "http";
const morgan = require("morgan");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.dev.babel");

const compiler = webpack(webpackConfig.default);
const middleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.default.output.publicPath,
  quiet: false,
  hot: true,
  inline: true,
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

const app = express();
app.use(morgan('dev'));
app.use('/web', express.static(__dirname + '/app'));
app.use(require('webpack-hot-middleware')(compiler));
app.use(middleware);
app.use('/:path?/:params1?/:params2?/:params3?/:params4?/:params5?', middleware);
const server = http.createServer(app);
server.listen(80);
