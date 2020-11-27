import config from "./config/config";

const utils = {
  getRoutePath: path => path ? config.routePath + path : config.routePath,
};

export default utils;
