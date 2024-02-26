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
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
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
registerBlockType('kadence/countdown-inner', {
	...metadata,
	title: __('Countdown Content', 'kadence-blocks'),
	description: __('Inner Container for Countdown Block', 'kadence-blocks'),
	keywords: [__('countdown', 'kadence-blocks'), __('timer', 'kadence-blocks'), 'KB'],
	icon: countdownInnerIcon,
	edit,
	save({ attributes }) {
		const { location, uniqueID } = attributes;

		const blockProps = useBlockProps.save({
			className: `kb-countdown-inner kb-countdown-inner-${location} kb-countdown-inner-${uniqueID}`,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
