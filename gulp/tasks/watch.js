const fs = require('fs');
const { parallel, watch } = require('gulp');
const jsTasks = require('./js');
const stylesTasks = require('./styles');

function miscStyles() {
	stylesTasks.miscStyles();
	watch(['src/assets/css/*.scss', 'includes/resources/Optimizer/assets/css/*.scss'], stylesTasks.miscStyles);
}
function miscJs() {
	jsTasks.miscJs();
	watch(['src/assets/js/*.js', 'src/assets/js/vendor/*.js', 'includes/resources/**/*.js'], jsTasks.miscJs);
}

function fseStyles() {
	// Webpack writes the sources one by one, so copy them only once they all exist.
	const copyWhenReady = (done) => {
		if (!stylesTasks.fseSources.every((source) => fs.existsSync(source))) {
			return done();
		}

		return stylesTasks.fseStyles(done);
	};

	watch(stylesTasks.fseSources, { ignoreInitial: false }, copyWhenReady);
}

exports.watch = parallel(miscStyles, miscJs, fseStyles);
