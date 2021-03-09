/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons/block-icons';
/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import attributes from './attributes';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/countdown', {
	/* translators: block name */
	title: __( 'Countdown', 'kadence-blocks' ),
	/* translators: block description */
	description: __( '', 'kadence-blocks' ),
	category: 'kadence-blocks',
	icon: icons.section,
	keywords: [
		'kb',
		/* translators: block keyword */
		__( 'countdown', 'kadence-blocks' ),
		/* translators: block keyword */
		__( 'timer', 'kadence-blocks' ),
	],
	supports: {
		anchor: true,
		align: [ 'wide', 'full' ],
		reusable: false,
		html: false,
	},
	attributes,
	edit,
	save,
} );
