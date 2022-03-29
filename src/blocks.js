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
import './blocks/spacer/block.js';
import './blocks/advanced-btn/block.js';
import './blocks/count-up/block.js';
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
import './blocks/posts/block.js';
import './blocks/countdown/block.js';
import './blocks/countdown/countdown-timer/block.js';
import './blocks/countdown/countdown-inner/block.js';

/* block.json styles */
import './blocks/lottie/index.js';
import './blocks/image/index.js';
import './blocks/show-more/index.js';


// import './plugins/kadence-control.js';
// import './plugins/editor-width.js';
import './plugins/prebuilt-library/toolbar-library';
// Brand Icon.
import icons from './brand-icon';
wp.blocks.updateCategory( 'kadence-blocks', { icon: icons.kadenceCatNew } );
