import { progressIcon } from '@kadence/icons';

import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';


registerBlockType('kadence/progress-bar', {
	...metadata,
	icon: {
		src: progressIcon,
	},
	transforms,
	edit,
	save,
});
