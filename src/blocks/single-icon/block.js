/**
 * BLOCK: Kadence Icon
 */

import metadata from './block.json';

/**
 * Import Icon stuff
 */
import { iconIcon } from '@kadence/icons';
import edit from './edit';
import save from './save';

/**
 * Internal block libraries
 */
import {
    registerBlockType,
} from '@wordpress/blocks';
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
registerBlockType( 'kadence/single-icon', {
    ...metadata,
    title: __( 'Single Icon', 'kadence-blocks' ),
    description: __( 'Single icon within Icon block', 'kadence-blocks' ),
    keywords: [
        __( 'icon', 'kadence-blocks' ),
        __( 'svg', 'kadence-blocks' ),
        'KB',
    ],
    icon: {
        src: iconIcon,
    },
    getEditWrapperProps( { blockAlignment } ) {
        if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
            return { 'data-align': blockAlignment };
        }
    },
    edit,
    save,
} );
