const { src, dest, parallel, series } = require('gulp');
const rename = require('gulp-rename');
const minify = require('gulp-babel-minify');
const config = require('../config');

// Process JS files
function processFiles() {
	return new Promise((resolve, reject) => {
		const stream = src(['src/assets/js/*.js'])
			.pipe(
				rename(function (path) {
					return {
						dirname: path.dirname,
						basename: path.basename,
						extname: '.min.js',
					};
				})
			)
			.pipe(minify(config.minify))
			.pipe(dest(config.dirs.dist + '/js'));

		stream.on('end', resolve);
		stream.on('error', reject);
	});
}

// Copy vendor files
function copyVendorFiles() {
	return new Promise((resolve, reject) => {
		const stream = src(['src/assets/js/vendor/*.js'])
			.pipe(
				rename(function (path) {
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

		stream.on('end', resolve);
		stream.on('error', reject);
	});
}

// Combined JS task
function miscJs(cb) {
	return parallel(processFiles, copyVendorFiles)(cb);
}

// Export tasks
exports.processFiles = processFiles;
exports.copyVendorFiles = copyVendorFiles;
exports.miscJs = miscJs;
exports.buildJs = miscJs;
exports.js = miscJs;

// Default task
exports.default = series(miscJs);
