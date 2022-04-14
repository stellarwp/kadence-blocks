const { parallel, series } = require('gulp');

const jsTasks = require('./gulp/tasks/js');
const stylesTasks = require('./gulp/tasks/styles');
const { clean } = require('./gulp/tasks/clean');
const { zip } = require('./gulp/tasks/zip');
const { webpack } = require('./gulp/tasks/webpack');
const { watch } = require('./gulp/tasks/watch');

exports.clean = clean;
exports.zip = zip;
exports.webpack = webpack;
exports.watch = watch;

exports.standaloneJs = jsTasks.standaloneJs;
exports.settingsJs = jsTasks.settingsJs;
exports.vendorJs = jsTasks.vendorJs;
exports.buildJs = jsTasks.buildJs;
exports.js = jsTasks.js;

exports.blocksStyles = stylesTasks.blocksStyles;
exports.settingsStyles = stylesTasks.settingsStyles;
exports.vendorStyles = stylesTasks.vendorStyles;
exports.buildStyles = stylesTasks.buildStyles;
exports.styles = stylesTasks.styles;

exports.vendor = parallel(jsTasks.vendorJs, stylesTasks.vendorStyles);
exports.build = parallel(jsTasks.js, stylesTasks.styles, webpack);
