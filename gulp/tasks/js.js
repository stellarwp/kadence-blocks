const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const minify = require('gulp-minify');
const del = require('del');
const config = require('../config');

function buildJs() {
    let transpiled =  src([
        'src/init/*.js',
        'src/utils/*.js'
    ])
        .pipe(babel({
            presets: [
                '@babel/preset-env',
                '@babel/preset-react'
            ]
        }))
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            noSource: true
        }))
        .pipe(dest('dist/assets/js'));
    
    return transpiled;
}

function copyJs() {
    return src([
        config.modulesDir + '/tiny-slider/dist/min/tiny-slider.js',
        config.modulesDir + '/simplelightbox/dist/simple-lightbox.min.js',
        config.modulesDir + '/@lottiefiles/lottie-player/dist/lottie-player.js',
        config.modulesDir + '/@lottiefiles/lottie-interactivity/dist/lottie-interactivity.min.js',
        config.modulesDir + '/gumshoejs/dist/gumshoe.min.js'
    ])
        .pipe(rename((file) => {
            if(!file.basename.endsWith('.min')) {
                file.basename += '.min';
            }
        }))
        .pipe(dest('dist/assets/js'));
}

exports.js = buildJs;
exports.copyJs = copyJs;