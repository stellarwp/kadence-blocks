const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');
const rename = require('gulp-rename');
const cleancss = require('gulp-clean-css')
const config = require('../config');

// TODO: handle sub-directories (like restaurant-menu has)
function buildBlockStyles() {
    return src('src/blocks/**/style.scss')
        .pipe(sass())
        .pipe(cleancss())
        .pipe(rename(function(file){
            file.basename = file.dirname.replace('/', '_');
            file.extname = '.style.build.css';
            file.dirname = '';
        }))
        .pipe(dest('dist/blocks'));
}

function buildSettingsStyles() {
    return src([
        'src/settings/dashboard.scss'
    ])
        .pipe(rename((file) => {
            file.basename = "style"
        }))
        .pipe(sass())
        .pipe(cleancss())
        .pipe(dest('dist/settings'));
}

// copy needed vendor styles from node_modules
function copyVendorStyles() {
    return src([
        config.modulesDir + '/simplelightbox/dist/simple-lightbox.min.css',
        config.modulesDir + '/tiny-slider/dist/tiny-slider.css'
    ])
        .pipe(rename((file) => {
            if(!file.basename.endsWith('.min')) {
                file.basename += '.min';
            }
        }))
        .pipe(dest('dist/assets/css'));
}

exports.buildBlockStyles = buildBlockStyles;
exports.buildSettingsStyles = buildSettingsStyles;
exports.buildStyles = parallel(buildBlockStyles, buildSettingsStyles);
exports.copyVendorStyles = copyVendorStyles;
exports.styles = parallel(copyVendorStyles, exports.buildStyles);