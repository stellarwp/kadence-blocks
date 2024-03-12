/**
 * BLOCK: Kadence Icon
 */

import metadata from './block.json';

/**
 * Import Icon stuff
 */
import { advancedBtnIcon } from '@kadence/icons';
import edit from './edit';

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
registerBlockType('kadence/singlebtn', {
	...metadata,
	title: __('Single Button', 'kadence-blocks'),
	description: __('Single button within a button block', 'kadence-blocks'),
	keywords: [__('Button', 'kadence-blocks'), __('btn', 'kadence-blocks'), 'KB'],
	icon: {
		src: advancedBtnIcon,
	},
	edit,
	save() {
		return null;
	},
	example: {
		attributes: {
			text: __('Click Me!', 'kadence-blocks'),
		},
	},
});
