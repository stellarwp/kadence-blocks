import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';
const { name } = metadata;
import { lottieIcon } from '@kadence/icons';

export { metadata, name };

export const settings = {
	getEditWrapperProps( attributes ) {
		return {
			'data-align': attributes.align,
		};
	},
	transforms,
	edit,
	save,
};

registerBlockType('kadence/lottie', {
	...metadata,
	icon: {
		src: lottieIcon,
	},
	...settings

});
