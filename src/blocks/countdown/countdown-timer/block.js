/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../../icons/block-icons';
/**
 * Internal dependencies
 */
import edit from './edit';

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
registerBlockType( 'kadence/countdown-timer', {
	/* translators: block name */
	title: __( 'Countdown Timer', 'kadence-blocks' ),
	/* translators: block description */
	description: __( 'The countdown timer', 'kadence-blocks' ),
	category: 'kadence-blocks',
	icon: icons.section,
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
	},
	edit,
	save: props => {
		const { attributes: { uniqueID, className } } = props;
		return (
			<div className={ `kb-countdown-timer${ uniqueID } kb-countdown-timer${ ( className ? ' ' + className : '' ) }` }>
			</div>
		);
	}
} );
