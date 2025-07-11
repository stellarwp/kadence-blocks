const { parallel, watch } = require('gulp');
const jsTasks = require('./js');
const stylesTasks = require('./styles');

function miscStyles() {
	stylesTasks.miscStyles();
	watch(['src/assets/css/*.scss'], stylesTasks.miscStyles);
}
function miscJs() {
	jsTasks.miscJs();
	watch(['src/assets/js/*.js', 'src/assets/js/vendor/*.js', 'includes/resources/**/*.js'], jsTasks.miscJs);
}

exports.watch = parallel(miscStyles, miscJs);
