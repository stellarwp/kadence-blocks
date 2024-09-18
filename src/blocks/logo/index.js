import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { __, _x } from '@wordpress/i18n';

import { searchBlockIcon } from '@kadence/icons';

import edit from './edit';
import metadata from './block.json';

/**
 * Import Css
 */
import './style.scss';

registerBlockType('kadence/logo', {
	...metadata,
	title: _x('Logo', 'block title', 'kadence-blocks'),
	description: _x('Kadence logo block', 'block description', 'kadence-blocks'),
	keywords: [__('logo', 'kadence-blocks'), __('image', 'kadence-blocks'), 'kb'],
	icon: {
		src: searchBlockIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
	example: {
		attributes: {},
	},
});
