/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Register sub blocks.
 */
 import './countdown-timer/block.js';
 import './countdown-inner/block.js';

/**
 * Import Icons
 */
import { countdownIcon } from '@kadence/icons';
/**
 * Import Css
 */
 import './style.scss';
/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * WordPress dependencies
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
registerBlockType( 'kadence/countdown', {
	...metadata,
	title: __( 'Countdown', 'kadence-blocks' ),
	description: __( 'The countdown timer', 'kadence-blocks' ),
	keywords: [
		__( 'countdown', 'kadence-blocks' ),
		__( 'timer', 'kadence-blocks' ),
		'KB',
	],
	icon: countdownIcon,
	edit,
	save,
} );
