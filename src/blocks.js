/**
 * Gutenberg Blocks
 *
 */
wp.i18n.setLocaleData( { '': {} }, 'kadence-blocks' );

import './blocks/spacer/block.js';
import './blocks/advanced-btn/block.js';
import './blocks/row-layout/block.js';
import './blocks/column/block.js';
import './blocks/icon/block.js';
import './blocks/advanced-heading/block.js';
import './blocks/tabs/block.js';
import './blocks/tab/block.js';

import './plugins/editor-width.js';

wp.data.dispatch( 'core/editor' ).updateEditorSettings( { maxWidth: kt_blocks_default_size } );