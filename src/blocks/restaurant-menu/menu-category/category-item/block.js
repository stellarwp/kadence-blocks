/**
 * BLOCK: Kadence Advanced Heading
 *
 * Registering a block with Gutenberg.
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';
/**
 * Import Icons
 */
//import icons from './icon';

import classnames from 'classnames';
import './editor.scss';

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
registerBlockType( 'kadence/restaurantmenuitem', {
	title: __( 'Menu Item' ),
	category: 'kadence-blocks',
	parent: [ 'kadence/restaurantmenu' ],
	supports: {
		inserter: false
	},
	getEditWrapperProps( attributes ) {
		return {
			style: {
				width: '33.333333%'
			}
		};
	},
	attributes,
	edit,
	save
} );
