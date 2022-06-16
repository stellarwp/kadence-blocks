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
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	...metadata,
	icon: {
		src: accordionBlockIcon,
	},
	edit,
	save,
} );
