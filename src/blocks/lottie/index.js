import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import transforms from './transforms';
import deprecated from './deprecated';
import { lottieIcon } from '@kadence/icons';
import { __, _x } from '@wordpress/i18n';

registerBlockType('kadence/lottie', {
	...metadata,
	title: _x( 'Lottie Animations', 'block title', 'kadence-blocks' ),
	description: _x( 'Display lottie animations on your site', 'block description', 'kadence-blocks' ),
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
	edit,
	deprecated,
	save: () => null,
	example: {}
});
