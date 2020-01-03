/**
 * BLOCK: Kadence Map
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
const { __, sprintf } = wp.i18n;
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
registerBlockType( 'kadence/header', {
	title: __( 'Header' ),
	icon: {
		src: icons.blocktabs,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'header' ),
		__( 'navigation' ),
		__( 'KB' ),
	],
	supports: {
		anchor: true,
		align: [ 'wide', 'full' ],
	},
	attributes,
	edit,
	save,
} );
