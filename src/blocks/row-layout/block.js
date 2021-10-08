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
 * Import edit
 */
 import deprecated from './deprecated';
/**
 * Import save
 */
import save from './save';

import classnames from 'classnames';
import times from 'lodash/times';
const {
	Fragment,
} = wp.element;
const {
	InnerBlocks,
} = wp.blockEditor;

/**
 * Import Css
 */
// import './style.scss';
// import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
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
	title: __( 'Row Layout', 'kadence-blocks' ), // Block title.
	icon: {
		src: icons.blockRow,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'row/layout', 'kadence-blocks' ),
		__( 'column', 'kadence-blocks' ),
		'KB',
	],
	supports: {
		anchor: true,
		kbcss: true,
		ktdynamic: true,
		// Add EditorsKit block navigator toolbar
		editorsKitBlockNavigator: true,
	},
	usesContext: [ 'postId', 'queryId' ],
	attributes,
	getEditWrapperProps( { align } ) {
		if ( 'full' === align || 'wide' === align || 'center' === align ) {
			return { 'data-align': align };
		}
	},
	edit,

	save,
	deprecated,
} );
