import { registerBlockType } from '@wordpress/blocks';
import { _x } from '@wordpress/i18n';

import './editor.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

registerBlockType('kadence/page-wizard', {
	...metadata,
	title: _x('Page Wizard', 'block title', 'kadence-blocks'),
	icon: {
		src: (
			<svg xmlns="http://www.w3.org/2000/svg" width="31" height="32" viewBox="0 0 31 32">
				<path
					fill="var(--kadence-color, #0058b0 )"
					d="M13.001 24.066l-3.089-6.797-6.797-3.089 6.797-3.09 3.089-6.796 3.089 6.796 6.797 3.09-6.797 3.089-3.089 6.797zm11.186 3.642l-1.528-3.415-3.415-1.528 3.415-1.561 1.528-3.383 1.561 3.383 3.383 1.561-3.383 1.528-1.561 3.415z"
				></path>
			</svg>
		),
	},
	edit,
	save: () => null,
});
