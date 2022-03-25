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
        .pipe(sass())
        .pipe(cleancss());
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
        .pipe(dest('dist/blocks'));
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
        .pipe(dest('dist/settings'));
}

/**
 * Copy vendor styles.
 * 
 * @returns 
 */
function vendor() {
    return src([
        config.modulesDir + '/simplelightbox/dist/simple-lightbox.min.css',
        config.modulesDir + '/tiny-slider/dist/tiny-slider.css',
        config.modulesDir + '/magnific-popup/dist/magnific-popup.css'
    ])
        .pipe(rename((file) => {
            if(!file.basename.endsWith('.min')) {
                file.basename += '.min';
            }
        }))
        .pipe(dest('dist/assets/css'));
}

exports.blocksStyles = blocks;
exports.settingsStyles = settings;
exports.vendorStyles = vendor;

exports.buildStyles = parallel(blocks, settings);
exports.styles = parallel(blocks, settings, vendor);