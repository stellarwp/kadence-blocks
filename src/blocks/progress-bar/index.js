import { progressIcon } from '@kadence/icons';

import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import './style.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import transforms from './transforms';

registerBlockType('kadence/progress-bar', {
	...metadata,
	icon: {
		src: progressIcon,
	},
	transforms,
	edit,
	save: () => null,
});
