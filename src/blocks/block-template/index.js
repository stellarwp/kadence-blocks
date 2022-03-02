import itemicons from '../../icons';

import { registerBlockType } from '@wordpress/blocks';

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
	transforms,
	edit,
	save,
};

registerBlockType('kadence/block-template', {
	...metadata,
	icon: {
		src: itemicons.row,
	},
	...settings

});
