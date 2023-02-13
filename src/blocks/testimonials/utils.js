/**
 * Utilities for the Testimonials block.
 */
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';
export function migrateToInnerblocks( attributes ) {
    const { testimonials, itemsCount } = attributes;

    let testimonialInnerBlocks = [];
    if ( testimonials?.length ) {
        times( itemsCount, n => {
            let testimonial = testimonials[n];
            let newAttrs = { ...testimonial };

            testimonialInnerBlocks.push( createBlock( 'kadence/testimonial', newAttrs ) );
        });
    }
    let testimonialParentAttributes = { ...attributes, testimonials: [], itemsCount: 1 }

    return [ testimonialParentAttributes, testimonialInnerBlocks ];
}