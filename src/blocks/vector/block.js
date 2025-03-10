import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { __, _x } from '@wordpress/i18n';
import { vectorBlockIcon } from '@kadence/icons';

/**
 * Import Css
 */
import './style.scss';

console.log('vector');

registerBlockType('kadence/vector', {
	...metadata,
	title: _x('Vector Graphic', 'block title', 'kadence-blocks'),
	description: _x('Display SVGs on your site', 'block description', 'kadence-blocks'),
	keywords: [__('svg', 'kadence-blocks'), __('vector', 'kadence-blocks'), 'KB'],
	icon: vectorBlockIcon,
	edit,
	save: () => null,
});
