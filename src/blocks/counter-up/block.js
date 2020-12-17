/**
 * BLOCK: Kadence Counter Up
 */

/**
 * Import Icons
 */
import icons from './icon';

/**
 * Import attributes
 */
import attributes from './attributes';

/**
 * Import External
 */
import classnames from 'classnames';

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
const { __ }                = wp.i18n;
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
registerBlockType( 'kadence/counterup', {
	title: __( 'Counter Up' ),
	icon: <Icon icon={ icons.block } />,
	category: 'kadence-blocks',
	keywords: ['count down', 'counter', 'count up', 'number spinner'],
	description: __( 'As well as counting up from zero and increasing to some preset value.' ),
	attributes,
	edit,
	save
} );
