/**
 * BLOCK: Kadence Accordion.
 */
/**
 * Register sub blocks.
 */
 import './pane/block.js';

/**
 * Import Icons
 */
import { accordionBlockIcon } from '@kadence/icons';

/**
 * Import block.json
 */
import metadata from './block.json';
/**
 * Import edit
 */
import edit from './edit';
/**
 * Import edit
 */
 import deprecated from './deprecated';
/**
 * Import save
 */
import save from './save';
/**
 * Import Css
 */
 import './style.scss';

/**
 * Internal block libraries
 */
import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/accordion', {
	...metadata,
	title: _x( 'Accordion', 'block title', 'kadence-blocks' ),
	description: __( 'Create beautiful accordions! Each pane can contain any other block, customize title styles, content background, and borders.', 'kadence-blocks' ),
	keywords: [
		__( 'accordion', 'kadence-blocks' ),
		__( 'pane', 'kadence-blocks' ),
		'KB',
	],
	icon: {
		src: accordionBlockIcon,
	},
	edit,
	save,
	example: {
		attributes: {
			uniqueID: '123456789',
		},
		innerBlocks: [
			{
				name: 'kadence/pane',
				attributes: {
					id: 1,
					title: [
						__( 'First Heading', 'kadence-blocks' ),
					],
				},
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: {
							content: __( 'This is an example of an accordion. You can add any block to the accordion pane. You can also add multiple panes to the accordion.', 'kadence-blocks' ),
						}
					}
				]
			},
			{
				name: 'kadence/pane',
				attributes: {
					id: 2,
					title: [
						__( 'Second Heading', 'kadence-blocks' ),
					],
				},
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: {
							content: __( 'Hello World', 'kadence-blocks' ),
						}
					}
				]
			}
		]
	}
} );
