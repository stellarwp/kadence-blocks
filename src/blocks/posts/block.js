/**
 * BLOCK: Kadence Latest Posts
 *
 * Registering a block with Gutenberg.
 */

/**
 * Import Icons
 */
import { postsIcon } from '@kadence/icons';

/**
 * Import Css
 */
import './editor.scss';
import './style.scss';

import edit from './edit';
import metadata from './block.json';

/**
 * Internal block libraries
 */
import { registerBlockType } from '@wordpress/blocks';
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
registerBlockType('kadence/posts', {
	...metadata,
	title: _x('Posts', 'block title', 'kadence-blocks'),
	keywords: [__('posts', 'kadence-blocks'), __('latest posts', 'kadence-blocks'), __('blog', 'kadence-blocks'), 'KB'],
	icon: {
		src: postsIcon,
	},
	edit,
	save() {
		return null;
	},
	example: {
		attributes: {
			columns: 1,
			postsToShow: 2,
		},
	},
});
