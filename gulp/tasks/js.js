const { src, dest, parallel } = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const minify = require('gulp-minify');
const del = require('del');
const config = require('../config');

function buildJs() {
    return src([
        'src/init/*.js',
        'src/utils/*.js'
    ])
        .pipe(babel(config.babel))
        .pipe(minify(config.minify))
        .pipe(dest('dist/assets/js'));
}

function buildSettingsJs() {
    return src('src/settings/*.js')
        .pipe(babel(config.babel))
        .pipe(minify(config.minify))
        .pipe(dest('dist/settings'));
}

function copyVendorJs() {
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

exports.buildJs = buildJs;
exports.copyVendorJs = copyVendorJs;
exports.buildSettingsJs = buildSettingsJs;
exports.js = parallel(buildJs, buildSettingsJs, copyVendorJs);