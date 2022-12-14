/**
 * Utilitites for the icon list block.
 */
import { createBlock } from '@wordpress/blocks';

export function migrateToInnerblocks( attributes ) {

    const { icons } = attributes;

    let iconInnerBlocks = [];

    for ( let icon of icons ) {
        let newAttrs = { ...icon };

        iconInnerBlocks.push( createBlock( 'kadence/single-icon', newAttrs ) );
    }

    let iconParentAttributes = { ...attributes, icons: [] }

    return [ iconParentAttributes, iconInnerBlocks ];
}