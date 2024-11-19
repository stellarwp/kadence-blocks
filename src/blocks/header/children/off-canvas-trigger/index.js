import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

import { offCanvasTriggerBlockIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

registerBlockType('kadence/off-canvas-trigger', {
	...metadata,
	title: _x('Off Canvas Trigger', 'block title', 'kadence-blocks'),
	description: _x('Toggles the display of an off canvas block.', 'block description', 'kadence-blocks'),
	icon: {
		src: offCanvasTriggerBlockIcon,
	},
	edit,
	save() {
		return null;
	},
});
