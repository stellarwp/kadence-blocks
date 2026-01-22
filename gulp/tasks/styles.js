const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleancss = require('gulp-clean-css');
const config = require('../config');

/**
 * Create gulp pipeline for scss/css files.
 *
 * @param {*} sources
 * @returns
 */
function stylesPipe(sources) {
	return src(sources).pipe(sass(config.sass)).pipe(cleancss(config.cleancss));
}

function miscStyles() {
	return stylesPipe(['src/assets/css/*.scss', 'includes/resources/Optimizer/assets/css/*.scss'])
		.pipe(
			rename((file) => {
				file.basename += '.min';
			})
		)
		.pipe(dest(config.dirs.dist + '/css'));
}

exports.miscStyles = miscStyles;

exports.buildStyles = parallel(miscStyles);
exports.styles = parallel(miscStyles);
