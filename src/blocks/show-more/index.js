import { showMoreIcon } from '@kadence/icons';

import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';
const { name } = metadata;

export { metadata, name };

export const settings = {
	title: _x( 'Show More', 'block title', 'kadence-blocks' ),
	description: _x( 'Hide content and enable a show more button to reveal', 'block description', 'kadence-blocks' ),
	transforms,
	edit,
	save
};

registerBlockType('kadence/show-more', {
	...metadata,
	icon: {
		src: showMoreIcon,
	},
	...settings
});
