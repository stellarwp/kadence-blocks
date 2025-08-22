/**
 * BLOCK: Kadence Icon List
 */
/**
 * Register sub blocks.
 */
import '../listitem/block.js';

import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';
import metadata from './block.json';

/**
 * Import Icon stuff
 */
import { iconListBlockIcon } from '@kadence/icons';
import { times } from 'lodash';

/**
 * Import Css
 */
import './style.scss';

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
registerBlockType('kadence/iconlist', {
	...metadata,
	title: _x('Icon List', 'block title', 'kadence-blocks'),
	description: _x('Create engaging lists with icons for bullets.', 'block description', 'kadence-blocks'),
	keywords: [__('list', 'kadence-blocks'), __('svg', 'kadence-blocks'), 'KB'],
	icon: {
		src: iconListBlockIcon,
	},
	transforms,
	getEditWrapperProps({ blockAlignment }) {
		if ('left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment) {
			return { 'data-align': blockAlignment };
		}
	},
	deprecated,
	edit,
	save,
	example: {
		innerBlocks: times(3, (n) => {
			return {
				name: 'kadence/listitem',
				attributes: {
					text: __('List Item', 'kadence-blocks'),
				},
			};
		}),
	},
});
