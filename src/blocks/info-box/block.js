/**
 * BLOCK: Kadence Info Box
 */

/**
 * Import Icons
 */
import { infoboxIcon } from '@kadence/icons';
import metadata from './block.json';
import deprecated from './deprecated.js'
import save from './save';

import { IconRender, IconSpanTag } from '@kadence/components';

/**
 * Import edit
 */
import edit from './edit';
/**
 * Import Css
 */
 import './style.scss';

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
registerBlockType( 'kadence/infobox', {
	...metadata,
	title: __( 'Info Box', 'kadence-blocks' ),
	description: __( 'Create beautiful information boxes using icons or images.', 'kadence-blocks' ),
	keywords: [
		__( 'icon', 'kadence-blocks' ),
		__( 'info', 'kadence-blocks' ),
		'KB',
	],
	icon: {
		src: infoboxIcon,
	},
	deprecated,
	edit,
	save,
} );
