/**
 * Utilities for the icon list block.
 */
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';

export function migrateToInnerblocks( attributes ) {

    const { icons, iconCount } = attributes;
    let iconInnerBlocks = [];
    if ( icons?.length ) {
        times( iconCount, n => {
            let icon = icons[n];
            let newAttrs = { ...icon };

            iconInnerBlocks.push( createBlock( 'kadence/single-icon', newAttrs ) );
        });
    }

    let iconParentAttributes = { ...attributes, icons: [], iconCount: 1 }

    return [ iconParentAttributes, iconInnerBlocks ];
}