/**
 * Kadence Blocks
 *
 */
import { get } from 'lodash';
import domReady from '@wordpress/dom-ready';

// Utils
import './plugins/kadence-control.js';
import './plugins/editor-width.js';
import './plugins/prebuilt-library/toolbar-library';
import './plugins/block-rename/block-rename.js';

if (typeof kt_blocks_default_size !== 'undefined') {
	wp.data.dispatch('core/editor').updateEditorSettings({ maxWidth: kt_blocks_default_size });
}

const config = get(kadence_blocks_params, 'globalSettings') ? JSON.parse(kadence_blocks_params.globalSettings) : {};
if (undefined !== config.adv_text_is_default_editor_block && config.adv_text_is_default_editor_block) {
	domReady(() => {
		wp.blocks.setDefaultBlockName('kadence/advancedheading');
	});
}
