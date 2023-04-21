import { registerBlockType } from '@wordpress/blocks';
import { get } from 'lodash';

/**
 * Register sub blocks.
 */
import '../testimonial/block.js';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import deprecated from './deprecated';

const { name } = metadata;
import { testimonialBlockIcon } from '@kadence/icons';
import { __ } from '@wordpress/i18n';
import './style.scss';

export { metadata, name };

registerBlockType( 'kadence/testimonials', {
	...metadata,
	title   : __( 'Testimonials', 'kadence-blocks' ),
	keywords: [
		__( 'testimonials', 'kadence-blocks' ),
		__( 'rating', 'kadence-blocks' ),
		'KB',
	],
	icon    : {
		src: testimonialBlockIcon,
	},
	__experimentalLabel( attributes, { context } ) {
		const { title, metadata } = attributes;

		// In the list view, use the block's content as the label.
		// If the content is empty, fall back to the default label.
		if ( context === 'list-view' && get( metadata, 'name', '') !== '' ) {
			return metadata.name;
		}
	},
	edit,
	save,
	deprecated,
	example: {}
} );
