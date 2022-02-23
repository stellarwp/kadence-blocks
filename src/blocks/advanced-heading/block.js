/**
 * BLOCK: Kadence Advanced Heading
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
// import './style.scss';
// import './editor.scss';
import edit from './edit';
import backwardCompatibility from './deprecated';
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
import { 
	RichText,
	getColorClassName,
} from '@wordpress/block-editor';
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
	title: __( 'Advanced Text', 'kadence-blocks' ),
	description: __( 'Create a heading or paragraph and define sizes for desktop, tablet and mobile along with font family, colors, etc.', 'kadence-blocks' ),
	icon: {
		src: icons.block,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'title', 'kadence-blocks' ),
		__( 'heading', 'kadence-blocks' ),
		__( 'text', 'kadence-blocks' ),
		'kb',
	],
	supports: {
		ktanimate: true,
		ktanimatereveal: true,
		ktanimatepreview: true,
		ktdynamic: true,
	},
	usesContext: [ 'postId', 'queryId' ],
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
			default: '',
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
		leftMargin: {
			type: 'number',
			default: '',
		},
		rightMargin: {
			type: 'number',
			default: '',
		},
		marginType: {
			type: 'string',
			default: 'px',
		},
		tabletMargin: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		mobileMargin: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		tabletMarginType: {
			type: 'string',
			default: 'px',
		},
		mobileMarginType: {
			type: 'string',
			default: 'px',
		},
		paddingType: {
			type: 'string',
			default: 'px',
		},
		padding: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		tabletPadding: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		mobilePadding: {
			type: 'array',
			default: [ '', '', '', '' ],
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
			default: '',
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
		markTabPadding: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		markMobilePadding: {
			type: 'array',
			default: [ '', '', '', '' ],
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
		loadItalic: {
			type: 'boolean',
			default: false,
		},
		link: {
			type: 'string',
		},
		linkTarget: {
			type: 'boolean',
			default: false,
		},
		linkNoFollow: {
			type: 'boolean',
			default: false,
		},
		linkSponsored: {
			type: 'boolean',
			default: false,
		},
		background: {
			type: 'string',
		},
		backgroundColorClass: {
			type: 'string',
		},
		linkStyle: {
			type: 'string',
		},
		linkColor: {
			type: 'string',
		},
		linkHoverColor: {
			type: 'string',
		},
		inQueryBlock: {
			type: 'bool',
			default: false,
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
		const { attributes: { anchor, level, content, colorClass, color, textShadow, letterSpacing, topMargin, bottomMargin, marginType, align, uniqueID, className, kadenceAnimation, kadenceAOSOptions, htmlTag, link, linkNoFollow, linkSponsored, linkTarget, backgroundColorClass, linkStyle } } = props;
		const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
		const mType = ( marginType ? marginType : 'px' );
		const textColorClass = getColorClassName( 'color', colorClass );
		const textBackgroundColorClass = getColorClassName( 'background-color', backgroundColorClass );
		const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
		const wrapper = ( revealAnimation ? true : false );
		const classes = classnames( {
			[ `kt-adv-heading${ uniqueID }` ]: uniqueID,
			[ className ]: ! wrapper && ! link && className,
			[ getBlockDefaultClassName( 'kadence/advancedheading' ) ]: getBlockDefaultClassName( 'kadence/advancedheading' ),
			[ textColorClass ]: textColorClass,
			'has-text-color': textColorClass,
			[ textBackgroundColorClass ]: textBackgroundColorClass,
			'has-background': textBackgroundColorClass,
			[ `hls-${ linkStyle }` ]: ! link && linkStyle
		} );
		let relAttr;
		if ( linkTarget ) {
			relAttr = 'noopener noreferrer';
		}
		if ( undefined !== linkNoFollow && true === linkNoFollow ) {
			relAttr = ( relAttr ? relAttr.concat( ' nofollow' ) : 'nofollow' );
		}
		if ( undefined !== linkSponsored && true === linkSponsored ) {
			relAttr = ( relAttr ? relAttr.concat( ' sponsored' ) : 'sponsored' );
		}
		//const readyContent = ( link ? `<a href="${link}" class="kb-advanced-heading-link"${ linkTarget ? ' target="_blank"' : '' }${ relAttr ? ` rel="${relAttr}"` : '' }>${content}</a>` : content );
		const htmlItem = (
			<RichText.Content
				tagName={ tagName }
				id={ anchor ? anchor : undefined }
				className={ classes }
				data-kb-block={ `kb-adv-heading${ uniqueID }` }
				data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
				data-aos-offset={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
				data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
				data-aos-delay={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
				data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
				data-aos-once={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
				value={ content }
			/>
		);
		const linkHTMLItem = (
			<a
				href={ link }
				className={ `kb-advanced-heading-link kt-adv-heading-link${ uniqueID }${ ( ! wrapper && className ? ' ' + className : '' ) }${ ( linkStyle ? ' hls-' + linkStyle : '' ) }` }
				target={ linkTarget ? '_blank' : undefined }
				rel={ relAttr ? relAttr : undefined }
			>
				{ htmlItem }
			</a>
		);
		const readyContent = ( link ? linkHTMLItem : htmlItem );
		return (
			<Fragment>
				{ wrapper && (
					<div className={ `kb-adv-heading-wrap${ uniqueID } kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }${ ( className ? ' ' + className : '' ) }` }>
						{ readyContent }
					</div>
				) }
				{ ! wrapper && (
					readyContent
				) }
			</Fragment>
		);
	},
	deprecated: backwardCompatibility,
} );
