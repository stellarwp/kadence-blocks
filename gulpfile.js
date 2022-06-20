const { parallel, series } = require('gulp');

const jsTasks = require('./gulp/tasks/js');
const stylesTasks = require('./gulp/tasks/styles');
const { clean } = require('./gulp/tasks/clean');
const { webpack } = require('./gulp/tasks/webpack');
const { watch } = require('./gulp/tasks/watch');

exports.clean = clean;
exports.webpack = webpack;
exports.watch = watch;

exports.standaloneJs = jsTasks.standaloneJs;
exports.js = jsTasks.js;

exports.miscStyles = stylesTasks.miscStyle;
exports.styles = stylesTasks.styles;

exports.build = parallel( jsTasks.js, stylesTasks.styles );
