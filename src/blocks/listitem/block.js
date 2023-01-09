/**
 * BLOCK: Kadence Icon List
 */

import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';

/**
 * Import Icon stuff
 */
import { iconListItemBlockIcon } from '@kadence/icons';

/**
 * Internal block libraries
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/listitem', {
    ...metadata,
    title: __( 'List item', 'kadence-blocks' ),
    description: __( 'Icon list item', 'kadence-blocks' ),
    icon: {
        src: iconListItemBlockIcon,
    },
    edit,
    save,
    merge: ( a, { text = '' } ) => ( {
		...a,
		text: ( a.text || '' ) + text,
	} ),
    deprecated
} );
