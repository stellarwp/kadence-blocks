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
	getEditWrapperProps( attributes ) {
		if ( 'wide' === attributes.align || 'full' === attributes.align || 'left' === attributes.align || 'right' === attributes.align ) {
			return {
				'data-align': attributes.align,
			};
		}
		return;
	},
	transforms,
	edit,
	save: () => null,
});
