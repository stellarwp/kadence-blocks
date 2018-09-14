/**
 * BLOCK: Kadence Row / Layout
 */

/**
 * Import Icons
 */
import icons from '../../icons';
/**
 * Import attributes
 */
import attributes from './attributes';
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
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/rowlayout', {
	title: __( 'Row Layout' ), // Block title.
	icon: {
		src: icons.blockRow,
	},
	category: 'layout',
	keywords: [
		__( 'row' ),
		__( 'layout' ),
		__( 'KT' ),
	],
	supports: {
		anchor: true,
	},
	attributes,
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,

	save,
} );
