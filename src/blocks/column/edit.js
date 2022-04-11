/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons';

/**
 * Import Controls
 */
import MeasurementControls from '../../measurement-control';
import BoxShadowControl from '../../components/common/box-shadow-control';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import PopColorControl from '../../components/color/pop-color-control';
import KadenceBackgroundControl from '../../components/background/background-control';
import KadenceColorOutput from '../../kadence-color-output';
import KadenceRange from '../../components/range/range-control';
import ResponsiveMeasuremenuControls from '../../components/measurement/responsive-measurement-control';
import ResponsiveAlignControls from '../../components/align/responsive-align-control';
import KadenceRadioButtons from '../../components/common/kadence-radio-buttons';
import SmallResponsiveControl from '../../components/responsive/small-responsive-control';
import VerticalAlignmentIcon from '../../components/common/vertical-align-icons';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';
import KadencePanelBody from '../../components/KadencePanelBody';
import URLInputControl from '../../components/links/link-control';
import { getPreviewSize, showSettings } from '../../helpers/helpers';
/**
 * Blocks Specific.
 */
import ColumnStyleCopyPaste from './copy-paste-style';

import './editor.scss';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef, useState, Fragment } from '@wordpress/element';
import {
	InnerBlocks,
	BlockControls,
	InspectorAdvancedControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
const {
	ToggleControl,
	SelectControl,
	ToolbarGroup,
	TabPanel,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;
/**
 * Build the section edit.
 */
function SectionEdit( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
	context,
	className,
} ) {
	const { id, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, leftMargin, rightMargin, leftMarginM, rightMarginM, topMarginT, bottomMarginT, leftMarginT, rightMarginT, topPaddingT, bottomPaddingT, leftPaddingT, rightPaddingT, backgroundOpacity, background, zIndex, border, borderWidth, borderOpacity, borderRadius, uniqueID, kadenceAnimation, kadenceAOSOptions, collapseOrder, backgroundImg, textAlign, textColor, linkColor, linkHoverColor, shadow, displayShadow, vsdesk, vstablet, vsmobile, paddingType, marginType, mobileBorderWidth, tabletBorderWidth, templateLock, kadenceBlockCSS, kadenceDynamic, direction, gutter, gutterUnit, verticalAlignment, justifyContent, backgroundImgHover, backgroundHover, borderHover, borderHoverWidth, borderHoverRadius, shadowHover, displayHoverShadow, tabletBorderHoverWidth, mobileBorderHoverWidth, textColorHover, linkColorHover, linkHoverColorHover, linkNoFollow, linkSponsored, link, linkTarget, linkTitle, wrapContent, heightUnit, height, maxWidth, maxWidthUnit, htmlTag } = attributes;
	const getDynamic = () => {
		let contextPost = null;
		if ( context && context.queryId && context.postId ) {
			contextPost = context.postId;
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['backgroundImg:0:bgImg'] && attributes.kadenceDynamic['backgroundImg:0:bgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', attributes, setAttributes, 'backgroundImg:0:bgImg', contextPost );
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['backgroundImgHover:0:bgImg'] && attributes.kadenceDynamic['backgroundImgHover:0:bgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', attributes, setAttributes, 'backgroundImgHover:0:bgImg', contextPost );
		}
	}
	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ]
	);
	useEffect( () => {
		let smallID = '_' + clientId.substr( 2, 9 );
		if ( ! uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( undefined === attributes.noCustomDefaults || ! attributes.noCustomDefaults ) {
				if ( blockConfigObject[ 'kadence/column' ] !== undefined && typeof blockConfigObject[ 'kadence/column' ] === 'object' ) {
					Object.keys( blockConfigObject[ 'kadence/column' ] ).map( ( attribute ) => {
						attributes[ attribute ] = blockConfigObject[ 'kadence/column' ][ attribute ];
					} );
				}
			}
			if ( ! isUniqueID( uniqueID ) ) {
				smallID = uniqueId( smallID );
			}
			setAttributes( {
				uniqueID: smallID,
			} );
			addUniqueID( smallID, clientId );
		} else if ( ! isUniqueID( uniqueID ) ) {
			// This checks if we are just switching views, client ID the same means we don't need to update.
			if ( ! isUniqueBlock( uniqueID, clientId ) ) {
				attributes.uniqueID = smallID;
				addUniqueID( smallID, clientId );
			}
		} else {
			addUniqueID( uniqueID, clientId );
		}
		if ( context && context.queryId && context.postId ) {
			if ( ! attributes.inQueryBlock ) {
				setAttributes( {
					inQueryBlock: true,
				} );
			}
		} else if ( attributes.inQueryBlock ) {
			setAttributes( {
				inQueryBlock: false,
			} );
		}
		debounce( getDynamic, 200 );
	}, [] );
	const { hasInnerBlocks, inRowBlock } = useSelect(
		( select ) => {
			const { getBlock, getBlockRootClientId, getBlocksByClientId } = select( blockEditorStore );
			const block = getBlock( clientId );
			const rootID = getBlockRootClientId( clientId );
			let inRowBlock = false;
			if ( rootID ) {
				const parentBlock = getBlocksByClientId( rootID );
				inRowBlock = ( undefined !== parentBlock && undefined !== parentBlock[0] && undefined !== parentBlock[0].name && parentBlock[0].name === 'kadence/rowlayout' ? true : false );
			}
			return {
				inRowBlock: inRowBlock,
				hasInnerBlocks: !! ( block && block.innerBlocks.length ),
			};
		},
		[ clientId ]
	);
	const [ borderRadiusControl, setBorderRadiusControl ] = useState( 'individual' );
	const [ borderWidthControl, setBorderWidthControl ] = useState( 'individual' );
	const [ paddingControl, setPaddingControl ] = useState( 'individual' );
	const [ marginControl, setMarginControl ] = useState( 'individual' );
	const saveShadow = ( value ) => {
		const newUpdate = shadow.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			shadow: newUpdate,
		} );
	};
	const saveShadowHover = ( value ) => {
		const newItems = shadowHover.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			shadowHover: newItems,
		} );
	}
	const saveBackgroundImage = ( value ) => {
		const newUpdate = backgroundImg.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			backgroundImg: newUpdate,
		} );
	};
	const saveHoverBackgroundImage = ( value ) => {
		const newUpdate = backgroundImgHover.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			backgroundImgHover: newUpdate,
		} );
	};
	const onRemoveBGImage = () => {
		saveBackgroundImage( {
			bgImgID: '',
			bgImg: '',
		} );
	};
	const onRemoveHoverBGImage = () => {
		saveHoverBackgroundImage( {
			bgImgID: '',
			bgImg: '',
		} );
	};
	const gutterMax = ( gutterUnit !== 'px' ? 12 : 200 );
	const gutterStep = ( gutterUnit !== 'px' ? 0.1 : 1 );
	const marginMin = ( marginType === 'em' || marginType === 'rem' ? -2 : -200 );
	const marginMax = ( marginType === 'em' || marginType === 'rem' ? 12 : 200 );
	const marginStep = ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 );
	const paddingMin = ( paddingType === 'em' || paddingType === 'rem' ? 0 : 0 );
	const paddingMax = ( paddingType === 'em' || paddingType === 'rem' ? 12 : 200 );
	const paddingStep = ( paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1 );
	const previewPaddingType = ( undefined !== paddingType ? paddingType : 'px' );
	const previewMarginType = ( undefined !== marginType ? marginType : 'px' );
	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== topMargin ? topMargin : '' ), ( undefined !== topMarginT ? topMarginT : '' ), ( undefined !== topMarginM ? topMarginM : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== rightMarginT ? rightMarginT : '' ), ( undefined !== rightMarginM ? rightMarginM : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== bottomMarginT ? bottomMarginT : '' ), ( undefined !== bottomMarginM ? bottomMarginM : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== leftMargin ? leftMargin : '' ), ( undefined !== leftMarginT ? leftMarginT : '' ), ( undefined !== leftMarginM ? leftMarginM : '' ) );
	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== topPadding ? topPadding : '' ), ( undefined !== topPaddingT ? topPaddingT : '' ), ( undefined !== topPaddingM ? topPaddingM : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== rightPadding ? rightPadding : '' ), ( undefined !== rightPaddingT ? rightPaddingT : '' ), ( undefined !== rightPaddingM ? rightPaddingM : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== bottomPadding ? bottomPadding : '' ), ( undefined !== bottomPaddingT ? bottomPaddingT : '' ), ( undefined !== bottomPaddingM ? bottomPaddingM : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== leftPadding ? leftPadding : '' ), ( undefined !== leftPaddingT ? leftPaddingT : '' ), ( undefined !== leftPaddingM ? leftPaddingM : '' ) );
	const previewBorderTop = getPreviewSize( previewDevice, ( undefined !== borderWidth ? borderWidth[ 0 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 0 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 0 ] : '' ) );
	const previewBorderRight = getPreviewSize( previewDevice, ( undefined !== borderWidth ? borderWidth[ 1 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 1 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 1 ] : '' ) );
	const previewBorderBottom = getPreviewSize( previewDevice, ( undefined !== borderWidth ? borderWidth[ 2 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 2 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 2 ] : '' ) );
	const previewBorderLeft = getPreviewSize( previewDevice, ( undefined !== borderWidth ? borderWidth[ 3 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 3 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 3 ] : '' ) );
	const previewHoverBorderTop = getPreviewSize( previewDevice, ( undefined !== borderHoverWidth ? borderHoverWidth[ 0 ] : '' ), ( undefined !== tabletBorderHoverWidth ? tabletBorderHoverWidth[ 0 ] : '' ), ( undefined !== mobileBorderHoverWidth ? mobileBorderHoverWidth[ 0 ] : '' ) );
	const previewHoverBorderRight = getPreviewSize( previewDevice, ( undefined !== borderHoverWidth ? borderHoverWidth[ 1 ] : '' ), ( undefined !== tabletBorderHoverWidth ? tabletBorderHoverWidth[ 1 ] : '' ), ( undefined !== mobileBorderHoverWidth ? mobileBorderHoverWidth[ 1 ] : '' ) );
	const previewHoverBorderBottom = getPreviewSize( previewDevice, ( undefined !== borderHoverWidth ? borderHoverWidth[ 2 ] : '' ), ( undefined !== tabletBorderHoverWidth ? tabletBorderHoverWidth[ 2 ] : '' ), ( undefined !== mobileBorderHoverWidth ? mobileBorderHoverWidth[ 2 ] : '' ) );
	const previewHoverBorderLeft = getPreviewSize( previewDevice, ( undefined !== borderHoverWidth ? borderHoverWidth[ 3 ] : '' ), ( undefined !== tabletBorderHoverWidth ? tabletBorderHoverWidth[ 3 ] : '' ), ( undefined !== mobileBorderHoverWidth ? mobileBorderHoverWidth[ 3 ] : '' ) );
	const previewAlign = getPreviewSize( previewDevice, ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ) , ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ), ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) );
	const previewGutter = getPreviewSize( previewDevice, ( gutter && '' !== gutter[ 0 ] ? gutter[ 0 ] : '' ) , ( gutter && '' !== gutter[ 1 ] ? gutter[ 1 ] : '' ), ( gutter && '' !== gutter[ 2 ] ? gutter[ 2 ] : '' ) );
	const previewDirection = getPreviewSize( previewDevice, ( direction && '' !== direction[ 0 ] ? direction[ 0 ] : '' ) , ( direction && '' !== direction[ 1 ] ? direction[ 1 ] : '' ), ( direction && '' !== direction[ 2 ] ? direction[ 2 ] : '' ) );
	const previewJustify = getPreviewSize( previewDevice, ( justifyContent && '' !== justifyContent[ 0 ] ? justifyContent[ 0 ] : '' ) , ( justifyContent && '' !== justifyContent[ 1 ] ? justifyContent[ 1 ] : '' ), ( justifyContent && '' !== justifyContent[ 2 ] ? justifyContent[ 2 ] : '' ) );
	const previewWrap = getPreviewSize( previewDevice, ( wrapContent && '' !== wrapContent[ 0 ] ? wrapContent[ 0 ] : '' ) , ( wrapContent && '' !== wrapContent[ 1 ] ? wrapContent[ 1 ] : '' ), ( wrapContent && '' !== wrapContent[ 2 ] ? wrapContent[ 2 ] : '' ) );
	const backgroundString = ( background ? KadenceColorOutput( background, backgroundOpacity ) : 'transparent' );
	const borderString = ( border ? KadenceColorOutput( border, borderOpacity ) : 'transparent' );

	const previewMaxWidth = getPreviewSize( previewDevice, ( maxWidth && maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ) , ( maxWidth && maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( maxWidth && maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) );
	const previewMinHeight = getPreviewSize( previewDevice, ( height && height[ 0 ] ? height[ 0 ] : '' ) , ( height && height[ 1 ] ? height[ 1 ] : '' ), ( height && height[ 2 ] ? height[ 2 ] : '' ) );
	const previewMinHeightUnit = ( heightUnit ? heightUnit : 'px' );
	const previewMaxWidthUnit = ( maxWidthUnit ? maxWidthUnit : 'px' );
	const classes = classnames( {
		[ className ]: className,
		'kadence-column': true,
		[ `inner-column-${ id }` ]: id,
		[ `kadence-column-${ uniqueID }` ]: uniqueID,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
	} );
	const hasBackgroundImage = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? true : false );
	const hasHoverBackgroundImage = ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImg ? true : false );
	const verticalAlignOptions = [
		[
			{
				icon: <VerticalAlignmentIcon value={ 'top' } isPressed={ ( verticalAlignment === 'top' ? true : false ) } />,
				title: __( 'Align Top', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'top' ? true : false ),
				onClick: () => {
					if ( verticalAlignment === 'top' ) {
						setAttributes( { verticalAlignment: '' } );
					} else {
						setAttributes( { verticalAlignment: 'top' } );
					}
				}
			},
		],
		[
			{
				icon: <VerticalAlignmentIcon value={ 'middle' } isPressed={ ( verticalAlignment === 'middle' ? true : false ) } />,
				title: __( 'Align Middle', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'middle' ? true : false ),
				onClick: () => {
					if ( verticalAlignment === 'middle' ) {
						setAttributes( { verticalAlignment: '' } );
					} else {
						setAttributes( { verticalAlignment: 'middle' } );
					}
				}
			},
		],
		[
			{
				icon: <VerticalAlignmentIcon value={ 'bottom' } isPressed={ ( verticalAlignment === 'bottom' ? true : false ) } />,
				title: __( 'Align Bottom', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'bottom' ? true : false ),
				onClick: () => {
					if ( verticalAlignment === 'bottom' ) {
						setAttributes( { verticalAlignment: '' } );
					} else {
						setAttributes( { verticalAlignment: 'bottom' } );
					}
				}
			},
		],
	];
	const innerClasses = classnames( {
		'kadence-inner-column-inner': true,
		'aos-animate': true,
		'kt-animation-wrap': true,
		[ `kadence-inner-column-direction-${ ( previewDirection ? previewDirection : 'vertical' ) }` ]: true,
		[ `kadence-inner-column-text-align-${ ( previewAlign ? previewAlign : 'normal' ) }` ]: true,
		[ `kadence-inner-column-vertical-align-${ ( verticalAlignment ? verticalAlignment : 'inherit' ) }` ]: true,
	} );
	const blockProps = useBlockProps( {
		className: classes,
		style: { maxWidth: ( undefined !== previewMaxWidth ? previewMaxWidth + previewMaxWidthUnit : undefined ) },
		'data-vertical-align': ( 'top' === verticalAlignment || 'middle' === verticalAlignment || 'bottom' === verticalAlignment ? verticalAlignment : undefined ),
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerClasses,
		},
		{
			orientation: ( direction && direction[ 0 ] ? direction[ 0 ] : 'vertical' ),
			templateLock: ( templateLock ? templateLock : false ),
			renderAppender: hasInnerBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);
	return (
		<div style={ {
				maxWidth: ( undefined !== previewMaxWidth ? previewMaxWidth + previewMaxWidthUnit : undefined ),
			} }
			{ ...blockProps }
		>
			<style>
				{ ( ( undefined !== previewMaxWidth && '' !== previewMaxWidth ) ? `.wp-block-kadence-column > .kadence-inner-column-direction-horizontal > .wp-block-kadence-column.kadence-column-${ uniqueID } { flex: 1 ${ previewMaxWidth + previewMaxWidthUnit }; }` : '' ) }
				{ ( ( undefined !== zIndex && '' !== zIndex ) ? `.kadence-column-${ uniqueID } { z-index: ${ zIndex }; }` : '' ) }
				{ ( textColor ? `.kadence-column-${ uniqueID }, .kadence-column-${ uniqueID } p, .kadence-column-${ uniqueID } h1, .kadence-column-${ uniqueID } h2, .kadence-column-${ uniqueID } h3, .kadence-column-${ uniqueID } h4, .kadence-column-${ uniqueID } h5, .kadence-column-${ uniqueID } h6 { color: ${ KadenceColorOutput( textColor ) }; }` : '' ) }
				{ ( linkColor ? `.kadence-column-${ uniqueID } a { color: ${ KadenceColorOutput( linkColor ) }; }` : '' ) }
				{ ( linkHoverColor ? `.kadence-column-${ uniqueID } a:hover { color: ${ KadenceColorOutput( linkHoverColor ) }; }` : '' ) }
				{ ( '' !== previewGutter ? `.kadence-column-${ uniqueID } .kadence-inner-column-direction-horizontal { margin-left: -${ previewGutter + ( gutterUnit ? gutterUnit : 'px' )}; }.kadence-column-${ uniqueID } .kadence-inner-column-direction-horizontal > .wp-block:not([data-type="kadence/advancedheading"]),.kadence-column-${ uniqueID } .kadence-inner-column-direction-horizontal > .block-editor-block-list__block:not([data-type="kadence/advancedheading"]), .kadence-column-${ uniqueID } .kadence-inner-column-direction-horizontal > .block-editor-block-list__block[data-type="kadence/advancedheading"] > * { margin-left: ${ previewGutter + ( gutterUnit ? gutterUnit : 'px' ) }; }` : '' ) }
				{ ( previewJustify ? `.kadence-column-${ uniqueID } > .kadence-inner-column-direction-horizontal { justify-content: ${ previewJustify }; }` : '' ) }
				{ ( previewWrap ? `.kadence-column-${ uniqueID } > .kadence-inner-column-direction-horizontal { flex-wrap: ${ previewWrap }; }` : '' ) }
				{ ( previewJustify && ( 'space-around' == previewJustify || 'space-between' == previewJustify || 'space-evenly' == previewJustify ) ? `.kadence-column-${ uniqueID } > .kadence-inner-column-direction-horizontal > .block-list-appender { display:none; }` : '' ) }
				{ ( textColorHover ? `.kadence-column-${ uniqueID }:hover, .kadence-column-${ uniqueID }:hover p, .kadence-column-${ uniqueID }:hover h1, .kadence-column-${ uniqueID }:hover h2, .kadence-column-${ uniqueID }:hover h3, .kadence-column-${ uniqueID }:hover h4, .kadence-column-${ uniqueID }:hover h5, .kadence-column-${ uniqueID }:hover h6 { color: ${ KadenceColorOutput( textColorHover ) }; }` : '' ) }
				{ ( linkColorHover ? `.kadence-column-${ uniqueID }:hover a { color: ${ KadenceColorOutput( linkColorHover ) }; }` : '' ) }
				{ ( linkHoverColorHover ? `.kadence-column-${ uniqueID }:hover a:hover { color: ${ KadenceColorOutput( linkHoverColorHover ) }; }` : '' ) }
				{ ( backgroundHover ? `.kadence-column-${ uniqueID }:hover .kadence-inner-column-inner { background-color: ${ KadenceColorOutput( backgroundHover ) } !important; }` : '' ) }
				{ ( hasHoverBackgroundImage ? `.kadence-column-${ uniqueID }:hover .kadence-inner-column-inner { background-image: url(${ backgroundImgHover[ 0 ].bgImg }) !important; }` : '' ) }
				{ ( hasHoverBackgroundImage && backgroundImgHover[ 0 ].bgImgPosition ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { background-position:${ backgroundImgHover[ 0 ].bgImgPosition } !important; }` : '' ) }
				{ ( hasHoverBackgroundImage && backgroundImgHover[ 0 ].bgImgSize ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { background-size:${ backgroundImgHover[ 0 ].bgImgSize } !important; }` : '' ) }
				{ ( hasHoverBackgroundImage && backgroundImgHover[ 0 ].bgImgRepeat ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { background-repeat:${ backgroundImgHover[ 0 ].bgImgRepeat } !important; }` : '' ) }
				{ ( hasHoverBackgroundImage && backgroundImgHover[ 0 ].bgImgAttachment ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { background-attachment:${ backgroundImgHover[ 0 ].bgImgAttachment } !important; }` : '' ) }
				{ ( previewHoverBorderTop ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-top-width:${ previewHoverBorderTop }px !important; }` : '' ) }
				{ ( previewHoverBorderRight ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-right-width:${ previewHoverBorderRight }px !important; }` : '' ) }
				{ ( previewHoverBorderBottom ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-bottom-width:${ previewHoverBorderBottom }px !important; }` : '' ) }
				{ ( previewHoverBorderLeft ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-left-width:${ previewHoverBorderLeft }px !important; }` : '' ) }
				{ ( borderHover ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-color:${ KadenceColorOutput( borderHover ) } !important; }` : '' ) }
				{ ( borderHoverRadius && undefined !== borderHoverRadius[0] && '' !== borderHoverRadius[0] ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-top-left-radius:${ borderHoverRadius[0] }px !important; }` : '' ) }
				{ ( borderHoverRadius && undefined !== borderHoverRadius[1] && '' !== borderHoverRadius[1] ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-top-right-radius:${ borderHoverRadius[1] }px !important; }` : '' ) }
				{ ( borderHoverRadius && undefined !== borderHoverRadius[2] && '' !== borderHoverRadius[2] ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-bottom-right-radius:${ borderHoverRadius[2] }px !important; }` : '' ) }
				{ ( borderHoverRadius && undefined !== borderHoverRadius[3] && '' !== borderHoverRadius[3] ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { border-bottom-left-radius:${ borderHoverRadius[3] }px !important; }` : '' ) }
				{ ( displayHoverShadow && undefined !== shadowHover && undefined !== shadowHover[ 0 ] && undefined !== shadowHover[ 0 ].color ? `.kadence-column-${ uniqueID } .kadence-inner-column-inner:hover { box-shadow:${ ( undefined !== shadowHover[ 0 ].inset && shadowHover[ 0 ].inset ? 'inset ' : '' ) + ( undefined !== shadowHover[ 0 ].hOffset ? shadowHover[ 0 ].hOffset : 0 ) + 'px ' + ( undefined !== shadowHover[ 0 ].vOffset ? shadowHover[ 0 ].vOffset : 0 ) + 'px ' + ( undefined !== shadowHover[ 0 ].blur ? shadowHover[ 0 ].blur : 14 ) + 'px ' + ( undefined !== shadowHover[ 0 ].spread ? shadowHover[ 0 ].spread : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== shadowHover[ 0 ].color ? shadowHover[ 0 ].color : '#000000' ), ( undefined !== shadowHover[ 0 ].opacity ? shadowHover[ 0 ].opacity : 1 ) ) } !important; }` : '' ) }
				{ kadenceBlockCSS && (
					<Fragment>
						{ kadenceBlockCSS.replace( /selector/g, `.kadence-column-${ uniqueID }` ) }
					</Fragment>
				) }
			</style>
			{ showSettings( 'allSettings', 'kadence/column' ) && (
				<Fragment>
					<BlockControls>
						<ToolbarGroup
							isCollapsed={ true }
							icon={ <VerticalAlignmentIcon value={ ( verticalAlignment ? verticalAlignment : ( direction && direction[ 0 ] && direction[ 0 ] === 'horizontal' ? 'middle' : 'top' ) ) } /> }
							label={ __( 'Vertical Align', 'kadence-blocks' )  }
							controls={ verticalAlignOptions }
						/>
						<ColumnStyleCopyPaste
							onPaste={ value => setAttributes( value ) }
							blockAttributes={ attributes }
						/>
					</BlockControls>
					<InspectorControls>
						{ showSettings( 'textAlign', 'kadence/column' ) && (
							<KadencePanelBody
								title={ __( 'Flex Align Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-col-align-settings' }
							>
									<SmallResponsiveControl
										label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
										desktopChildren={ <KadenceRadioButtons
											//label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
											value={ ( direction && direction[ 0 ] ? direction[ 0 ] : 'vertical' ) }
											options={ [
												{ value: 'vertical', label: __( 'Vertical', 'kadence-blocks' ) },
												{ value: 'horizontal', label: __( 'Horizontal', 'kadence-blocks' ) },
											] }
											onChange={ value => setAttributes( { direction: [ value, ( direction && direction[ 1 ] ? direction[ 1 ] : '' ), ( direction && direction[ 2 ] ? direction[ 2 ] : '' ) ] } ) }
										/> }
										tabletChildren={ <KadenceRadioButtons
											//label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
											value={  ( direction && direction[ 1 ] ? direction[ 1 ] : '' ) }
											options={ [
												{ value: 'vertical', label: __( 'Vertical', 'kadence-blocks' ) },
												{ value: 'horizontal', label: __( 'Horizontal', 'kadence-blocks' ) },
											] }
											onChange={ value => setAttributes( { direction: [ ( direction && direction[ 0 ] ? direction[ 0 ] : 'vertical' ), value, ( direction && direction[ 2 ] ? direction[ 2 ] : '' ) ] } ) }
										/> }
										mobileChildren={ <KadenceRadioButtons
											//label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
											value={  ( direction && direction[ 2 ] ? direction[ 2 ] : '' ) }
											options={ [
												{ value: 'vertical', label: __( 'Vertical', 'kadence-blocks' ) },
												{ value: 'horizontal', label: __( 'Horizontal', 'kadence-blocks' ) },
											] }
											onChange={ value => setAttributes( { direction: [ ( direction && direction[ 0 ] ? direction[ 0 ] : 'vertical' ), ( direction && direction[ 1 ] ? direction[ 1 ] : '' ), value ] } ) }
										/> }
									/>
									{ ( previewDirection ? previewDirection : 'vertical' ) === 'horizontal' && (
										<Fragment>
											<ResponsiveRangeControls
												label={ __( 'Default Horizontal Block Gap', 'kadence-blocks' ) }
												value={ ( gutter && '' !== gutter[ 0 ] ? gutter[ 0 ] : 10 ) }
												onChange={ value => setAttributes( { gutter: [ value, ( gutter && gutter[ 1 ] ? gutter[ 1 ] : '' ), ( gutter && gutter[ 2 ] ? gutter[ 2 ] : '' ) ] } ) }
												tabletValue={ ( gutter && '' !== gutter[ 1 ] ? gutter[ 1 ] : '' ) }
												onChangeTablet={ value => setAttributes( { gutter: [ ( gutter && gutter[ 0 ] ? gutter[ 0 ] : 10 ), value, ( gutter && gutter[ 2 ] ? gutter[ 2 ] : '' ) ] } ) }
												mobileValue={ ( gutter && '' !== gutter[ 2 ] ? gutter[ 2 ] : '' ) }
												onChangeMobile={ value => setAttributes( { gutter: [ ( gutter && gutter[ 0 ] ? gutter[ 0 ] : 10 ), ( gutter && gutter[ 2 ] ? gutter[ 2 ] : '' ), value ] } ) }
												min={ 0 }
												max={ gutterMax }
												step={ gutterStep }
												unit={ gutterUnit }
												onUnit={ ( value ) => setAttributes( { gutterUnit: value } ) }
												units={ [ 'px', 'em', 'rem' ] }
											/>
											<SmallResponsiveControl
												label={ __( 'Justify Content', 'kadence-blocks' ) }
												desktopChildren={ <SelectControl
													//label={ __( 'Justify Content', 'kadence-blocks' ) }
													value={ ( justifyContent && justifyContent[ 0 ] ? justifyContent[ 0 ] : '' ) }
													options={ [
														{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
														{ value: 'flex-start', label: __( 'Start', 'kadence-blocks' ) },
														{ value: 'center', label: __( 'Center', 'kadence-blocks' ) },
														{ value: 'flex-end', label: __( 'End', 'kadence-blocks' ) },
														{ value: 'space-between', label: __( 'Space Between', 'kadence-blocks' ) },
														{ value: 'space-around', label: __( 'Space Around', 'kadence-blocks' ) },
														{ value: 'space-evenly', label: __( 'Space Evenly', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { justifyContent: [ value, ( justifyContent && justifyContent[ 1 ] ? justifyContent[ 1 ] : '' ), ( justifyContent && justifyContent[ 2 ] ? justifyContent[ 2 ] : '' ) ] } ) }
												/> }
												tabletChildren={ <SelectControl
													//label={ __( 'Justify Content', 'kadence-blocks' ) }
													value={ ( justifyContent && justifyContent[ 1 ] ? justifyContent[ 1 ] : '' ) }
													options={ [
														{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
														{ value: 'flex-start', label: __( 'Start', 'kadence-blocks' ) },
														{ value: 'center', label: __( 'Center', 'kadence-blocks' ) },
														{ value: 'flex-end', label: __( 'End', 'kadence-blocks' ) },
														{ value: 'space-between', label: __( 'Space Between', 'kadence-blocks' ) },
														{ value: 'space-around', label: __( 'Space Around', 'kadence-blocks' ) },
														{ value: 'space-evenly', label: __( 'Space Evenly', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { justifyContent: [ ( justifyContent && justifyContent[ 0 ] ? justifyContent[ 0 ] : '' ), value, ( justifyContent && justifyContent[ 2 ] ? justifyContent[ 2 ] : '' ) ] } ) }
												/> }
												mobileChildren={ <SelectControl
													//label={ __( 'Justify Content', 'kadence-blocks' ) }
													value={ ( justifyContent && justifyContent[ 2 ] ? justifyContent[ 2 ] : '' ) }
													options={ [
														{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
														{ value: 'flex-start', label: __( 'Start', 'kadence-blocks' ) },
														{ value: 'center', label: __( 'Center', 'kadence-blocks' ) },
														{ value: 'flex-end', label: __( 'End', 'kadence-blocks' ) },
														{ value: 'space-between', label: __( 'Space Between', 'kadence-blocks' ) },
														{ value: 'space-around', label: __( 'Space Around', 'kadence-blocks' ) },
														{ value: 'space-evenly', label: __( 'Space Evenly', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { justifyContent: [ ( justifyContent && justifyContent[ 0 ] ? justifyContent[ 0 ] : '' ), ( justifyContent && justifyContent[ 1 ] ? justifyContent[ 1 ] : '' ), value ] } ) }
												/> }
											/>
											<SmallResponsiveControl
												label={ __( 'Wrap Content', 'kadence-blocks' ) }
												desktopChildren={ <SelectControl
													//label={ __( 'Justify Content', 'kadence-blocks' ) }
													value={ ( wrapContent && wrapContent[ 0 ] ? wrapContent[ 0 ] : '' ) }
													options={ [
														{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
														{ value: 'nowrap', label: __( 'No Wrap', 'kadence-blocks' ) },
														{ value: 'wrap', label: __( 'Wrap', 'kadence-blocks' ) },
														{ value: 'wrap-reverse', label: __( 'Wrap Reverse', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { wrapContent: [ value, ( wrapContent && wrapContent[ 1 ] ? wrapContent[ 1 ] : '' ), ( wrapContent && wrapContent[ 2 ] ? wrapContent[ 2 ] : '' ) ] } ) }
												/> }
												tabletChildren={ <SelectControl
													//label={ __( 'Justify Content', 'kadence-blocks' ) }
													value={ ( wrapContent && wrapContent[ 1 ] ? wrapContent[ 1 ] : '' ) }
													options={ [
														{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
														{ value: 'nowrap', label: __( 'No Wrap', 'kadence-blocks' ) },
														{ value: 'wrap', label: __( 'Wrap', 'kadence-blocks' ) },
														{ value: 'wrap-reverse', label: __( 'Wrap Reverse', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { wrapContent: [ ( wrapContent && wrapContent[ 0 ] ? wrapContent[ 0 ] : '' ), value, ( wrapContent && wrapContent[ 2 ] ? wrapContent[ 2 ] : '' ) ] } ) }
												/> }
												mobileChildren={ <SelectControl
													//label={ __( 'Justify Content', 'kadence-blocks' ) }
													value={ ( wrapContent && wrapContent[ 2 ] ? wrapContent[ 2 ] : '' ) }
													options={ [
														{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
														{ value: 'nowrap', label: __( 'No Wrap', 'kadence-blocks' ) },
														{ value: 'wrap', label: __( 'Wrap', 'kadence-blocks' ) },
														{ value: 'wrap-reverse', label: __( 'Wrap Reverse', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { wrapContent: [ ( wrapContent && wrapContent[ 0 ] ? wrapContent[ 0 ] : '' ), ( wrapContent && wrapContent[ 1 ] ? wrapContent[ 1 ] : '' ), value ] } ) }
												/> }
											/>
										</Fragment>
									) }
									<ResponsiveAlignControls
										label={ __( 'Text Alignment', 'kadence-blocks' ) }
										value={ ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ) }
										mobileValue={ ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) }
										tabletValue={ ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ) }
										onChange={ ( nextAlign ) => setAttributes( { textAlign: [ nextAlign, ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ), ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) ] } ) }
										onChangeTablet={ ( nextAlign ) => setAttributes( { textAlign: [ ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ), nextAlign, ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) ] } ) }
										onChangeMobile={ ( nextAlign ) => setAttributes( { textAlign: [ ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ), ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ), nextAlign ] } ) }
									/>
								</KadencePanelBody>
							) }
							{ showSettings( 'paddingMargin', 'kadence/column' ) && (
								<KadencePanelBody
									title={ __( 'Padding/Margin', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-col-padding-margin' }
								>
									<ResponsiveMeasuremenuControls
										label={ __( 'Padding', 'kadence-blocks' ) }
										control={ paddingControl }
										value={ [ ( undefined !== topPadding ? topPadding : '' ), ( undefined !== rightPadding ? rightPadding : '' ), ( undefined !== bottomPadding ? bottomPadding : '' ), ( undefined !== leftPadding ? leftPadding : '' ) ] }
										tabletValue={ [ ( undefined !== topPaddingT ? topPaddingT : '' ), ( undefined !== rightPaddingT ? rightPaddingT : '' ), ( undefined !== bottomPaddingT ? bottomPaddingT : '' ), ( undefined !== leftPaddingT ? leftPaddingT : '' ) ] }
										mobileValue={ [ ( undefined !== topPaddingM ? topPaddingM : '' ), ( undefined !== rightPaddingM ? rightPaddingM : '' ), ( undefined !== bottomPaddingM ? bottomPaddingM : '' ), ( undefined !== leftPaddingM ? leftPaddingM : '' ) ] }
										onChange={ ( value ) => {
											setAttributes( { topPadding: value[ 0 ], rightPadding: value[ 1 ], bottomPadding: value[ 2 ], leftPadding: value[ 3 ] } );
										} }
										onChangeTablet={ ( value ) => {
											setAttributes( { topPaddingT: value[ 0 ], rightPaddingT: value[ 1 ], bottomPaddingT: value[ 2 ], leftPaddingT: value[ 3 ] } );
										} }
										onChangeMobile={ ( value ) => {
											setAttributes( { topPaddingM: value[ 0 ], rightPaddingM: value[ 1 ], bottomPaddingM: value[ 2 ], leftPaddingM: value[ 3 ] } );
										} }
										onChangeControl={ ( value ) => setPaddingControl( value ) }
										allowEmpty={ true }
										min={ paddingMin }
										max={ paddingMax }
										step={ paddingStep }
										unit={ paddingType }
										units={ [ 'px', 'em', 'rem', '%' ] }
										onUnit={ ( value ) => setAttributes( { paddingType: value } ) }
									/>
									<ResponsiveMeasuremenuControls
										label={ __( 'Margin', 'kadence-blocks' ) }
										control={ marginControl }
										value={ [ ( undefined !== topMargin ? topMargin : '' ), ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== leftMargin ? leftMargin : '' ) ] }
										tabletValue={ [ ( undefined !== topMarginT ? topMarginT : '' ), ( undefined !== rightMarginT ? rightMarginT : '' ), ( undefined !== bottomMarginT ? bottomMarginT : '' ), ( undefined !== leftMarginT ? leftMarginT : '' ) ] }
										mobileValue={ [ ( undefined !== topMarginM ? topMarginM : '' ), ( undefined !== rightMarginM ? rightMarginM : '' ), ( undefined !== bottomMarginM ? bottomMarginM : '' ), ( undefined !== leftMarginM ? leftMarginM : '' ) ] }
										onChange={ ( value ) => {
											setAttributes( { topMargin: value[ 0 ], rightMargin: value[ 1 ], bottomMargin: value[ 2 ], leftMargin: value[ 3 ] } );
										} }
										onChangeTablet={ ( value ) => {
											setAttributes( { topMarginT: value[ 0 ], rightMarginT: value[ 1 ], bottomMarginT: value[ 2 ], leftMarginT: value[ 3 ] } );
										} }
										onChangeMobile={ ( value ) => {
											setAttributes( { topMarginM: value[ 0 ], rightMarginM: value[ 1 ], bottomMarginM: value[ 2 ], leftMarginM: value[ 3 ] } );
										} }
										onChangeControl={ ( value ) => setMarginControl( value ) }
										allowEmpty={ true }
										min={ marginMin }
										max={ marginMax }
										step={ marginStep }
										unit={ marginType }
										units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
										onUnit={ ( value ) => setAttributes( { marginType: value } ) }
									/>
								</KadencePanelBody>
							) }
							{ showSettings( 'container', 'kadence/column' ) && (
								<Fragment>
									<KadencePanelBody
										title={ __( 'Structure Settings', 'kadence-blocks' ) }
										initialOpen={ false }
										panelName={ 'kb-col-container-style-settings' }
									>
										<SelectControl
											label={ __( 'Container HTML tag', 'kadence-blocks' ) }
											value={ htmlTag }
											options={ [
												{ value: 'div', label: 'div' },
												{ value: 'header', label: 'header' },
												{ value: 'section', label: 'section' },
												{ value: 'article', label: 'article' },
												{ value: 'main', label: 'main' },
												{ value: 'aside', label: 'aside' },
												{ value: 'footer', label: 'footer' },
											] }
											onChange={ value => setAttributes( { htmlTag: value } ) }
										/>
										{ ! inRowBlock && (
											<ResponsiveRangeControls
												label={ __( 'Max Width', 'kadence-blocks' ) }
												value={ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ) }
												onChange={ value => {
													setAttributes( { maxWidth: [ value, ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ] } );
												} }
												tabletValue={ ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ) }
												onChangeTablet={ ( value ) => {
													setAttributes( { maxWidth: [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), value, ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ] } );
												} }
												mobileValue={ ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) }
												onChangeMobile={ ( value ) => {
													setAttributes( { maxWidth: [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), value ] } );
												} }
												min={ 0 }
												max={ ( maxWidthUnit === 'px' ? 2000 : 100 ) }
												step={ 1 }
												unit={ maxWidthUnit ? maxWidthUnit : 'px' }
												onUnit={ ( value ) => {
													setAttributes( { maxWidthUnit: value } );
												} }
												units={ [ 'px', '%', 'vw' ] }
											/>
										) }
										<ResponsiveRangeControls
											label={ __( 'Min Height', 'kadence-blocks' ) }
											value={ ( undefined !== height && undefined !== height[ 0 ] ? height[ 0 ] : '' ) }
											onChange={ value => {
												setAttributes( { height: [ value, ( undefined !== height && undefined !== height[ 1 ] ? height[ 1 ] : '' ), ( undefined !== height && undefined !== height[ 2 ] ? height[ 2 ] : '' ) ] } );
											} }
											tabletValue={ ( undefined !== height && undefined !== height[ 1 ] ? height[ 1 ] : '' ) }
											onChangeTablet={ ( value ) => {
												setAttributes( { height: [ ( undefined !== height && undefined !== height[ 0 ] ? height[ 0 ] : '' ), value, ( undefined !== height && undefined !== height[ 2 ] ? height[ 2 ] : '' ) ] } );
											} }
											mobileValue={ ( undefined !== height && undefined !== height[ 2 ] ? height[ 2 ] : '' ) }
											onChangeMobile={ ( value ) => {
												setAttributes( { height: [ ( undefined !== height && undefined !== height[ 0 ] ? height[ 0 ] : '' ), ( undefined !== height && undefined !== height[ 1 ] ? height[ 1 ] : '' ), value ] } );
											} }
											min={ 0 }
											max={ ( heightUnit === 'px' ? 2000 : 200 ) }
											step={ 1 }
											unit={ heightUnit ? heightUnit : 'px' }
											onUnit={ ( value ) => {
												setAttributes( { heightUnit: value } );
											} }
											units={ [ 'px', '%', 'vw' ] }
										/>
									</KadencePanelBody>
									<KadencePanelBody
										title={ __( 'Background Settings', 'kadence-blocks' ) }
										initialOpen={ false }
										panelName={ 'kb-col-bg-settings' }
									>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={ [
												{
													name: 'normal',
													title: __( 'Normal', 'kadence-blocks' ),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __( 'Hover', 'kadence-blocks' ),
													className: 'kt-hover-tab',
												},
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<Fragment>
																	<PopColorControl
																		label={ __( 'Background Color', 'kadence-blocks' ) }
																		value={ ( backgroundHover ? backgroundHover : '' ) }
																		default={ '' }
																		onChange={ value => setAttributes( { backgroundHover: value } ) }
																	/>
																	<KadenceBackgroundControl
																		label={ __( 'Background Image', 'kadence-blocks' ) }
																		hasImage={ hasHoverBackgroundImage }
																		imageURL={ ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImg ? backgroundImgHover[ 0 ].bgImg : '' ) }
																		imageID={ ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImgID ? backgroundImgHover[ 0 ].bgImgID : '' ) }
																		imagePosition={ ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImgPosition ? backgroundImgHover[ 0 ].bgImgPosition : 'center center' ) }
																		imageSize={ ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImgSize ? backgroundImgHover[ 0 ].bgImgSize : 'cover' ) }
																		imageRepeat={ ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImgRepeat ? backgroundImgHover[ 0 ].bgImgRepeat : 'no-repeat' ) }
																		imageAttachment={ ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImgAttachment ? backgroundImgHover[ 0 ].bgImgAttachment : 'scroll' ) }
																		onRemoveImage={ onRemoveHoverBGImage }
																		onSaveImage={ ( img ) => {
																			saveHoverBackgroundImage( {
																				bgImgID: img.id,
																				bgImg: img.url,
																			} );
																		} }
																		onSaveURL={ ( newURL ) => {
																			if ( newURL !== ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImg ? backgroundImgHover[ 0 ].bgImg : '' ) ) {
																				saveHoverBackgroundImage( {
																					bgImgID: undefined,
																					bgImg: newURL,
																				} );
																			}
																		} }
																		onSavePosition={ value => saveHoverBackgroundImage( { bgImgPosition: value } ) }
																		onSaveSize={ value => saveHoverBackgroundImage( { bgImgSize: value } ) }
																		onSaveRepeat={ value => saveHoverBackgroundImage( { bgImgRepeat: value } ) }
																		onSaveAttachment={ value => saveHoverBackgroundImage( { bgImgAttachment: value } ) }
																		disableMediaButtons={ ( backgroundImgHover && backgroundImgHover[ 0 ] && backgroundImgHover[ 0 ].bgImg ? backgroundImgHover[ 0 ].bgImg : '' ) }
																		dynamicAttribute="backgroundImgHover:0:bgImg"
																		isSelected={ isSelected }
																		attributes={ attributes }
																		setAttributes={ setAttributes }
																		name={ 'kadence/column' }
																		clientId={ clientId }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<PopColorControl
																		label={ __( 'Background Color', 'kadence-blocks' ) }
																		value={ ( background ? background : '' ) }
																		default={ '' }
																		opacityValue={ backgroundOpacity }
																		onChange={ value => setAttributes( { background: value } ) }
																		onOpacityChange={ value => setAttributes( { backgroundOpacity: value } ) }
																	/>
																	<KadenceBackgroundControl
																		label={ __( 'Background Image', 'kadence-blocks' ) }
																		hasImage={ hasBackgroundImage }
																		imageURL={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) }
																		imageID={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgID ? backgroundImg[ 0 ].bgImgID : '' ) }
																		imagePosition={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgPosition ? backgroundImg[ 0 ].bgImgPosition : 'center center' ) }
																		imageSize={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgSize ? backgroundImg[ 0 ].bgImgSize : 'cover' ) }
																		imageRepeat={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgRepeat ? backgroundImg[ 0 ].bgImgRepeat : 'no-repeat' ) }
																		imageAttachment={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgAttachment ? backgroundImg[ 0 ].bgImgAttachment : 'scroll' ) }
																		onRemoveImage={ onRemoveBGImage }
																		onSaveImage={ ( img ) => {
																			saveBackgroundImage( {
																				bgImgID: img.id,
																				bgImg: img.url,
																			} );
																		} }
																		onSaveURL={ ( newURL ) => {
																			if ( newURL !== ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) ) {
																				saveBackgroundImage( {
																					bgImgID: undefined,
																					bgImg: newURL,
																				} );
																			}
																		} }
																		onSavePosition={ value => saveBackgroundImage( { bgImgPosition: value } ) }
																		onSaveSize={ value => saveBackgroundImage( { bgImgSize: value } ) }
																		onSaveRepeat={ value => saveBackgroundImage( { bgImgRepeat: value } ) }
																		onSaveAttachment={ value => saveBackgroundImage( { bgImgAttachment: value } ) }
																		disableMediaButtons={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) }
																		dynamicAttribute="backgroundImg:0:bgImg"
																		isSelected={ isSelected }
																		attributes={ attributes }
																		setAttributes={ setAttributes }
																		name={ 'kadence/column' }
																		clientId={ clientId }
																	/>
																</Fragment>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
									</KadencePanelBody>
									<KadencePanelBody
										title={ __( 'Border Styles', 'kadence-blocks' ) }
										initialOpen={ false }
										panelName={ 'kb-col-border-settings' }
									>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={ [
												{
													name: 'normal',
													title: __( 'Normal', 'kadence-blocks' ),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __( 'Hover', 'kadence-blocks' ),
													className: 'kt-hover-tab',
												},
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<Fragment>
																	<PopColorControl
																		label={ __( 'Border Color', 'kadence-blocks' ) }
																		value={ ( borderHover ? borderHover : '' ) }
																		default={ '' }
																		onChange={ value => setAttributes( { borderHover: value } ) }
																	/>
																	<ResponsiveMeasuremenuControls
																		label={ __( 'Border Width', 'kadence-blocks' ) }
																		value={ borderHoverWidth }
																		control={ borderWidthControl }
																		tabletValue={ tabletBorderHoverWidth }
																		mobileValue={ mobileBorderHoverWidth }
																		onChange={ ( value ) => setAttributes( { borderHoverWidth: value } ) }
																		onChangeTablet={ ( value ) => setAttributes( { tabletBorderHoverWidth: value } ) }
																		onChangeMobile={ ( value ) => setAttributes( { mobileBorderHoverWidth: value } ) }
																		onChangeControl={ ( value ) => setBorderWidthControl( value ) }
																		min={ 0 }
																		max={ 40 }
																		step={ 1 }
																		unit={ 'px' }
																		units={ [ 'px' ] }
																		showUnit={ true }
																		preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
																	/>
																	<MeasurementControls
																		label={ __( 'Border Radius', 'kadence-blocks' ) }
																		measurement={ borderHoverRadius }
																		control={ borderRadiusControl }
																		onChange={ ( value ) => setAttributes( { borderHoverRadius: value } ) }
																		onControl={ ( value ) => setBorderRadiusControl( value ) }
																		min={ 0 }
																		max={ 200 }
																		step={ 1 }
																		controlTypes={ [
																			{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: icons.radiuslinked },
																			{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: icons.radiusindividual },
																		] }
																		firstIcon={ icons.topleft }
																		secondIcon={ icons.topright }
																		thirdIcon={ icons.bottomright }
																		fourthIcon={ icons.bottomleft }
																	/>
																	<BoxShadowControl
																		label={ __( 'Box Shadow', 'kadence-blocks' ) }
																		enable={ ( undefined !== displayHoverShadow ? displayHoverShadow : false ) }
																		color={ ( undefined !== shadowHover && undefined !== shadowHover[ 0 ] && undefined !== shadowHover[ 0 ].color ? shadowHover[ 0 ].color : '#000000' ) }
																		colorDefault={ '#000000' }
																		onArrayChange={ ( color, opacity ) => {
																			saveShadowHover( { color: color, opacity: opacity } );
																		} }
																		opacity={ ( undefined !== shadowHover && undefined !== shadowHover[ 0 ] && undefined !== shadowHover[ 0 ].opacity ? shadowHover[ 0 ].opacity : 0.2 ) }
																		hOffset={ ( undefined !== shadowHover && undefined !== shadowHover[ 0 ] && undefined !== shadowHover[ 0 ].hOffset ? shadowHover[ 0 ].hOffset : 0 ) }
																		vOffset={ ( undefined !== shadowHover && undefined !== shadowHover[ 0 ] && undefined !== shadowHover[ 0 ].vOffset ? shadowHover[ 0 ].vOffset : 0 ) }
																		blur={ ( undefined !== shadowHover && undefined !== shadowHover[ 0 ] && undefined !== shadowHover[ 0 ].blur ? shadowHover[ 0 ].blur : 14 ) }
																		spread={ ( undefined !== shadowHover && undefined !== shadowHover[ 0 ] && undefined !== shadowHover[ 0 ].spread ? shadowHover[ 0 ].spread : 0 ) }
																		inset={ ( undefined !== shadowHover && undefined !== shadowHover[ 0 ] && undefined !== shadowHover[ 0 ].inset ? shadowHover[ 0 ].inset : false ) }
																		onEnableChange={ value => {
																			setAttributes( {
																				displayHoverShadow: value,
																			} );
																		} }
																		onColorChange={ value => {
																			saveShadowHover( { color: value } );
																		} }
																		onOpacityChange={ value => {
																			saveShadowHover( { opacity: value } );
																		} }
																		onHOffsetChange={ value => {
																			saveShadowHover( { hOffset: value } );
																		} }
																		onVOffsetChange={ value => {
																			saveShadowHover( { vOffset: value } );
																		} }
																		onBlurChange={ value => {
																			saveShadowHover( { blur: value } );
																		} }
																		onSpreadChange={ value => {
																			saveShadowHover( { spread: value } );
																		} }
																		onInsetChange={ value => {
																			saveShadowHover( { inset: value } );
																		} }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<PopColorControl
																		label={ __( 'Border Color', 'kadence-blocks' ) }
																		value={ ( border ? border : '' ) }
																		default={ '' }
																		opacityValue={ borderOpacity }
																		onChange={ value => setAttributes( { border: value } ) }
																		onOpacityChange={ value => setAttributes( { borderOpacity: value } ) }
																	/>
																	<ResponsiveMeasuremenuControls
																		label={ __( 'Border Width', 'kadence-blocks' ) }
																		value={ borderWidth }
																		control={ borderWidthControl }
																		tabletValue={ tabletBorderWidth }
																		mobileValue={ mobileBorderWidth }
																		onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
																		onChangeTablet={ ( value ) => setAttributes( { tabletBorderWidth: value } ) }
																		onChangeMobile={ ( value ) => setAttributes( { mobileBorderWidth: value } ) }
																		onChangeControl={ ( value ) => setBorderWidthControl( value ) }
																		min={ 0 }
																		max={ 40 }
																		step={ 1 }
																		unit={ 'px' }
																		units={ [ 'px' ] }
																		showUnit={ true }
																		preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
																	/>
																	<MeasurementControls
																		label={ __( 'Border Radius', 'kadence-blocks' ) }
																		measurement={ borderRadius }
																		control={ borderRadiusControl }
																		onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
																		onControl={ ( value ) => setBorderRadiusControl( value ) }
																		min={ 0 }
																		max={ 200 }
																		step={ 1 }
																		controlTypes={ [
																			{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: icons.radiuslinked },
																			{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: icons.radiusindividual },
																		] }
																		firstIcon={ icons.topleft }
																		secondIcon={ icons.topright }
																		thirdIcon={ icons.bottomright }
																		fourthIcon={ icons.bottomleft }
																	/>
																	<BoxShadowControl
																		label={ __( 'Box Shadow', 'kadence-blocks' ) }
																		enable={ ( undefined !== displayShadow ? displayShadow : false ) }
																		color={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' ) }
																		colorDefault={ '#000000' }
																		onArrayChange={ ( color, opacity ) => {
																			saveShadow( { color: color, opacity: opacity } );
																		} }
																		opacity={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 0.2 ) }
																		hOffset={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].hOffset ? shadow[ 0 ].hOffset : 0 ) }
																		vOffset={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].vOffset ? shadow[ 0 ].vOffset : 0 ) }
																		blur={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].blur ? shadow[ 0 ].blur : 14 ) }
																		spread={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].spread ? shadow[ 0 ].spread : 0 ) }
																		inset={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].inset ? shadow[ 0 ].inset : false ) }
																		onEnableChange={ value => {
																			setAttributes( {
																				displayShadow: value,
																			} );
																		} }
																		onColorChange={ value => {
																			saveShadow( { color: value } );
																		} }
																		onOpacityChange={ value => {
																			saveShadow( { opacity: value } );
																		} }
																		onHOffsetChange={ value => {
																			saveShadow( { hOffset: value } );
																		} }
																		onVOffsetChange={ value => {
																			saveShadow( { vOffset: value } );
																		} }
																		onBlurChange={ value => {
																			saveShadow( { blur: value } );
																		} }
																		onSpreadChange={ value => {
																			saveShadow( { spread: value } );
																		} }
																		onInsetChange={ value => {
																			saveShadow( { inset: value } );
																		} }
																	/>
																</Fragment>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
									</KadencePanelBody>
								</Fragment>
							) }
						<div className="kt-sidebar-settings-spacer"></div>
						{ showSettings( 'textColor', 'kadence/column' ) && (
							<KadencePanelBody
								title={ __( 'Text Color Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-col-text-color-settings' }
							>
								<TabPanel className="kt-inspect-tabs kt-hover-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'normal',
											title: __( 'Normal', 'kadence-blocks' ),
											className: 'kt-normal-tab',
										},
										{
											name: 'hover',
											title: __( 'Hover', 'kadence-blocks' ),
											className: 'kt-hover-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'hover' === tab.name ) {
													tabout = (
														<Fragment>
															<PopColorControl
																label={ __( 'Text Color', 'kadence-blocks' ) }
																value={ ( textColorHover ? textColorHover : '' ) }
																default={ '' }
																onChange={ value => setAttributes( { textColorHover: value } ) }
															/>
															<PopColorControl
																label={ __( 'Text Link Color', 'kadence-blocks' ) }
																value={ ( linkColorHover ? linkColorHover : '' ) }
																default={ '' }
																onChange={ value => setAttributes( { linkColorHover: value } ) }
															/>
															<PopColorControl
																label={ __( 'Text Link Hover Color', 'kadence-blocks' ) }
																value={ ( linkHoverColorHover ? linkHoverColorHover : '' ) }
																default={ '' }
																onChange={ value => setAttributes( { linkHoverColorHover: value } ) }
															/>
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															<PopColorControl
																label={ __( 'Text Color', 'kadence-blocks' ) }
																value={ ( textColor ? textColor : '' ) }
																default={ '' }
																onChange={ value => setAttributes( { textColor: value } ) }
															/>
															<PopColorControl
																label={ __( 'Text Link Color', 'kadence-blocks' ) }
																value={ ( linkColor ? linkColor : '' ) }
																default={ '' }
																onChange={ value => setAttributes( { linkColor: value } ) }
															/>
															<PopColorControl
																label={ __( 'Text Link Hover Color', 'kadence-blocks' ) }
																value={ ( linkHoverColor ? linkHoverColor : '' ) }
																default={ '' }
																onChange={ value => setAttributes( { linkHoverColor: value } ) }
															/>
														</Fragment>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</KadencePanelBody>
						) }
						{ showSettings( 'overlayLink', 'kadence/column' ) && (
							<KadencePanelBody
								title={ __( 'Overlay Link', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-col-overlay-link' }
							>
								<p className="kadence-sidebar-notice">{ __( 'Please note, If a link is added nothing else inside of the section will be selectable.', 'kadence-blocks' ) }</p>
								<URLInputControl
									label={ __( 'Link entire section', 'kadence-blocks' ) }
									url={ link }
									onChangeUrl={ value => setAttributes( { link: value } ) }
									additionalControls={ true }
									opensInNewTab={ ( undefined !== linkTarget ? linkTarget : false ) }
									onChangeTarget={ value => setAttributes( { linkTarget: value } ) }
									linkNoFollow={ ( undefined !== linkNoFollow ? linkNoFollow : false ) }
									onChangeFollow={ value => setAttributes( { linkNoFollow: value } ) }
									linkSponsored={ ( undefined !== linkSponsored ? linkSponsored : false ) }
									onChangeSponsored={ value => setAttributes( { linkSponsored: value } ) }
									linkTitle={ linkTitle }
									onChangeTitle={ value => {
										setAttributes( { linkTitle: value } )
									} }
									dynamicAttribute={ 'link' }
									allowClear={ true }
									isSelected={ isSelected }
									attributes={ attributes }
									setAttributes={ setAttributes }
									name={ 'kadence/column' }
									clientId={ clientId }
								/>
							</KadencePanelBody>
						) }
						<KadencePanelBody
							title={ __( 'Visibility Settings', 'kadence-blocks' ) }
							initialOpen={ false }
							panelName={ 'kb-col-visibility-settings' }
						>
							<ToggleControl
								label={ __( 'Hide on Desktop', 'kadence-blocks' ) }
								checked={ ( undefined !== vsdesk ? vsdesk : false ) }
								onChange={ ( value ) => setAttributes( { vsdesk: value } ) }
							/>
							<ToggleControl
								label={ __( 'Hide on Tablet', 'kadence-blocks' ) }
								checked={ ( undefined !== vstablet ? vstablet : false ) }
								onChange={ ( value ) => setAttributes( { vstablet: value } ) }
							/>
							<ToggleControl
								label={ __( 'Hide on Mobile', 'kadence-blocks' ) }
								checked={ ( undefined !== vsmobile ? vsmobile : false ) }
								onChange={ ( value ) => setAttributes( { vsmobile: value } ) }
							/>
						</KadencePanelBody>
					</InspectorControls>
				</Fragment>
			) }
			<InspectorAdvancedControls>
				<KadenceRange
					label={ __( 'Z Index Control' ) }
					value={ zIndex }
					onChange={ ( value ) => {
						setAttributes( {
							zIndex: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				{ inRowBlock && (
					<KadenceRange
						label={ __( 'Mobile Collapse Order' ) }
						value={ collapseOrder }
						onChange={ ( value ) => {
							setAttributes( {
								collapseOrder: value,
							} );
						} }
						min={ -10 }
						max={ 10 }
					/>
				) }
			</InspectorAdvancedControls>
			<div id={ `animate-id${ uniqueID }` } data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) } data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) } data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) } style={ {
				minHeight: ( undefined !== previewMinHeight ? previewMinHeight + previewMinHeightUnit : undefined ),
				paddingLeft: ( undefined !== previewPaddingLeft ? previewPaddingLeft + previewPaddingType : undefined ),
				paddingRight: ( undefined !== previewPaddingRight ? previewPaddingRight + previewPaddingType : undefined ),
				paddingTop: ( undefined !== previewPaddingTop ? previewPaddingTop + previewPaddingType : undefined ),
				paddingBottom: ( undefined !== previewPaddingBottom ? previewPaddingBottom + previewPaddingType : undefined ),
				marginLeft: ( undefined !== previewMarginLeft ? previewMarginLeft + previewMarginType : undefined ),
				marginRight: ( undefined !== previewMarginRight ? previewMarginRight + previewMarginType : undefined ),
				marginTop: ( undefined !== previewMarginTop ? previewMarginTop + previewMarginType : undefined ),
				marginBottom: ( undefined !== previewMarginBottom ? previewMarginBottom + previewMarginType : undefined ),
				textAlign: ( previewAlign ? previewAlign : undefined ),
				backgroundColor: backgroundString,
				backgroundImage: ( hasBackgroundImage ? `url( ${ backgroundImg[ 0 ].bgImg} )` : undefined ),
				backgroundSize: ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgSize ? backgroundImg[ 0 ].bgImgSize : undefined ),
				backgroundPosition: ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgPosition ? backgroundImg[ 0 ].bgImgPosition : undefined ),
				backgroundRepeat: ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgRepeat ? backgroundImg[ 0 ].bgImgRepeat : undefined ),
				backgroundAttachment: ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgAttachment ? backgroundImg[ 0 ].bgImgAttachment : undefined ),
				borderColor: borderString,
				borderRadius: ( borderRadius ? borderRadius[ 0 ] + 'px ' + borderRadius[ 1 ] + 'px ' + borderRadius[ 2 ] + 'px ' + borderRadius[ 3 ] + 'px' : '' ),
				borderTopWidth: ( previewBorderTop ? previewBorderTop + 'px' : undefined ),
				borderRightWidth: ( previewBorderRight ? previewBorderRight + 'px' : undefined ),
				borderBottomWidth: ( previewBorderBottom ? previewBorderBottom + 'px' : undefined ),
				borderLeftWidth: ( previewBorderLeft ? previewBorderLeft + 'px' : undefined ),
				boxShadow: ( undefined !== displayShadow && displayShadow && undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].color ? ( undefined !== shadow[ 0 ].inset && shadow[ 0 ].inset ? 'inset ' : '' ) + ( undefined !== shadow[ 0 ].hOffset ? shadow[ 0 ].hOffset : 0 ) + 'px ' + ( undefined !== shadow[ 0 ].vOffset ? shadow[ 0 ].vOffset : 0 ) + 'px ' + ( undefined !== shadow[ 0 ].blur ? shadow[ 0 ].blur : 14 ) + 'px ' + ( undefined !== shadow[ 0 ].spread ? shadow[ 0 ].spread : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' ), ( undefined !== shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 1 ) ) : undefined ),
			} } { ...innerBlocksProps }>
			</div>
		</div>
	);
}
export default SectionEdit;