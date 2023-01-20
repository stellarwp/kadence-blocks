import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

const { name } = metadata;
import { testimonialSingleBlockIcon } from '@kadence/icons';
import { __ } from '@wordpress/i18n';

export { metadata, name };

registerBlockType( 'kadence/testimonial', {
	...metadata,
	title   : __( 'Testimonial', 'kadence-blocks' ),
	keywords: [
		__( 'testimonial', 'kadence-blocks' ),
		__( 'rating', 'kadence-blocks' ),
		'KB',
	],
	icon    : {
		src: testimonialSingleBlockIcon,
	},
	edit
} );