import { registerBlockType } from '@wordpress/blocks';
import { get } from 'lodash';
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
	__experimentalLabel( attributes, { context } ) {
		const { title, metadata } = attributes;

		// In the list view, use the block's content as the label.
		// If the content is empty, fall back to the default label.
		if ( context === 'list-view' && get( metadata, 'name', '') !== '' ) {
			return metadata.name;
		} else if ( context === 'list-view' && title ) {
			return title;
		}
	},
	edit,
	example: {}
} );
