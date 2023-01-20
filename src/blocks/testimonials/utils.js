/**
 * Utilities for the Testimonials block.
 */
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';
export function migrateToInnerblocks( attributes ) {
    const { testimonials, itemsCount } = attributes;

    let testimonialInnerBlocks = [];
    times( itemsCount, n => {
		let testimonial = testimonials[n];
		let newAttrs = { ...testimonial };

        testimonialInnerBlocks.push( createBlock( 'kadence/testimonial', newAttrs ) );
    });

    let testimonialParentAttributes = { ...attributes, testimonials: [] }

    return [ testimonialParentAttributes, testimonialInnerBlocks ];
}