import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { __, _x } from '@wordpress/i18n';

import { logoBlockIcon } from '@kadence/icons';

import edit from './edit';
import metadata from './block.json';

/**
 * Import Css
 */
import './style.scss';

registerBlockType('kadence/logo', {
	...metadata,
	title: _x('Site Identity', 'block title', 'kadence-blocks'),
	description: _x('Kadence site identity block', 'block description', 'kadence-blocks'),
	keywords: [__('logo', 'kadence-blocks'), __('identity', 'kadence-blocks'), 'kb'],
	icon: {
		src: logoBlockIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
	example: {
		attributes: {
			showSiteTagline: true,
		},
	},
});
