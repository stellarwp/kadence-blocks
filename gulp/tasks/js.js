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
        'src/init/*.js',
        'src/utils/*.js'
    ]).pipe(dest('dist/assets/js'));
}

/**
 * Build settings js files.
 * 
 * @returns 
 */
function settings() {
    return jsPipe('src/settings/*.js')
        .pipe(dest('dist/settings'));
}

/**
 * Copy vendor scripts.
 * 
 * @returns 
 */
function vendor() {
    return src([
        config.modulesDir + '/tiny-slider/dist/min/tiny-slider.js',
        config.modulesDir + '/simplelightbox/dist/simple-lightbox.min.js',
        config.modulesDir + '/@lottiefiles/lottie-player/dist/lottie-player.js',
        config.modulesDir + '/@lottiefiles/lottie-interactivity/dist/lottie-interactivity.min.js',
        config.modulesDir + '/gumshoejs/dist/gumshoe.min.js',
        config.modulesDir + '/jarallax/dist/jarallax.min.js',
        config.modulesDir + '/magnific-popup/dist/jquery.magnific-popup.min.js',
        config.modulesDir + '/slick-carousel/slick/slick.min.js'
    ])
        .pipe(rename((file) => {
            if(!file.basename.endsWith('.min')) {
                file.basename += '.min';
            }
        }))
        .pipe(dest('dist/assets/js'));
}

exports.standaloneJs = standalone;
exports.settingsJs = settings;
exports.vendorJs = vendor;

exports.buildJs = parallel(standalone, settings);
exports.js = parallel(standalone, settings, vendor);