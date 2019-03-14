/**
 * Gutenberg Blocks
 *
 */
import icons from './brand-icon';
wp.i18n.setLocaleData( { '': {} }, 'kadence-blocks' );

import './blocks/spacer/block.js';
import './blocks/advanced-btn/block.js';
import './blocks/row-layout/block.js';
import './blocks/column/block.js';
import './blocks/icon/block.js';
import './blocks/advanced-heading/block.js';
import './blocks/tabs/block.js';
import './blocks/tab/block.js';
import './blocks/info-box/block.js';
import './blocks/accordion/block.js';
import './blocks/pane/block.js';

import './plugins/kadence-control.js';
import './plugins/editor-width.js';
if ( typeof kt_blocks_default_size !== 'undefined' ) {
	wp.data.dispatch( 'core/editor' ).updateEditorSettings( { maxWidth: kt_blocks_default_size } );
}
wp.blocks.updateCategory( 'kadence-blocks', { icon: icons.kadenceCat } );
