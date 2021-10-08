/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons/block-icons';
/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import attributes from './attributes';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
registerBlockType( 'kadence/column', {
	/* translators: block name */
	title: __( 'Section', 'kadence-blocks' ),
	/* translators: block description */
	description: __( 'An inner section of content.', 'kadence-blocks' ),
	category: 'kadence-blocks',
	icon: icons.section,
	parent: [ 'kadence/rowlayout' ],
	keywords: [
		'kb',
		/* translators: block keyword */
		__( 'column', 'kadence-blocks' ),
		/* translators: block keyword */
		__( 'section', 'kadence-blocks' ),
	],
	supports: {
		inserter: false,
		reusable: false,
		html: false,
		ktanimate: true,
		ktanimateadd: true,
		ktanimatepreview: true,
		ktanimateswipe: true,
		kbcss: true,
		ktdynamic: true,
		// Add EditorsKit block navigator toolbar.
		editorsKitBlockNavigator: true,
	},
	usesContext: [ 'postId', 'queryId' ],
	getEditWrapperProps( { verticalAlignment } ) {
		if ( 'top' === verticalAlignment || 'middle' === verticalAlignment || 'bottom' === verticalAlignment ) {
			return { 'data-vertical-align': verticalAlignment };
		}
	},
	attributes,
	edit,
	save,
	deprecated,
} );
