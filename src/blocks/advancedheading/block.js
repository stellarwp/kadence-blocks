/**
 * BLOCK: Kadence Advanced Heading
 *
 * Registering a block with Gutenberg.
 */

/**
 * Import Icons
 */
import { advancedHeadingIcon } from '@kadence/icons';

/**
 * Import Css
 */
import './style.scss';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import backwardCompatibility from './deprecated';

/**
 * Internal block libraries
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('kadence/advancedheading', {
	...metadata,
	title: _x('Text (Adv)', 'block title', 'kadence-blocks'),
	description: __(
		'Create a heading or paragraph and define sizes for desktop, tablet and mobile along with font family, colors, etc.',
		'kadence-blocks'
	),
	keywords: [__('text', 'kadence-blocks'), __('advanced', 'kadence-blocks'), __('heading', 'kadence-blocks'), 'KB'],
	icon: {
		src: advancedHeadingIcon,
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: ['core/paragraph'],
				transform: ({ content }) => {
					return createBlock('kadence/advancedheading', {
						content,
						htmlTag: 'p',
					});
				},
			},
			{
				type: 'block',
				blocks: ['core/heading'],
				transform: ({ content, level }) => {
					return createBlock('kadence/advancedheading', {
						content,
						level,
					});
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: ['core/paragraph'],
				transform: ({ content }) => {
					return createBlock('core/paragraph', {
						content,
					});
				},
			},
			{
				type: 'block',
				blocks: ['core/heading'],
				transform: ({ content, level }) => {
					return createBlock('core/heading', {
						content,
						level,
					});
				},
			},
		],
	},
	edit,
	save,
	deprecated: backwardCompatibility,
	example: {
		attributes: {
			content: __('Example Heading', 'kadence-blocks'),
		},
	},
});
