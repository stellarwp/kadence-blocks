/**
 * BLOCK: Kadence Advanced Heading
 *
 * Registering a block with Gutenberg.
 */
import icons from './icons';
import attributes from './attributes';
import edit from './edit';
import save from './save';
/**
 * Import Icons
 */
//import icons from './icon';

import classnames from 'classnames';
/**
 * Import Css
 */

//import backwardCompatibility from './deprecated';
//import KadenceColorOutput from '../../kadence-color-output';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	registerBlockType,
	createBlock,
	getBlockDefaultClassName,
} = wp.blocks;
const {
	Fragment,
} = wp.element;
const {
	RichText,
	getColorClassName,
} = wp.blockEditor;

const {
	Icon,
} = wp.components;

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
	attributes,
	edit,
	save
} );
