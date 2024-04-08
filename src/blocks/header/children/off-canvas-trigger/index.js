import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

import { headerBlockIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType('kadence/off-canvas-trigger', {
	...metadata,
	title: _x('Off Canvas Trigger', 'block title', 'kadence-blocks'),
	description: _x('Toggles the display of an off canvas block.', 'block description', 'kadence-blocks'),
	icon: {
		src: headerBlockIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
