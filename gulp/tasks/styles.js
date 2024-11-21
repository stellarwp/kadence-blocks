const { src, dest, parallel } = require('gulp');
const sass = require('sass');
const through2 = require('through2');
const rename = require('gulp-rename');
const cleancss = require('gulp-clean-css');
const config = require('../config');

function stylesPipe(sources) {
	return src(sources)
		.pipe(
			through2.obj(function (file, _, callback) {
				if (file.isBuffer()) {
					try {
						// Using the modern Sass API
						const result = sass.compile(file.path, {
							sourceMap: config.sass.sourceMap,
							style: config.sass.outputStyle,
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
		.pipe(cleancss(config.cleancss));
}

function miscStyles() {
	return stylesPipe(['src/assets/css/*.scss'])
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
