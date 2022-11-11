/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Import Icons
 */
import { blockRowIcon } from '@kadence/icons';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Import Css
 */
 import './style.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import deprecated from './deprecated';

registerBlockType( 'kadence/rowlayout', {
	...metadata,
	title: __( 'Row Layout', 'kadence-blocks' ),
	description: __( 'A container to hold a grid layout.', 'kadence-blocks' ),
	keywords: [
		__( 'column', 'kadence-blocks' ),
		__( 'row/layout', 'kadence-blocks' ),
		'KB',
	],
	icon: {
		src: blockRowIcon,
	},
	edit,
	save,
	deprecated,
	supports: {
		anchor: true,
		ktdynamic: true,
		kbcss: true,
	  }
});
