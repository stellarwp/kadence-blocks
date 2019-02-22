/**
 * BLOCK: Kadence Advanced Heading
 *
 * Registering a block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from './icon';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';
import edit from './edit';
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
} = wp.editor;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/advancedheading', {
	title: __( 'Advanced Heading' ),
	icon: {
		src: icons.block,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'title' ),
		__( 'heading' ),
		__( 'KT' ),
	],
	supports: {
		ktanimate: true,
	},
	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'h1,h2,h3,h4,h5,h6',
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
		anchor: {
			type: 'string',
		},
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'kadence/advancedheading', {
						content,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/heading' ],
				transform: ( { content, level } ) => {
					return createBlock( 'kadence/advancedheading', {
						content: content,
						level: level,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'core/paragraph', {
						content,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/heading' ],
				transform: ( { content, level } ) => {
					return createBlock( 'core/heading', {
						content: content,
						level: level,
					} );
				},
			},
		],
	},
	edit,
	save: props => {
		const { attributes: { anchor, align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType, className, kadenceAnimation } } = props;
		const tagName = 'h' + level;
		const mType = ( marginType ? marginType : 'px' );
		const tagId = ( anchor ? anchor : `kt-adv-heading${ uniqueID }` );
		const wrapper = ( anchor || ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation ||'reveal-down' === kadenceAnimation ) ) ? true : false );
		const classes = ( className ? `${ className } ${ getBlockDefaultClassName( 'kadence/advancedheading' ) }` : getBlockDefaultClassName( 'kadence/advancedheading' ) );
		const htmlItem = (
			<RichText.Content
				tagName={ tagName }
				id={ tagId }
				className={ `kt-adv-heading${ uniqueID } ${ classes }` }
				data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
				style={ {
					textAlign: align,
					color: color,
					letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
					marginTop: ( topMargin ? topMargin + mType : undefined ),
					marginBottom: ( bottomMargin ? bottomMargin + mType : undefined ),
				} }
				value={ content }
			/>
		);
		return (
			<Fragment>
				{ wrapper && (
					<div id={ `kt-adv-heading${ uniqueID }` } className={ `kadence-advanced-heading-wrapper${ ( kadenceAnimation ? ' kadence-heading-clip-animation' : '' ) }` }>
						{ htmlItem }
					</div>
				) }
				{ ! wrapper && (
					htmlItem
				) }
			</Fragment>
		);
	},
	deprecated: [
		{
			attributes: {
				content: {
					type: 'array',
					source: 'children',
					selector: 'h1,h2,h3,h4,h5,h6',
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
			},
			save: ( { attributes } ) => {
				const { align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType } = attributes;
				const tagName = 'h' + level;
				const mType = ( marginType ? marginType : 'px' );
				return (
					<RichText.Content
						tagName={ tagName }
						id={ `kt-adv-heading${ uniqueID }` }
						style={ {
							textAlign: align,
							color: color,
							letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
							marginTop: ( topMargin ? topMargin + mType : undefined ),
							marginBottom: ( bottomMargin ? bottomMargin + mType : undefined ),
						} }
						value={ content }
					/>
				);
			},
		},
		{
			attributes: {
				content: {
					type: 'array',
					source: 'children',
					selector: 'h1,h2,h3,h4,h5,h6',
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
			},
			save: ( { attributes } ) => {
				const { align, level, content, color, uniqueID, letterSpacing } = attributes;
				const tagName = 'h' + level;
				return (
					<RichText.Content
						tagName={ tagName }
						id={ `kt-adv-heading${ uniqueID }` }
						style={ {
							textAlign: align,
							color: color,
							letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
						} }
						value={ content }
					/>
				);
			},
		},
	],
} );
