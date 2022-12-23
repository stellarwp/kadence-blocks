/**
 * Utilities for the Testimonials block.
 */
import { createBlock } from '@wordpress/blocks';

export function migrateToInnerblocks( attributes ) {
    const { testimonials } = attributes;

    let testimonialInnerBlocks = [];

    for ( let testimonial of testimonials ) {
        let newAttrs = { ...testimonial };

        testimonialInnerBlocks.push( createBlock( 'kadence/testimonial', newAttrs ) );
    }

    let testimonialParentAttributes = { ...attributes, testimonials: [] }

    return [ testimonialParentAttributes, testimonialInnerBlocks ];
}