// js.js
const { src, dest, parallel } = require('gulp');
const rename = require('gulp-rename');
const minify = require('gulp-babel-minify');
const sass = require('sass');
const through2 = require('through2');
const config = require('../config');

// Process JavaScript files
function processFiles() {
	return src(['src/assets/js/*.js'])
		.pipe(
			rename((path) => {
				path.extname = '.min.js';
			})
		)
		.pipe(minify(config.minify))
		.pipe(dest(config.dirs.dist + '/js'));
}

// Process vendor JavaScript files
function copyVendorFiles() {
	return src(['src/assets/js/vendor/*.js'])
		.pipe(
			rename((path) => {
				if (!path.basename.endsWith('.min')) {
					path.extname = '.min.js';
				}
			})
		)
		.pipe(minify(config.minify))
		.pipe(dest(config.dirs.dist + '/js'));
}

// Process SCSS files with modern Sass API
function styles() {
	return src('src/assets/scss/**/*.scss')
		.pipe(
			through2.obj(function (file, _, callback) {
				if (file.isBuffer()) {
					try {
						// Using the modern Sass API
						const result = sass.compile(file.path, {
							style: 'compressed',
						});
						file.contents = Buffer.from(result.css);
						file.extname = '.css';
						this.push(file);
					} catch (err) {
						this.emit('error', err);
					}
				}
				callback();
			})
		)
		.pipe(dest(config.dirs.dist + '/css'));
}

// Parallel tasks for JavaScript
function miscJs() {
	return parallel(processFiles, copyVendorFiles)();
}

exports.miscJs = miscJs;
exports.styles = styles;
exports.buildJs = parallel(miscJs);
exports.js = parallel(miscJs);
exports.default = parallel(styles, miscJs);
