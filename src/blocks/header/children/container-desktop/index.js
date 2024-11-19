import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

import { headerDesktopBlockIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType('kadence/header-desktop-container', {
	...metadata,
	title: _x('Header Desktop', 'block title', 'kadence-blocks'),
	description: _x('Header content for desktop.', 'block description', 'kadence-blocks'),
	icon: {
		src: headerDesktopBlockIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
