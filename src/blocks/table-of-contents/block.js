/**
 * BLOCK: Kadence Table of Content
 *
 * Registering a block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from './icon';

import classnames from 'classnames';
/**
 * Import Css
 */
import './editor.scss';



import edit from './edit';
import KadenceColorOutput from '../../kadence-color-output';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
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

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/tableofcontents', {
	title: __( 'Table of Contents', 'kadence-blocks' ),
	icon: {
		src: icons.block,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'table of contents', 'kadence-blocks' ),
		__( 'summary', 'kadence-blocks' ),
		'KB',
	],
	supports: {
		html: false,
		//align: [ 'left', 'right', 'center' ],
	},
	attributes: {
		uniqueID: {
			type: 'string',
		},
		allowedHeaders: {
			type: 'array',
			default: [ {
				h1: true,
				h2: true,
				h3: true,
				h4: true,
				h5: true,
				h6: true,
			} ],
		},
		columns: {
			type: 'number',
			default: 1,
		},
		listStyle: {
			type: 'string',
			default: 'disc',
		},
		linkStyle: {
			type: 'string',
			default: 'underline',
		},
		containerPadding: {
			type: 'array',
			default: [ 20, 20, 20, 20 ],
		},
		containerPaddingUnit: {
			type: 'string',
			default: 'px',
		},
		containerBackground: {
			type: 'string',
			default: '',
		},
		containerBorderColor: {
			type: 'string',
			default: '',
		},
		containerBorder: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		enableTitle: {
			type: 'boolean',
			default: true,
		},
		titleAlign: {
			type: 'string',
		},
		title: {
			type: 'string',
			default: __( 'Table Of Contents', 'kadence-blocks' ),
		},
		titleColor: {
			type: 'string',
		},
		titleSize: {
			type: 'array',
			default: [ '', '', '' ],
		},
		titleSizeType: {
			type: 'string',
			default: 'px',
		},
		titleLineHeight: {
			type: 'array',
			default: [ '', '', '' ],
		},
		titleLineType: {
			type: 'string',
			default: 'px',
		},
		titleLetterSpacing: {
			type: 'number',
		},
		titleTypography: {
			type: 'string',
			default: '',
		},
		titleGoogleFont: {
			type: 'boolean',
			default: false,
		},
		titleLoadGoogleFont: {
			type: 'boolean',
			default: true,
		},
		titleFontSubset: {
			type: 'string',
			default: '',
		},
		titleFontVariant: {
			type: 'string',
			default: '',
		},
		titleFontWeight: {
			type: 'string',
			default: 'regular',
		},
		titleFontStyle: {
			type: 'string',
			default: 'normal',
		},
		titlePadding: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		titleBorder: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		titleBorderColor: {
			type: 'string',
		},
		titleCollapseBorderColor: {
			type: 'string',
		},
		titleTextTransform: {
			type: 'string',
			default: '',
		},
		enableToggle: {
			type: 'boolean',
			default: false,
		},
		startClosed: {
			type: 'boolean',
			default: false,
		},
		toggleIcon: {
			type: 'string',
			default: 'arrow',
		},
		contentColor: {
			type: 'string',
		},
		contentHoverColor: {
			type: 'string',
		},
		contentSize: {
			type: 'array',
			default: [ '', '', '' ],
		},
		contentSizeType: {
			type: 'string',
			default: 'px',
		},
		contentLineHeight: {
			type: 'array',
			default: [ '', '', '' ],
		},
		contentLineType: {
			type: 'string',
			default: 'px',
		},
		contentLetterSpacing: {
			type: 'number',
		},
		contentTypography: {
			type: 'string',
			default: '',
		},
		contentGoogleFont: {
			type: 'boolean',
			default: false,
		},
		contentLoadGoogleFont: {
			type: 'boolean',
			default: true,
		},
		contentFontSubset: {
			type: 'string',
			default: '',
		},
		contentFontVariant: {
			type: 'string',
			default: '',
		},
		contentFontWeight: {
			type: 'string',
			default: 'regular',
		},
		contentFontStyle: {
			type: 'string',
			default: 'normal',
		},
		contentMargin: {
			type: 'array',
			default: [ 20, 0, 0, 0 ],
		},
		contentTextTransform: {
			type: 'string',
			default: '',
		},
		listGap: {
			type: 'array',
			default: [ '', '', '' ],
		},
		borderRadius: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		maxWidth: {
			type: 'number',
			default: '',
		},
		maxWidthType: {
			type: 'string',
			default: 'px',
		},
		displayShadow: {
			type: 'bool',
			default: false,
		},
		shadow: {
			type: 'array',
			default: [ {
				color: '#000000',
				opacity: 0.2,
				spread: 0,
				blur: 14,
				hOffset: 0,
				vOffset: 0,
				inset: false,
			} ],
		},
		enableScrollSpy: {
			type: 'boolean',
			default: false,
		},
		contentActiveColor: {
			type: 'string',
		},
		enableSmoothScroll: {
			type: 'boolean',
			default: false,
		},
		smoothScrollOffset: {
			type: 'number',
			default: 40,
		},
		containerMargin: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		containerTabletMargin: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		containerMobileMargin: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
	},
	edit,
	save() {
		return null;
	},
} );
