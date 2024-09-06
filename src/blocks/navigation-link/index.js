/**
 * WordPress dependencies
 */
import { _x, __ } from '@wordpress/i18n';
import { navigationItemIcon } from '@kadence/icons';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import { enhanceNavigationLinkVariations } from './hooks';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

registerBlockType(name, {
	...metadata,
	title: __('Kadence Navigation Link', 'kadence-blocks'),
	icon: navigationItemIcon,
	__experimentalLabel: ({ label }) => label,
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
	example: {
		attributes: {
			label: _x('Example Link', 'navigation link preview example'),
			url: 'https://example.com',
		},
	},
	transforms,
});
