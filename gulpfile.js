const { parallel, series } = require('gulp');

const { js, copyVendorJs, buildJs } = require('./gulp/tasks/js');
const { styles } = require('./gulp/tasks/styles');
const { clean } = require('./gulp/tasks/clean');
const { php } = require('./gulp/tasks/php');
const { zip } = require('./gulp/tasks/zip');
const { webpack } = require('./gulp/tasks/webpack');

exports.clean = clean;
exports.php = php;
exports.js = js;
exports.styles = styles;
exports.build = series(clean, parallel(js, styles, php));
exports.zip = zip;
exports.webpack = webpack;