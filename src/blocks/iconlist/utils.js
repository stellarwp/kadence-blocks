/**
 * Utilities for the icon list block.
 */
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';

export function migrateToInnerblocks( attributes ) {
    const { items, listCount } = attributes;

    let listInnerBlocks = [];
    times( listCount, n => {
		let item = items[n];
		let newAttrs = { ...item };

        listInnerBlocks.push( createBlock( 'kadence/listitem', newAttrs ) );
    });

    let listParentAttributes = { ...attributes, items: [] }

    return [ listParentAttributes, listInnerBlocks ];
}