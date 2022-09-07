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
import { __ } from '@wordpress/i18n';
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
	title: __( 'Accordion', 'kadence-blocks' ),
	description: __( 'Create beautiful accordions! Each pane can contain any other block, customize title styles, content background, and borders.', 'kadence-blocks' ),
	keywords: [
		__( 'accordion', 'kadence-blocks' ),
		__( 'pane', 'kadence-blocks' ),
		'KB',
	],
	// getEditWrapperProps( { blockAlignment } ) {
	// 	if ( 'full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
	// 		return { 'data-align': blockAlignment };
	// 	}
	// },
	icon: {
		src: accordionBlockIcon,
	},
	edit,
	save,
	
} );
