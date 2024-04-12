import { progressIcon } from '@kadence/icons';
import { registerBlockType } from '@wordpress/blocks';
import { _x } from '@wordpress/i18n';

import './editor.scss';
import './style.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

registerBlockType('kadence/progress-bar', {
	...metadata,
	title: _x('Progress Bar', 'block title', 'kadence-blocks'),
	icon: {
		src: progressIcon,
	},
	getEditWrapperProps(attributes) {
		if (
			'wide' === attributes.align ||
			'full' === attributes.align ||
			'left' === attributes.align ||
			'right' === attributes.align
		) {
			return {
				'data-align': attributes.align,
			};
		}
	},
	edit,
	save: () => null,
});
