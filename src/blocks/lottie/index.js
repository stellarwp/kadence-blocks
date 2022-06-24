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
import { __ } from '@wordpress/i18n';

registerBlockType('kadence/lottie', {
	...metadata,
	title: __( 'Lottie Animations', 'kadence-blocks' ),
	description: __( 'Kadence lottie animation.', 'kadence-blocks' ),
	keywords: [
		__( 'lottie', 'kadence-blocks' ),
		__( 'animation', 'kadence-blocks' ),
		'KB',
	],
	getEditWrapperProps( attributes ) {
		return {
			'data-align': attributes.align,
		};
	},
	icon: {
		src: lottieIcon,
	},
	transforms,
	edit,
	save,
});
