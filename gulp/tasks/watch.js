const { parallel, watch } = require('gulp');
const jsTasks = require('./js');
const stylesTasks = require('./styles');

function miscStyles() {
	return stylesTasks.miscStyles();
}

function watchStyles() {
	watch(['src/assets/css/*.scss'], miscStyles);
}

function miscJs() {
	return jsTasks.miscJs();
}

function watchJs() {
	watch(['src/assets/js/*.js', 'src/assets/js/vendor/*.js'], miscJs);
}

exports.watch = parallel(parallel(miscStyles, watchStyles), parallel(miscJs, watchJs));
