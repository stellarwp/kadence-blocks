import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';
const { name } = metadata;
import { spacerIcon } from '@kadence/icons';

export { metadata, name };

export const settings = {
	transforms,
	deprecated,
	edit,
	save,
};

registerBlockType('kadence/spacer', {
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	...metadata,
	icon: {
		src: spacerIcon,
	},
	...settings,

});
