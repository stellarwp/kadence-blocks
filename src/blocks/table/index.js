import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { tableBlockIcon } from '@kadence/icons';
import { __, _x } from '@wordpress/i18n';

import './children/row/index';
import './children/data/index';

/**
 * Import Css
 */
import './style.scss';

registerBlockType('kadence/table', {
	...metadata,
	title: _x('Table (Adv)', 'block title', 'kadence-blocks'),
	description: _x('Display tables on your site', 'block description', 'kadence-blocks'),
	keywords: [__('table', 'kadence-blocks'), __('structure', 'kadence-blocks'), 'KB'],
	icon: {
		src: tableBlockIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
	example: {},
});
