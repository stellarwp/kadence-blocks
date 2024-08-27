import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

import { showMoreIcon } from '@kadence/icons';

import edit from './edit';
import metadata from './block.json';

registerBlockType('kadence/search', {
	...metadata,
	title: _x('Search', 'block title', 'kadence-blocks'),
	description: _x('Kadence search block', 'block description', 'kadence-blocks'),
	keywords: [__('search', 'kadence-blocks'), __('find', 'kadence-blocks'), 'kb'],
	icon: {
		src: showMoreIcon,
	},
	edit,
	save: () => null,
	example: {
		attributes: {},
	},
});
