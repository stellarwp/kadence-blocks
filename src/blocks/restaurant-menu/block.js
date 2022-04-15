/**
 * BLOCK: Kadence Restaurant Menu
 */

/**
 * Internal dependencies
 */
import icons from './icons';
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
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const { registerBlockType } = wp.blocks;
const { Fragment }          = wp.element;
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
registerBlockType( 'kadence/restaurantmenu', {
	title: __( 'Restaurant Menu' ),
	icon: <Icon icon={ icons.block } />,
	category: 'kadence-blocks',
	keywords: ['restaurant menu', 'food', 'drinks'],
	description: __( 'In the restaurant, a menu is a list of food and beverages offered to customers and the prices.' ),
	attributes,
	edit,
	save
} );
