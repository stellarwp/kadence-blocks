/**
 * Kadence Blocks
 *
 */
import TypographyControls from './typography-control.js';
import AdvancedColorControl from './advanced-color-control.js';
import BoxShadowControl from './box-shadow-control';
import IconControl from './icon-control';
import IconRender from './icon-render';
window.kb = {
	// Sidebar controls.
	controls: {
		AdvancedColorControl,
		TypographyControls,
		BoxShadowControl,
		IconControl,
		IconRender,
	},
};
import icons from './brand-icon';
//wp.i18n.setLocaleData( { '': {} }, 'kadence-blocks' );
import './blocks/counter-up/block.js';
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
import './blocks/icon-list/block.js';
import './blocks/testimonials/block.js';
import './blocks/advanced-gallery/block.js';
import './blocks/form/block.js';
import './blocks/table-of-contents/block.js';
import './blocks/restaurant-menu/block.js';
import './blocks/restaurant-menu/menu-category/block.js';
import './blocks/restaurant-menu/menu-category/category-item/block.js';

import './plugins/kadence-control.js';
import './plugins/editor-width.js';
if ( typeof kt_blocks_default_size !== 'undefined' ) {
	wp.data.dispatch( 'core/editor' ).updateEditorSettings( { maxWidth: kt_blocks_default_size } );
}
wp.blocks.updateCategory( 'kadence-blocks', { icon: icons.kadenceCat } );
