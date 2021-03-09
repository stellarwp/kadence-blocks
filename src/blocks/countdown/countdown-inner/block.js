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
registerBlockType( 'kadence/countdown-content', {
	/* translators: block name */
	title: __( 'Countdown Content', 'kadence-blocks' ),
	/* translators: block description */
	description: __( 'Inner Container for Countdown Block', 'kadence-blocks' ),
	category: 'kadence-blocks',
	icon: icons.section,
	parent: [ 'kadence/countdown' ],
	supports: {
		inserter: false,
		reusable: false,
		html: false,
	},
	attributes,
	edit,
	save,
} );
