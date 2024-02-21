import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

import { formBlockIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType( 'kadence/header', {
	...metadata,
	title: _x( 'Header (Adv)', 'block title', 'kadence-blocks' ),
	description: _x( 'Create an advanced header or footer for your website.', 'block description', 'kadence-blocks' ),
	keywords: [
		__( 'header', 'kadence-blocks' ),
		__( 'footer', 'kadence-blocks' ),
		'kb',
	],
	icon: {
		src: formBlockIcon,
	},
	edit,
	save:() => {
		return <InnerBlocks.Content />;
	}
});
