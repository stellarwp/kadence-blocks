/**
 * Utilities for the icon list block.
 */
import { createBlock } from '@wordpress/blocks';

export function migrateToInnerblocks( attributes ) {
    const { items } = attributes;

    let listInnerBlocks = [];

    for ( let item of items ) {
        let newAttrs = { ...item };

        listInnerBlocks.push( createBlock( 'kadence/listitem', newAttrs ) );
    }

    let listParentAttributes = { ...attributes, items: [] }

    return [ listParentAttributes, listInnerBlocks ];
}