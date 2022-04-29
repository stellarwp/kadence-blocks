/**
 * BLOCK: Kadence Row / Layout
 */

/**
 * Import Icons
 */
import {
	rowIcon,
	collapseRowIcon,
	collapseRowThreeIcon,
	collapseRowFourIcon,
	collapseRowFiveIcon,
	collapseRowSixIcon,
	twoColIcon,
	gridIcon,
	threeColIcon,
	threeGridIcon,
	lastRowIcon,
	firstRowIcon,
	twoLeftGoldenIcon,
	twoRightGoldenIcon,
	leftHalfIcon,
	rightHalfIcon,
	centerHalfIcon,
	wideCenterIcon,
	exWideCenterIcon,
	fourColIcon,
	lFourFortyIcon,
	rFourFortyIcon,
	fiveColIcon,
	sixColIcon,
	radiusLinkedIcon,
	radiusIndividualIcon,
	topLeftIcon,
	topRightIcon,
	bottomLeftIcon,
	bottomRightIcon
} from '@kadence/icons';

/**
 * Import External
 */
import Select from 'react-select';
import times from 'lodash/times';
import dropRight from 'lodash/dropRight';
import debounce from 'lodash/debounce';
import map from 'lodash/map';
import classnames from 'classnames';
import memoize from 'memize';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import ContainerDimensions from 'react-container-dimensions';
/**
 * Import Kadence Components
 */
import { PopColorControl, SmallResponsiveControl, ResponsiveControl, KadenceRange, MeasurementControls, ResponsiveRangeControls, KadencePanelBody, KadenceRadioButtons, VerticalAlignmentIcon, BackgroundControl as KadenceBackgroundControl } from '@kadence/components';
import { KadenceColorOutput, getPreviewSize } from '@kadence/helpers';

/**
 * Import Block Specific Components
 */
import ThreeColumnDrag from './threeColumndrag';
import PrebuiltModal from '../../plugins/prebuilt-library/prebuilt-library';
import Overlay from './row-overlay';
import RowBackground from './row-background';
import ContentWidthIcon from './content-width-icons';
/**
 * Import Css
 */
import './editor.scss';
/**
 * Import WordPress Internals
 */
import { Component, Fragment } from '@wordpress/element';
import {
	MediaUpload,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockAlignmentToolbar,
} from '@wordpress/block-editor';
import {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	Popover,
	ToolbarGroup,
	TextControl,
	Dashicon,
	RangeControl,
	Toolbar,
	ToggleControl,
	SelectControl,
	ResizableBox,
} from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';
import {
	image,
} from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';
/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {number} columns Number of columns.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnsTemplate = memoize( ( columns ) => {
	return times( columns, n => [ 'kadence/column', { id: n + 1 } ] );
} );
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [ 'kadence/column' ];
const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktrowUniqueIDs = [];
/**
 * Build the row edit
 */
 function RowLayoutEditContainer( {
	attributes,
	setAttributes,
	updateAlignment,
	context,
	updateColumns,
	toggleSelection,
	isSelected,
	clientId,
} ) {
	const { uniqueID, columns, mobileLayout, currentTab, colLayout, tabletLayout, columnGutter, collapseGutter, collapseOrder, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, bgColor, bgImg, bgImgAttachment, bgImgSize, bgImgPosition, bgImgRepeat, bgImgID, verticalAlignment, overlayOpacity, overlayBgImg, overlayBgImgAttachment, overlayBgImgID, overlayBgImgPosition, overlayBgImgRepeat, overlayBgImgSize, currentOverlayTab, overlayBlendMode, overlayGradAngle, overlayGradLoc, overlayGradLocSecond, overlayGradType, overlay, overlaySecond, htmlTag, minHeight, maxWidth, bottomSep, bottomSepColor, bottomSepHeight, bottomSepHeightMobile, bottomSepHeightTab, bottomSepWidth, bottomSepWidthMobile, bottomSepWidthTab, topSep, topSepColor, topSepHeight, topSepHeightMobile, topSepHeightTab, topSepWidth, topSepWidthMobile, topSepWidthTab, firstColumnWidth, secondColumnWidth, textColor, linkColor, linkHoverColor, tabletPadding, topMarginT, bottomMarginT, minHeightUnit, maxWidthUnit, marginUnit, columnsUnlocked, tabletBackground, tabletOverlay, mobileBackground, mobileOverlay, columnsInnerHeight, zIndex, backgroundInline, backgroundSettingTab, backgroundSliderCount, backgroundSlider, inheritMaxWidth, backgroundSliderSettings, backgroundVideo, backgroundVideoType, overlaySecondOpacity, overlayFirstOpacity, paddingUnit, align, minHeightTablet, minHeightMobile, bgColorClass, vsdesk, vstablet, vsmobile, loggedInUser, loggedIn, loggedOut, loggedInShow, rcpAccess, rcpMembership, rcpMembershipLevel, borderWidth, tabletBorderWidth, mobileBorderWidth, borderRadius, tabletBorderRadius, mobileBorderRadius, border, tabletBorder, mobileBorder, isPrebuiltModal, responsiveMaxWidth, kadenceBlockCSS } = attributes;
	const getDynamic = () => {
		let contextPost = null;
		if ( context && context.queryId && context.postId ) {
			contextPost = context.postId;
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['bgImg'] && attributes.kadenceDynamic['bgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', attributes, setAttributes, 'bgImg', contextPost );
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['overlayBgImg'] && attributes.kadenceDynamic['overlayBgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', attributes, setAttributes, 'overlayBgImg', contextPost );
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['tabletBackground:0:bgImg'] && attributes.kadenceDynamic['tabletBackground:0:bgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', attributes, setAttributes, 'tabletBackground:0:bgImg', contextPost );
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['tabletOverlay:0:overlayBgImg'] && attributes.kadenceDynamic['tabletOverlay:0:overlayBgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', attributes, setAttributes, 'tabletOverlay:0:overlayBgImg', contextPost );
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['mobileBackground:0:bgImg'] && attributes.kadenceDynamic['mobileBackground:0:bgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', attributes, setAttributes, 'mobileBackground:0:bgImg', contextPost );
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['mobileOverlay:0:overlayBgImg'] && attributes.kadenceDynamic['mobileOverlay:0:overlayBgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', attributes, setAttributes, 'mobileOverlay:0:overlayBgImg', contextPost );
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
				if ( blockConfigObject[ 'kadence/rowlayout' ] !== undefined && typeof blockConfigObject[ 'kadence/rowlayout' ] === 'object' ) {
					Object.keys( blockConfigObject[ 'kadence/rowlayout' ] ).map( ( attribute ) => {
						attributes[ attribute ] = blockConfigObject[ 'kadence/rowlayout' ][ attribute ];
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
	const { innerItemCount } = useSelect(
		( select ) => {
			return {
				innerItemCount: select( blockEditorStore ).getBlockCount( clientId ),
			};
		},
		[ clientId ]
	);
	useEffect( () => {
		if ( innerItemCount < columns ) {
			updateColumns( innerItemCount, columns );
		}
	}, [ innerItemCount, columns ] );
	const [ firstWidth, setFirstWidth ] = useState( null );
	const [ secondWidth, setSecondWidth ] = useState( null );
	const [ borderWidthControl, setBorderWidthControl ] = useState( 'individual' );
	const [ borderRadiusControl, setBorderRadiusControl ] = useState( 'individual' );
	const [ paddingControl, setPaddingControl ] = useState( 'individual' );
	const [ marginControl, setMarginControl ] = useState( 'individual' );
	const [ showPreset, setShowPreset ] = useState( false );
	const [ contentWidthPop, setContentWidthPop ] = useState( false );
	const saveSlideItem = ( value, thisIndex ) => {
		let currentItems = backgroundSlider;
		if ( undefined === currentItems || ( undefined !== currentItems && undefined === currentItems[ 0 ] ) ) {
			currentItems = [ {
				bgColor: '',
				bgImg: '',
				bgImgID: '',
			} ];
		}
		const newUpdate = currentItems.map( ( item, index ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			backgroundSlider: newUpdate,
		} );
	};
	const editorDocument = document.querySelector( 'iframe[name="editor-canvas"]' )?.contentWindow.document || document;
	const saveTabletBackground = ( value ) => {
		const newUpdate = tabletBackground.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			tabletBackground: newUpdate,
		} );
	};
	const saveTabletOverlay = ( value ) => {
		const newUpdate = tabletOverlay.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			tabletOverlay: newUpdate,
		} );
	};
	const saveMobileBackground = ( value ) => {
		const newUpdate = mobileBackground.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			mobileBackground: newUpdate,
		} );
	};
	const saveMobileOverlay = ( value ) => {
		const newUpdate = mobileOverlay.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			mobileOverlay: newUpdate,
		} );
	};
	const heightTypes = [
		{ key: 'px', name: 'px' },
		{ key: 'vw', name: 'vw' },
		{ key: 'vh', name: 'vh' },
	];
	const widthTypes = [
		{ key: 'px', name: 'px' },
		{ key: '%', name: '%' },
		{ key: 'vw', name: 'vw' },
	];
	const heightMax = ( minHeightUnit === 'px' ? 2000 : 200 );
	const widthMax = ( maxWidthUnit === 'px' ? 2000 : 100 );
	const marginMin = ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 );
	const marginMax = ( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 );
	const marginStep = ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 );
	const paddingMin = ( paddingUnit === 'em' || paddingUnit === 'rem' ? 0 : 0 );
	const paddingMax = ( paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 500 );
	const paddingStep = ( paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1 );
	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== topPadding ? topPadding : '' ), ( undefined !== tabletPadding ? tabletPadding[ 0 ] : '' ), ( undefined !== topPaddingM ? topPaddingM : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== rightPadding ? rightPadding : '' ), ( undefined !== tabletPadding ? tabletPadding[ 1 ] : '' ), ( undefined !== rightPaddingM ? rightPaddingM : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== bottomPadding ? bottomPadding : '' ), ( undefined !== tabletPadding ? tabletPadding[ 2 ] : '' ), ( undefined !== bottomPaddingM ? bottomPaddingM : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== leftPadding ? leftPadding : '' ), ( undefined !== tabletPadding ? tabletPadding[ 3 ] : '' ), ( undefined !== leftPaddingM ? leftPaddingM : '' ) );
	const previewMaxWidth = getPreviewSize( previewDevice, ( undefined !== maxWidth ? maxWidth : '' ), ( undefined !== responsiveMaxWidth && responsiveMaxWidth[0] ? responsiveMaxWidth[ 0 ] : '' ), ( undefined !== responsiveMaxWidth && responsiveMaxWidth[ 1 ] ? responsiveMaxWidth[ 1 ] : '' ) );
	const previewTopSepHeight = getPreviewSize( previewDevice, ( undefined !== topSepHeight ? topSepHeight : '' ), ( undefined !== topSepHeightTab ? topSepHeightTab : '' ), ( undefined !== topSepHeightMobile ? topSepHeightMobile : '' ) );
	const previewTopSepWidth = getPreviewSize( previewDevice, ( undefined !== topSepWidth ? topSepWidth : '' ), ( undefined !== topSepWidthTab ? topSepWidthTab : '' ), ( undefined !== topSepWidthMobile ? topSepWidthMobile : '' ) );
	const previewBottomSepHeight = getPreviewSize( previewDevice, ( undefined !== bottomSepHeight ? bottomSepHeight : '' ), ( undefined !== bottomSepHeightTab ? bottomSepHeightTab : '' ), ( undefined !== bottomSepHeightMobile ? bottomSepHeightMobile : '' ) );
	const previewBottomSepWidth = getPreviewSize( previewDevice, ( undefined !== bottomSepWidth ? bottomSepWidth : '' ), ( undefined !== bottomSepWidthTab ? bottomSepWidthTab : '' ), ( undefined !== bottomSepWidthMobile ? bottomSepWidthMobile : '' ) );
	// const layoutClass = ( ! colLayout ? 'equal' : colLayout );
	// const tabLayoutClass = ( ! tabletLayout ? '' : tabletLayout );
	// const mobileLayoutClass = ( ! mobileLayout ? '' : mobileLayout );
	const previewLayout = getPreviewSize( previewDevice, ( ! colLayout ? 'equal' : colLayout ), ( ! tabletLayout ? '' : tabletLayout ), ( ! mobileLayout ? '' : mobileLayout ) );
	let hasBorderRadius = false;
	if ( undefined !== borderRadius && undefined !== borderRadius[0] && borderRadius[0] ) {
		hasBorderRadius = true;
	}
	if ( undefined !== borderRadius && undefined !== borderRadius[1] && borderRadius[1] ) {
		hasBorderRadius = true;
	}
	if ( undefined !== borderRadius && undefined !== borderRadius[2] && borderRadius[2] ) {
		hasBorderRadius = true;
	}
	if ( undefined !== borderRadius && undefined !== borderRadius[3] && borderRadius[3] ) {
		hasBorderRadius = true;
	}
	const onResize = ( event, direction, elt ) => {
		let firstCol;
		let secondCol;
		if ( columnsUnlocked ) {
			firstCol = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			secondCol = Math.round( ( 100 - firstCol ) * 10 ) / 10;
		} else {
			firstCol = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			secondCol = 100 - ( Math.round( parseInt( elt.style.width ) / 5 ) * 5 );
		}
		setFirstWidth( firstCol );
		setSecondWidth( secondCol );
		editorDocument.getElementById( 'left-column-width-' + uniqueID ).innerHTML = firstCol + '%';
		editorDocument.getElementById( 'right-column-width-' + uniqueID ).innerHTML = secondCol + '%';
	};
	const onResizeStop = ( event, direction, elt, delta ) => {
		let firstCol;
		let secondCol;
		if ( columnsUnlocked ) {
			firstCol = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			secondCol = Math.round( ( 100 - firstCol ) * 10 ) / 10;
		} else {
			firstCol = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			secondCol = 100 - ( Math.round( parseInt( elt.style.width ) / 5 ) * 5 );
		}
		setAttributes( { firstColumnWidth: firstCol } );
		setAttributes( { secondColumnWidth: secondCol } );
		setFirstWidth( null );
		setSecondWidth( null );
	};
	const temporaryColumnWidth = firstWidth;
	const temporarySecondColumnWidth = secondWidth;
	const widthString = `${ temporaryColumnWidth || firstColumnWidth || colLayout }`;
	const secondWidthString = `${ temporarySecondColumnWidth || secondColumnWidth || colLayout }`;
	let thirdWidthString;
	if ( 3 === columns ) {
		if ( firstWidth ) {
			thirdWidthString = Math.abs( Math.round( ( ( parseFloat( firstWidth ) + parseFloat( secondWidth ) ) - 100 ) * 10 ) / 10 );
		} else if ( Math.abs( firstColumnWidth ) === parseFloat( firstColumnWidth ) ) {
			thirdWidthString = Math.abs( Math.round( ( ( parseFloat( firstColumnWidth ) + parseFloat( secondColumnWidth ) ) - 100 ) * 10 ) / 10 );
		} else {
			thirdWidthString = colLayout;
		}
	} else {
		thirdWidthString = colLayout;
	}
	let widthNumber;
	if ( widthString === parseFloat( widthString ) ) {
		widthNumber = widthString + '%';
	} else if ( 'left-golden' === widthString ) {
		widthNumber = '66.67%';
	} else if ( 'right-golden' === widthString ) {
		widthNumber = '33.37%';
	} else {
		widthNumber = '50%';
	}
	const layoutClass = ( ! colLayout ? 'equal' : colLayout );
	const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
	const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
	const selectColLayout = ( columns && ( 2 === columns || 3 === columns ) ? widthString : colLayout );
	const hasBG = ( bgColor || bgImg || overlay || overlayBgImg ? 'kt-row-has-bg' : '' );
	const classes = classnames( {
		'kt-row-column-wrap': true,
		[ `kb-row-id-${ uniqueID }` ]: uniqueID,
		[ `kt-has-${ columns }-columns` ]: columns,
		[ `kt-row-layout-${ previewLayout }` ]: previewLayout,
		[ `kt-row-valign-${ verticalAlignment }` ]: verticalAlignment,
		// [ `kt-tab-layout-${ tabLayoutClass }` ]: tabLayoutClass,
		// [ `kt-mobile-layout-${ mobileLayoutClass }` ]: mobileLayoutClass,
		[ `current-tab-${ currentTab }` ]: currentTab,
		[ `kt-gutter-${ columnGutter }` ]: columnGutter,
		[ `kt-v-gutter-${ collapseGutter }` ]: collapseGutter,
		[ `kt-m-colapse-${ collapseOrder }` ]: collapseOrder,
		[ `kt-custom-first-width-${ widthString }` ]: widthString,
		[ `kt-custom-second-width-${ secondWidthString }` ]: secondWidthString,
		[ `kt-custom-third-width-${ thirdWidthString }` ]: thirdWidthString,
		[ hasBG ]: hasBG,
		'has-border-radius' : hasBorderRadius,
		'kt-inner-column-height-full': columnsInnerHeight,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
		'kadence-has-rcp-display' : rcpMembership && kadence_blocks_params && kadence_blocks_params.rcp_access,
	} );
	let layoutOptions;
	let mobileLayoutOptions;
	const startlayoutOptions = [
		{ key: 'equal', col: 1, name: __( 'Row', 'kadence-blocks' ), icon: rowIcon },
		{ key: 'equal', col: 2, name: __( 'Two: Equal', 'kadence-blocks' ), icon: twoColIcon },
		{ key: 'left-golden', col: 2, name: __( 'Two: Left Heavy 66/33', 'kadence-blocks' ), icon: twoLeftGoldenIcon },
		{ key: 'right-golden', col: 2, name: __( 'Two: Right Heavy 33/66', 'kadence-blocks' ), icon: twoRightGoldenIcon },
		{ key: 'equal', col: 3, name: __( 'Three: Equal', 'kadence-blocks' ), icon: threeColIcon },
		{ key: 'left-half', col: 3, name: __( 'Three: Left Heavy 50/25/25', 'kadence-blocks' ), icon: leftHalfIcon },
		{ key: 'right-half', col: 3, name: __( 'Three: Right Heavy 25/25/50', 'kadence-blocks' ), icon: rightHalfIcon },
		{ key: 'center-half', col: 3, name: __( 'Three: Center Heavy 25/50/25', 'kadence-blocks' ), icon: centerHalfIcon },
		{ key: 'center-wide', col: 3, name: __( 'Three: Wide Center 20/60/20', 'kadence-blocks' ), icon: wideCenterIcon },
		{ key: 'center-exwide', col: 3, name: __( 'Three: Wider Center 15/70/15', 'kadence-blocks' ), icon: exWideCenterIcon },
		{ key: 'equal', col: 4, name: __( 'Four: Equal', 'kadence-blocks' ), icon: fourColIcon },
		{ key: 'left-forty', col: 4, name: __( 'Four: Left Heavy 40/20/20/20', 'kadence-blocks' ), icon: lFourFortyIcon },
		{ key: 'right-forty', col: 4, name: __( 'Four: Right Heavy 20/20/20/40', 'kadence-blocks' ), icon: rFourFortyIcon },
		{ key: 'equal', col: 5, name: __( 'Five: Equal', 'kadence-blocks' ), icon: fiveColIcon },
		{ key: 'equal', col: 6, name: __( 'Six: Equal', 'kadence-blocks' ), icon: sixColIcon },
	];
	const saveSliderSettings = ( value ) => {
		let backgroundSlidSettings;
		if ( undefined === backgroundSliderSettings || ( undefined !== backgroundSliderSettings && undefined === backgroundSliderSettings[ 0 ] ) ) {
			backgroundSlidSettings = [ {
				youTube: '',
				local: '',
				localID: '',
				vimeo: '',
				ratio: '16/9',
				btns: false,
				loop: true,
				mute: true,
			} ];
		} else {
			backgroundSlidSettings = backgroundSliderSettings;
		}
		const newUpdate = backgroundSlidSettings.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			backgroundSliderSettings: newUpdate,
		} );
	};
	const saveVideoSettings = ( value ) => {
		let bgVideo;
		if ( undefined === backgroundVideo || ( undefined !== backgroundVideo && undefined === backgroundVideo[ 0 ] ) ) {
			bgVideo = [ {
				youTube: '',
				local: '',
				localID: '',
				vimeo: '',
				ratio: '16/9',
				btns: false,
				loop: true,
				mute: true,
			} ];
		} else {
			bgVideo = backgroundVideo;
		}
		const newUpdate = bgVideo.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			backgroundVideo: newUpdate,
		} );
	};
	const bottomSVGDivider = {};
	bottomSVGDivider.ct = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
	bottomSVGDivider.cti = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
	bottomSVGDivider.ctd = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
	bottomSVGDivider.ctdi = <Fragment><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></Fragment>;
	bottomSVGDivider.sltl = <path d="M1000,0l-1000,100l1000,0l0,-100Z" />;
	bottomSVGDivider.sltli = <path d="M0,100l1000,-100l-1000,0l0,100Z" />;
	bottomSVGDivider.sltr = <path d="M0,0l1000,100l-1000,0l0,-100Z" />;
	bottomSVGDivider.sltri = <path d="M1000,100l-1000,-100l1000,0l0,100Z" />;
	bottomSVGDivider.crv = <path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />;
	bottomSVGDivider.crvi = <path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />;
	bottomSVGDivider.crvl = <path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />;
	bottomSVGDivider.crvli = <path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />;
	bottomSVGDivider.crvr = <path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />;
	bottomSVGDivider.crvri = <path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />;
	bottomSVGDivider.wave = <path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />;
	bottomSVGDivider.wavei = <path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />;
	bottomSVGDivider.waves = <Fragment><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
	bottomSVGDivider.wavesi = <Fragment><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
	bottomSVGDivider.mtns = <Fragment><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></Fragment>;
	bottomSVGDivider.littri = <path d="M500,2l25,98l-50,0l25,-98Z" />;
	bottomSVGDivider.littrii = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
	bottomSVGDivider.threelevels = <Fragment><path style={ { opacity: 0.33 } } d="M0 95L1000 0v100H0v-5z"></path><path style={ { opacity: 0.66 } } d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path></Fragment>;
	bottomSVGDivider.threelevelsi = <Fragment><path style={ { opacity: 0.33 } } d="M1000 95L0 0v100h1000v-5z"></path><path style={ { opacity: 0.66 } } d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path></Fragment>;
	const renderBottomSVGDivider = svg => (
		<svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={ { fill: '#000000' } }>
			{ bottomSVGDivider[ svg ] }
		</svg>
	);
	const topSVGDivider = {};
	topSVGDivider.ct = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
	topSVGDivider.cti = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
	topSVGDivider.ctd = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
	topSVGDivider.ctdi = <Fragment><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></Fragment>;
	topSVGDivider.sltl = <path d="M1000,0l-1000,100l1000,0l0,-100Z" />;
	topSVGDivider.sltli = <path d="M0,100l1000,-100l-1000,0l0,100Z" />;
	topSVGDivider.sltr = <path d="M0,0l1000,100l-1000,0l0,-100Z" />;
	topSVGDivider.sltri = <path d="M1000,100l-1000,-100l1000,0l0,100Z" />;
	topSVGDivider.crv = <path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />;
	topSVGDivider.crvi = <path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />;
	topSVGDivider.crvl = <path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />;
	topSVGDivider.crvli = <path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />;
	topSVGDivider.crvr = <path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />;
	topSVGDivider.crvri = <path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />;
	topSVGDivider.wave = <path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />;
	topSVGDivider.wavei = <path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />;
	topSVGDivider.waves = <Fragment><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
	topSVGDivider.wavesi = <Fragment><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
	topSVGDivider.mtns = <Fragment><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></Fragment>;
	topSVGDivider.littri = <path d="M500,2l25,98l-50,0l25,-98Z" />;
	topSVGDivider.littrii = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
	topSVGDivider.threelevels = <Fragment><path style={ { opacity: 0.33 } } d="M0 95L1000 0v100H0v-5z"></path><path style={ { opacity: 0.66 } } d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path></Fragment>;
	topSVGDivider.threelevelsi = <Fragment><path style={ { opacity: 0.33 } } d="M1000 95L0 0v100h1000v-5z"></path><path style={ { opacity: 0.66 } } d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path></Fragment>;
	const renderTopSVGDivider = svg => (
		<svg className="top-icon" viewBox="0 0 1000 100" preserveAspectRatio="none" style={ { fill: '#000000' } }>
			{ topSVGDivider[ svg ] }
		</svg>
	);
	if ( 2 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: twoColIcon },
			{ key: 'left-golden', name: __( 'Left Heavy 66/33', 'kadence-blocks' ), icon: twoLeftGoldenIcon },
			{ key: 'right-golden', name: __( 'Right Heavy 33/66', 'kadence-blocks' ), icon: twoRightGoldenIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowIcon },
		];
	} else if ( 3 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: threeColIcon },
			{ key: 'left-half', name: __( 'Left Heavy 50/25/25', 'kadence-blocks' ), icon: leftHalfIcon },
			{ key: 'right-half', name: __( 'Right Heavy 25/25/50', 'kadence-blocks' ), icon: rightHalfIcon },
			{ key: 'center-half', name: __( 'Center Heavy 25/50/25', 'kadence-blocks' ), icon: centerHalfIcon },
			{ key: 'center-wide', name: __( 'Wide Center 20/60/20', 'kadence-blocks' ), icon: wideCenterIcon },
			{ key: 'center-exwide', name: __( 'Wider Center 15/70/15', 'kadence-blocks' ), icon: exWideCenterIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowThreeIcon },
		];
	} else if ( 4 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: fourColIcon },
			{ key: 'left-forty', name: __( 'Left Heavy 40/20/20/20', 'kadence-blocks' ), icon: lFourFortyIcon },
			{ key: 'right-forty', name: __( 'Right Heavy 20/20/20/40', 'kadence-blocks' ), icon: rFourFortyIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowFourIcon },
		];
	} else if ( 5 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: fiveColIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowFiveIcon },
		];
	} else if ( 6 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: sixCol },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowSixIcon },
		];
	} else {
		layoutOptions = [
			{ key: 'equal', name: __( 'Single Row', 'kadence-blocks' ), icon: rowIcon },
		];
	}
	if ( 2 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: twoColIcon },
			{ key: 'left-golden', name: __( 'Left Heavy 66/33', 'kadence-blocks' ), icon: twoLeftGoldenIcon },
			{ key: 'right-golden', name: __( 'Right Heavy 33/66', 'kadence-blocks' ), icon: twoRightGoldenIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowIcon },
		];
	} else if ( 3 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: threeColIcon },
			{ key: 'left-half', name: __( 'Left Heavy 50/25/25', 'kadence-blocks' ), icon: leftHalfIcon },
			{ key: 'right-half', name: __( 'Right Heavy 25/25/50', 'kadence-blocks' ), icon: rightHalfIcon },
			{ key: 'center-half', name: __( 'Center Heavy 25/50/25', 'kadence-blocks' ), icon: centerHalfIcon },
			{ key: 'center-wide', name: __( 'Wide Center 20/60/20', 'kadence-blocks' ), icon: wideCenterIcon },
			{ key: 'center-exwide', name: __( 'Wider Center 15/70/15', 'kadence-blocks' ), icon: exWideCenterIcon },
			{ key: 'first-row', name: __( 'First Row, Next Columns 100 - 50/50', 'kadence-blocks' ), icon: firstRowIcon },
			{ key: 'last-row', name: __( 'Last Row, Previous Columns 50/50 - 100', 'kadence-blocks' ), icon: lastRowIcon },
			{ key: 'two-grid', name: __( 'Two Column Grid', 'kadence-blocks' ), icon: gridIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowThreeIcon },
		];
	} else if ( 4 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: fourColIcon },
			{ key: 'left-forty', name: __( 'Left Heavy 40/20/20/20', 'kadence-blocks' ), icon: lFourFortyIcon },
			{ key: 'right-forty', name: __( 'Right Heavy 20/20/20/40', 'kadence-blocks' ), icon: rFourFortyIcon },
			{ key: 'two-grid', name: __( 'Two Column Grid', 'kadence-blocks' ), icon: gridIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowFourIcon },
		];
	} else if ( 5 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: fiveColIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowFiveIcon },
		];
	} else if ( 6 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: sixColIcon },
			{ key: 'two-grid', name: __( 'Two Column Grid', 'kadence-blocks' ), icon: gridIcon },
			{ key: 'three-grid', name: __( 'Three Column Grid', 'kadence-blocks' ), icon: threeGridIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowSixIcon },
		];
	} else {
		mobileLayoutOptions = [
			{ key: 'row', name: __( 'Single Row', 'kadence-blocks' ), icon: rowIcon },
		];
	}
	const onTabBackgroundSelect = ( tabName ) => {
		setAttributes( { backgroundSettingTab: tabName } );
	};
	const onTabSelect = ( tabName ) => {
		setAttributes( { currentTab: tabName } );
	};
	const onOverlayTabSelect = ( tabName ) => {
		setAttributes( { currentOverlayTab: tabName } );
	};
	const onSelectImage = img => {
		setAttributes( {
			bgImgID: img.id,
			bgImg: img.url,
		} );
	};
	const onSelectURL = img => {
		setAttributes( {
			bgImgID: img.id,
			bgImg: img.url,
		} );
	};
	const onSelectOverlayImage = img => {
		setAttributes( {
			overlayBgImgID: img.id,
			overlayBgImg: img.url,
		} );
	};
	const onRemoveMobileImage = () => {
		saveMobileBackground( {
			bgImgID: '',
			bgImg: '',
		} );
	};
	const onRemoveTabletImage = () => {
		saveTabletBackground( {
			bgImgID: '',
			bgImg: '',
		} );
	};
	const onRemoveImage = () => {
		setAttributes( {
			bgImgID: null,
			bgImg: null,
		} );
	};
	const onRemoveMobileOverlayImage = () => {
		saveMobileOverlay( {
			overlayBgImgID: '',
			overlayBgImg: '',
		} );
	};
	const onRemoveTabletOverlayImage = () => {
		saveTabletOverlay( {
			overlayBgImgID: '',
			overlayBgImg: '',
		} );
	};
	const onRemoveOverlayImage = () => {
		setAttributes( {
			overlayBgImgID: null,
			overlayBgImg: null,
		} );
	};
	const mobileControls = (
		<Fragment>
			{ showSettings( 'basicLayout' ) && (
				<KadencePanelBody panelName={ 'kb-row-basic-settings' }>
					{ columns > 1 && (
						<Fragment>
							<p className="components-base-control__label">{ __( 'Mobile Layout', 'kadence-blocks' ) }</p>
							<ButtonGroup aria-label={ __( 'Mobile Layout', 'kadence-blocks' ) }>
								{ map( mobileLayoutOptions, ( { name, key, icon } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-layout-btn"
											isSmall
											isPrimary={ mobileLayout === key }
											aria-pressed={ mobileLayout === key }
											onClick={ () => setAttributes( { mobileLayout: key } ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
						</Fragment>
					) }
					{ columns > 1 && (
						<SelectControl
							label={ __( 'Column Collapse Vertical Gutter', 'kadence-blocks' ) }
							value={ collapseGutter }
							options={ [
								{ value: 'default', label: __( 'Standard: 30px', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Gutter', 'kadence-blocks' ) },
								{ value: 'skinny', label: __( 'Skinny: 10px', 'kadence-blocks' ) },
								{ value: 'narrow', label: __( 'Narrow: 20px', 'kadence-blocks' ) },
								{ value: 'wide', label: __( 'Wide: 40px', 'kadence-blocks' ) },
								{ value: 'wider', label: __( 'Wider: 60px', 'kadence-blocks' ) },
								{ value: 'widest', label: __( 'Widest: 80px', 'kadence-blocks' ) },
							] }
							onChange={ ( value ) => setAttributes( { collapseGutter: value } ) }
						/>
					) }
					{ columns > 1 && (
						<SelectControl
							label={ __( 'Collapse Order', 'kadence-blocks' ) }
							value={ collapseOrder }
							options={ [
								{ value: 'left-to-right', label: __( 'Left to Right', 'kadence-blocks' ) },
								{ value: 'right-to-left', label: __( 'Right to Left', 'kadence-blocks' ) },
							] }
							onChange={ value => setAttributes( { collapseOrder: value } ) }
						/>
					) }
				</KadencePanelBody>
			) }
			{ showSettings( 'paddingMargin', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Mobile Padding/Margin', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-mobile-padding' }
				>
					<MeasurementControls
						label={ __( 'Padding', 'kadence-blocks' ) }
						measurement={ [ topPaddingM, rightPaddingM, bottomPaddingM, leftPaddingM ] }
						onChange={ ( value ) => setAttributes( { topPaddingM: value[ 0 ], rightPaddingM: value[ 1 ], bottomPaddingM: value[ 2 ], leftPaddingM: value[ 3 ] } ) }
						min={ paddingMin }
						max={ paddingMax }
						step={ paddingStep }
						allowEmpty={ true }
						unit={ paddingUnit }
						onUnit={ ( value ) => setAttributes( { paddingUnit: value } ) }
						showUnit={ true }
						units={ [ 'px', 'em', 'rem', '%', 'vh', 'vw' ] }
					/>
					<MeasurementControls
						label={ __( 'Margin', 'kadence-blocks' ) }
						measurement={ [ ( undefined !== topMarginM ? topMarginM : '' ), 'auto', ( undefined !== bottomMarginM ? bottomMarginM : '' ), 'auto' ] }
						onChange={ ( value ) => {
							setAttributes( { topMarginM: value[ 0 ], bottomMarginM: value[ 2 ] } );
						} }
						min={ marginMin }
						max={ marginMax }
						step={ marginStep }
						allowEmpty={ true }
						unit={ marginUnit }
						onUnit={ ( value ) => setAttributes( { marginUnit: value } ) }
						showUnit={ true }
						units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
					/>
				</KadencePanelBody>
			) }
			{ showSettings( 'background', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Mobile Background', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-mobile-background' }
				>
					<ToggleControl
						label={ __( 'Set custom background for Mobile?', 'kadence-blocks' ) }
						checked={ ( mobileBackground && mobileBackground[ 0 ] ? mobileBackground[ 0 ].enable : false ) }
						onChange={ ( value ) => saveMobileBackground( { enable: value } ) }
					/>
					{ mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].enable && (
						<Fragment>
							<PopColorControl
								label={ __( 'Background Color', 'kadence-blocks' ) }
								value={ ( mobileBackground[ 0 ].bgColor ? mobileBackground[ 0 ].bgColor : '' ) }
								default={ '' }
								onChange={ value => saveMobileBackground( { bgColor: value } ) }
							/>
							{ '' === mobileBackground[ 0 ].bgImg && '' !== bgImg && (
								<ToggleControl
									label={ __( 'Force no image for mobile', 'kadence-blocks' ) }
									checked={ ( mobileBackground && mobileBackground[ 0 ] ? mobileBackground[ 0 ].forceOverDesk : false ) }
									onChange={ ( value ) => saveMobileBackground( { forceOverDesk: value } ) }
								/>
							) }
							<KadenceBackgroundControl
								label={ __( 'Background Image', 'kadence-blocks' ) }
								hasImage={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImg ? true : false ) }
								imageURL={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImg ? mobileBackground[ 0 ].bgImg : '' ) }
								imageID={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgID ? mobileBackground[ 0 ].bgImgID : '' ) }
								imagePosition={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgPosition ? mobileBackground[ 0 ].bgImgPosition : 'center center' ) }
								imageSize={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgSize ? mobileBackground[ 0 ].bgImgSize : 'cover' ) }
								imageRepeat={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgRepeat ? mobileBackground[ 0 ].bgImgRepeat : 'no-repeat' ) }
								imageAttachment={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgAttachment ? mobileBackground[ 0 ].bgImgAttachment : 'scroll' ) }
								imageAttachmentParallax={ true }
								onRemoveImage={ onRemoveMobileImage }
								onSaveImage={ ( img ) => {
									saveMobileBackground( {
										bgImgID: img.id,
										bgImg: img.url,
									} );
								} }
								onSaveURL={ ( newURL ) => {
									if ( newURL !== ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImg ? mobileBackground[ 0 ].bgImg : '' ) ) {
										saveMobileBackground( {
											bgImgID: undefined,
											bgImg: newURL,
										} );
									}
								} }
								onSavePosition={ value => saveMobileBackground( { bgImgPosition: value } ) }
								onSaveSize={ value => saveMobileBackground( { bgImgSize: value } ) }
								onSaveRepeat={ value => saveMobileBackground( { bgImgRepeat: value } ) }
								onSaveAttachment={ value => saveMobileBackground( { bgImgAttachment: value } ) }
								disableMediaButtons={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImg ? mobileBackground[ 0 ].bgImg : '' ) }
								dynamicAttribute="mobileBackground:0:bgImg"
								isSelected={ isSelected }
								attributes={ attributes }
								setAttributes={ setAttributes }
								name={ 'kadence/rowlayout' }
								clientId={ clientId }
							/>
						</Fragment>
					) }
				</KadencePanelBody>
			) }
			{ showSettings( 'backgroundOverlay', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Mobile Background Overlay' ) }
					initialOpen={ false }
					panelName={ 'kb-row-mobile-bg-overlay' }
				>
					<ToggleControl
						label={ __( 'Set custom background overlay for mobile?', 'kadence-blocks' ) }
						checked={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].enable : false ) }
						onChange={ ( value ) => saveMobileOverlay( { enable: value } ) }
					/>
					{ mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].enable && (
						<TabPanel className="kt-inspect-tabs kt-gradient-tabs"
							activeClass="active-tab"
							initialTabName={ mobileOverlay[ 0 ].currentOverlayTab }
							onSelect={ value => saveMobileOverlay( { currentOverlayTab: value } ) }
							tabs={ [
								{
									name: 'normal',
									title: __( 'Normal', 'kadence-blocks' ),
									className: 'kt-over-normal',
								},
								{
									name: 'grad',
									title: __( 'Gradient', 'kadence-blocks' ),
									className: 'kt-over-grad',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'grad' === tab.name ) {
											tabout = overMobileGradControls;
										} else {
											tabout = overMobileControls;
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>
					) }
				</KadencePanelBody>
			) }
			{ showSettings( 'border', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Border Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-border-settings' }
				>
					<PopColorControl
						label={ __( 'Mobile Border Color', 'kadence-blocks' ) }
						value={ ( mobileBorder ? mobileBorder : '' ) }
						default={ '' }
						onChange={ value => setAttributes( { mobileBorder: value } ) }
					/>
					<MeasurementControls
						label={ __( 'Mobile Border Width', 'kadence-blocks' ) }
						measurement={ mobileBorderWidth }
						onChange={ ( value ) => setAttributes( { mobileBorderWidth: value } ) }
						control={ borderWidthControl }
						onControl={ ( value ) => setBorderWidthControl( value ) }
						min={ 0 }
						max={ 40 }
						step={ 1 }
						allowEmpty={ true }
						unit={ 'px' }
						units={ [ 'px' ] }
						showUnit={ true }
						preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
					/>
					<MeasurementControls
						label={ __( 'Mobile Border Radius', 'kadence-blocks' ) }
						measurement={ mobileBorderRadius }
						control={ borderRadiusControl }
						onChange={ ( value ) => setAttributes( { mobileBorderRadius: value } ) }
						onControl={ ( value ) => setBorderRadiusControl( value ) }
						min={ 0 }
						max={ 500 }
						step={ 1 }
						allowEmpty={ true }
						controlTypes={ [
							{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: icons.radiuslinked },
							{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: icons.radiusindividual },
						] }
						firstIcon={ icons.topleft }
						secondIcon={ icons.topright }
						thirdIcon={ icons.bottomright }
						fourthIcon={ icons.bottomleft }
					/>
				</KadencePanelBody>
			) }
		</Fragment>
	);
	const tabletControls = (
		<Fragment>
			{ showSettings( 'basicLayout', 'kadence/rowlayout' ) && (
				<KadencePanelBody panelName={ 'kb-row-basic-layout' }>
					{ columns > 1 && (
						<Fragment>
							<p className="components-base-control__label">{ __( 'Tablet Layout', 'kadence-blocks' ) }</p>
							<ButtonGroup aria-label={ __( 'Tablet Layout', 'kadence-blocks' ) }>
								{ map( mobileLayoutOptions, ( { name, key, icon } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-layout-btn"
											isSmall
											isPrimary={ tabletLayout === key }
											aria-pressed={ tabletLayout === key }
											onClick={ () => setAttributes( { tabletLayout: key } ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
						</Fragment>
					) }
				</KadencePanelBody>
			) }
			{ showSettings( 'paddingMargin', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Tablet Padding/Margin', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-tablet-padding' }
				>
					<MeasurementControls
						label={ __( 'Padding', 'kadence-blocks' ) }
						measurement={ tabletPadding }
						onChange={ ( value ) => setAttributes( { tabletPadding: value } ) }
						min={ paddingMin }
						max={ paddingMax }
						step={ paddingStep }
						allowEmpty={ true }
						unit={ paddingUnit }
						onUnit={ ( value ) => setAttributes( { paddingUnit: value } ) }
						showUnit={ true }
						units={ [ 'px', 'em', 'rem', '%', 'vh', 'vw' ] }
					/>
					<MeasurementControls
						label={ __( 'Margin', 'kadence-blocks' ) }
						measurement={ [ ( undefined !== topMarginT ? topMarginT : '' ), 'auto', ( undefined !== bottomMarginT ? bottomMarginT : '' ), 'auto' ] }
						onChange={ ( value ) => {
							setAttributes( { topMarginT: value[ 0 ], bottomMarginT: value[ 2 ] } );
						} }
						min={ marginMin }
						max={ marginMax }
						step={ marginStep }
						allowEmpty={ true }
						unit={ marginUnit }
						onUnit={ ( value ) => setAttributes( { marginUnit: value } ) }
						showUnit={ true }
						units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
					/>
				</KadencePanelBody>
			) }
			{ showSettings( 'background', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Tablet Background', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-tablet-bg' }
				>
					<ToggleControl
						label={ __( 'Set custom background for tablets?', 'kadence-blocks' ) }
						checked={ ( tabletBackground && tabletBackground[ 0 ] ? tabletBackground[ 0 ].enable : false ) }
						onChange={ ( value ) => saveTabletBackground( { enable: value } ) }
					/>
					{ tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].enable && (
						<Fragment>
							<PopColorControl
								label={ __( 'Background Color', 'kadence-blocks' ) }
								value={ ( tabletBackground[ 0 ].bgColor ? tabletBackground[ 0 ].bgColor : '' ) }
								default={ '' }
								onChange={ value => saveTabletBackground( { bgColor: value } ) }
							/>
							{ '' === tabletBackground[ 0 ].bgImg && '' !== bgImg && (
								<ToggleControl
									label={ __( 'Force no image for tablet', 'kadence-blocks' ) }
									checked={ ( tabletBackground && tabletBackground[ 0 ] ? tabletBackground[ 0 ].forceOverDesk : false ) }
									onChange={ ( value ) => saveTabletBackground( { forceOverDesk: value } ) }
								/>
							) }
							<KadenceBackgroundControl
								label={ __( 'Background Image', 'kadence-blocks' ) }
								hasImage={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImg ? true : false ) }
								imageURL={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImg ? tabletBackground[ 0 ].bgImg : '' ) }
								imageID={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgID ? tabletBackground[ 0 ].bgImgID : '' ) }
								imagePosition={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgPosition ? tabletBackground[ 0 ].bgImgPosition : 'center center' ) }
								imageSize={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgSize ? tabletBackground[ 0 ].bgImgSize : 'cover' ) }
								imageRepeat={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgRepeat ? tabletBackground[ 0 ].bgImgRepeat : 'no-repeat' ) }
								imageAttachment={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgAttachment ? tabletBackground[ 0 ].bgImgAttachment : 'scroll' ) }
								imageAttachmentParallax={ true }
								onRemoveImage={ onRemoveTabletImage }
								onSaveImage={ ( img ) => {
									saveTabletBackground( {
										bgImgID: img.id,
										bgImg: img.url,
									} );
								} }
								onSaveURL={ ( newURL ) => {
									if ( newURL !== ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImg ? tabletBackground[ 0 ].bgImg : '' ) ) {
										saveTabletBackground( {
											bgImgID: undefined,
											bgImg: newURL,
										} );
									}
								} }
								onSavePosition={ value => saveTabletBackground( { bgImgPosition: value } ) }
								onSaveSize={ value => saveTabletBackground( { bgImgSize: value } ) }
								onSaveRepeat={ value => saveTabletBackground( { bgImgRepeat: value } ) }
								onSaveAttachment={ value => saveTabletBackground( { bgImgAttachment: value } ) }
								disableMediaButtons={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImg ? tabletBackground[ 0 ].bgImg : '' ) }
								dynamicAttribute="tabletBackground:0:bgImg"
								isSelected={ isSelected }
								attributes={ attributes }
								setAttributes={ setAttributes }
								name={ 'kadence/rowlayout' }
								clientId={ clientId }
							/>
						</Fragment>
					) }
				</KadencePanelBody>
			) }
			{ showSettings( 'backgroundOverlay', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Tablet Background Overlay', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-tablet-bg-overlay' }
				>
					<ToggleControl
						label={ __( 'Set custom background overlay for tablets?', 'kadence-blocks' ) }
						checked={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].enable : false ) }
						onChange={ ( value ) => saveTabletOverlay( { enable: value } ) }
					/>
					{ tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].enable && (
						<TabPanel className="kt-inspect-tabs kt-gradient-tabs"
							activeClass="active-tab"
							initialTabName={ tabletOverlay[ 0 ].currentOverlayTab }
							onSelect={ value => saveTabletOverlay( { currentOverlayTab: value } ) }
							tabs={ [
								{
									name: 'normal',
									title: __( 'Normal', 'kadence-blocks' ),
									className: 'kt-over-normal',
								},
								{
									name: 'grad',
									title: __( 'Gradient', 'kadence-blocks' ),
									className: 'kt-over-grad',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'grad' === tab.name ) {
											tabout = overTabGradControls;
										} else {
											tabout = overTabControls;
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>
					) }
				</KadencePanelBody>
			) }
			{ showSettings( 'border', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Border Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-border-settings' }
				>
					<PopColorControl
						label={ __( 'Tablet Border Color', 'kadence-blocks' ) }
						value={ ( tabletBorder ? tabletBorder : '' ) }
						default={ '' }
						onChange={ value => setAttributes( { tabletBorder: value } ) }
					/>
					<MeasurementControls
						label={ __( 'Tablet Border Width', 'kadence-blocks' ) }
						measurement={ tabletBorderWidth }
						onChange={ ( value ) => setAttributes( { tabletBorderWidth: value } ) }
						control={ borderWidthControl }
						onControl={ ( value ) => this.setState( { borderWidthControl: value } ) }
						min={ 0 }
						max={ 40 }
						step={ 1 }
						allowEmpty={ true }
						unit={ 'px' }
						units={ [ 'px' ] }
						showUnit={ true }
						preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
					/>
					<MeasurementControls
						label={ __( 'Tablet Border Radius', 'kadence-blocks' ) }
						measurement={ tabletBorderRadius }
						control={ borderRadiusControl }
						onChange={ ( value ) => setAttributes( { tabletBorderRadius: value } ) }
						onControl={ ( value ) => this.setState( { borderRadiusControl: value } ) }
						min={ 0 }
						max={ 500 }
						step={ 1 }
						allowEmpty={ true }
						controlTypes={ [
							{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: icons.radiuslinked },
							{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: icons.radiusindividual },
						] }
						firstIcon={ icons.topleft }
						secondIcon={ icons.topright }
						thirdIcon={ icons.bottomright }
						fourthIcon={ icons.bottomleft }
					/>
				</KadencePanelBody>
			) }
		</Fragment>
	);
	const slideControls = ( index ) => {
		let bgSlider;
		if ( undefined === backgroundSlider || ( undefined !== backgroundSlider && undefined === backgroundSlider[ 0 ] ) ) {
			bgSlider = [ {
				bgColor: '',
				bgImg: '',
				bgImgID: '',
			} ];
		} else {
			bgSlider = backgroundSlider;
		}
		return (
			<Fragment>
				<h2>{ __( 'Slide', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' ) }</h2>
				<div className="kt-inner-sub-section">
					<PopColorControl
						label={ __( 'Slide Background Color', 'kadence-blocks' ) }
						value={ ( undefined !== bgSlider && undefined !== bgSlider[ index ] && bgSlider[ index ].bgColor ? bgSlider[ index ].bgColor : '' ) }
						default={ '' }
						onChange={ value => saveSlideItem( { bgColor: value }, index ) }
					/>
					{ ( undefined === bgSlider[ index ] || undefined === bgSlider[ index ].bgImg || '' === bgSlider[ index ].bgImg ) && (
						<MediaUpload
							onSelect={ img => {
								saveSlideItem( {
									bgImgID: img.id,
									bgImg: img.url,
								}, index );
							} }
							type="image"
							value={ ( undefined !== bgSlider && undefined !== bgSlider[ index ] && bgSlider[ index ].bgImgID ? bgSlider[ index ].bgImgID : '' ) }
							render={ ( { open } ) => (
								<Button
									className={ 'components-button components-icon-button kt-cta-upload-btn' }
									onClick={ open }
								>
									<Dashicon icon="format-image" />
									{ __( 'Slide Select Image', 'kadence-blocks' ) }
								</Button>
							) }
						/>
					) }
					{ undefined !== bgSlider && undefined !== bgSlider[ index ] && bgSlider[ index ].bgImg && (
						<Fragment>
							<MediaUpload
								onSelect={ media => {
									saveSlideItem( {
										bgImgID: media.id,
										bgImg: media.url,
									}, index );
								} }
								type="image"
								value={ ( undefined !== bgSlider && undefined !== bgSlider[ index ] && bgSlider[ index ].bgImgID ? bgSlider[ index ].bgImgID : '' ) }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Tooltip text={ __( 'Edit Image', 'kadence-blocks' ) }>
										<Button
											style={ {
												backgroundImage: 'url("' + bgSlider[ index ].bgImg + '")',
												backgroundSize: 'cover',
											} }
											className={ 'kb-sidebar-image' }
											onClick={ open }
										>
											{ __( 'Edit Image' ) }
										</Button>
									</Tooltip>
								) }
							/>
							<Tooltip text={ __( 'Remove Image', 'kadence-blocks' ) }>
								<Button
									className={ 'components-button components-icon-button kt-remove-img kt-cta-upload-btn' }
									onClick={ () => {
										saveSlideItem( {
											bgImgID: '',
											bgImg: '',
										}, index );
									} }
								>
									<Dashicon icon="no-alt" />
								</Button>
							</Tooltip>
						</Fragment>
					) }
				</div>
			</Fragment>
		);
	};
	const deskControls = (
		<Fragment>
			{ showSettings( 'basicLayout', 'kadence/rowlayout' ) && (
				<KadencePanelBody panelName={ 'kb-row-basic-layout' }>
					<RangeControl
						label={ __( 'Columns', 'kadence-blocks' ) }
						value={ columns }
						onChange={ ( nextColumns ) => {
							updateColumns( innerItemCount, nextColumns );
							setAttributes( {
								columns: nextColumns,
								colLayout: 'equal',
								firstColumnWidth: undefined,
								secondColumnWidth: undefined,
								tabletLayout: 'inherit',
								mobileLayout: 'row',
							} );
						} }
						min={ 1 }
						max={ 6 }
					/>
					{ columns > 1 && (
						<Fragment>
							<p className="components-base-control__label">{ __( 'Layout', 'kadence-blocks' ) }</p>
							<ButtonGroup className="kb-column-layout" aria-label={ __( 'Column Layout', 'kadence-blocks' ) }>
								{ map( layoutOptions, ( { name, key, icon } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-layout-btn"
											isSmall
											isPrimary={ selectColLayout === key }
											aria-pressed={ selectColLayout === key }
											onClick={ () => {
												setAttributes( {
													colLayout: key,
												} );
												setAttributes( {
													firstColumnWidth: undefined,
													secondColumnWidth: undefined,
												} );
											} }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
						</Fragment>
					) }
					{ columns > 1 && (
						<SelectControl
							label={ __( 'Column Gutter', 'kadence-blocks' ) }
							value={ columnGutter }
							options={ [
								{ value: 'default', label: __( 'Standard: 30px', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Gutter', 'kadence-blocks' ) },
								{ value: 'skinny', label: __( 'Skinny: 10px', 'kadence-blocks' ) },
								{ value: 'narrow', label: __( 'Narrow: 20px', 'kadence-blocks' ) },
								{ value: 'wide', label: __( 'Wide: 40px', 'kadence-blocks' ) },
								{ value: 'wider', label: __( 'Wider: 60px', 'kadence-blocks' ) },
								{ value: 'widest', label: __( 'Widest: 80px', 'kadence-blocks' ) },
							] }
							onChange={ ( value ) => setAttributes( { columnGutter: value } ) }
						/>
					) }
				</KadencePanelBody>
			) }
			{ showSettings( 'paddingMargin', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Padding/Margin', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-padding' }
				>
					<MeasurementControls
						label={ __( 'Padding', 'kadence-blocks' ) }
						measurement={ [ ( undefined !== topPadding ? topPadding : '' ), ( undefined !== rightPadding ? rightPadding : '' ), ( undefined !== bottomPadding ? bottomPadding : '' ), ( undefined !== leftPadding ? leftPadding : '' ) ] }
						onChange={ ( value ) => setAttributes( { topPadding: value[ 0 ], rightPadding: value[ 1 ], bottomPadding: value[ 2 ], leftPadding: value[ 3 ] } ) }
						min={ paddingMin }
						max={ paddingMax }
						step={ paddingStep }
						allowEmpty={ true }
						unit={ paddingUnit }
						onUnit={ ( value ) => setAttributes( { paddingUnit: value } ) }
						showUnit={ true }
						units={ [ 'px', 'em', 'rem', '%', 'vh', 'vw' ] }
					/>
					<MeasurementControls
						label={ __( 'Margin', 'kadence-blocks' ) }
						measurement={ [ ( undefined !== topMargin ? topMargin : '' ), 'auto', ( undefined !== bottomMargin ? bottomMargin : '' ), 'auto' ] }
						onChange={ ( value ) => {
							setAttributes( { topMargin: value[ 0 ], bottomMargin: value[ 2 ] } );
						} }
						min={ marginMin }
						max={ marginMax }
						step={ marginStep }
						allowEmpty={ true }
						unit={ marginUnit }
						onUnit={ ( value ) => setAttributes( { marginUnit: value } ) }
						showUnit={ true }
						units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
					/>
				</KadencePanelBody>
			) }
			{ showSettings( 'background', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Background Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-bg-settings' }
				>
					<TabPanel className="kt-inspect-tabs"
						initialTabName={ backgroundSettingTab }
						activeClass="active-tab"
						onSelect={ onTabBackgroundSelect }
						tabs={ [
							{
								name: 'normal',
								title: <Dashicon icon="format-image" />,
								className: 'kt-desk-tab',
							},
							{
								name: 'slider',
								title: <Dashicon icon="slides" />,
								className: 'kt-tablet-tab',
							},
							{
								name: 'video',
								title: <Dashicon icon="format-video" />,
								className: 'kt-mobile-tab',
							},
						] }>
						{
							( tab ) => {
								let tabout;
								if ( tab.name ) {
									if ( 'slider' === tab.name ) {
										tabout = (
											<Fragment>
												<RangeControl
													label={ __( 'Background Slider Image Count', 'kadence-blocks' ) }
													value={ ( undefined !== backgroundSliderCount ? backgroundSliderCount : 1 ) }
													onChange={ newcount => {
														let newSlides;
														if ( undefined === backgroundSlider || ( undefined !== backgroundSlider && undefined === backgroundSlider[ 0 ] ) ) {
															newSlides = [ {
																bgColor: '',
																bgImg: '',
																bgImgID: '',
															} ];
														} else {
															newSlides = backgroundSlider;
														}
														if ( newSlides.length < newcount ) {
															const amount = Math.abs( newcount - newSlides.length );
															{ times( amount, n => {
																newSlides.push( {
																	bgColor: '',
																	bgImg: '',
																	bgImgID: '',
																} );
															} ); }
															setAttributes( { backgroundSlider: newSlides } );
														}
														setAttributes( { backgroundSliderCount: newcount } );
													} }
													step={ 1 }
													min={ 1 }
													max={ 20 }
												/>
												{ times( ( undefined !== backgroundSliderCount ? backgroundSliderCount : 1 ), n => slideControls( n ) ) }
												<KadenceRadioButtons
													label={ __( 'Slider Image Size', 'kadence-blocks' ) }
													value={ bgImgSize }
													options={ [
														{ value: 'cover', label: __( 'Cover', 'kadence-blocks' ) },
														{ value: 'contain', label: __( 'Contain', 'kadence-blocks' ) },
														{ value: 'auto', label: __( 'Auto', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { bgImgSize: value } ) }
												/>
												<SelectControl
													label={ __( 'Slider Image Position', 'kadence-blocks' ) }
													value={ bgImgPosition }
													options={ [
														{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
														{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
														{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
														{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
														{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
														{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
														{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
														{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
														{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { bgImgPosition: value } ) }
												/>
												<KadenceRadioButtons
													label={ __( 'Slider Image Repeat', 'kadence-blocks' ) }
													value={ bgImgRepeat }
													options={ [
														{ value: 'no-repeat', label: __( 'No Repeat', 'kadence-blocks' ) },
														{ value: 'repeat', label: __( 'Repeat', 'kadence-blocks' ) },
														{ value: 'repeat-x', label: __( 'Repeat-x', 'kadence-blocks' ) },
														{ value: 'repeat-y', label: __( 'Repeat-y', 'kadence-blocks' ) },
													] }
													onChange={ value => setAttributes( { bgImgRepeat: value } ) }
												/>
												<ToggleControl
													label={ __( 'Slider Auto Play', 'kadence-blocks' ) }
													checked={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].autoPlay ? backgroundSliderSettings[ 0 ].autoPlay : true ) }
													onChange={ ( value ) => saveSliderSettings( { autoPlay: value } ) }
												/>
												{ backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].autoPlay && backgroundSliderSettings[ 0 ].autoPlay && (
													<KadenceRange
														label={ __( 'Autoplay Speed', 'kadence-blocks' ) }
														value={ backgroundSliderSettings[ 0 ].speed }
														onChange={ ( value ) => saveSliderSettings( { speed: value } ) }
														min={ 500 }
														max={ 15000 }
														step={ 10 }
													/>
												) }
												<SelectControl
													label={ __( 'Transition Style', 'kadence-blocks' ) }
													options={ [
														{
															label: __( 'Fade', 'kadence-blocks' ),
															value: 'fade',
														},
														{
															label: __( 'Slide', 'kadence-blocks' ),
															value: 'slide',
														},
													] }
													value={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].fade && false === backgroundSliderSettings[ 0 ].fade ? 'slide' : 'fade' ) }
													onChange={ ( value ) => {
														if ( 'slide' === value ) {
															saveSliderSettings( { fade: false } );
														} else {
															saveSliderSettings( { fade: true } );
														}
													} }
												/>
												<KadenceRange
													label={ __( 'Slider Transition Speed', 'kadence-blocks' ) }
													value={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].tranSpeed ? backgroundSliderSettings[ 0 ].tranSpeed : 400 ) }
													onChange={ ( value ) => saveSliderSettings( { tranSpeed: value } ) }
													min={ 100 }
													max={ 2000 }
													step={ 10 }
												/>
												<SelectControl
													label={ __( 'Arrow Style', 'kadence-blocks' ) }
													options={ [
														{
															label: __( 'White on Dark', 'kadence-blocks' ),
															value: 'whiteondark',
														},
														{
															label: __( 'Black on Light', 'kadence-blocks' ),
															value: 'blackonlight',
														},
														{
															label: __( 'Outline Black', 'kadence-blocks' ),
															value: 'outlineblack',
														},
														{
															label: __( 'Outline White', 'kadence-blocks' ),
															value: 'outlinewhite',
														},
														{
															label: __( 'None', 'kadence-blocks' ),
															value: 'none',
														},
													] }
													value={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].arrowStyle ? backgroundSliderSettings[ 0 ].arrowStyle : 'none' ) }
													onChange={ ( value ) => saveSliderSettings( { arrowStyle: value } ) }
												/>
												<SelectControl
													label={ __( 'Dot Style' ) }
													options={ [
														{
															label: __( 'Dark', 'kadence-blocks' ),
															value: 'dark',
														},
														{
															label: __( 'Light', 'kadence-blocks' ),
															value: 'light',
														},
														{
															label: __( 'Outline Dark', 'kadence-blocks' ),
															value: 'outlinedark',
														},
														{
															label: __( 'Outline Light', 'kadence-blocks' ),
															value: 'outlinelight',
														},
														{
															label: __( 'None', 'kadence-blocks' ),
															value: 'none',
														},
													] }
													value={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].dotStyle ? backgroundSliderSettings[ 0 ].dotStyle : 'dark' ) }
													onChange={ ( value ) => saveSliderSettings( { dotStyle: value } ) }
												/>
											</Fragment>
										);
									} else if ( 'video' === tab.name ) {
										tabout = (
											<Fragment>
												{/* <SelectControl
													label={ __( 'Background Video Type' ) }
													options={ [
														{
															label: __( 'Local (MP4)' ),
															value: 'local',
														},
														{
															label: __( 'YouTube' ),
															value: 'youtube',
														},
														{
															label: __( 'Vimeo' ),
															value: 'vimeo',
														},
													] }
													value={ backgroundVideoType }
													onChange={ ( value ) => setAttributes( { backgroundVideoType: value } ) }
												/> */}
												{ ( undefined === backgroundVideoType || 'local' === backgroundVideoType ) && (
													<Fragment>
														<MediaUpload
															onSelect={ video => {
																saveVideoSettings( {
																	localID: video.id,
																	local: video.url,
																} );
															} }
															type="video"
															allowedTypes={ [ 'video' ] }
															value={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && backgroundVideo[ 0 ].localID ? backgroundVideo[ 0 ].localID : '' ) }
															render={ ( { open } ) => (
																<Button
																	className={ 'components-button components-icon-button kt-cta-upload-btn' }
																	onClick={ open }
																>
																	<Dashicon icon="format-image" />
																	{ __( 'Select Video', 'kadence-blocks' ) }
																</Button>
															) }
														/>
														{ undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && backgroundVideo[ 0 ].localID && (
															<Tooltip text={ __( 'Remove Video', 'kadence-blocks' ) }>
																<Button
																	className={ 'components-button components-icon-button kt-remove-img kt-cta-upload-btn' }
																	onClick={ () => {
																		saveVideoSettings( {
																			localID: '',
																			local: '',
																		} );
																	} }
																>
																	<Dashicon icon="no-alt" />
																</Button>
															</Tooltip>
														) }
														<TextControl
															label={ __( 'HTML5 Video File URL', 'kadence-blocks' ) }
															value={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && backgroundVideo[ 0 ].local ? backgroundVideo[ 0 ].local : '' ) }
															onChange={ value => saveVideoSettings( { local: value } ) }
														/>
													</Fragment>
												) }
												{ 'youtube' === backgroundVideoType && (
													<TextControl
														label={ __( 'YouTube ID ( example: Sv_hGITmNuo )', 'kadence-blocks' ) }
														value={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && backgroundVideo[ 0 ].youtube ? backgroundVideo[ 0 ].youtube : '' ) }
														onChange={ value => saveVideoSettings( { youtube: value } ) }
													/>
												) }
												{ undefined !== backgroundVideoType && 'local' !== backgroundVideoType && (
													<SelectControl
														label={ __( 'Background Video Ratio', 'kadence-blocks' ) }
														options={ [
															{
																label: __( '16 / 9' ),
																value: '16/9',
															},
															{
																label: __( '4 / 3' ),
																value: '4/3',
															},
															{
																label: __( '3 / 2' ),
																value: '3/2',
															},
														] }
														value={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].ratio ? backgroundVideo[ 0 ].ratio : '16/9' ) }
														onChange={ ( value ) => saveVideoSettings( { ratio: value } ) }
													/>
												) }
												<ToggleControl
													label={ __( 'Mute Video', 'kadence-blocks' ) }
													checked={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].mute ? backgroundVideo[ 0 ].mute : true ) }
													onChange={ ( value ) => saveVideoSettings( { mute: value } ) }
												/>
												<ToggleControl
													label={ __( 'Loop Video', 'kadence-blocks' ) }
													checked={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].loop ? backgroundVideo[ 0 ].loop : true ) }
													onChange={ ( value ) => saveVideoSettings( { loop: value } ) }
												/>
												<ToggleControl
													label={ __( 'Show Play Pause Buttons?', 'kadence-blocks' ) }
													checked={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].btns ? backgroundVideo[ 0 ].btns : true ) }
													onChange={ ( value ) => saveVideoSettings( { btns: value } ) }
												/>
												<PopColorControl
													label={ __( 'Background Color', 'kadence-blocks' ) }
													value={ ( bgColor ? bgColor : '' ) }
													default={ '' }
													onChange={ value => setAttributes( { bgColor: value } ) }
													onClassChange={ value => setAttributes( { bgColorClass: value } ) }
												/>
												<MediaUpload
													onSelect={ onSelectImage }
													type="image"
													value={ bgImgID }
													render={ ( { open } ) => (
														<Button
															className={ 'components-button components-icon-button kt-cta-upload-btn' }
															onClick={ open }
														>
															<Dashicon icon="format-image" />
															{ __( 'Select Video Poster', 'kadence-blocks' ) }
														</Button>
													) }
												/>
												{ bgImg && (
													<Tooltip text={ __( 'Remove Image', 'kadence-blocks' ) }>
														<Button
															className={ 'components-button components-icon-button kt-remove-img kt-cta-upload-btn' }
															onClick={ onRemoveImage }
														>
															<Dashicon icon="no-alt" />
														</Button>
													</Tooltip>
												) }
											</Fragment>
										);
									} else {
										tabout = (
											<Fragment>
												<PopColorControl
													label={ __( 'Background Color', 'kadence-blocks' ) }
													value={ ( bgColor ? bgColor : '' ) }
													default={ '' }
													onChange={ value => setAttributes( { bgColor: value } ) }
													onClassChange={ value => setAttributes( { bgColorClass: value } ) }
												/>
												<KadenceBackgroundControl
													label={ __( 'Background Image', 'kadence-blocks' ) }
													hasImage={ bgImg }
													imageURL={ bgImg }
													imageID={ bgImgID }
													imagePosition={ ( bgImgPosition ? bgImgPosition : 'center center' ) }
													imageSize={ ( bgImgSize ? bgImgSize : 'cover' ) }
													imageRepeat={ ( bgImgRepeat ? bgImgRepeat : 'no-repeat' ) }
													imageAttachment={ ( bgImgAttachment ? bgImgAttachment : 'scroll' ) }
													imageAttachmentParallax={ true }
													onRemoveImage={ onRemoveImage }
													onSaveImage={ ( img ) => {
														setAttributes( {
															bgImgID: img.id,
															bgImg: img.url,
														} );
													} }
													onSaveURL={ ( newURL ) => {
														if ( newURL !== bgImg ) {
															setAttributes( {
																bgImgID: undefined,
																bgImg: newURL,
															} );
														}
													} }
													onSavePosition={ value => setAttributes( { bgImgPosition: value } ) }
													onSaveSize={ value => setAttributes( { bgImgSize: value } ) }
													onSaveRepeat={ value => setAttributes( { bgImgRepeat: value } ) }
													onSaveAttachment={ value => setAttributes( { bgImgAttachment: value } ) }
													inlineImage={ backgroundInline }
													onSaveInlineImage={ ( value ) => setAttributes( { backgroundInline: value } ) }
													disableMediaButtons={ bgImg }
													dynamicAttribute="bgImg"
													isSelected={ isSelected }
													attributes={ attributes }
													setAttributes={ setAttributes }
													name={ 'kadence/rowlayout' }
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
			) }
			{ showSettings( 'backgroundOverlay', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Background Overlay Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-bg-overlay' }
				>
					<TabPanel className="kt-inspect-tabs kt-gradient-tabs"
						activeClass="active-tab"
						initialTabName={ currentOverlayTab }
						onSelect={ onOverlayTabSelect }
						tabs={ [
							{
								name: 'normal',
								title: __( 'Normal', 'kadence-blocks' ),
								className: 'kt-over-normal',
							},
							{
								name: 'grad',
								title: __( 'Gradient', 'kadence-blocks' ),
								className: 'kt-over-grad',
							},
						] }>
						{
							( tab ) => {
								let tabout;
								if ( tab.name ) {
									if ( 'grad' === tab.name ) {
										tabout = overGradControls;
									} else {
										tabout = overControls;
									}
								}
								return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
							}
						}
					</TabPanel>
				</KadencePanelBody>
			) }
			{ showSettings( 'border', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Border Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-border-settings' }
				>
					<PopColorControl
						label={ __( 'Border Color', 'kadence-blocks' ) }
						value={ ( border ? border : '' ) }
						default={ '' }
						onChange={ value => setAttributes( { border: value } ) }
					/>
					<MeasurementControls
						label={ __( 'Border Width', 'kadence-blocks' ) }
						measurement={ borderWidth }
						onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
						control={ borderWidthControl }
						onControl={ ( value ) => setBorderWidthControl( value ) }
						min={ 0 }
						max={ 40 }
						step={ 1 }
						allowEmpty={ true }
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
						max={ 500 }
						step={ 1 }
						allowEmpty={ true }
						controlTypes={ [
							{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: radiusLinkedIcon },
							{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: radiusIndividualIcon },
						] }
						firstIcon={ topLeftIcon }
						secondIcon={ topRightIcon }
						thirdIcon={ bottomRightIcon }
						fourthIcon={ bottomLeftIcon }
					/>
				</KadencePanelBody>
			) }
		</Fragment>
	);
	const overControls = (
		<Fragment>
			<RangeControl
				label={ __( 'Overlay Opacity', 'kadence-blocks' ) }
				value={ overlayOpacity }
				onChange={ ( value ) => {
					setAttributes( {
						overlayOpacity: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Overlay Color', 'kadence-blocks' ) }
				value={ ( overlay ? overlay : '' ) }
				default={ '' }
				onChange={ value => setAttributes( {overlay: value } ) }
				opacityValue={ ( undefined !== overlayFirstOpacity && '' !== overlayFirstOpacity ? overlayFirstOpacity : 1 ) }
				onOpacityChange={ value => setAttributes( { overlayFirstOpacity: value } ) }
			/>
			<KadenceBackgroundControl
				label={ __( 'Background Image', 'kadence-blocks' ) }
				hasImage={ overlayBgImg }
				imageURL={ overlayBgImg }
				imageID={ overlayBgImgID }
				imagePosition={ ( overlayBgImgPosition ? overlayBgImgPosition : 'center center' ) }
				imageSize={ ( overlayBgImgSize ? overlayBgImgSize : 'cover' ) }
				imageRepeat={ ( overlayBgImgRepeat ? overlayBgImgRepeat : 'no-repeat' ) }
				imageAttachment={ ( overlayBgImgAttachment ? overlayBgImgAttachment : 'scroll' ) }
				imageAttachmentParallax={ true }
				onRemoveImage={ onRemoveOverlayImage }
				onSaveImage={ ( img ) => {
					setAttributes( {
						overlayBgImgID: img.id,
						overlayBgImg: img.url,
					} );
				} }
				onSaveURL={ ( newURL ) => {
					if ( newURL !== overlayBgImg ) {
						setAttributes( {
							overlayBgImgID: undefined,
							overlayBgImg: newURL,
						} );
					}
				} }
				onSavePosition={ value => setAttributes( { overlayBgImgPosition: value } ) }
				onSaveSize={ value => setAttributes( { overlayBgImgSize: value } ) }
				onSaveRepeat={ value => setAttributes( { overlayBgImgRepeat: value } ) }
				onSaveAttachment={ value => setAttributes( { overlayBgImgAttachment: value } ) }
				disableMediaButtons={ overlayBgImg }
				dynamicAttribute="overlayBgImg"
				isSelected={ isSelected }
				attributes={ attributes }
				setAttributes={ setAttributes }
				name={ 'kadence/rowlayout' }
				clientId={ clientId }
			/>
			<SelectControl
				label={ __( 'Blend Mode' ) }
				value={ overlayBlendMode }
				options={ [
					{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
					{ value: 'multiply', label: __( 'Multiply', 'kadence-blocks' ) },
					{ value: 'screen', label: __( 'Screen', 'kadence-blocks' ) },
					{ value: 'overlay', label: __( 'Overlay', 'kadence-blocks' ) },
					{ value: 'darken', label: __( 'Darken', 'kadence-blocks' ) },
					{ value: 'lighten', label: __( 'Lighten', 'kadence-blocks' ) },
					{ value: 'color-dodge', label: __( 'Color Dodge', 'kadence-blocks' ) },
					{ value: 'color-burn', label: __( 'Color Burn', 'kadence-blocks' ) },
					{ value: 'difference', label: __( 'Difference', 'kadence-blocks' ) },
					{ value: 'exclusion', label: __( 'Exclusion', 'kadence-blocks' ) },
					{ value: 'hue', label: __( 'Hue', 'kadence-blocks' ) },
					{ value: 'saturation', label: __( 'Saturation', 'kadence-blocks' ) },
					{ value: 'color', label: __( 'Color', 'kadence-blocks' ) },
					{ value: 'luminosity', label: __( 'Luminosity', 'kadence-blocks' ) },

				] }
				onChange={ value => setAttributes( { overlayBlendMode: value } ) }
			/>
			<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
		</Fragment>
	);
	const overGradControls = (
		<div>
			<RangeControl
				label={ __( 'Overlay Opacity', 'kadence-blocks' ) }
				value={ overlayOpacity }
				onChange={ ( value ) => {
					setAttributes( {
						overlayOpacity: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Color', 'kadence-blocks' ) }
				value={ ( overlay ? overlay : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { overlay: value } ) }
				opacityValue={ ( undefined !== overlayFirstOpacity && '' !== overlayFirstOpacity ? overlayFirstOpacity : 1 ) }
				onOpacityChange={ value => setAttributes( { overlayFirstOpacity: value } ) }
			/>
			<RangeControl
				label={ __( 'Location', 'kadence-blocks' ) }
				value={ overlayGradLoc }
				onChange={ ( value ) => {
					setAttributes( {
						overlayGradLoc: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Second Color', 'kadence-blocks' ) }
				value={ ( overlaySecond ? overlaySecond : '' ) }
				default={ '#00B5E2' }
				onChange={ value => setAttributes( { overlaySecond: value } ) }
				opacityValue={ ( undefined !== overlaySecondOpacity && '' !== overlaySecondOpacity ? overlaySecondOpacity : 1 ) }
				onOpacityChange={ value => setAttributes( { overlaySecondOpacity: value } ) }
			/>
			<RangeControl
				label={ __( 'Location', 'kadence-blocks' ) }
				value={ overlayGradLocSecond }
				onChange={ ( value ) => {
					setAttributes( {
						overlayGradLocSecond: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<SelectControl
				label={ __( 'Gradient Type', 'kadence-blocks' ) }
				value={ overlayGradType }
				options={ [
					{ value: 'linear', label: __( 'Linear', 'kadence-blocks' ) },
					{ value: 'radial', label: __( 'Radial', 'kadence-blocks' ) },
				] }
				onChange={ value => setAttributes( { overlayGradType: value } ) }
			/>
			{ overlayGradType && 'linear' === overlayGradType && (
				<RangeControl
					label={ __( 'Gradient Angle', 'kadence-blocks' ) }
					value={ overlayGradAngle }
					onChange={ ( value ) => {
						setAttributes( {
							overlayGradAngle: value,
						} );
					} }
					min={ 0 }
					max={ 360 }
				/>
			) }
			{ overlayGradType && 'radial' === overlayGradType && (
				<SelectControl
					label={ __( 'Gradient Position', 'kadence-blocks' ) }
					value={ overlayBgImgPosition }
					options={ [
						{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
						{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
						{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
						{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
						{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
						{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
						{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
						{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
						{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
					] }
					onChange={ value => setAttributes( { overlayBgImgPosition: value } ) }
				/>
			) }
			<SelectControl
				label={ __( 'Blend Mode' ) }
				value={ overlayBlendMode }
				options={ [
					{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
					{ value: 'multiply', label: __( 'Multiply', 'kadence-blocks' ) },
					{ value: 'screen', label: __( 'Screen', 'kadence-blocks' ) },
					{ value: 'overlay', label: __( 'Overlay', 'kadence-blocks' ) },
					{ value: 'darken', label: __( 'Darken', 'kadence-blocks' ) },
					{ value: 'lighten', label: __( 'Lighten', 'kadence-blocks' ) },
					{ value: 'color-dodge', label: __( 'Color Dodge', 'kadence-blocks' ) },
					{ value: 'color-burn', label: __( 'Color Burn', 'kadence-blocks' ) },
					{ value: 'difference', label: __( 'Difference', 'kadence-blocks' ) },
					{ value: 'exclusion', label: __( 'Exclusion', 'kadence-blocks' ) },
					{ value: 'hue', label: __( 'Hue', 'kadence-blocks' ) },
					{ value: 'saturation', label: __( 'Saturation', 'kadence-blocks' ) },
					{ value: 'color', label: __( 'Color', 'kadence-blocks' ) },
					{ value: 'luminosity', label: __( 'Luminosity', 'kadence-blocks' ) },

				] }
				onChange={ value => setAttributes( { overlayBlendMode: value } ) }
			/>
			<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
		</div>
	);
	const overTabControls = (
		<div>
			<RangeControl
				label={ __( 'Overlay Opacity', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayOpacity : 30 ) }
				onChange={ ( value ) => {
					saveTabletOverlay( {
						overlayOpacity: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Overlay Color', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlay : '' ) }
				default={ '' }
				onChange={ value => saveTabletOverlay( { overlay: value } ) }
			/>
			<KadenceBackgroundControl
				label={ __( 'Overlay Image', 'kadence-blocks' ) }
				hasImage={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImg ? true : false ) }
				imageURL={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImg ? tabletOverlay[ 0 ].overlayBgImg : '' ) }
				imageID={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImgID ? tabletOverlay[ 0 ].overlayBgImgID : '' ) }
				imagePosition={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImgPosition ? tabletOverlay[ 0 ].overlayBgImgPosition : 'center center' ) }
				imageSize={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImgSize ? tabletOverlay[ 0 ].overlayBgImgSize : 'cover' ) }
				imageRepeat={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImgRepeat ? tabletOverlay[ 0 ].overlayBgImgRepeat : 'no-repeat' ) }
				imageAttachment={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].bgImgAttachment ? tabletOverlay[ 0 ].bgImgAttachment : 'scroll' ) }
				imageAttachmentParallax={ true }
				onRemoveImage={ onRemoveTabletOverlayImage }
				onSaveImage={ ( img ) => {
					saveTabletOverlay( {
						overlayBgImgID: img.id,
						overlayBgImg: img.url,
					} );
				} }
				onSaveURL={ ( newURL ) => {
					if ( newURL !== ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImg ? tabletOverlay[ 0 ].overlayBgImg : '' ) ) {
						saveTabletOverlay( {
							overlayBgImgID: undefined,
							overlayBgImg: newURL,
						} );
					}
				} }
				onSavePosition={ value => saveTabletOverlay( { overlayBgImgPosition: value } ) }
				onSaveSize={ value => saveTabletOverlay( { overlayBgImgSize: value } ) }
				onSaveRepeat={ value => saveTabletOverlay( { overlayBgImgRepeat: value } ) }
				onSaveAttachment={ value => saveTabletOverlay( { overlayBgImgAttachment: value } ) }
				disableMediaButtons={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImg ? tabletOverlay[ 0 ].overlayBgImg : '' ) }
				dynamicAttribute="tabletOverlay:0:overlayBgImg"
				isSelected={ isSelected }
				attributes={ attributes }
				setAttributes={ setAttributes }
				name={ 'kadence/rowlayout' }
				clientId={ clientId }
			/>
			<SelectControl
				label={ __( 'Blend Mode' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayBlendMode : 'none' ) }
				options={ [
					{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
					{ value: 'multiply', label: __( 'Multiply', 'kadence-blocks' ) },
					{ value: 'screen', label: __( 'Screen', 'kadence-blocks' ) },
					{ value: 'overlay', label: __( 'Overlay', 'kadence-blocks' ) },
					{ value: 'darken', label: __( 'Darken', 'kadence-blocks' ) },
					{ value: 'lighten', label: __( 'Lighten', 'kadence-blocks' ) },
					{ value: 'color-dodge', label: __( 'Color Dodge', 'kadence-blocks' ) },
					{ value: 'color-burn', label: __( 'Color Burn', 'kadence-blocks' ) },
					{ value: 'difference', label: __( 'Difference', 'kadence-blocks' ) },
					{ value: 'exclusion', label: __( 'Exclusion', 'kadence-blocks' ) },
					{ value: 'hue', label: __( 'Hue', 'kadence-blocks' ) },
					{ value: 'saturation', label: __( 'Saturation', 'kadence-blocks' ) },
					{ value: 'color', label: __( 'Color', 'kadence-blocks' ) },
					{ value: 'luminosity', label: __( 'Luminosity', 'kadence-blocks' ) },

				] }
				onChange={ value => saveTabletOverlay( { overlayBlendMode: value } ) }
			/>
			<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
		</div>
	);
	const overTabGradControls = (
		<div>
			<RangeControl
				label={ __( 'Overlay Opacity', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayOpacity : 30 ) }
				onChange={ ( value ) => {
					saveTabletOverlay( {
						overlayOpacity: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Color', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlay : '' ) }
				default={ '' }
				onChange={ value => saveTabletOverlay( { overlay: value } ) }
			/>
			<RangeControl
				label={ __( 'Location', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayGradLoc : 0 ) }
				onChange={ ( value ) => {
					saveTabletOverlay( {
						overlayGradLoc: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Second Color', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlaySecond : '' ) }
				default={ '#00B5E2' }
				onChange={ value => saveTabletOverlay( { overlaySecond: value } ) }
			/>
			<RangeControl
				label={ __( 'Location', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayGradLocSecond : 100 ) }
				onChange={ ( value ) => {
					saveTabletOverlay( {
						overlayGradLocSecond: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<SelectControl
				label={ __( 'Gradient Type', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayGradType : 'linear' ) }
				options={ [
					{ value: 'linear', label: __( 'Linear', 'kadence-blocks' ) },
					{ value: 'radial', label: __( 'Radial', 'kadence-blocks' ) },
				] }
				onChange={ value => saveTabletOverlay( { overlayGradType: value } ) }
			/>
			{ tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayGradType && 'linear' === tabletOverlay[ 0 ].overlayGradType && (
				<RangeControl
					label={ __( 'Gradient Angle', 'kadence-blocks' ) }
					value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayGradAngle : 180 ) }
					onChange={ ( value ) => {
						saveTabletOverlay( {
							overlayGradAngle: value,
						} );
					} }
					min={ 0 }
					max={ 360 }
				/>
			) }
			{ tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayGradType && 'radial' === tabletOverlay[ 0 ].overlayGradType && (
				<SelectControl
					label={ __( 'Gradient Position', 'kadence-blocks' ) }
					value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayBgImgPosition : 'center center' ) }
					options={ [
						{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
						{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
						{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
						{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
						{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
						{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
						{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
						{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
						{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
					] }
					onChange={ value => saveTabletOverlay( { overlayBgImgPosition: value } ) }
				/>
			) }
			<SelectControl
				label={ __( 'Blend Mode' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayBlendMode : 'none' ) }
				options={ [
					{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
					{ value: 'multiply', label: __( 'Multiply', 'kadence-blocks' ) },
					{ value: 'screen', label: __( 'Screen', 'kadence-blocks' ) },
					{ value: 'overlay', label: __( 'Overlay', 'kadence-blocks' ) },
					{ value: 'darken', label: __( 'Darken', 'kadence-blocks' ) },
					{ value: 'lighten', label: __( 'Lighten', 'kadence-blocks' ) },
					{ value: 'color-dodge', label: __( 'Color Dodge', 'kadence-blocks' ) },
					{ value: 'color-burn', label: __( 'Color Burn', 'kadence-blocks' ) },
					{ value: 'difference', label: __( 'Difference', 'kadence-blocks' ) },
					{ value: 'exclusion', label: __( 'Exclusion', 'kadence-blocks' ) },
					{ value: 'hue', label: __( 'Hue', 'kadence-blocks' ) },
					{ value: 'saturation', label: __( 'Saturation', 'kadence-blocks' ) },
					{ value: 'color', label: __( 'Color', 'kadence-blocks' ) },
					{ value: 'luminosity', label: __( 'Luminosity', 'kadence-blocks' ) },

				] }
				onChange={ value => saveTabletOverlay( { overlayBlendMode: value } ) }
			/>
			<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
		</div>
	);
	const overMobileControls = (
		<div>
			<RangeControl
				label={ __( 'Overlay Opacity' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayOpacity : 30 ) }
				onChange={ ( value ) => {
					saveMobileOverlay( {
						overlayOpacity: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Overlay Color', 'kadence-blocks' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlay : '' ) }
				default={ '' }
				onChange={ value => saveMobileOverlay( { overlay: value } ) }
			/>
			<KadenceBackgroundControl
				label={ __( 'Overlay Image', 'kadence-blocks' ) }
				hasImage={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImg ? true : false ) }
				imageURL={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImg ? mobileOverlay[ 0 ].overlayBgImg : '' ) }
				imageID={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImgID ? mobileOverlay[ 0 ].overlayBgImgID : '' ) }
				imagePosition={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImgPosition ? mobileOverlay[ 0 ].overlayBgImgPosition : 'center center' ) }
				imageSize={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImgSize ? mobileOverlay[ 0 ].overlayBgImgSize : 'cover' ) }
				imageRepeat={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImgRepeat ? mobileOverlay[ 0 ].overlayBgImgRepeat : 'no-repeat' ) }
				imageAttachment={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].bgImgAttachment ? mobileOverlay[ 0 ].bgImgAttachment : 'scroll' ) }
				imageAttachmentParallax={ true }
				onRemoveImage={ onRemoveMobileOverlayImage }
				onSaveImage={ ( img ) => {
					saveMobileOverlay( {
						overlayBgImgID: img.id,
						overlayBgImg: img.url,
					} );
				} }
				onSaveURL={ ( newURL ) => {
					if ( newURL !== ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImg ? mobileOverlay[ 0 ].overlayBgImg : '' ) ) {
						saveMobileOverlay( {
							overlayBgImgID: undefined,
							overlayBgImg: newURL,
						} );
					}
				} }
				onSavePosition={ value => saveMobileOverlay( { overlayBgImgPosition: value } ) }
				onSaveSize={ value => saveMobileOverlay( { overlayBgImgSize: value } ) }
				onSaveRepeat={ value => saveMobileOverlay( { overlayBgImgRepeat: value } ) }
				onSaveAttachment={ value => saveMobileOverlay( { overlayBgImgAttachment: value } ) }
				disableMediaButtons={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImg ? mobileOverlay[ 0 ].overlayBgImg : '' ) }
				dynamicAttribute="mobileOverlay:0:overlayBgImg"
				isSelected={ isSelected }
				attributes={ attributes }
				setAttributes={ setAttributes }
				name={ 'kadence/rowlayout' }
				clientId={ clientId }
			/>
			<SelectControl
				label={ __( 'Blend Mode', 'kadence-blocks' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayBlendMode : 'none' ) }
				options={ [
					{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
					{ value: 'multiply', label: __( 'Multiply', 'kadence-blocks' ) },
					{ value: 'screen', label: __( 'Screen', 'kadence-blocks' ) },
					{ value: 'overlay', label: __( 'Overlay', 'kadence-blocks' ) },
					{ value: 'darken', label: __( 'Darken', 'kadence-blocks' ) },
					{ value: 'lighten', label: __( 'Lighten', 'kadence-blocks' ) },
					{ value: 'color-dodge', label: __( 'Color Dodge', 'kadence-blocks' ) },
					{ value: 'color-burn', label: __( 'Color Burn', 'kadence-blocks' ) },
					{ value: 'difference', label: __( 'Difference', 'kadence-blocks' ) },
					{ value: 'exclusion', label: __( 'Exclusion', 'kadence-blocks' ) },
					{ value: 'hue', label: __( 'Hue', 'kadence-blocks' ) },
					{ value: 'saturation', label: __( 'Saturation', 'kadence-blocks' ) },
					{ value: 'color', label: __( 'Color', 'kadence-blocks' ) },
					{ value: 'luminosity', label: __( 'Luminosity', 'kadence-blocks' ) },

				] }
				onChange={ value => saveMobileOverlay( { overlayBlendMode: value } ) }
			/>
			<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
		</div>
	);
	const overMobileGradControls = (
		<div>
			<RangeControl
				label={ __( 'Overlay Opacity', 'kadence-blocks' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayOpacity : 30 ) }
				onChange={ ( value ) => {
					saveMobileOverlay( {
						overlayOpacity: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Color', 'kadence-blocks' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlay : '' ) }
				default={ '' }
				onChange={ value => saveMobileOverlay( { overlay: value } ) }
			/>
			<RangeControl
				label={ __( 'Location' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayGradLoc : 0 ) }
				onChange={ ( value ) => {
					saveMobileOverlay( {
						overlayGradLoc: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Second Color', 'kadence-blocks' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlaySecond : '' ) }
				default={ '#00B5E2' }
				onChange={ value => saveMobileOverlay( { overlaySecond: value } ) }
			/>
			<RangeControl
				label={ __( 'Location', 'kadence-blocks' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayGradLocSecond : 100 ) }
				onChange={ ( value ) => {
					saveMobileOverlay( {
						overlayGradLocSecond: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<SelectControl
				label={ __( 'Gradient Type' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayGradType : 'linear' ) }
				options={ [
					{ value: 'linear', label: __( 'Linear', 'kadence-blocks' ) },
					{ value: 'radial', label: __( 'Radial', 'kadence-blocks' ) },
				] }
				onChange={ value => saveMobileOverlay( { overlayGradType: value } ) }
			/>
			{ mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayGradType && 'linear' === mobileOverlay[ 0 ].overlayGradType && (
				<RangeControl
					label={ __( 'Gradient Angle', 'kadence-blocks' ) }
					value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayGradAngle : 180 ) }
					onChange={ ( value ) => {
						saveMobileOverlay( {
							overlayGradAngle: value,
						} );
					} }
					min={ 0 }
					max={ 360 }
				/>
			) }
			{ mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayGradType && 'radial' === mobileOverlay[ 0 ].overlayGradType && (
				<SelectControl
					label={ __( 'Gradient Position', 'kadence-blocks' ) }
					value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayBgImgPosition : 'center center' ) }
					options={ [
						{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
						{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
						{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
						{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
						{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
						{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
						{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
						{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
						{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
					] }
					onChange={ value => saveMobileOverlay( { overlayBgImgPosition: value } ) }
				/>
			) }
			<SelectControl
				label={ __( 'Blend Mode', 'kadence-blocks' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayBlendMode : 'none' ) }
				options={ [
					{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
					{ value: 'multiply', label: __( 'Multiply', 'kadence-blocks' ) },
					{ value: 'screen', label: __( 'Screen', 'kadence-blocks' ) },
					{ value: 'overlay', label: __( 'Overlay', 'kadence-blocks' ) },
					{ value: 'darken', label: __( 'Darken', 'kadence-blocks' ) },
					{ value: 'lighten', label: __( 'Lighten', 'kadence-blocks' ) },
					{ value: 'color-dodge', label: __( 'Color Dodge', 'kadence-blocks' ) },
					{ value: 'color-burn', label: __( 'Color Burn', 'kadence-blocks' ) },
					{ value: 'difference', label: __( 'Difference', 'kadence-blocks' ) },
					{ value: 'exclusion', label: __( 'Exclusion', 'kadence-blocks' ) },
					{ value: 'hue', label: __( 'Hue', 'kadence-blocks' ) },
					{ value: 'saturation', label: __( 'Saturation', 'kadence-blocks' ) },
					{ value: 'color', label: __( 'Color', 'kadence-blocks' ) },
					{ value: 'luminosity', label: __( 'Luminosity', 'kadence-blocks' ) },

				] }
				onChange={ value => saveMobileOverlay( { overlayBlendMode: value } ) }
			/>
			<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
		</div>
	);
	const colorControls = (
		<KadencePanelBody
			title={ __( 'Text Color Settings', 'kadence-blocks' ) }
			initialOpen={ false }
			panelName={ 'kb-row-text-color' }
		>
			<PopColorControl
				label={ __( 'Text Color', 'kadence-blocks' ) }
				value={ ( textColor ? textColor : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { textColor: value } ) }
			/>
			<PopColorControl
				label={ __( 'Link Color', 'kadence-blocks' ) }
				value={ ( linkColor ? linkColor : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { linkColor: value } ) }
			/>
			<PopColorControl
				label={ __( 'Link Hover Color', 'kadence-blocks' ) }
				value={ ( linkHoverColor ? linkHoverColor : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { linkHoverColor: value } ) }
			/>
		</KadencePanelBody>
	);
	const tabControls = (
		<TabPanel className="kt-inspect-tabs"
			activeClass="active-tab"
			initialTabName={ currentTab }
			onSelect={ onTabSelect }
			tabs={ [
				{
					name: 'desk',
					title: <Dashicon icon="desktop" />,
					className: 'kt-desk-tab',
				},
				{
					name: 'tablet',
					title: <Dashicon icon="tablet" />,
					className: 'kt-tablet-tab',
				},
				{
					name: 'mobile',
					title: <Dashicon icon="smartphone" />,
					className: 'kt-mobile-tab',
				},
			] }>
			{
				( tab ) => {
					let tabout;
					if ( tab.name ) {
						if ( 'mobile' === tab.name ) {
							tabout = mobileControls;
						} else if ( 'tablet' === tab.name ) {
							tabout = tabletControls;
						} else {
							tabout = deskControls;
						}
					}
					return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
				}
			}
		</TabPanel>
	);
	const bottomSepSizesMobile = (
		<Fragment>
			<KadenceRange
				label={ __( 'Mobile Height (px)', 'kadence-blocks' ) }
				value={ ( bottomSepHeightMobile ? bottomSepHeightMobile : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepHeightMobile: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<KadenceRange
				label={ __( 'Mobile Width (%)', 'kadence-blocks' ) }
				value={ ( bottomSepWidthMobile ? bottomSepWidthMobile : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepWidthMobile: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const bottomSepSizesTablet = (
		<Fragment>
			<KadenceRange
				label={ __( 'Tablet Height (px)', 'kadence-blocks' ) }
				value={ ( bottomSepHeightTab ? bottomSepHeightTab : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepHeightTab: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<KadenceRange
				label={ __( 'Tablet Width (%)', 'kadence-blocks' ) }
				value={ ( bottomSepWidthTab ? bottomSepWidthTab : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepWidthTab: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const bottomSepSizes = (
		<Fragment>
			<KadenceRange
				label={ __( 'Divider Height (px)', 'kadence-blocks' ) }
				value={ bottomSepHeight }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepHeight: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<KadenceRange
				label={ __( 'Divider Width (%)', 'kadence-blocks' ) }
				value={ ( bottomSepWidth ? bottomSepWidth : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepWidth: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const topSepSizesMobile = (
		<Fragment>
			<KadenceRange
				label={ __( 'Mobile Height (px)', 'kadence-blocks' ) }
				value={ ( topSepHeightMobile ? topSepHeightMobile : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepHeightMobile: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<KadenceRange
				label={ __( 'Mobile Width (%)', 'kadence-blocks' ) }
				value={ ( topSepWidthMobile ? topSepWidthMobile : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepWidthMobile: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const topSepSizesTablet = (
		<Fragment>
			<KadenceRange
				label={ __( 'Tablet Height (px)', 'kadence-blocks' ) }
				value={ ( topSepHeightTab ? topSepHeightTab : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepHeightTab: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<KadenceRange
				label={ __( 'Tablet Width (%)', 'kadence-blocks' ) }
				value={ ( topSepWidthTab ? topSepWidthTab : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepWidthTab: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const topSepSizes = (
		<Fragment>
			<KadenceRange
				label={ __( 'Divider Height (px)', 'kadence-blocks' ) }
				value={ topSepHeight }
				onChange={ ( value ) => {
					setAttributes( {
						topSepHeight: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<KadenceRange
				label={ __( 'Divider Width (%)', 'kadence-blocks' ) }
				value={ ( topSepWidth ? topSepWidth : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepWidth: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const topDividerSettings = (
		<Fragment>
			<FontIconPicker
				icons={ [
					'ct',
					'cti',
					'ctd',
					'ctdi',
					'sltl',
					'sltr',
					'crv',
					'crvi',
					'crvl',
					'crvli',
					'crvr',
					'crvri',
					'wave',
					'wavei',
					'waves',
					'wavesi',
					'mtns',
					'littri',
					'littrii',
					'threelevels',
					'threelevelsi',
				] }
				iconsPerPage={ 30 }
				value={ ( topSep === 'none' ? '' : topSep ) }
				onChange={ value => setAttributes( { topSep: value } ) }
				appendTo="body"
				showSearch={ false }
				renderFunc={ renderTopSVGDivider }
				theme="dividers"
				noSelectedPlaceholder={ __( 'Select Divider', 'kadence-blocks' ) }
				isMulti={ false }
			/>
			<PopColorControl
				label={ __( 'Divider Color' ) }
				value={ ( topSepColor ? topSepColor : '' ) }
				default={ '#ffffff' }
				onChange={ value => setAttributes( { topSepColor: value } ) }
			/>
			<SmallResponsiveControl
				label={ __( 'Size Controls', 'kadence-blocks' ) }
				desktopChildren={ topSepSizes }
				tabletChildren={ topSepSizesTablet }
				mobileChildren={ topSepSizesMobile }
			/>
		</Fragment>
	);
	const bottomDividerSettings = (
		<Fragment>
			<FontIconPicker
				icons={ [
					'ct',
					'cti',
					'ctd',
					'ctdi',
					'sltl',
					'sltr',
					'crv',
					'crvi',
					'crvl',
					'crvli',
					'crvr',
					'crvri',
					'wave',
					'wavei',
					'waves',
					'wavesi',
					'mtns',
					'littri',
					'littrii',
					'threelevels',
					'threelevelsi',
				] }
				iconsPerPage={ 30 }
				value={ ( bottomSep === 'none' ? '' : bottomSep ) }
				onChange={ value => setAttributes( { bottomSep: value } ) }
				appendTo="body"
				showSearch={ false }
				renderFunc={ renderBottomSVGDivider }
				theme="dividers"
				noSelectedPlaceholder={ __( 'Select Divider', 'kadence-blocks' ) }
				isMulti={ false }
			/>
			<PopColorControl
				label={ __( 'Divider Color', 'kadence-blocks' ) }
				value={ ( bottomSepColor ? bottomSepColor : '' ) }
				default={ '#ffffff' }
				onChange={ value => setAttributes( { bottomSepColor: value } ) }
			/>
			<SmallResponsiveControl
				label={ __( 'Size Controls', 'kadence-blocks' ) }
				desktopChildren={ bottomSepSizes }
				tabletChildren={ bottomSepSizesTablet }
				mobileChildren={ bottomSepSizesMobile }
			/>
		</Fragment>
	);
	const verticalAlignOptions = [
		[
			{
				icon: <VerticalAlignmentIcon value={ 'top' } isPressed={ ( verticalAlignment === 'top' ? true : false ) } />,
				title: __( 'Align Top', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'top' ? true : false ),
				onClick: () => setAttributes( { verticalAlignment: 'top' } ),
			},
		],
		[
			{
				icon: <VerticalAlignmentIcon value={ 'middle' } isPressed={ ( verticalAlignment === 'middle' ? true : false ) } />,
				title: __( 'Align Middle', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'middle' ? true : false ),
				onClick: () => setAttributes( { verticalAlignment: 'middle' } ),
			},
		],
		[
			{
				icon: <VerticalAlignmentIcon value={ 'bottom' } isPressed={ ( verticalAlignment === 'bottom' ? true : false ) } />,
				title: __( 'Align Bottom', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'bottom' ? true : false ),
				onClick: () => setAttributes( { verticalAlignment: 'bottom' } ),
			},
		],
	];
	const innerClasses = classnames( {
		'innerblocks-wrap': true,
		'kb-theme-content-width': inheritMaxWidth,
		[ `kt-layout-inner-wrap-id${ uniqueID }` ]: uniqueID,
		[ `kb-grid-columns-${ columns }` ]: columns,
	} );
	const innerResizeClasses = classnames( {
		//'innerblocks-wrap': true,
		'kt-resizeable-column-container': true,
		//'kb-theme-content-width': inheritMaxWidth,
		[ `kt-resizeable-column-container${ uniqueID }` ]: uniqueID,
		// [ `kb-grid-columns-${ columns }` ]: columns,

	} );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerClasses,
			style: {
				maxWidth: ! inheritMaxWidth && previewMaxWidth ? previewMaxWidth + maxWidthUnit : undefined,
				paddingLeft: previewPaddingLeft + ( paddingUnit ? paddingUnit : 'px' ),
				paddingRight: previewPaddingRight + ( paddingUnit ? paddingUnit : 'px' ),
			}
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			orientation:'horizontal',
			renderAppender: false,
		}
	);
	const gutter = 30;
	const gutterUnit = 'px';
	const gutterPercentUnit = parseFloat( gutter/100 );
	const firstCol = parseInt( ! firstColumnWidth ? widthNumber : firstColumnWidth );
	const adjuster1 = -50*gutterPercentUnit;
	const adjuster2 = -50*gutterPercentUnit;
	const adjuster3 = -50*gutterPercentUnit;
	const adjuster4 = -50*gutterPercentUnit;
	const adjuster5 = 0;
	const adjuster6 = 50*gutterPercentUnit;
	const adjuster7 = 50*gutterPercentUnit;
	const adjuster8 = 50*gutterPercentUnit;
	const adjuster9 = 50*gutterPercentUnit;
	// if ( firstCol < 35 ) {
	// 	adjuster = gutterPercentUnit*( -70 + firstCol );
	// } else if ( firstCol < 50 ) {
	// 	adjuster = gutterPercentUnit* ( -60 + firstCol );
	// } else if ( firstCol > 65 ) {
	// 	adjuster = gutterPercentUnit* ( -30 + firstCol );
	// } else if ( firstCol > 50 ) {
	// 	adjuster = gutterPercentUnit* ( -40 + firstCol );
	// }
	return (
		<Fragment>
			<BlockControls>
				<BlockAlignmentToolbar
					value={ align }
					controls={ [ 'center', 'wide', 'full' ] }
					onChange={ value => setAttributes( { align: value } ) }
				/>
				{ showSettings( 'allSettings', 'kadence/rowlayout' ) && showSettings( 'background', 'kadence/rowlayout' ) && (
					<Toolbar>
						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ null }
							render={ ( { open } ) => (
								<Button
									className="components-toolbar__control"
									label={ __( 'Background Image', 'kadence-blocks' ) }
									icon={ image }
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				) }
				<Toolbar>
					<Button
						className="kb-content-width"
						icon={ inheritMaxWidth ? <ContentWidthIcon value='theme' /> : <ContentWidthIcon value='normal' /> }
						onClick={ () => {
							if ( ! contentWidthPop ) {
								setContentWidthPop( true );
							}
						} }
						isPressed={ contentWidthPop ? true : false }
						aria-haspopup="true"
						aria-expanded={ contentWidthPop }
						label={  __( 'Inner Content Width', 'kadence-blocks' ) }
						showTooltip={ true }
					/>
					{ contentWidthPop && (
						<Popover
							className="kb-content-width-popover"
							position="bottom center"
							onClick={ () => {} }
							expandOnMobile={ true }
							onClose={ () => {
								setContentWidthPop( false );
							} }
						>
							<div className="kb-content-width-popover-inner-wrap">
								<ToggleControl
									label={ __( 'Use Theme Content Inner Width?', 'kadence-blocks' ) }
									checked={ ( undefined !== inheritMaxWidth ? inheritMaxWidth : false ) }
									onChange={ ( value ) => setAttributes( { inheritMaxWidth: value } ) }
								/>
								{ inheritMaxWidth !== true && (
									<Fragment>
										<ResponsiveRangeControls
											label={ __( 'Custom Content Max Width', 'kadence-blocks' ) }
											value={ maxWidth ? maxWidth : '' }
											onChange={ value => {
												setAttributes( { maxWidth: value } );
											} }
											tabletValue={ ( undefined !== responsiveMaxWidth && undefined !== responsiveMaxWidth[ 0 ] ? responsiveMaxWidth[ 0 ] : '' ) }
											onChangeTablet={ ( value ) => {
												setAttributes( { responsiveMaxWidth: [ value, ( undefined !== responsiveMaxWidth && undefined !== responsiveMaxWidth[ 1 ] ? responsiveMaxWidth[ 1 ] : '' ) ] } );
											} }
											mobileValue={ ( undefined !== responsiveMaxWidth && undefined !== responsiveMaxWidth[ 1 ] ? responsiveMaxWidth[ 1 ] : '' ) }
											onChangeMobile={ ( value ) => {
												setAttributes( { responsiveMaxWidth: [ ( undefined !== responsiveMaxWidth && undefined !== responsiveMaxWidth[ 0 ] ? responsiveMaxWidth[ 0 ] : '' ), value ] } );
											} }
											min={ 0 }
											max={ widthMax }
											step={ 1 }
											unit={ maxWidthUnit ? maxWidthUnit : 'px' }
											onUnit={ ( value ) => {
												setAttributes( { maxWidthUnit: value } );
											} }
											units={ [ 'px', '%', 'vw' ] }
										/>
									</Fragment>
								) }
							</div>
						</Popover>
					) }
				</Toolbar>
				{/* <ToolbarGroup
					isCollapsed={ true }
					icon={ <ContentWidthIcon value={ inheritMaxWidth } /> }
					label={ __( 'Inner Content Width', 'kadence-blocks' )  }
					controls={ contentWidthOptions }
				/> */}
				<ToolbarGroup
					isCollapsed={ true }
					icon={ <VerticalAlignmentIcon value={ verticalAlignment } /> }
					label={ __( 'Vertical Align', 'kadence-blocks' )  }
					controls={ verticalAlignOptions }
				/>
			</BlockControls>
			{ showSettings( 'allSettings', 'kadence/rowlayout' ) && (
				<InspectorControls>
					<ResponsiveControl
						desktopChildren={ deskControls }
						tabletChildren={ tabletControls }
						mobileChildren={ mobileControls }
					/>
					<div className="kt-sidebar-settings-spacer"></div>
					{ showSettings( 'dividers', 'kadence/rowlayout' ) && (
						<KadencePanelBody
							title={ __( 'Dividers', 'kadence-blocks' ) }
							initialOpen={ false }
							panelName={ 'kb-row-dividers' }
						>
							<TabPanel className="kt-inspect-tabs kt-hover-tabs"
								activeClass="active-tab"
								tabs={ [
									{
										name: 'bottomdivider',
										title: __( 'Bottom', 'kadence-blocks' ),
										className: 'kt-bottom-tab',
									},
									{
										name: 'topdivider',
										title: __( 'Top', 'kadence-blocks' ),
										className: 'kt-top-tab',
									},
								] }>
								{
									( tab ) => {
										let tabout;
										if ( tab.name ) {
											if ( 'topdivider' === tab.name ) {
												tabout = topDividerSettings;
											} else {
												tabout = bottomDividerSettings;
											}
										}
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
						</KadencePanelBody>
					) }
					{ showSettings( 'textColor', 'kadence/rowlayout' ) && (
						colorControls
					) }
					{ showSettings( 'structure', 'kadence/rowlayout' ) && (
						<Fragment>
							<KadencePanelBody
								title={ __( 'Structure Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-row-structure-settings' }
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
								<div class="row-min-height-settings">
									<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Min Height Type', 'kadence-blocks' ) }>
										{ map( heightTypes, ( { name, key } ) => (
											<Button
												key={ key }
												className="kt-size-btn"
												isSmall
												isPrimary={ minHeightUnit === key }
												aria-pressed={ minHeightUnit === key }
												onClick={ () => setAttributes( { minHeightUnit: key } ) }
											>
												{ name }
											</Button>
										) ) }
									</ButtonGroup>
									<h2 className="kt-heading-size-title">{ __( 'Minimum Height', 'kadence-blocks' ) }</h2>
									<TabPanel className="kt-size-tabs"
										activeClass="active-tab"
										tabs={ [
											{
												name: 'desk',
												title: <Dashicon icon="desktop" />,
												className: 'kt-desk-tab',
											},
											{
												name: 'tablet',
												title: <Dashicon icon="tablet" />,
												className: 'kt-tablet-tab',
											},
											{
												name: 'mobile',
												title: <Dashicon icon="smartphone" />,
												className: 'kt-mobile-tab',
											},
										] }>
										{
											( tab ) => {
												let tabout;
												if ( tab.name ) {
													if ( 'mobile' === tab.name ) {
														tabout = (
															<KadenceRange
																label={ __( 'Mobile Min Height', 'kadence-blocks' ) }
																value={ minHeightMobile }
																onChange={ ( value ) => {
																	setAttributes( {
																		minHeightMobile: value,
																	} );
																} }
																min={ 0 }
																max={ heightMax }
															/>
														);
													} else if ( 'tablet' === tab.name ) {
														tabout = (
															<KadenceRange
																label={ __( 'Tablet Min Height', 'kadence-blocks' ) }
																value={ minHeightTablet }
																onChange={ ( value ) => {
																	setAttributes( {
																		minHeightTablet: value,
																	} );
																} }
																min={ 0 }
																max={ heightMax }
															/>
														);
													} else {
														tabout = (
															<KadenceRange
																label={ __( 'Min Height', 'kadence-blocks' ) }
																value={ minHeight }
																onChange={ ( value ) => {
																	setAttributes( {
																		minHeight: value,
																	} );
																} }
																min={ 0 }
																max={ heightMax }
															/>
														);
													}
												}
												return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
											}
										}
									</TabPanel>
								</div>
								<ToggleControl
									label={ __( 'Content Max Width Inherit from Theme?', 'kadence-blocks' ) }
									checked={ ( undefined !== inheritMaxWidth ? inheritMaxWidth : false ) }
									onChange={ ( value ) => setAttributes( { inheritMaxWidth: value } ) }
								/>
								{ inheritMaxWidth !== true && (
									<Fragment>
										<ResponsiveRangeControls
											label={ __( 'Custom Content Max Width', 'kadence-blocks' ) }
											value={ maxWidth ? maxWidth : '' }
											onChange={ value => {
												setAttributes( { maxWidth: value } );
											} }
											tabletValue={ ( undefined !== responsiveMaxWidth && undefined !== responsiveMaxWidth[ 0 ] ? responsiveMaxWidth[ 0 ] : '' ) }
											onChangeTablet={ ( value ) => {
												setAttributes( { responsiveMaxWidth: [ value, ( undefined !== responsiveMaxWidth && undefined !== responsiveMaxWidth[ 1 ] ? responsiveMaxWidth[ 1 ] : '' ) ] } );
											} }
											mobileValue={ ( undefined !== responsiveMaxWidth && undefined !== responsiveMaxWidth[ 1 ] ? responsiveMaxWidth[ 1 ] : '' ) }
											onChangeMobile={ ( value ) => {
												setAttributes( { responsiveMaxWidth: [ ( undefined !== responsiveMaxWidth && undefined !== responsiveMaxWidth[ 0 ] ? responsiveMaxWidth[ 0 ] : '' ), value ] } );
											} }
											min={ 0 }
											max={ widthMax }
											step={ 1 }
											unit={ maxWidthUnit ? maxWidthUnit : 'px' }
											onUnit={ ( value ) => {
												setAttributes( { maxWidthUnit: value } );
											} }
											units={ [ 'px', '%', 'vw' ] }
										/>
									</Fragment>
								) }
								<ToggleControl
									label={ __( 'Inner Column Height 100%', 'kadence-blocks' ) }
									checked={ ( undefined !== columnsInnerHeight ? columnsInnerHeight : false ) }
									onChange={ ( value ) => setAttributes( { columnsInnerHeight: value } ) }
								/>
								<RangeControl
									label={ __( 'Z-Index Control', 'kadence-blocks' ) }
									value={ zIndex }
									onChange={ ( value ) => {
										setAttributes( {
											zIndex: value,
										} );
									} }
									min={ -200 }
									max={ 2000 }
								/>
							</KadencePanelBody>
							<KadencePanelBody
								title={ __( 'Visibility Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-row-visibility-settings' }
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
								<h2>{ __( 'User Visibility Settings', 'kadence-blocks' ) }</h2>
								<ToggleControl
									label={ __( 'Hide from Logged in Users', 'kadence-blocks' ) }
									checked={ ( undefined !== loggedIn ? loggedIn : false ) }
									onChange={ ( value ) => setAttributes( { loggedIn: value } ) }
								/>
								{ loggedIn && (
									<Fragment>
										<div className="components-base-control">
											<span className="kadence-sidebar-label">{ __( 'Optional: Hide from Specific User Roles', 'kadence-blocks' ) }</span>
											<div className="kt-meta-select-wrap">
												<Select
													options={ ( kadence_blocks_user_params && kadence_blocks_user_params.userVisibility ? kadence_blocks_user_params.userVisibility : [] ) }
													value={ loggedInUser }
													isMulti={ true }
													maxMenuHeight={ 200 }
													isClearable={ true }
													placeholder={ '' }
													onChange={ value => setAttributes( { loggedInUser: value } ) }
												/>
											</div>
										</div>
										<div className="components-base-control">
											<span className="kadence-sidebar-label">{ __( 'Optional: Show Only to Specific User Roles', 'kadence-blocks' ) }</span>
											<div className="kt-meta-select-wrap">
												<Select
													options={ ( kadence_blocks_user_params && kadence_blocks_user_params.userVisibility ? kadence_blocks_user_params.userVisibility : [] ) }
													value={ loggedInShow }
													isMulti={ true }
													maxMenuHeight={ 200 }
													isClearable={ true }
													placeholder={ '' }
													onChange={ value => setAttributes( { loggedInShow: value } ) }
												/>
											</div>
										</div>
									</Fragment>
								) }
								<ToggleControl
									label={ __( 'Hide from Loggedout Users', 'kadence-blocks' ) }
									checked={ ( undefined !== loggedOut ? loggedOut : false ) }
									onChange={ ( value ) => setAttributes( { loggedOut: value } ) }
								/>
								{ kadence_blocks_params && kadence_blocks_params.rcp_access && (
									<Fragment>
										<ToggleControl
											label={ __( 'Restrict based on Membership', 'kadence-blocks' ) }
											checked={ ( undefined !== rcpMembership ? rcpMembership : false ) }
											onChange={ ( value ) => setAttributes( { rcpMembership: value } ) }
										/>
										{ rcpMembership && (
											<Fragment>
												<SelectControl
													label={ __( 'Minimum Access Level', 'kadence-blocks' ) }
													value={ rcpAccess }
													options={ ( kadence_blocks_params && kadence_blocks_params.rcp_access ? kadence_blocks_params.rcp_access : [] ) }
													onChange={ ( value ) => setAttributes( { rcpAccess: value } ) }
												/>
												<div className="components-base-control">
													<span className="kadence-sidebar-label">{ __( 'Specific Memberships', 'kadence-blocks' ) }</span>
													<div className="kt-meta-select-wrap">
														<Select
															options={ ( kadence_blocks_params && kadence_blocks_params.rcp_levels ? kadence_blocks_params.rcp_levels : [] ) }
															value={ rcpMembershipLevel }
															isMulti={ true }
															maxMenuHeight={ 200 }
															isClearable={ true }
															placeholder={ 'Any Membership' }
															onChange={ value => setAttributes( { rcpMembershipLevel: value } ) }
														/>
													</div>
												</div>
											</Fragment>
										) }
									</Fragment>

								) }
							</KadencePanelBody>
						</Fragment>
					) }
				</InspectorControls>
			) }
			{ ( textColor || linkColor || linkHoverColor || columns || zIndex || kadenceBlockCSS ) && (
				<style>
					{ ( adjuster1 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-1"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster1 + gutterUnit } }` : '' ) }
					{ ( adjuster2 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-2"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster2 + gutterUnit } }` : '' ) }
					{ ( adjuster3 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-3"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster3 + gutterUnit } }` : '' ) }
					{ ( adjuster4 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-4"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster4 + gutterUnit } }` : '' ) }
					{ ( adjuster5 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-5"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster5 + gutterUnit } }` : '' ) }
					{ ( adjuster6 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-6"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster6 + gutterUnit } }` : '' ) }
					{ ( adjuster7 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-7"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster7 + gutterUnit } }` : '' ) }
					{ ( adjuster8 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-8"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster8 + gutterUnit } }` : '' ) }
					{ ( adjuster9 ? `.wp-block-kadence-rowlayout[class*=" kt-custom-first-width-9"].kb-row-id-${ uniqueID } > .kt-resizeable-column-container .editor-row-controls-container { right: ${ adjuster9 + gutterUnit } }` : '' ) }
					{ ( textColor ? `#kt-layout-id${ uniqueID }, #kt-layout-id${ uniqueID } p, #kt-layout-id${ uniqueID } h1, #kt-layout-id${ uniqueID } h2, #kt-layout-id${ uniqueID } h3, #kt-layout-id${ uniqueID } h4, #kt-layout-id${ uniqueID } h5, #kt-layout-id${ uniqueID } h6 { color: ${ KadenceColorOutput( textColor ) }; }` : '' ) }
					{ ( linkColor ? `#kt-layout-id${ uniqueID } a { color: ${ KadenceColorOutput( linkColor ) }; }` : '' ) }
					{ ( linkHoverColor ? `#kt-layout-id${ uniqueID } a:hover { color: ${ KadenceColorOutput( linkHoverColor ) }; }` : '' ) }
					{ columns && columns === 2 && (
						<Fragment>
							{ ( ( firstColumnWidth || temporaryColumnWidth ) && ( secondColumnWidth || temporarySecondColumnWidth ) ? `.wp-block-kadence-rowlayout.kb-row-id-${ uniqueID } > .innerblocks-wrap.kb-grid-columns-2.kt-layout-inner-wrap-id${ uniqueID } { grid-template-columns: minmax(0, ${ parseFloat( widthString ) }% ) minmax(0, ${ parseFloat( secondWidthString ) }% ) }` : '' ) }
						</Fragment>
					) }
					{ columns && columns === 3 && (
						<Fragment>
							{ ( firstColumnWidth || temporaryColumnWidth ? `#kt-layout-id${ uniqueID } > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-type="kadence/column"]:nth-child(1) { flex: 0 1 ${ parseFloat( widthString ) }%; }` : '' ) }
							{ ( secondColumnWidth || temporarySecondColumnWidth ? `#kt-layout-id${ uniqueID } > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-type="kadence/column"]:nth-child(2) { flex: 0 1 ${ parseFloat( secondWidthString ) }%; }` : '' ) }
							{ ( secondColumnWidth || temporarySecondColumnWidth ? `#kt-layout-id${ uniqueID } > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-type="kadence/column"]:nth-child(3) { flex: 0 1 ${ parseFloat( thirdWidthString ) }%; }` : '' ) }
						</Fragment>
					) }
					{ zIndex && zIndex > 30 && (
						<Fragment>
							{ `.components-popover.block-editor-block-list__block-popover { z-index: ${ zIndex + 1000 }` };
						</Fragment>
					) }
					{ kadenceBlockCSS && (
						<Fragment>
							{ kadenceBlockCSS.replace( /selector/g, `.kb-row-id-${ uniqueID }` ) }
						</Fragment>
					)}
				</style>
			) }
			<RowBackground
				backgroundClasses={ classes }
				attributes={ attributes }
				previewDevice={ previewDevice }
			>
				<Overlay
					attributes={ attributes }
					previewDevice={ previewDevice }
				/>
				{ ! colLayout && (
					<div className="kt-select-layout">
						<div className="kt-select-layout-title">
							{ __( 'Select Your Layout', 'kadence-blocks' ) }
						</div>
						<ButtonGroup aria-label={ __( 'Column Layout', 'kadence-blocks' ) }>
							{ map( startlayoutOptions, ( { name, key, icon, col } ) => (
								<Tooltip text={ name }>
									<Button
										key={ key }
										className="kt-layout-btn"
										isSmall
										onClick={ () => setAttributes( {
											colLayout: key,
											columns: col,
										} ) }
									>
										{ icon }
									</Button>
								</Tooltip>
							) ) }
						</ButtonGroup>
						<PrebuiltModal
							clientId={ clientId }
							open={ isPrebuiltModal ? true : false }
							onlyModal={ isPrebuiltModal ? true : false }
						/>
					</div>
				) }
				{ colLayout && 'none' !== topSep && '' !== topSep && (
					<div className={ `kt-row-layout-top-sep kt-row-sep-type-${ topSep }` } style={ {
						height: previewTopSepHeight + 'px',
					} }>
						<svg style={ { fill: KadenceColorOutput( topSepColor ), width: previewTopSepWidth + '%' } } viewBox="0 0 1000 100" preserveAspectRatio="none">
							{ topSVGDivider[ topSep ] }
						</svg>
					</div>
				) }
				<div style={ { height: '1px' } }></div>
				{ colLayout && showSettings( 'allSettings', 'kadence/rowlayout' ) && showSettings( 'paddingMargin', 'kadence/rowlayout' ) && ( ! paddingUnit || ( paddingUnit && 'px' === paddingUnit ) ) && (
					<ResizableBox
						size={ {
							height: previewPaddingTop,
						} }
						minHeight="0"
						handleClasses={ {
							top: 'wp-block-kadence-rowlayout-handler-top',
							bottom: 'wp-block-kadence-rowlayout-handler-bottom',
						} }
						enable={ {
							top: true,
							right: false,
							bottom: false,
							left: false,
							topRight: false,
							bottomRight: false,
							bottomLeft: false,
							topLeft: false,
						} }
						className={ 'kt-top-padding-resize kt-padding-resize-box' }
						onResize={ ( event, direction, elt, delta ) => {
							event.preventDefault();
							editorDocument.getElementById( 'row-top-' + uniqueID ).innerHTML = parseInt( previewPaddingTop + delta.height, 10 ) + 'px';
						} }
						onResizeStop={ ( event, direction, elt, delta ) => {
							if ( 'Mobile' === previewDevice ) {
								setAttributes( {
									topPaddingM: parseInt( previewPaddingTop + delta.height, 10 ),
								} );
							} else if ( 'Tablet' === previewDevice ) {
								setAttributes( {
									tabletPadding: [ parseInt( previewPaddingTop + delta.height, 10 ), ( tabletPadding ? tabletPadding[ 1 ] : '' ), ( tabletPadding ? tabletPadding[ 2 ] : '' ), ( tabletPadding ? tabletPadding[ 3 ] : '' ) ],
								} );
							} else {
								setAttributes( {
									topPadding: parseInt( previewPaddingTop + delta.height, 10 ),
								} );
							}
							toggleSelection( true );
						} }
						onResizeStart={ () => {
							toggleSelection( false );
						} }
					>
						{ uniqueID && (
							<div className="kt-row-padding">
								<span id={ `row-top-${ uniqueID }` } >
									{ previewPaddingTop + 'px' }
								</span>
							</div>
						) }
					</ResizableBox>
				) }
				{ colLayout && ( ! showSettings( 'allSettings', 'kadence/rowlayout' ) || ! showSettings( 'paddingMargin', 'kadence/rowlayout' ) || ( paddingUnit && 'px' !== paddingUnit ) ) && (
					<Fragment>
						{ uniqueID && (
							<div className="kt-row-padding kb-static-row-padding" style={ {
								paddingTop: previewPaddingTop + ( paddingUnit ? paddingUnit : 'px' ),
							} }>
								<div className={ 'kb-row-padding-container' }>
									<span id={ `row-top-${ uniqueID }` } >
										{ previewPaddingTop + ( paddingUnit ? paddingUnit : 'px' ) }
									</span>
								</div>
							</div>
						) }
					</Fragment>
				) }
				{ colLayout && (
					<Fragment>
						<div { ...innerBlocksProps } />
						{/* <div className={ `innerblocks-wrap${ ( inheritMaxWidth ? ' kb-theme-content-width' : '' ) }` } id={ `kt-layout-id${ uniqueID }` } style={ {
							maxWidth: ! inheritMaxWidth && previewMaxWidth ? previewMaxWidth + maxWidthUnit : undefined,
							paddingLeft: previewPaddingLeft + ( paddingUnit ? paddingUnit : 'px' ),
							paddingRight: previewPaddingRight + ( paddingUnit ? paddingUnit : 'px' ),
						} }> */}
						{ colLayout && 'row' !== colLayout && columns && 2 === columns && showSettings( 'allSettings', 'kadence/rowlayout' ) && 'Desktop' === previewDevice && showSettings( 'columnResize', 'kadence/rowlayout' ) && (
							<div className={ innerResizeClasses } style={ {
								left: previewPaddingLeft + ( paddingUnit ? paddingUnit : 'px' ),
								right: previewPaddingRight + ( paddingUnit ? paddingUnit : 'px' ),
							} }>
								<ContainerDimensions>
									{ ( { width } ) =>
										<ResizableBox
											className="editor-row-first-column__resizer"
											size={ { width: ( ! firstColumnWidth ? widthNumber : firstColumnWidth + '%' ) } }
											minWidth="10%"
											maxWidth="90%"
											enable={ {
												right: true,
											} }
											handleClasses={ {
												right: 'components-resizable-box__handle components-resizable-box__handle-right',
											} }
											handleWrapperClass="editor-row-controls-container"
											grid={ ( columnsUnlocked ? [ width / 1000, 1 ] : [ width / 20, 1 ] ) }
											onResize={ onResize }
											onResizeStop={ onResizeStop }
											axis="x"
										>
											<span className="editor-row-controls-container">
												{ columnsUnlocked && (
													<Tooltip text={ __( 'Switch to 5% step resizing' ) }>
														<Button
															className="kt-fluid-grid-btn"
															isSmall
															onClick={ () => setAttributes( { columnsUnlocked: false } ) }
														>
															{
																<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><path d="M4.217,10.611l0,2.7l-3.31,-3.311l3.31,-3.311l0,2.7l11.566,0l0,-2.7l3.31,3.311l-3.31,3.311l0,-2.7l-11.566,0Z" /></svg>
															}
														</Button>
													</Tooltip>
												) }
												{ ! columnsUnlocked && (
													<Tooltip text={ __( 'Switch to fluid resizing' ) }>
														<Button
															className="kt-fluid-grid-btn"
															isSmall
															onClick={ () => setAttributes( { columnsUnlocked: true } ) }
														>
															{
																<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="1.5">
																	<path d="M13.967,10.611l0.001,-1.222l1.815,0l0,-2.7l3.31,3.311l-3.31,3.311l0,-2.7l-1.816,0Z"
																	/>
																	<path d="M8.918,10.611l-0.022,-1.222l2.15,0l-0.031,1.222l-2.097,0Z" />
																	<path d="M4.217,10.611l0,2.7l-3.31,-3.311l3.31,-3.311l0,2.7l1.693,0l-0.028,1.222l-1.665,0Z"
																	/>
																	<circle cx="12.427" cy="9.997" r="1.419" fill="none" stroke="#0085ba" />
																	<circle cx="7.456" cy="9.997" r="1.419" fill="none" stroke="#0085ba" />
																</svg>
															}
														</Button>
													</Tooltip>
												) }
												<span id={ `left-column-width-${ uniqueID }` } className="left-column-width-size column-width-size-handle" >
													{ ( ! firstColumnWidth ? widthNumber : firstColumnWidth + '%' ) }
												</span>
												<span id={ `right-column-width-${ uniqueID }` } className="right-column-width-size column-width-size-handle" >
													{ ( ! firstColumnWidth ? Math.abs( parseFloat( widthNumber ) - 100 ) + '%' : ( Math.round( ( 100 - firstColumnWidth ) * 10 ) / 10 ) + '%' ) }
												</span>
											</span>
										</ResizableBox>
									}
								</ContainerDimensions>
							</div>
						) }
						{/* { colLayout && 'row' !== colLayout && columns && 3 === columns && showSettings( 'allSettings', 'kadence/rowlayout' ) && 'Desktop' === previewDevice && showSettings( 'columnResize', 'kadence/rowlayout' ) && (
							<ThreeColumnDrag
								uniqueID={ uniqueID }
								onSetFirstCol={ value => setFirstWidth( value ) }
								onSetSecondCol={ value => setSecondWidth( value ) }
								onSetAttributes={ value => setAttributes( value ) }
								firstColumnWidth={ firstColumnWidth }
								secondColumnWidth={ secondColumnWidth }
								widthString={ widthString }
								secondWidthString={ secondWidthString }
								columnsUnlocked={ columnsUnlocked }
								leftPadding={ previewPaddingLeft }
								rightPadding={ previewPaddingRight }
							/>
						) } */}

					{/* // 	<InnerBlocks
					// 		template={ getColumnsTemplate( columns ) }
					// 		templateLock="all"
					// 		orientation="horizontal"
					// 		renderAppender={ false }
					// 		allowedBlocks={ ALLOWED_BLOCKS } />
					// </div> */}
					</Fragment>
				) }
				{ colLayout && showSettings( 'allSettings', 'kadence/rowlayout' ) && showSettings( 'paddingMargin', 'kadence/rowlayout' ) && ( ! paddingUnit || ( paddingUnit && 'px' === paddingUnit ) ) && (
					<ResizableBox
						size={ {
							height: previewPaddingBottom,
						} }
						minHeight="0"
						handleClasses={ {
							top: 'wp-block-kadence-rowlayout-handler-top',
							bottom: 'wp-block-kadence-rowlayout-handler-bottom',
						} }
						enable={ {
							top: false,
							right: false,
							bottom: true,
							left: false,
							topRight: false,
							bottomRight: false,
							bottomLeft: false,
							topLeft: false,
						} }
						className={ 'kt-bottom-padding-resize kt-padding-resize-box' }
						onResize={ ( event, direction, elt, delta ) => {
							editorDocument.getElementById( 'row-bottom-' + uniqueID ).innerHTML = parseInt( previewPaddingBottom + delta.height, 10 ) + 'px';
						} }
						onResizeStop={ ( event, direction, elt, delta ) => {
							if ( 'Mobile' === previewDevice ) {
								setAttributes( {
									bottomPaddingM: parseInt( previewPaddingBottom + delta.height, 10 ),
								} );
							} else if ( 'Tablet' === previewDevice ) {
								setAttributes( {
									tabletPadding: [ ( tabletPadding ? tabletPadding[ 0 ] : '' ), ( tabletPadding ? tabletPadding[ 1 ] : '' ), parseInt( previewPaddingBottom + delta.height, 10 ), ( tabletPadding ? tabletPadding[ 3 ] : '' ) ],
								} );
							} else {
								setAttributes( {
									bottomPadding: parseInt( previewPaddingBottom + delta.height, 10 ),
								} );
							}
						} }
						onResizeStart={ () => {
						} }
					>
						{ uniqueID && (
							<div className="kt-row-padding">
								<span id={ `row-bottom-${ uniqueID }` } >
									{ previewPaddingBottom + 'px' }
								</span>
							</div>
						) }
					</ResizableBox>
				) }
				{ colLayout && ( ! showSettings( 'allSettings', 'kadence/rowlayout' ) || ! showSettings( 'paddingMargin', 'kadence/rowlayout' ) || ( paddingUnit && 'px' !== paddingUnit ) ) && (
					<Fragment>
						{ uniqueID && (
							<div className="kt-row-padding kb-static-row-padding" style={ {
								paddingBottom: previewPaddingBottom + ( paddingUnit ? paddingUnit : 'px' ),
							} }>
								<div className={ 'kb-row-padding-container' }>
									<span id={ `row-bottom-${ uniqueID }` } >
										{ previewPaddingBottom + ( paddingUnit ? paddingUnit : 'px' ) }
									</span>
								</div>
							</div>
						) }
					</Fragment>
				) }
				<div style={ { height: '1px' } }></div>
				{ colLayout && 'none' !== bottomSep && '' !== bottomSep && (
					<div className={ `kt-row-layout-bottom-sep kt-row-sep-type-${ bottomSep }` } style={ {
						height: previewBottomSepHeight + 'px',
					} }>
						<svg style={ { fill: KadenceColorOutput( bottomSepColor ), width: previewBottomSepWidth + '%' } } viewBox="0 0 1000 100" preserveAspectRatio="none">
							{ bottomSVGDivider[ bottomSep ] }
						</svg>
					</div>
				) }
			</RowBackground>
		</Fragment>
	);
}
const RowLayoutEditContainerWrapper = withDispatch(
	( dispatch, ownProps, registry ) => ( {
		/**
		 * Update all child Column blocks with a new vertical alignment setting
		 * based on whatever alignment is passed in. This allows change to parent
		 * to overide anything set on a individual column basis.
		 *
		 * @param {string} verticalAlignment the vertical alignment setting
		 */
		updateAlignment( verticalAlignment ) {
			const { clientId, setAttributes } = ownProps;
			const { updateBlockAttributes } = dispatch( blockEditorStore );
			const { getBlockOrder } = registry.select( blockEditorStore );

			// Update own alignment.
			setAttributes( { verticalAlignment } );

			// Update all child Column Blocks to match.
			const innerBlockClientIds = getBlockOrder( clientId );
			innerBlockClientIds.forEach( ( innerBlockClientId ) => {
				updateBlockAttributes( innerBlockClientId, {
					verticalAlignment,
				} );
			} );
		},
		/**
		 * Updates the column count, including necessary revisions to child Column
		 * blocks to grant required or redistribute available space.
		 *
		 * @param {number} previousColumns Previous column count.
		 * @param {number} newColumns      New column count.
		 */
		updateColumns( previousColumns, newColumns ) {
			const { clientId } = ownProps;
			const { replaceInnerBlocks } = dispatch( blockEditorStore );
			const { getBlocks } = registry.select( blockEditorStore );

			let innerBlocks = getBlocks( clientId );
			const isAddingColumn = newColumns > previousColumns;


			if ( isAddingColumn ) {
				const arrayLength = innerBlocks.length;
				for ( let i = 0; i < arrayLength; i++ ) {
					innerBlocks[ i ].attributes.id = ( i + 1 );
				}
				innerBlocks = [
					...innerBlocks,
					...times( newColumns - previousColumns, ( n ) => {
						return createBlock( 'kadence/column', {
							id: previousColumns + n + 1,
						} );
					} ),
				];
			} else {
				if ( 1 === ( previousColumns - newColumns ) ) {
					console.log( innerBlocks );
					console.log( innerBlocks.length );
					const lastItem = innerBlocks.length - 1;
					if ( ! innerBlocks[lastItem].innerBlocks.length ) {
						innerBlocks = dropRight(
							innerBlocks,
							previousColumns - newColumns
						);
					}
				}
				// innerBlocks = dropRight(
				// 	innerBlocks,
				// 	previousColumns - newColumns
				// );
			}

			replaceInnerBlocks( clientId, innerBlocks );
		},
	} )
)( RowLayoutEditContainer );
const KadenceRowLayout = ( props ) => {
	const { clientId } = props;
	const { rowBlock, realColumnCount } = useSelect(
		( select ) => {
			const {
				getBlock,
			} = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return {
				rowBlock: block,
				isUniqueBlock: block.innerBlocks.length,
			};
		},
		[ clientId ]
	);
	return <RowLayoutEditContainerWrapper realColumnCount={ realColumnCount } rowBlock={ rowBlock } { ...props } />;
};
export default KadenceRowLayout;

