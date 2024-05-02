import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

import { headerTabletBlockIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType('kadence/header-tablet-container', {
	...metadata,
	title: _x('Header Tablet/Mobile', 'block title', 'kadence-blocks'),
	description: _x('Header content for tablet and mobile devices.', 'block description', 'kadence-blocks'),
	icon: {
		src: headerTabletBlockIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
