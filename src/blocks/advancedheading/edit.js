/**
 * BLOCK: Kadence Advanced Heading
 *
 */
/* global kadence_blocks_params */
/**
 * Internal dependencies
 */
import classnames from 'classnames';
import {
	PopColorControl,
	TextShadowControl,
	TypographyControls,
	InlineTypographyControls,
	ResponsiveMeasurementControls,
	ResponsiveRangeControls,
	BorderControl,
	KadencePanelBody,
	URLInputControl,
	KadenceWebfontLoader,
	HeadingLevelIcon,
	InlinePopColorControl,
	ResponsiveAlignControls,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	ResponsiveUnitControl,
	TwoColumn,
	ColorGroup,
	ResponsiveFontSizeControl,
	KadenceRadioButtons,
	TagSelect,
	ResponsiveBorderControl,
} from '@kadence/components';

import {
	KadenceColorOutput,
	showSettings,
	getPreviewSize,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	getFontSizeOptionOutput,
	getBorderStyle,
	getUniqueId,
	getInQueryBlock,
	setBlockDefaults,
} from '@kadence/helpers';

/**
 * Block dependencies
 */
import HeadingStyleCopyPaste from './copy-paste-style';
import './markformat';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {
	createBlock,
} from '@wordpress/blocks';
import {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	RichText,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Fragment,
	useEffect,
	useState,
} from '@wordpress/element';

import {
	ToolbarGroup,
	Spinner,
	SelectControl,
	TextControl,
} from '@wordpress/components';

import {
	applyFilters,
} from '@wordpress/hooks';

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

function KadenceAdvancedHeading( props ) {

	const { attributes, className, setAttributes, mergeBlocks, onReplace, clientId, getPreviewDevice, addUniqueID, isUniqueID, isUniqueBlock, context } = props;
	const {
		inQueryBlock,
		uniqueID,
		align,
		level,
		content,
		color,
		colorClass,
		textShadow,
		mobileAlign,
		tabletAlign,
		size,
		sizeType,
		lineType,
		lineHeight,
		tabLineHeight,
		tabSize,
		mobileSize,
		mobileLineHeight,
		letterSpacing,
		typography,
		fontVariant,
		fontWeight,
		fontStyle,
		fontSubset,
		googleFont,
		loadGoogleFont,
		marginType,
		topMargin,
		bottomMargin,
		markSize,
		markSizeType,
		markLineHeight,
		markLineType,
		markLetterSpacing,
		markTypography,
		markGoogleFont,
		markLoadGoogleFont,
		markFontSubset,
		markFontVariant,
		markFontWeight,
		markFontStyle,
		markPadding,
		markColor,
		markBG,
		markBGOpacity,
		markBorder,
		markBorderWidth,
		markBorderOpacity,
		markBorderStyle,
		anchor,
		textTransform,
		markTextTransform,
		kadenceAnimation,
		kadenceAOSOptions,
		htmlTag,
		leftMargin,
		rightMargin,
		tabletMargin,
		mobileMargin,
		margin,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		markMobilePadding,
		markTabPadding,
		loadItalic,
		kadenceDynamic,
		link,
		linkTarget,
		linkNoFollow,
		linkSponsored,
		background,
		backgroundColorClass,
		linkStyle,
		linkColor,
		linkHoverColor,
		fontSize,
		fontHeight,
		fontHeightType,
		letterSpacingType,
		tabletLetterSpacing,
		mobileLetterSpacing,
		markLetterSpacingType,
		markPaddingType,
		tabletMarkLetterSpacing,
		mobileMarkLetterSpacing,
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles,
		maxWidthType,
		maxWidth,
		beforeIcon,
		afterIcon,
	} = attributes;
	const [ activeTab, setActiveTab ] = useState( 'style' );

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	useEffect( () => {
		setBlockDefaults( 'kadence/advancedheading', attributes);

		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );

		setAttributes( { inQueryBlock: getInQueryBlock( context, inQueryBlock ) } );

		// Update Old Styles
		if ( ( '' !== topMargin || '' !== rightMargin || '' !== bottomMargin || '' !== leftMargin ) ) {
			setAttributes( { margin: [ topMargin, rightMargin, bottomMargin, leftMargin ], topMargin:'', rightMargin:'', bottomMargin:'', leftMargin:'' } );
		}
		// Update Old font Styles
		if ( ( size || tabSize || mobileSize ) ) {
			setAttributes( { fontSize: [ size, tabSize, mobileSize ], size:'', tabSize:'', mobileSize:'' } );
		}
		// Update Old Line height Styles
		if ( ( lineHeight || tabLineHeight || mobileLineHeight ) ) {
			setAttributes( { fontHeight: [ lineHeight, tabLineHeight, mobileLineHeight ], fontHeightType: lineType, lineHeight:'', tabLineHeight:'', mobileLineHeight:'' } );
		}
		// Update from old border settings.
		let tempBorderStyle = JSON.parse( JSON.stringify( attributes.markBorderStyles ? attributes.markBorderStyles : [{ 
			top: [ '', '', '' ],
			right: [ '', '', '' ],
			bottom: [ '', '', '' ],
			left: [ '', '', '' ],
			unit: 'px'
		  }] ) );
		let updateBorderStyle = false;
		if ( ( '' !== markBorder ) ) {
			tempBorderStyle[0].top[0] = KadenceColorOutput( markBorder, markBorderOpacity );
			tempBorderStyle[0].right[0] = KadenceColorOutput( markBorder, markBorderOpacity );
			tempBorderStyle[0].bottom[0] = KadenceColorOutput( markBorder, markBorderOpacity );
			tempBorderStyle[0].left[0] = KadenceColorOutput( markBorder, markBorderOpacity );
			updateBorderStyle = true;
			setAttributes( { markBorder: '' } );
		}
		if ( '' !== markBorderWidth && 0 !== markBorderWidth ) {
			tempBorderStyle[0].top[2] = markBorderWidth;
			tempBorderStyle[0].right[2] = markBorderWidth;
			tempBorderStyle[0].bottom[2] = markBorderWidth;
			tempBorderStyle[0].left[2] = markBorderWidth;
			updateBorderStyle = true;
			setAttributes( { markBorderWidth:0 } );
		}
		if ( '' !== markBorderStyle && 'solid' !== markBorderStyle ) {
			tempBorderStyle[0].top[1] = markBorderStyle;
			tempBorderStyle[0].right[1] = markBorderStyle;
			tempBorderStyle[0].bottom[1] = markBorderStyle;
			tempBorderStyle[0].left[1] = markBorderStyle;
			updateBorderStyle = true;
			setAttributes( { markBorderStyle:'solid' } );
		}
		if ( updateBorderStyle ) {
			setAttributes( { markBorderStyles: tempBorderStyle } );
			setAttributes( { tabletMarkBorderStyles: tempBorderStyle } );
			setAttributes( { mobileMarkBorderStyles: tempBorderStyle } );
		}
	}, [] );

	const saveShadow = ( value ) => {
		const newItems = textShadow.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			textShadow: newItems,
		} );
	};

	const renderTypography = typography && !typography.includes( ',' ) ? '\'' + typography + '\'' : typography;
	const markBGString = ( markBG ? KadenceColorOutput( markBG, markBGOpacity ) : '' );
	const markBorderString = ( markBorder ? KadenceColorOutput( markBorder, markBorderOpacity ) : '' );
	const textColorClass = getColorClassName( 'color', colorClass );
	const textBackgroundColorClass = getColorClassName( 'background-color', backgroundColorClass );
	const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
	const TagHTML = tagName;

	const previewMarginTop = getPreviewSize( getPreviewDevice, ( undefined !== margin ? margin[ 0 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 0 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( getPreviewDevice, ( undefined !== margin ? margin[ 1 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 1 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( getPreviewDevice, ( undefined !== margin ? margin[ 2 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 2 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( getPreviewDevice, ( undefined !== margin ? margin[ 3 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 3 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 3 ] : '' ) );
	const previewPaddingTop = getPreviewSize( getPreviewDevice, ( undefined !== padding ? padding[ 0 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 0 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( getPreviewDevice, ( undefined !== padding ? padding[ 1 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 1 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( getPreviewDevice, ( undefined !== padding ? padding[ 2 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 2 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( getPreviewDevice, ( undefined !== padding ? padding[ 3 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 3 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 3 ] : '' ) );
	const previewFontSize = getPreviewSize( getPreviewDevice, ( undefined !== fontSize?.[0] ? fontSize[0] : '' ), ( undefined !== fontSize?.[1] ? fontSize[1] : '' ), ( undefined !== fontSize?.[2] ? fontSize[2] : '' ) );
	const previewLineHeight = getPreviewSize( getPreviewDevice, ( undefined !== fontHeight?.[0] ? fontHeight[0] : '' ), ( undefined !== fontHeight?.[1] ? fontHeight[1] : '' ), ( undefined !== fontHeight?.[2] ? fontHeight[2] : '' ) );

	const previewLetterSpacing = getPreviewSize( getPreviewDevice, ( undefined !== letterSpacing ? letterSpacing : '' ), ( undefined !== tabletLetterSpacing ? tabletLetterSpacing : '' ), ( undefined !== mobileLetterSpacing ? mobileLetterSpacing : '' ) );

	const previewAlign = getPreviewSize( getPreviewDevice, ( undefined !== align ? align : '' ), ( undefined !== tabletAlign ? tabletAlign : '' ), ( undefined !== mobileAlign ? mobileAlign : '' ) );
	const previewMarkPaddingTop = getPreviewSize( getPreviewDevice, ( undefined !== markPadding ? markPadding[ 0 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 0 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 0 ] : '' ) );
	const previewMarkPaddingRight = getPreviewSize( getPreviewDevice, ( undefined !== markPadding ? markPadding[ 1 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 1 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 1 ] : '' ) );
	const previewMarkPaddingBottom = getPreviewSize( getPreviewDevice, ( undefined !== markPadding ? markPadding[ 2 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 2 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 2 ] : '' ) );
	const previewMarkPaddingLeft = getPreviewSize( getPreviewDevice, ( undefined !== markPadding ? markPadding[ 3 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 3 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 3 ] : '' ) );
	const previewMarkSize = getPreviewSize( getPreviewDevice, ( undefined !== markSize ? markSize[ 0 ] : '' ), ( undefined !== markSize ? markSize[ 1 ] : '' ), ( undefined !== markSize ? markSize[ 2 ] : '' ) );
	const previewMarkLineHeight = getPreviewSize( getPreviewDevice, ( undefined !== markLineHeight ? markLineHeight[ 0 ] : '' ), ( undefined !== markLineHeight ? markLineHeight[ 1 ] : '' ), ( undefined !== markLineHeight ? markLineHeight[ 2 ] : '' ) );

	const previewMarkLetterSpacing = getPreviewSize( getPreviewDevice, ( undefined !== markLetterSpacing ? markLetterSpacing : '' ), ( undefined !== tabletMarkLetterSpacing ? tabletMarkLetterSpacing : '' ), ( undefined !== mobileMarkLetterSpacing ? mobileMarkLetterSpacing : '' ) );

	const previewMaxWidth = getPreviewSize( getPreviewDevice, ( maxWidth && maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ) , ( maxWidth && maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( maxWidth && maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) );

	const previewMarkBorderTopStyle = getBorderStyle( getPreviewDevice, 'top', markBorderStyles, tabletMarkBorderStyles, mobileMarkBorderStyles );
	const previewMarkBorderRightStyle = getBorderStyle( getPreviewDevice, 'right', markBorderStyles, tabletMarkBorderStyles, mobileMarkBorderStyles );
	const previewMarkBorderBottomStyle = getBorderStyle( getPreviewDevice, 'bottom', markBorderStyles, tabletMarkBorderStyles, mobileMarkBorderStyles );
	const previewMarkBorderLeftStyle = getBorderStyle( getPreviewDevice, 'left', markBorderStyles, tabletMarkBorderStyles, mobileMarkBorderStyles );
	const headingOptions = [
		[
			{
				icon    : <HeadingLevelIcon level={1} isPressed={( 1 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 1', 'kadence-blocks' ),
				isActive: ( 1 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 1, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={2} isPressed={( 2 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 2', 'kadence-blocks' ),
				isActive: ( 2 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 2, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={3} isPressed={( 3 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 3', 'kadence-blocks' ),
				isActive: ( 3 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 3, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={4} isPressed={( 4 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 4', 'kadence-blocks' ),
				isActive: ( 4 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 4, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={5} isPressed={( 5 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 5', 'kadence-blocks' ),
				isActive: ( 5 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 5, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={6} isPressed={( 6 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 6', 'kadence-blocks' ),
				isActive: ( 6 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 6, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={'p'} isPressed={( htmlTag && htmlTag === 'p' ? true : false )}/>,
				title   : __( 'Paragraph', 'kadence-blocks' ),
				isActive: ( htmlTag && htmlTag === 'p' ? true : false ),
				onClick : () => setAttributes( { htmlTag: 'p' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={'span'} isPressed={( htmlTag && htmlTag === 'span' ? true : false )}/>,
				title   : __( 'Span', 'kadence-blocks' ),
				isActive: ( htmlTag && htmlTag === 'span' ? true : false ),
				onClick : () => setAttributes( { htmlTag: 'span' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={'div'} isPressed={( htmlTag && htmlTag === 'div' ? true : false )}/>,
				title   : __( 'div', 'kadence-blocks' ),
				isActive: ( htmlTag && htmlTag === 'div' ? true : false ),
				onClick : () => setAttributes( { htmlTag: 'div' } ),
			},
		],
	];

	const classes = classnames( {
		[ `kt-adv-heading${uniqueID}` ]: uniqueID,
		[ className ]                  : className,
		'kb-content-is-dynamic'        : undefined !== kadenceDynamic && undefined !== kadenceDynamic[ 'content' ] && undefined !== kadenceDynamic[ 'content' ].enable && kadenceDynamic[ 'content' ].enable,
		[ textColorClass ]             : textColorClass,
		'has-text-color'               : textColorClass,
		[ textBackgroundColorClass ]   : textBackgroundColorClass,
		'has-background'               : textBackgroundColorClass,
		[ `hls-${linkStyle}` ]         : !link && linkStyle,
	} );
	const dynamicHeadingContent = (
		<TagHTML
			style={{
				textAlign      : previewAlign,
				color          : color ? KadenceColorOutput( color ) : undefined,
				backgroundColor: background ? KadenceColorOutput( background ) : undefined,
				fontWeight     : fontWeight,
				fontStyle      : fontStyle,
				fontSize       : ( previewFontSize ? getFontSizeOptionOutput( previewFontSize, ( sizeType ? sizeType : 'px' ) ) : undefined ),
				lineHeight     : ( previewLineHeight ? previewLineHeight + ( fontHeightType ? fontHeightType : '' ) : undefined ),
				letterSpacing  : ( previewLetterSpacing ? previewLetterSpacing + ( letterSpacingType ? letterSpacingType : 'px' ) : undefined ),
				textTransform  : ( textTransform ? textTransform : undefined ),
				fontFamily     : ( typography ? renderTypography : '' ),
				paddingTop     : ( '' !== previewPaddingTop ? getSpacingOptionOutput( previewPaddingTop, paddingType ) : undefined ),
				paddingRight   : ( '' !== previewPaddingRight ? getSpacingOptionOutput( previewPaddingRight, paddingType ) : undefined ),
				paddingBottom  : ( '' !== previewPaddingBottom ? getSpacingOptionOutput( previewPaddingBottom, paddingType ) : undefined ),
				paddingLeft    : ( '' !== previewPaddingLeft ? getSpacingOptionOutput( previewPaddingLeft, paddingType ) : undefined ),
				marginTop      : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginType ) : undefined ),
				marginRight    : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginType ) : undefined ),
				marginBottom   : ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginType ) : undefined ),
				marginLeft     : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginType ) : undefined ),
				textShadow     : ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable && textShadow[ 0 ].enable ? ( undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].color ? KadenceColorOutput( textShadow[ 0 ].color ) : 'rgba(0,0,0,0.2)' ) : undefined ),
			}}
			className={classes}
		>
			{applyFilters( 'kadence.dynamicContent', <Spinner/>, attributes, 'content' )}
		</TagHTML>
	);
	const headingContent = (
		<RichText
			tagName={tagName}
			allowedFormats={( link ? applyFilters( 'kadence.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'kadence/insert-dynamic', 'kadence/mark', 'core/strikethrough', 'core/superscript', 'core/superscript', 'toolset/inline-field' ], 'kadence/advancedheading' ) : undefined )}
			value={content}
			onChange={( value ) => setAttributes( { content: value } )}
			onMerge={mergeBlocks}
			onSplit={( value ) => {
				if ( !value ) {
					return createBlock( 'core/paragraph' );
				}
				return createBlock( 'kadence/advancedheading', {
					...attributes,
					content: value,
				} );
			}}
			onReplace={onReplace}
			onRemove={() => onReplace( [] )}
			style={{
				textAlign      : previewAlign,
				color          : color ? KadenceColorOutput( color ) : undefined,
				backgroundColor: background ? KadenceColorOutput( background ) : undefined,
				fontWeight     : fontWeight,
				fontStyle      : fontStyle,
				fontSize       : ( previewFontSize ? getFontSizeOptionOutput( previewFontSize, ( sizeType ? sizeType : 'px' ) ) : undefined ),
				lineHeight     : ( previewLineHeight ? previewLineHeight + ( fontHeightType ? fontHeightType : '' ) : undefined ),
				letterSpacing  : ( previewLetterSpacing ? previewLetterSpacing + ( letterSpacingType ? letterSpacingType : 'px' ) : undefined ),
				textTransform  : ( textTransform ? textTransform : undefined ),
				fontFamily     : ( typography ? renderTypography : '' ),
				paddingTop     : ( '' !== previewPaddingTop ? getSpacingOptionOutput( previewPaddingTop, paddingType ) : undefined ),
				paddingRight   : ( '' !== previewPaddingRight ? getSpacingOptionOutput( previewPaddingRight, paddingType ) : undefined ),
				paddingBottom  : ( '' !== previewPaddingBottom ? getSpacingOptionOutput( previewPaddingBottom, paddingType ) : undefined ),
				paddingLeft    : ( '' !== previewPaddingLeft ? getSpacingOptionOutput( previewPaddingLeft, paddingType ) : undefined ),
				marginTop      : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginType ) : undefined ),
				marginRight    : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginType ) : undefined ),
				marginBottom   : ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginType ) : undefined ),
				marginLeft     : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginType ) : undefined ),
				textShadow     : ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable && textShadow[ 0 ].enable ? ( undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].color ? KadenceColorOutput( textShadow[ 0 ].color ) : 'rgba(0,0,0,0.2)' ) : undefined ),
			}}
			className={classes}
			placeholder={__( 'Write something…', 'kadence-blocks' )}
		/>
	);
	const headingLinkContent = (
		<a
			href={link}
			className={`kb-advanced-heading-link${( linkStyle ? ' hls-' + linkStyle : '' )}`}
			onClick={( event ) => {
				event.preventDefault();
			}}
		>
			{undefined !== kadenceDynamic && undefined !== kadenceDynamic[ 'content' ] && undefined !== kadenceDynamic[ 'content' ].enable && kadenceDynamic[ 'content' ].enable ? dynamicHeadingContent : headingContent}
		</a>
	);
	const wrapperClasses = classnames({
		'kb-is-heading' : htmlTag && htmlTag === 'heading',
		'kb-adv-text'   : true,
	});
	const blockProps = useBlockProps( {
		className: wrapperClasses,
	} );

	return (
		<div {...blockProps}>
			<style>
				{`.kt-adv-heading${uniqueID} mark, .kt-adv-heading${uniqueID}.rich-text:focus mark[data-rich-text-format-boundary] {
						color: ${KadenceColorOutput( markColor )};
						background: ${( markBG ? markBGString : 'transparent' )};
						font-weight: ${( markFontWeight ? markFontWeight : 'inherit' )};
						font-style: ${( markFontStyle ? markFontStyle : 'inherit' )};
						font-size: ${( previewMarkSize ? getFontSizeOptionOutput( previewMarkSize, markSizeType ) : 'inherit' )};
						line-height: ${( previewMarkLineHeight ? previewMarkLineHeight + markLineType : 'inherit' )};
						letter-spacing: ${( previewMarkLetterSpacing ? previewMarkLetterSpacing + ( markLetterSpacingType ? markLetterSpacingType : 'px' ) : 'inherit' )};
						text-transform: ${( markTextTransform ? markTextTransform : 'inherit' )};
						font-family: ${( markTypography ? markTypography : 'inherit' )};
						border-top: ${( previewMarkBorderTopStyle ? previewMarkBorderTopStyle : 'inherit' )};
						border-right: ${( previewMarkBorderRightStyle ? previewMarkBorderRightStyle : 'inherit' )};
						border-bottom: ${( previewMarkBorderBottomStyle ? previewMarkBorderBottomStyle : 'inherit' )};
						border-left: ${( previewMarkBorderLeftStyle ? previewMarkBorderLeftStyle : 'inherit' )};
						padding-top: ${( previewMarkPaddingTop ? getSpacingOptionOutput( previewMarkPaddingTop, markPaddingType ) : '0' )};
						padding-right: ${( previewMarkPaddingRight ? getSpacingOptionOutput( previewMarkPaddingRight, markPaddingType ) : '0' )};
						padding-bottom: ${( previewMarkPaddingBottom ? getSpacingOptionOutput( previewMarkPaddingBottom, markPaddingType ) : '0' )};
						padding-left: ${( previewMarkPaddingLeft ? getSpacingOptionOutput( previewMarkPaddingLeft, markPaddingType ) : '0' )};
					}`}
				{ ( previewMaxWidth ? `.kt-adv-heading${uniqueID } { max-width:${ previewMaxWidth + ( maxWidthType ? maxWidthType : 'px' ) } !important; }` : '' ) }
				{ ( previewMaxWidth && previewAlign === 'center' ? `.kt-adv-heading${uniqueID } { margin-left: auto; margin-right:auto; }` : '' ) }
				{ ( previewMaxWidth && previewAlign === 'right' ? `.kt-adv-heading${uniqueID } { margin-left: auto; margin-right:0; }` : '' ) }
				{linkColor && (
					`.kt-adv-heading${uniqueID} a, #block-${clientId} a.kb-advanced-heading-link, #block-${clientId} a.kb-advanced-heading-link > .wp-block-kadence-advancedheading {
							color: ${KadenceColorOutput( linkColor )} !important;
						}`
				)}
				{linkHoverColor && (
					`.kt-adv-heading${uniqueID} a:hover, #block-${clientId} a.kb-advanced-heading-link:hover, #block-${clientId} a.kb-advanced-heading-link:hover > .wp-block-kadence-advancedheading {
							color: ${KadenceColorOutput( linkHoverColor )}!important;
						}`
				)}
			</style>
			<BlockControls>
				<ToolbarGroup
					isCollapsed={true}
					icon={<HeadingLevelIcon level={( htmlTag !== 'heading' ? htmlTag : level )}/>}
					label={__( 'Change heading tag', 'kadence-blocks' )}
					controls={headingOptions}
				/>
				{showSettings( 'allSettings', 'kadence/advancedheading' ) && showSettings( 'toolbarTypography', 'kadence/advancedheading', false ) && (
					<InlineTypographyControls
						uniqueID={uniqueID}
						fontGroup={'heading'}
						letterSpacing={letterSpacing}
						onLetterSpacing={( value ) => setAttributes( { letterSpacing: value } )}
						fontFamily={typography}
						onFontFamily={( value ) => setAttributes( { typography: value } )}
						onFontChange={( select ) => {
							setAttributes( {
								typography: select.value,
								googleFont: select.google,
							} );
						}}
						googleFont={googleFont}
						onGoogleFont={( value ) => setAttributes( { googleFont: value } )}
						loadGoogleFont={loadGoogleFont}
						onLoadGoogleFont={( value ) => setAttributes( { loadGoogleFont: value } )}
						fontVariant={fontVariant}
						onFontVariant={( value ) => setAttributes( { fontVariant: value } )}
						fontWeight={fontWeight}
						onFontWeight={( value ) => setAttributes( { fontWeight: value } )}
						fontStyle={fontStyle}
						onFontStyle={( value ) => setAttributes( { fontStyle: value } )}
						fontSubset={fontSubset}
						onFontSubset={( value ) => setAttributes( { fontSubset: value } )}
						textTransform={textTransform}
						onTextTransform={( value ) => setAttributes( { textTransform: value } )}
						fontSizeArray={false}
						fontSizeType={sizeType}
						onFontSizeType={( value ) => setAttributes( { sizeType: value } )}
						lineHeightType={fontHeightType}
						onLineHeightType={( value ) => setAttributes( { fontHeightType: value } )}
						fontSize={ ( undefined !== fontSize?.[0] ? fontSize[0] : '' ) }
						onFontSize={ value => setAttributes( { fontSize: [value,( undefined !== fontSize[1] ? fontSize[1] : '' ),( undefined !== fontSize[2] ? fontSize[2] : '' )] } )}
						tabSize={( undefined !== fontSize?.[1] ? fontSize[1] : '' )}
						onTabSize={( value ) => setAttributes( { fontSize: [( undefined !== fontSize[0] ? fontSize[0] : '' ),value,( undefined !== fontSize[2] ? fontSize[2] : '' )] } )}
						mobileSize={( undefined !== fontSize?.[2] ? fontSize[2] : '' )}
						onMobileSize={( value ) => setAttributes( { fontSize: [( undefined !== fontSize[0] ? fontSize[0] : '' ),( undefined !== fontSize[1] ? fontSize[1] : '' ),value] } )}
						lineHeight={( undefined !== fontHeight?.[0] ? fontHeight[0] : '' )}
						onLineHeight={value => setAttributes( { fontHeight: [value,( undefined !== fontHeight[1] ? fontHeight[1] : '' ),( undefined !== fontHeight[2] ? fontHeight[2] : '' )] } )}
						tabLineHeight={( undefined !== fontHeight?.[1] ? fontHeight[1] : '' )}
						onTabLineHeight={( value ) => setAttributes( { fontHeight: [( undefined !== fontHeight[0] ? fontHeight[0] : '' ),value,( undefined !== fontHeight[2] ? fontHeight[2] : '' )] } )}
						mobileLineHeight={( undefined !== fontHeight?.[2] ? fontHeight[2] : '' )}
						onMobileLineHeight={( value ) => setAttributes( { fontHeight: [( undefined !== fontHeight[0] ? fontHeight[0] : '' ),( undefined !== fontHeight[1] ? fontHeight[1] : '' ),value] } )}
					/>
				)}
				{showSettings( 'allSettings', 'kadence/advancedheading' ) && showSettings( 'toolbarColor', 'kadence/advancedheading', false ) && (
					<InlinePopColorControl
						label={__( 'Color', 'kadence-blocks' )}
						value={( color ? color : '' )}
						default={''}
						onChange={( value ) => setAttributes( { color: value } )}
						onClassChange={value => setAttributes( { colorClass: value } )}
					/>
				)}
				<AlignmentToolbar
					value={align}
					onChange={( nextAlign ) => {
						setAttributes( { align: nextAlign } );
					}}
				/>
				<HeadingStyleCopyPaste
					onPaste={value => setAttributes( value )}
					blockAttributes={attributes}
				/>
			</BlockControls>
			{showSettings( 'allSettings', 'kadence/advancedheading' ) && (
				<InspectorControls>

					<InspectorControlTabs
						panelName={'advancedheading'}
						initialOpen={ 'style' }
						setActiveTab={( value ) => setActiveTab( value )}
						activeTab={activeTab}
					/>

					{( activeTab === 'general' ) &&
						<>
							<KadencePanelBody panelName={'kb-adv-heading-general-settings'}>
								<TagSelect
									label={__( 'HTML Tag', 'kadence-blocks' )}
									value={ 'heading' === htmlTag ? level : htmlTag }
									onChange={ (value) => {
										if ( 'div' === value || 'p' === value || 'span' === value ) {
											setAttributes( { level: 2, htmlTag: value } );
										} else {
											setAttributes( { level: value, htmlTag: 'heading' } );
										}
									} }
								/>
								<ResponsiveAlignControls
									label={__( 'Text Alignment', 'kadence-blocks' )}
									value={( align ? align : '' )}
									mobileValue={( mobileAlign ? mobileAlign : '' )}
									tabletValue={( tabletAlign ? tabletAlign : '' )}
									onChange={( nextAlign ) => setAttributes( { align: nextAlign } )}
									onChangeTablet={( nextAlign ) => setAttributes( { tabletAlign: nextAlign } )}
									onChangeMobile={( nextAlign ) => setAttributes( { mobileAlign: nextAlign } )}
								/>
								<ResponsiveRangeControls
									label={__( 'Max Width', 'kadence-blocks' )}
									value={( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' )}
									onChange={value => {
										setAttributes( { maxWidth: [ value, ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ] } );
									}}
									tabletValue={( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' )}
									onChangeTablet={( value ) => {
										setAttributes( { maxWidth: [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), value, ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ] } );
									}}
									mobileValue={( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' )}
									onChangeMobile={( value ) => {
										setAttributes( { maxWidth: [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), value ] } );
									}}
									min={0}
									max={( maxWidthType === 'px' ? 2000 : 100 )}
									step={1}
									unit={maxWidthType ? maxWidthType : 'px'}
									onUnit={( value ) => {
										setAttributes( { maxWidthType: value } );
									}}
									units={[ 'px', '%', 'vw' ]}
								/>
							</KadencePanelBody>
							{showSettings( 'linkSettings', 'kadence/advancedheading' ) && (
								<KadencePanelBody
									title={__( 'Link Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-adv-heading-link-settings'}
								>
									<PopColorControl
										label={__( 'Link Color', 'kadence-blocks' )}
										swatchLabel={__( 'Link Color', 'kadence-blocks' )}
										value={( linkColor ? linkColor : '' )}
										default={''}
										onChange={value => setAttributes( { linkColor: value } )}
										swatchLabel2={__( 'Hover Color', 'kadence-blocks' )}
										value2={( linkHoverColor ? linkHoverColor : '' )}
										default2={''}
										onChange2={value => setAttributes( { linkHoverColor: value } )}
									/>
									<SelectControl
										label={__( 'Link Style', 'kadence-blocks' )}
										value={linkStyle}
										options={[
											{ value: '', label: __( 'Unset', 'kadence-blocks' ) },
											{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
											{ value: 'underline', label: __( 'Underline', 'kadence-blocks' ) },
											{ value: 'hover_underline', label: __( 'Underline on Hover', 'kadence-blocks' ) },
										]}
										onChange={value => setAttributes( { linkStyle: value } )}
									/>
									<URLInputControl
										label={__( 'Text Wrap Link', 'kadence-blocks' )}
										url={link}
										onChangeUrl={value => setAttributes( { link: value } )}
										additionalControls={true}
										opensInNewTab={( undefined !== linkTarget ? linkTarget : false )}
										onChangeTarget={value => setAttributes( { linkTarget: value } )}
										linkNoFollow={( undefined !== linkNoFollow ? linkNoFollow : false )}
										onChangeFollow={value => setAttributes( { linkNoFollow: value } )}
										linkSponsored={( undefined !== linkSponsored ? linkSponsored : false )}
										onChangeSponsored={value => setAttributes( { linkSponsored: value } )}
										dynamicAttribute={'link'}
										allowClear={true}
										{...props}
									/>
								</KadencePanelBody>
							)}
						</>
					}

					{( activeTab === 'style' ) &&
						<>
						<KadencePanelBody panelName={'kb-adv-heading-style'}>
							{showSettings( 'colorSettings', 'kadence/advancedheading' ) && (
									<ColorGroup>
										<PopColorControl
											label={__( 'Color', 'kadence-blocks' )}
											value={( color ? color : '' )}
											default={''}
											onChange={value => setAttributes( { color: value } )}
											onClassChange={value => setAttributes( { colorClass: value } )}
										/>
										<PopColorControl
											label={__( 'Background Color', 'kadence-blocks' )}
											value={( background ? background : '' )}
											default={''}
											onChange={value => setAttributes( { background: value } )}
											onClassChange={value => setAttributes( { backgroundColorClass: value } )}
										/>
									</ColorGroup>
								)}
								{showSettings( 'sizeSettings', 'kadence/advancedheading' ) && (
									<>
										<ResponsiveFontSizeControl
											label={__( 'Font Size', 'kadence-blocks' )}
											value={ ( undefined !== fontSize?.[0] ? fontSize[0] : '' ) }
											onChange={ value => setAttributes( { fontSize: [value,( undefined !== fontSize[1] ? fontSize[1] : '' ),( undefined !== fontSize[2] ? fontSize[2] : '' )] } )}
											tabletValue={( undefined !== fontSize?.[1] ? fontSize[1] : '' )}
											onChangeTablet={( value ) => setAttributes( { fontSize: [( undefined !== fontSize[0] ? fontSize[0] : '' ),value,( undefined !== fontSize[2] ? fontSize[2] : '' )] } )}
											mobileValue={( undefined !== fontSize?.[2] ? fontSize[2] : '' )}
											onChangeMobile={( value ) => setAttributes( { fontSize: [( undefined !== fontSize[0] ? fontSize[0] : '' ),( undefined !== fontSize[1] ? fontSize[1] : '' ),value] } )}
											min={0}
											max={( sizeType === 'px' ? 200 : 12 )}
											step={( sizeType === 'px' ? 1 : 0.1 )}
											unit={ sizeType ? sizeType : 'px' }
											onUnit={( value ) => {
												setAttributes( { sizeType: value } );
											}}
											units={[ 'px', 'em', 'rem', 'vw' ]}
										/>
										<TwoColumn className="kb-font-settings">
											<ResponsiveUnitControl
												label={__( 'Line Height', 'kadence-blocks' )}
												value={( undefined !== fontHeight?.[0] ? fontHeight[0] : '' )}
												onChange={value => setAttributes( { fontHeight: [value,( undefined !== fontHeight[1] ? fontHeight[1] : '' ),( undefined !== fontHeight[2] ? fontHeight[2] : '' )] } )}
												tabletValue={( undefined !== fontHeight?.[1] ? fontHeight[1] : '' )}
												onChangeTablet={( value ) => setAttributes( { fontHeight: [( undefined !== fontHeight[0] ? fontHeight[0] : '' ),value,( undefined !== fontHeight[2] ? fontHeight[2] : '' )] } )}
												mobileValue={( undefined !== fontHeight?.[2] ? fontHeight[2] : '' )}
												onChangeMobile={( value ) => setAttributes( { fontHeight: [( undefined !== fontHeight[0] ? fontHeight[0] : '' ),( undefined !== fontHeight[1] ? fontHeight[1] : '' ),value] } )}
												min={0}
												max={( fontHeightType === 'px' ? 200 : 12 )}
												step={( fontHeightType === 'px' ? 1 : 0.1 )}
												unit={ fontHeightType ? fontHeightType : '' }
												onUnit={( value ) => setAttributes( { fontHeightType: value } )}
												units={[ '-', 'px', 'em', 'rem' ]}
												compressedDevice={ true }
											/>
											<KadenceRadioButtons
												label={__( 'Letter Case', 'kadence-blocks' )}
												value={textTransform}
												className={ 'kb-letter-case' }
												options={[
													{ value: 'none', label: __( '-', 'kadence-blocks' ), tooltip: __( 'None', 'kadence-blocks' ) },
													{ value: 'uppercase', label: __( 'AB', 'kadence-blocks' ), tooltip: __( 'Uppercase', 'kadence-blocks' ) },
													{ value: 'lowercase', label: __( 'ab', 'kadence-blocks' ), tooltip: __( 'Lowercase', 'kadence-blocks' ) },
													{ value: 'capitalize', label: __( 'Ab', 'kadence-blocks' ), tooltip: __( 'Capitalize', 'kadence-blocks' ) },
												]}
												allowClear={ true }
												onChange={value => setAttributes( { textTransform: value } )}
											/>
										</TwoColumn>
									</>
								)}
							</KadencePanelBody>
							{showSettings( 'advancedSettings', 'kadence/advancedheading' ) && (
								<KadencePanelBody
									title={__( 'Advanced Typography Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-adv-heading-typography-settings'}
								>
									<TypographyControls
										fontGroup={'heading'}
										reLetterSpacing={[letterSpacing, tabletLetterSpacing, mobileLetterSpacing]}
										onLetterSpacing={( value ) => setAttributes( {  letterSpacing: value[0], tabletLetterSpacing: value[1], mobileLetterSpacing: value[2] } )}
										letterSpacingType={ letterSpacingType }
										onLetterSpacingType={( value ) => setAttributes( { letterSpacingType: value } )}
										fontFamily={typography}
										onFontFamily={( value ) => setAttributes( { typography: value } )}
										onFontChange={( select ) => {
											setAttributes( {
												typography: select.value,
												googleFont: select.google,
											} );
										}}
										googleFont={googleFont}
										onGoogleFont={( value ) => setAttributes( { googleFont: value } )}
										loadGoogleFont={loadGoogleFont}
										onLoadGoogleFont={( value ) => setAttributes( { loadGoogleFont: value } )}
										fontVariant={fontVariant}
										onFontVariant={( value ) => setAttributes( { fontVariant: value } )}
										fontWeight={fontWeight}
										onFontWeight={( value ) => setAttributes( { fontWeight: value } )}
										fontStyle={fontStyle}
										onFontStyle={( value ) => setAttributes( { fontStyle: value } )}
										fontSubset={fontSubset}
										onFontSubset={( value ) => setAttributes( { fontSubset: value } )}
										loadItalic={loadItalic}
										onLoadItalic={( value ) => setAttributes( { loadItalic: value } )}
									/>
								</KadencePanelBody>
							)}
							<KadencePanelBody
								title={__( 'Text Shadow Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={'kb-adv-heading-text-shadow'}
							>
								<TextShadowControl
									label={__( 'Text Shadow', 'kadence-blocks' )}
									enable={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable ? textShadow[ 0 ].enable : false )}
									color={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].color ? textShadow[ 0 ].color : 'rgba(0, 0, 0, 0.2)' )}
									colorDefault={'rgba(0, 0, 0, 0.2)'}
									hOffset={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 )}
									vOffset={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 )}
									blur={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 )}
									onEnableChange={value => {
										saveShadow( { enable: value } );
									}}
									onColorChange={value => {
										saveShadow( { color: value } );
									}}
									onHOffsetChange={value => {
										saveShadow( { hOffset: value } );
									}}
									onVOffsetChange={value => {
										saveShadow( { vOffset: value } );
									}}
									onBlurChange={value => {
										saveShadow( { blur: value } );
									}}
								/>
							</KadencePanelBody>
							{showSettings( 'highlightSettings', 'kadence/advancedheading' ) && (
								<KadencePanelBody
									title={__( 'Highlight Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-adv-heading-highlight-settings'}
								>
									<PopColorControl
										label={__( 'Color', 'kadence-blocks' )}
										value={( markColor ? markColor : '' )}
										default={''}
										onChange={value => setAttributes( { markColor: value } )}
									/>
									<PopColorControl
										label={__( 'Background', 'kadence-blocks' )}
										value={( markBG ? markBG : '' )}
										default={''}
										onChange={value => setAttributes( { markBG: value } )}
										opacityValue={markBGOpacity}
										onOpacityChange={value => setAttributes( { markBGOpacity: value } )}
										onArrayChange={( color, opacity ) => setAttributes( { markBG: color, markBGOpacity: opacity } )}
									/>
									<ResponsiveBorderControl
										label={__( 'Border', 'kadence-blocks' )}
										value={markBorderStyles}
										tabletValue={tabletMarkBorderStyles}
										mobileValue={mobileMarkBorderStyles}
										onChange={( value ) => setAttributes( { markBorderStyles: value } )}
										onChangeTablet={( value ) => setAttributes( { tabletMarkBorderStyles: value } )}
										onChangeMobile={( value ) => setAttributes( { mobileMarkBorderStyles: value } )}
									/>
									<TypographyControls
										fontGroup={'mark-heading'}
										fontSize={markSize}
										onFontSize={( value ) => setAttributes( { markSize: value } )}
										fontSizeType={markSizeType}
										onFontSizeType={( value ) => setAttributes( { markSizeType: value } )}
										lineHeight={markLineHeight}
										onLineHeight={( value ) => setAttributes( { markLineHeight: value } )}
										lineHeightType={markLineType}
										onLineHeightType={( value ) => setAttributes( { markLineType: value } )}
										reLetterSpacing={[markLetterSpacing, tabletMarkLetterSpacing, mobileMarkLetterSpacing]}
										onLetterSpacing={( value ) => setAttributes( {  markLetterSpacing: value[0], tabletMarkLetterSpacing: value[1], mobileMarkLetterSpacing: value[2] } )}
										letterSpacingType={ markLetterSpacingType }
										onLetterSpacingType={( value ) => setAttributes( { markLetterSpacingType: value } )}
										fontFamily={markTypography}
										onFontFamily={( value ) => setAttributes( { markTypography: value } )}
										onFontChange={( select ) => {
											setAttributes( {
												markTypography: select.value,
												markGoogleFont: select.google,
											} );
										}}
										googleFont={markGoogleFont}
										onGoogleFont={( value ) => setAttributes( { markGoogleFont: value } )}
										loadGoogleFont={markLoadGoogleFont}
										onLoadGoogleFont={( value ) => setAttributes( { markLoadGoogleFont: value } )}
										fontVariant={markFontVariant}
										onFontVariant={( value ) => setAttributes( { markFontVariant: value } )}
										fontWeight={markFontWeight}
										onFontWeight={( value ) => setAttributes( { markFontWeight: value } )}
										fontStyle={markFontStyle}
										onFontStyle={( value ) => setAttributes( { markFontStyle: value } )}
										fontSubset={markFontSubset}
										onFontSubset={( value ) => setAttributes( { markFontSubset: value } )}
										textTransform={markTextTransform}
										onTextTransform={( value ) => setAttributes( { markTextTransform: value } )}
									/>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={markPadding}
										tabletValue={markTabPadding}
										mobileValue={markMobilePadding}
										onChange={( value ) => setAttributes( { markPadding: value } )}
										onChangeTablet={( value ) => setAttributes( { markTabPadding: value } )}
										onChangeMobile={( value ) => setAttributes( { markMobilePadding: value } )}
										min={0}
										max={( markPaddingType === 'em' || markPaddingType === 'rem' ? 12 : 200 )}
										step={( markPaddingType === 'em' || markPaddingType === 'rem' ? 0.1 : 1 )}
										unit={markPaddingType}
										units={['px', 'em', 'rem', '%']}
										onUnit={(value) => setAttributes({markPaddingType: value})}
									/>
								</KadencePanelBody>
							)}
						</>
					}

					{( activeTab === 'advanced' ) && (
						<>
							{showSettings('marginSettings', 'kadence/advancedheading') && (
								<>
									<KadencePanelBody panelName={'kb-row-padding'}>
										<ResponsiveMeasureRangeControl
											label={__('Padding', 'kadence-blocks')}
											value={padding}
											tabletValue={tabletPadding}
											mobileValue={mobilePadding}
											onChange={(value) => setAttributes({padding: value})}
											onChangeTablet={(value) => setAttributes({tabletPadding: value})}
											onChangeMobile={(value) => setAttributes({mobilePadding: value})}
											min={0}
											max={( paddingType === 'em' || paddingType === 'rem' ? 12 : 200 )}
											step={( paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1 )}
											unit={paddingType}
											units={['px', 'em', 'rem', '%']}
											onUnit={(value) => setAttributes({paddingType: value})}
											onMouseOver={paddingMouseOver.onMouseOver}
											onMouseOut={paddingMouseOver.onMouseOut}
										/>
										<ResponsiveMeasureRangeControl
											label={__('Margin', 'kadence-blocks')}
											value={margin}
											tabletValue={tabletMargin}
											mobileValue={mobileMargin}
											onChange={(value) => {
												setAttributes({margin: value})
											}}
											onChangeTablet={(value) => setAttributes({tabletMargin: value})}
											onChangeMobile={(value) => setAttributes({mobileMargin: value})}
											min={( marginType === 'em' || marginType === 'rem' ? -10 : -200 )}
											max={( marginType === 'em' || marginType === 'rem' ? 12 : 200 )}
											step={( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 )}
											unit={marginType}
											units={['px', 'em', 'rem', '%', 'vh']}
											onUnit={(value) => setAttributes({marginType: value})}
											onMouseOver={marginMouseOver.onMouseOver}
											onMouseOut={marginMouseOver.onMouseOut}
										/>
									</KadencePanelBody>

									<div className="kt-sidebar-settings-spacer"></div>
								</>
							)}

							<KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ 'kadence/advancedheading' } excludedAttrs={ [ 'content' ] }  />

						</>

					)}

						</InspectorControls>
			)}
			<InspectorAdvancedControls>
				<TextControl
					label={__( 'HTML Anchor', 'kadence-blocks' )}
					help={__( 'Anchors lets you link directly to a section on a page.', 'kadence-blocks' )}
					value={anchor || ''}
					onChange={( nextValue ) => {
						nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
						setAttributes( {
							anchor: nextValue,
						} );
					}}/>
			</InspectorAdvancedControls>
			{kadenceAnimation && (
				<div className={`kt-animation-wrap-${kadenceAnimation}`}>
					<div id={`animate-id${uniqueID}`} className={'aos-animate kt-animation-wrap'} data-aos={( kadenceAnimation ? kadenceAnimation : undefined )}
						 data-aos-duration={( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined )}
						 data-aos-easing={( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined )}
					>
						{link ? headingLinkContent : headingContent}
					</div>
				</div>
			)}
			{!kadenceAnimation && (
				link ? headingLinkContent : headingContent
			)}
			{ googleFont && typography && (
				<KadenceWebfontLoader typography={ [{family: typography, variant: ( fontVariant ? fontVariant : '' ) }] } clientId={ clientId } id={ 'advancedHeading' } />
			) }
			{ markGoogleFont && markTypography && (
				<KadenceWebfontLoader typography={ [{family: markTypography, variant: ( markFontVariant ? markFontVariant : '' ) }] } clientId={ clientId } id={ 'advancedHeadingMark' } />
			) }

			<SpacingVisualizer
				type="outsideVertical"
				forceShow={ marginMouseOver.isMouseOver }
				spacing={ [ getSpacingOptionOutput( previewMarginTop, marginType ), getSpacingOptionOutput( previewMarginRight, marginType ), getSpacingOptionOutput( previewMarginBottom, marginType ), getSpacingOptionOutput( previewMarginLeft, marginType ) ] }
			/>
			<SpacingVisualizer
				style={ {
					marginLeft: ( undefined !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginType ) : undefined ),
					marginRight: ( undefined !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginType ) : undefined ),
					marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginType ) : undefined ),
					marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginType ) : undefined ),
				} }
				type="inside"
				forceShow={ paddingMouseOver.isMouseOver }
				spacing={ [ getSpacingOptionOutput( previewPaddingTop, paddingType ), getSpacingOptionOutput( previewPaddingRight, paddingType ), getSpacingOptionOutput( previewPaddingBottom, paddingType ), getSpacingOptionOutput( previewPaddingLeft, paddingType ) ] }
			/>
		</div>
	);

}

export default compose( [
	withSelect( ( select ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			isUniqueID      : ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
			isUniqueBlock   : ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		addUniqueID: ( value, clientId ) => dispatch( 'kadenceblocks/data' ).addUniqueID( value, clientId ),
	} ) ),
] )( KadenceAdvancedHeading );
