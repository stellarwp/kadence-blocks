const { src, dest } = require('gulp');
const del  = require('del');
const config = require('../config');

function clean() {
    return del([
        config.dirs.dist + '/**',
        '!' + config.dirs.dist
    ], { force: true });
}

exports.clean = clean;