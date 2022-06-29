const { parallel, watch } = require( 'gulp' );
const jsTasks = require( './js' );
const stylesTasks = require( './styles' );

function miscStyles() {
	watch( [ 'src/assets/*.scss' ], function() {
		return stylesTasks.miscStyles();
	} );
}
function standaloneJs() {
	watch( [ 'src/assets/*.js' ], function() {
		return jsTasks.standaloneJs();
	} );
}

exports.watch = parallel( miscStyles, standaloneJs );
