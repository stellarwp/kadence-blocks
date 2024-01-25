/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
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
	title: _x( 'Row Layout', 'block title', 'kadence-blocks' ),
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
	example: {
		attributes: {
			colLayout: 'equal',
			columns: 2,
			customGutter: [ 0, 0, 0 ]
		},
		innerBlocks: [
			{
				name: 'kadence/column',
				attributes: {
					background: '#DADADA',
					padding: [ 30, 20, 30, 20 ],
				},
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: {
							content: __( 'Column 1', 'kadence-blocks' ),
						}
					}
				]
			},
			{
				name: 'kadence/column',
				attributes: {
					background: '#f5f5f5',
					padding: [ 30, 20, 30, 20 ],
				},
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: {
							content: __( 'Column 2', 'kadence-blocks' ),
						}
					}
				]
			}
		]
	}
});
