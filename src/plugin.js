/**
 * Kadence Blocks
 *
 */
// Utils
import './plugins/kadence-control.js';
import './plugins/editor-width.js';
import './plugins/prebuilt-library/toolbar-library';
import './plugins/block-rename/block-rename.js';

if ( typeof kt_blocks_default_size !== 'undefined' ) {
	wp.data.dispatch( 'core/editor' ).updateEditorSettings( { maxWidth: kt_blocks_default_size } );
}
