/**
 * BLOCK: Kadence Icon
 */

import metadata from './block.json';

/**
 * Register sub blocks.
 */
import '../single-icon/block.js';

/**
 * Import Icon stuff
 */
import { iconIcon } from '@kadence/icons';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

/**
 * Import Css
 */
 import './style.scss';

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
registerBlockType( 'kadence/icon', {
	...metadata,
	title: __( 'Icon', 'kadence-blocks' ),
	description: __( 'Create engaging lists with icons for bullets.', 'kadence-blocks' ),
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
	deprecated,
} );
