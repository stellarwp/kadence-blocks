const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');
const rename = require('gulp-rename');
const cleancss = require('gulp-clean-css')
const config = require('../config');

/**
 * Create gulp pipeline for scss/css files.
 * 
 * @param {*} sources 
 * @returns 
 */
function stylesPipe(sources) {
    return src(sources)
        .pipe(sass(config.sass))
        .pipe(cleancss(config.cleancss));
}

/**
 * Build block styles.
 * 
 * @todo handle sub-directories like in restaurant-menu
 * 
 * @returns 
 */
function blocks() {
    return stylesPipe('src/blocks/**/style.scss')
        .pipe(rename(function(file){
            file.basename = file.dirname.replace('/', '_');
            file.extname = '.style.build.css';
            file.dirname = '';
        }))
        .pipe(dest(config.dirs.dist + '/blocks'));
}

/**
 * Build settings styles.
 * 
 * @returns 
 */
function settings() {
    return stylesPipe([
        'src/settings/dashboard.scss'
    ])
        .pipe(rename((file) => {
            file.basename = "styles"
        }))
        .pipe(dest(config.dirs.dist + '/settings'));
}

function misc() {
    return stylesPipe(['src/utils/*.scss'])
        .pipe(rename((file) => {
            file.basename += '.min'
        }))
        .pipe(dest(config.dirs.dist + '/assets/css'));
}

/**
 * Copy vendor styles.
 * 
 * @returns 
 */
function vendor() {
    return src([
        config.dirs.modules + '/simplelightbox/dist/simple-lightbox.min.css',
        config.dirs.modules + '/tiny-slider/dist/tiny-slider.css',
        config.dirs.modules + '/magnific-popup/dist/magnific-popup.css'
    ])
        .pipe(rename((file) => {
            if(!file.basename.endsWith('.min')) {
                file.basename += '.min';
            }
        }))
        .pipe(dest(config.dirs.dist + '/assets/css'));
}

exports.blocksStyles = blocks;
exports.settingsStyles = settings;
exports.vendorStyles = vendor;
exports.miscStyles = misc;

exports.buildStyles = parallel(blocks, settings, misc);
exports.styles = parallel(blocks, settings, misc, vendor);