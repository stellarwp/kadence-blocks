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
import './style.scss';
import './editor.scss';
import edit from './edit';
import KadenceColorOutput from '../../kadence-color-output';
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
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/table-of-contents', {
	title: __( 'Table of Contents' ),
	icon: {
		src: icons.block,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'table of contents' ),
		__( 'summary' ),
		__( 'KB' ),
	],
	supports: {
		ktanimate: true,
		ktanimatepreview: true,
	},
	attributes: {
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
	},
	edit,
	save: props => {
		const { attributes: { anchor, align, level, content, color, colorClass, textShadow, uniqueID, letterSpacing, topMargin, bottomMargin, marginType, className, kadenceAnimation, kadenceAOSOptions } } = props;
		const tagName = 'h' + level;
		const textColorClass = getColorClassName( 'color', colorClass );
		const mType = ( marginType ? marginType : 'px' );
		let tagId = ( anchor ? anchor : `kt-adv-heading${ uniqueID }` );
		const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
		const wrapper = ( anchor || revealAnimation ? true : false );
		tagId = ( revealAnimation && ! anchor ? `kt-adv-inner-heading${ uniqueID }` : tagId );
		//const classes = ( ! wrapper && className ? `${ className } ${ getBlockDefaultClassName( 'kadence/advancedheading' ) }` : getBlockDefaultClassName( 'kadence/advancedheading' ) );
		const classes = classnames( {
			[ `kt-adv-heading${ uniqueID }` ]: uniqueID,
			[ className ]: ! wrapper && className,
			[ getBlockDefaultClassName( 'kadence/advancedheading' ) ]: getBlockDefaultClassName( 'kadence/advancedheading' ),
			[ textColorClass ]: textColorClass,
		} );
		const htmlItem = (
			<RichText.Content
				tagName={ tagName }
				id={ tagId }
				className={ classes }
				data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
				data-aos-offset={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
				data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
				data-aos-delay={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
				data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
				data-aos-once={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
				style={ {
					textAlign: align,
					color: ! textColorClass && color ? KadenceColorOutput( color ) : undefined,
					letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
					marginTop: ( undefined !== topMargin && '' !== topMargin ? topMargin + mType : undefined ),
					marginBottom: ( undefined !== bottomMargin && '' !== bottomMargin ? bottomMargin + mType : undefined ),
					textShadow: ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable && textShadow[ 0 ].enable ? ( undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].color ? KadenceColorOutput( textShadow[ 0 ].color ) : 'rgba(0,0,0,0.2)' ) : undefined ),
				} }
				value={ content }
			/>
		);
		return (
			<Fragment>
				{ wrapper && (
					<div id={ `kt-adv-heading${ uniqueID }` } className={ `kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }${ ( className ? ' ' + className : '' ) }` }>
						{ htmlItem }
					</div>
				) }
				{ ! wrapper && (
					htmlItem
				) }
			</Fragment>
		);
	},
} );
