/**
 * Kadence Blocks
 *
 */
// Utils
import './stores/kadence-store';
import AdvancedColorControl from './advanced-color-control.js';
import { BoxShadowControl, TypographyControls, IconControl, IconRender } from '@kadence/components';

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
import './extension/block-css/block-css';
/* block.json styles */
import './blocks/lottie/index.js';
import './blocks/image/index.js';
import './blocks/google-maps/index.js';
import './blocks/advanced-btn/block.js';
import './blocks/count-up/block.js';
import './blocks/row-layout/index.js';
import './blocks/column/index.js';
import './blocks/icon/block.js';
import './blocks/advanced-heading/block.js';
import './blocks/tabs/block.js';
import './blocks/tab/block.js';
import './blocks/info-box/block.js';
import './blocks/accordion/block.js';
import './blocks/pane/block.js';
import './blocks/icon-list/block.js';
import './blocks/advanced-gallery/block.js';
import './blocks/form/block.js';
import './blocks/posts/block.js';
import './blocks/countdown/block.js';

/* block.json styles */
import './blocks/image/index.js';
import './blocks/lottie/index.js';
import './blocks/show-more/index.js';
import './blocks/spacer/index.js';
import './blocks/table-of-contents/index.js';
import './blocks/testimonials/index.js';


// import './plugins/kadence-control.js';
// import './plugins/editor-width.js';
import './plugins/prebuilt-library/toolbar-library';
// Brand Icon.

import { kadenceCatNewIcon } from '@kadence/icons';
wp.blocks.updateCategory( 'kadence-blocks', { icon: kadenceCatNewIcon } );
