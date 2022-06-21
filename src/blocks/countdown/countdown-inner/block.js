/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import { countdownInnerIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/countdown-inner', {
	/* translators: block name */
	title: __( 'Countdown Content', 'kadence-blocks' ),
	/* translators: block description */
	description: __( 'Inner Container for Countdown Block', 'kadence-blocks' ),
	category: 'kadence-blocks',
	icon: countdownInnerIcon,
	parent: [ 'kadence/countdown' ],
	supports: {
		inserter: false,
		reusable: false,
		html: false,
	},
	attributes: {
		uniqueID: {
			type: 'string',
		},
		location: {
			type: 'string',
		},
	},
	edit,
	save( { attributes } ) {
		const { location, uniqueID } = attributes;
		return (
			<div className={ `kb-countdown-inner kb-countdown-inner-${ location } kb-countdown-inner-${ uniqueID }` }>
				<InnerBlocks.Content />
			</div>
		);
	},
} );
