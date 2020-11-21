/**
 * BLOCK: Kadence Restaurant Menu Category Item
 */

/**
 * Internal dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ }                = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Icon }              = wp.components;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/restaurantmenuitem', {
	title: __( 'Menu Item' ),
	category: 'kadence-blocks',
	parent: [ 'kadence/restaurantmenu' ],
	supports: {
		inserter: false
	},
	getEditWrapperProps( attributes ) {
		return {
		};
	},
	attributes,
	edit,
	save
} );
