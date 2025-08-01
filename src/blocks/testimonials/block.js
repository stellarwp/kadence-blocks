import { registerBlockType } from '@wordpress/blocks';

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
import { __, _x } from '@wordpress/i18n';
import './style.scss';

export { metadata, name };

registerBlockType('kadence/testimonials', {
	...metadata,
	title: _x('Testimonials', 'block title', 'kadence-blocks'),
	keywords: [
		__('testimonials', 'kadence-blocks'),
		__('rating', 'kadence-blocks'),
		'KB',
		__('carousel', 'kadence-blocks'),
	],
	icon: {
		src: testimonialBlockIcon,
	},
	edit,
	save,
	deprecated,
	example: {},
});
