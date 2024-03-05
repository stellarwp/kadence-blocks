/**
 * Utilities for the Testimonials block.
 */
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';
export function migrateToInnerblocks(attributes) {
	const { testimonials, itemsCount } = attributes;

	const testimonialInnerBlocks = [];
	if (testimonials?.length) {
		times(itemsCount, (n) => {
			const testimonial = testimonials[n];
			const newAttrs = { ...testimonial };

			testimonialInnerBlocks.push(createBlock('kadence/testimonial', newAttrs));
		});
	}
	const testimonialParentAttributes = { ...attributes, testimonials: [], itemsCount: 1 };

	return [testimonialParentAttributes, testimonialInnerBlocks];
}
