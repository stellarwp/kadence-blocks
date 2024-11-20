const { src, dest, parallel } = require('gulp');
const rename = require('gulp-rename');
const minify = require('gulp-babel-minify');
const config = require('../config');

function processFiles() {
	return src(['src/assets/js/*.js'])
		.pipe(
			rename(function (path) {
				// Returns a completely new object, make sure you return all keys needed!
				return {
					dirname: path.dirname,
					basename: path.basename,
					extname: '.min.js',
				};
			})
		)
		.pipe(minify(config.minify))
		.pipe(dest(config.dirs.dist + '/js'));
}

function copyVendorFiles() {
	return src(['src/assets/js/vendor/*.js'])
		.pipe(
			rename(function (path) {
				// We don't need to rename if .min is already in filename
				if (path.basename.endsWith('.min')) {
					return path;
				}

				return {
					dirname: path.dirname,
					basename: path.basename,
					extname: '.min.js',
				};
			})
		)
		.pipe(minify(config.minify))
		.pipe(dest(config.dirs.dist + '/js'));
}

/**
 * Build standalone js files.
 *
 * @returns
 */
function miscJs() {
	let process = processFiles();

	let copy = copyVendorFiles();

	return copy;
}

exports.miscJs = miscJs;

exports.buildJs = parallel(miscJs);
exports.js = parallel(miscJs);
