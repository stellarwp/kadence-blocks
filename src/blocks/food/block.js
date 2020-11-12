/**
 * BLOCK: Kadence Advanced Heading
 *
 * Registering a block with Gutenberg.
 */
import icons from './icons';
/**
 * Import Icons
 */
//import icons from './icon';

import classnames from 'classnames';
/**
 * Import Css
 */
//import './style.scss';
//import './editor.scss';
import edit from './edit';
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
registerBlockType( 'kadence/advancedheadingtest', {
	title: __( 'Restaurant Menu' ),
	icon: <Icon icon={ icons.block } />,
	category: 'kadence-blocks',
	keywords: [
		__( 'title' ),
		__( 'heading' ),
		__( 'KT' ),
	],
	supports: {
		ktanimate: true,
		ktanimatereveal: true,
		ktanimatepreview: true,
	},
	attributes: {
		content: {
			type: 'string',
			source: 'html',
			selector: 'h1,h2,h3,h4,h5,h6,p',
		},
		level: {
			type: 'number',
			default: 2,
		},
		uniqueID: {
			type: 'string',
		},
		align: {
			type: 'string',
		},
		color: {
			type: 'string',
		},
		size: {
			type: 'number',
		},
		sizeType: {
			type: 'string',
			default: 'px',
		},
		lineHeight: {
			type: 'number',
		},
		lineType: {
			type: 'string',
			default: 'px',
		},
		tabSize: {
			type: 'number',
		},
		tabLineHeight: {
			type: 'number',
		},
		mobileSize: {
			type: 'number',
		},
		mobileLineHeight: {
			type: 'number',
		},
		letterSpacing: {
			type: 'number',
		},
		typography: {
			type: 'string',
			default: '',
		},
		googleFont: {
			type: 'boolean',
			default: false,
		},
		loadGoogleFont: {
			type: 'boolean',
			default: true,
		},
		fontSubset: {
			type: 'string',
			default: '',
		},
		fontVariant: {
			type: 'string',
			default: '',
		},
		fontWeight: {
			type: 'string',
			default: 'regular',
		},
		fontStyle: {
			type: 'string',
			default: 'normal',
		},
		topMargin: {
			type: 'number',
			default: '',
		},
		bottomMargin: {
			type: 'number',
			default: '',
		},
		marginType: {
			type: 'string',
			default: 'px',
		},
		markSize: {
			type: 'array',
			default: [ '', '', '' ],
		},
		markSizeType: {
			type: 'string',
			default: 'px',
		},
		markLineHeight: {
			type: 'array',
			default: [ '', '', '' ],
		},
		markLineType: {
			type: 'string',
			default: 'px',
		},
		markLetterSpacing: {
			type: 'number',
		},
		markTypography: {
			type: 'string',
			default: '',
		},
		markGoogleFont: {
			type: 'boolean',
			default: false,
		},
		markLoadGoogleFont: {
			type: 'boolean',
			default: true,
		},
		markFontSubset: {
			type: 'string',
			default: '',
		},
		markFontVariant: {
			type: 'string',
			default: '',
		},
		markFontWeight: {
			type: 'string',
			default: 'regular',
		},
		markFontStyle: {
			type: 'string',
			default: 'normal',
		},
		markColor: {
			type: 'string',
			default: '#f76a0c',
		},
		markBG: {
			type: 'string',
		},
		markBGOpacity: {
			type: 'number',
			default: 1,
		},
		markPadding: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		markPaddingControl: {
			type: 'string',
			default: 'linked',
		},
		markBorder: {
			type: 'string',
		},
		markBorderOpacity: {
			type: 'number',
			default: 1,
		},
		markBorderWidth: {
			type: 'number',
			default: 0,
		},
		markBorderStyle: {
			type: 'string',
			default: 'solid',
		},
		textTransform: {
			type: 'string',
			default: '',
		},
		markTextTransform: {
			type: 'string',
			default: '',
		},
		anchor: {
			type: 'string',
		},
		colorClass: {
			type: 'string',
		},
		tabletAlign: {
			type: 'string',
		},
		mobileAlign: {
			type: 'string',
		},
		textShadow: {
			type: 'array',
			default: [ {
				enable: false,
				color: 'rgba(0, 0, 0, 0.2)',
				blur: 1,
				hOffset: 1,
				vOffset: 1,
			} ],
		},
		htmlTag: {
			type: 'string',
			default: 'heading',
		},
	},
	edit,
	save: props => {

		return (
			<Fragment>

			</Fragment>
		);
	},

} );
