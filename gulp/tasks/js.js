const { src, dest, parallel } = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const minify = require('gulp-minify');
const del = require('del');
const config = require('../config');

/**
 * Create gulp pipeline for js files
 * 
 * @param {*} sources 
 * @returns js build pipeline
 */
function jsPipe(sources) {
    return src(sources)
        .pipe(babel(config.babel))
        .pipe(minify(config.minify));
}

/**
 * Build standalone js files.
 * 
 * @returns 
 */
function standalone() {
    return jsPipe([
        'src/assets/js/*.js'
    ]).pipe(dest(config.dirs.dist + '/js'));
}

exports.standaloneJs = standalone;

exports.buildJs = parallel(standalone);
exports.js = parallel(standalone);