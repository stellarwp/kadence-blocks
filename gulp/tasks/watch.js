const { parallel, watch } = require( 'gulp' );
const jsTasks = require( './js' );
const stylesTasks = require( './styles' );
const phpTask = require( './php' );

function blockStyles() {
	watch( [ 'src/blocks/**/style.scss' ], function() {
		return stylesTasks.blocksStyles();
	} );
}

function settingStyles() {
	watch( [ 'src/settings/dashboard.scss' ], function() {
		return stylesTasks.settingsStyles();
	} );
}

function standaloneJs() {
	watch( [ 'src/init/*.js', 'src/utils/*.js' ], function() {
		return jsTasks.standaloneJs();
	} );
}

function settingsJs() {
	watch( [ 'src/settings/*.js' ], function() {
		return jsTasks.settingsJs();
	} );

}

exports.watch = parallel( blockStyles, settingStyles, standaloneJs, settingsJs );
