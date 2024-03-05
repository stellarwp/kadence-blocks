import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { tableOfContentsIcon } from '@kadence/icons';

/**
 * Import Css
 */
import './editor.scss';
import './style.scss';
import { __, _x } from '@wordpress/i18n';

registerBlockType('kadence/tableofcontents', {
	...metadata,
	title: _x('Table of Contents', 'block title', 'kadence-blocks'),
	keywords: [__('table of contents', 'kadence-blocks'), __('summary', 'kadence-blocks'), 'KB'],
	icon: {
		src: tableOfContentsIcon,
	},
	edit,
	save() {
		return null;
	},
	example: {},
});
