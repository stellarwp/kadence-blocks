import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { tableRowBlockIcon } from '@kadence/icons';
import { __, _x } from '@wordpress/i18n';

/**
 * Import Css
 */
import './style.scss';

registerBlockType('kadence/table-row', {
	...metadata,
	title: _x('Table Row', 'block title', 'kadence-blocks'),
	description: _x('Display tables on your site', 'block description', 'kadence-blocks'),
	keywords: [__('table', 'kadence-blocks'), __('structure', 'kadence-blocks'), 'KB'],
	icon: {
		src: tableRowBlockIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
	example: {},
});
