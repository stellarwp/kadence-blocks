/**
 * BLOCK: Kadence Tabs
 */

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktaccordUniqueIDs = [];
/**
 * Import Icons
 */
import {
	accord1Icon,
	accord2Icon,
	accord3Icon,
	accord4Icon,
	radiusLinkedIcon,
	radiusIndividualIcon,
	topRightIcon,
	topLeftIcon,
	bottomLeftIcon,
	bottomRightIcon,
} from '@kadence/icons';

/**
 * Import External
 */
import classnames from 'classnames';
import memoize from 'memize';
import { times, map } from 'lodash';

import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import {
	PopColorControl,
	BorderColorControls,
	TypographyControls,
	ResponsiveMeasurementControls,
	MeasurementControls,
	KadenceRange,
	KadencePanelBody,
	WebfontLoader,
	RangeControl,
	IconPicker,
	InspectorControlTabs,
} from '@kadence/components';
import {
	getPreviewSize,
	KadenceColorOutput,
	getPreviewDevice,
	showSettings,
} from '@kadence/helpers';

/**
 * Import Css
 */
import './editor.scss';

import {
	createBlock,
} from '@wordpress/blocks';
import {
	useEffect,
	useState,
	Component,
	Fragment,
} from '@wordpress/element';
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	useBlockProps
} from '@wordpress/block-editor';

import {
	TabPanel,
	Button,
	ButtonGroup,
	ToggleControl,
	SelectControl,
	IconButton,
} from '@wordpress/components';

import { withSelect, withDispatch, useSelect, useDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [ 'kadence/pane' ];
/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */
const getPanesTemplate = memoize( ( panes ) => {
	return times( panes, n => [ 'kadence/pane', { id: n + 1 } ] );
} );

/**
 * Build the row edit
 */
function KadenceAccordionComponent( { attributes, className, setAttributes, clientId, realPaneCount, accordionBlock, removePane, updatePaneTag, updateFaqSchema, insertPane } ) {

	const {
		uniqueID,
		paneCount,
		blockAlignment,
		openPane,
		titleStyles,
		contentPadding,
		contentTabletPadding,
		contentMobilePadding,
		contentPaddingType,
		minHeight,
		maxWidth,
		contentBorder,
		contentBorderColor,
		contentBorderRadius,
		contentBgColor,
		titleAlignment,
		startCollapsed,
		faqSchema,
		linkPaneCollapse,
		showIcon,
		iconStyle,
		iconSide,
		iconColor
	} = attributes;

	const [ contentPaddingControl, setContentPaddingControl ] = useState( 'linked' );
	const [ contentBorderRadiusControl, setContentBorderRadiusControl ] = useState( 'linked' );
	const [ contentBorderControl, setContentBorderControl ] = useState( 'linked' );
	const [ titleBorderControl, setTitleBorderControl ] = useState( 'linked' );
	const [ titlePaddingControl, setTitlePaddingControl ] = useState( 'individual' );
	const [ titleBorderRadiusControl, setTitleBorderRadiusControl ] = useState( 'linked' );
	const [ titleBorderColorControl, setTitleBorderColorControl ] = useState( 'linked' );
	const [ titleBorderHoverColorControl, setTitleBorderHoverColorControl ] = useState( 'linked' );
	const [ titleBorderActiveColorControl, setTitleBorderActiveColorControl ] = useState( 'linked' );
	const [ titleTag, setTitleTag ] = useState( 'div' );
	const [ showPreset, setShowPreset ] = useState( false );
	const [ activeTab, setActiveTab ] = useState( 'general' );

	useEffect( () => {
		// This runs when we switch from desktop to tablet.
		if ( !uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/accordion' ] !== undefined && typeof blockConfigObject[ 'kadence/accordion' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/accordion' ] ).map( ( attribute ) => {
					if ( 'titleTag' === attribute ) {
						const accordionBlock = wp.data.select( 'core/block-editor' ).getBlocksByClientId( clientId );
						const realPaneCount = accordionBlock[ 0 ] ? accordionBlock[ 0 ].innerBlocks.length : accordionBlock.innerBlocks.length;
						if ( accordionBlock[ 0 ] ) {
							times( realPaneCount, n => {
								wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( accordionBlock[ 0 ].innerBlocks[ n ].clientId, {
									titleTag: blockConfigObject[ 'kadence/accordion' ][ attribute ],
								} );
							} );
						} else {
							times( realPaneCount, n => {
								wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( accordionBlock.innerBlocks[ n ].clientId, {
									titleTag: blockConfigObject[ 'kadence/accordion' ][ attribute ],
								} );
							} );
						}
						setTitleTag( blockConfigObject[ 'kadence/accordion' ][ attribute ] );
					} else {
						attributes[ attribute ] = blockConfigObject[ 'kadence/accordion' ][ attribute ];
					}
				} );
			}
			if ( blockConfigObject[ 'kadence/pane' ] !== undefined && typeof blockConfigObject[ 'kadence/pane' ] === 'object' ) {
				if ( blockConfigObject[ 'kadence/pane' ].titleTag !== undefined ) {
					setTitleTag( blockConfigObject[ 'kadence/pane' ].titleTag );
				}
			}
			if ( showPreset ) {
				setShowPreset( true );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktaccordUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( ktaccordUniqueIDs.includes( uniqueID ) ) {
			// This will force a rebuild of the unique ID when preview changes.
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktaccordUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			ktaccordUniqueIDs.push( uniqueID );
		}
		if ( titleStyles[ 0 ].padding[ 0 ] === titleStyles[ 0 ].padding[ 1 ] && titleStyles[ 0 ].padding[ 0 ] === titleStyles[ 0 ].padding[ 2 ] && titleStyles[ 0 ].padding[ 0 ] === titleStyles[ 0 ].padding[ 3 ] ) {
			setTitlePaddingControl( 'linked' );
		} else {
			setTitlePaddingControl( 'individual' );
		}
		if ( titleStyles[ 0 ].borderWidth[ 0 ] === titleStyles[ 0 ].borderWidth[ 1 ] && titleStyles[ 0 ].borderWidth[ 0 ] === titleStyles[ 0 ].borderWidth[ 2 ] && titleStyles[ 0 ].borderWidth[ 0 ] === titleStyles[ 0 ].borderWidth[ 3 ] ) {
			setTitleBorderControl( 'linked' );
		} else {
			setTitleBorderControl( 'individual' );
		}
		if ( titleStyles[ 0 ].borderRadius[ 0 ] === titleStyles[ 0 ].borderRadius[ 1 ] && titleStyles[ 0 ].borderRadius[ 0 ] === titleStyles[ 0 ].borderRadius[ 2 ] && titleStyles[ 0 ].borderRadius[ 0 ] === titleStyles[ 0 ].borderRadius[ 3 ] ) {
			setTitleBorderRadiusControl( 'linked' );
		} else {
			setTitleBorderRadiusControl( 'individual' );
		}
		if ( contentBorder[ 0 ] === contentBorder[ 1 ] && contentBorder[ 0 ] === contentBorder[ 2 ] && contentBorder[ 0 ] === contentBorder[ 3 ] ) {
			setContentBorderControl( 'linked' );
		} else {
			setContentBorderControl( 'individual' );
		}
		if ( contentBorderRadius[ 0 ] === contentBorderRadius[ 1 ] && contentBorderRadius[ 0 ] === contentBorderRadius[ 2 ] && contentBorderRadius[ 0 ] === contentBorderRadius[ 3 ] ) {
			setContentBorderRadiusControl( 'linked' );
		} else {
			setContentBorderRadiusControl( 'individual' );
		}
		if ( contentPadding[ 0 ] === contentPadding[ 1 ] && contentPadding[ 0 ] === contentPadding[ 2 ] && contentPadding[ 0 ] === contentPadding[ 3 ] ) {
			setContentPaddingControl( 'linked' );
		} else {
			setContentPaddingControl( 'individual' );
		}
		if ( titleStyles[ 0 ].border[ 0 ] === titleStyles[ 0 ].border[ 1 ] && titleStyles[ 0 ].border[ 0 ] === titleStyles[ 0 ].border[ 2 ] && titleStyles[ 0 ].border[ 0 ] === titleStyles[ 0 ].border[ 3 ] ) {
			setTitleBorderColorControl( 'linked' );
		} else {
			setTitleBorderColorControl( 'individual' );
		}
		if ( titleStyles[ 0 ].borderHover[ 0 ] === titleStyles[ 0 ].borderHover[ 1 ] && titleStyles[ 0 ].borderHover[ 0 ] === titleStyles[ 0 ].borderHover[ 2 ] && titleStyles[ 0 ].borderHover[ 0 ] === titleStyles[ 0 ].borderHover[ 3 ] ) {
			setTitleBorderHoverColorControl( 'linked' );
		} else {
			setTitleBorderHoverColorControl( 'individual' );
		}
		if ( titleStyles[ 0 ].borderActive[ 0 ] === titleStyles[ 0 ].borderActive[ 1 ] && titleStyles[ 0 ].borderActive[ 0 ] === titleStyles[ 0 ].borderActive[ 2 ] && titleStyles[ 0 ].borderActive[ 0 ] === titleStyles[ 0 ].borderActive[ 3 ] ) {
			setTitleBorderActiveColorControl( 'linked' );
		} else {
			setTitleBorderActiveColorControl( 'individual' );
		}

		if ( accordionBlock && accordionBlock[ 0 ] && accordionBlock[ 0 ].innerBlocks[ 0 ] && accordionBlock[ 0 ].innerBlocks[ 0 ].attributes && accordionBlock[ 0 ].innerBlocks[ 0 ].attributes.titleTag ) {
			setTitleTag( accordionBlock[ 0 ].innerBlocks[ 0 ].attributes.titleTag );
		}
		if ( accordionBlock && accordionBlock.innerBlocks[ 0 ] && accordionBlock.innerBlocks[ 0 ].attributes && accordionBlock.innerBlocks[ 0 ].attributes.titleTag ) {
			setTitleTag( accordionBlock.innerBlocks[ 0 ].attributes.titleTag );
		}

	}, [] );

	const startlayoutOptions = [
		{ key: 'skip', name: __( 'Skip' ), icon: __( 'Skip' ) },
		{ key: 'base', name: __( 'Base' ), icon: accord1Icon },
		{ key: 'highlight', name: __( 'Highlight' ), icon: accord2Icon },
		{ key: 'subtle', name: __( 'Subtle' ), icon: accord3Icon },
		{ key: 'bottom', name: __( 'Bottom Border' ), icon: accord4Icon },
	];
	const previewPaddingType = ( undefined !== contentPaddingType ? contentPaddingType : 'px' );
	const paddingMin = ( previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0 : 0 );
	const paddingMax = ( previewPaddingType === 'em' || previewPaddingType === 'rem' ? 12 : 200 );
	const paddingStep = ( previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0.1 : 1 );
	const previewContentPaddingTop = getPreviewSize( getPreviewDevice, ( undefined !== contentPadding && undefined !== contentPadding[ 0 ] ? contentPadding[ 0 ] : '' ), ( undefined !== contentTabletPadding && undefined !== contentTabletPadding[ 0 ] ? contentTabletPadding[ 0 ] : '' ), ( undefined !== contentMobilePadding && undefined !== contentMobilePadding[ 0 ] ? contentMobilePadding[ 0 ] : '' ) );
	const previewContentPaddingRight = getPreviewSize( getPreviewDevice, ( undefined !== contentPadding && undefined !== contentPadding[ 1 ] ? contentPadding[ 1 ] : '' ), ( undefined !== contentTabletPadding && undefined !== contentTabletPadding[ 1 ] ? contentTabletPadding[ 1 ] : '' ), ( undefined !== contentMobilePadding && undefined !== contentMobilePadding[ 1 ] ? contentMobilePadding[ 1 ] : '' ) );
	const previewContentPaddingBottom = getPreviewSize( getPreviewDevice, ( undefined !== contentPadding && undefined !== contentPadding[ 2 ] ? contentPadding[ 2 ] : '' ), ( undefined !== contentTabletPadding && undefined !== contentTabletPadding[ 2 ] ? contentTabletPadding[ 2 ] : '' ), ( undefined !== contentMobilePadding && undefined !== contentMobilePadding[ 2 ] ? contentMobilePadding[ 2 ] : '' ) );
	const previewContentPaddingLeft = getPreviewSize( getPreviewDevice, ( undefined !== contentPadding && undefined !== contentPadding[ 3 ] ? contentPadding[ 3 ] : '' ), ( undefined !== contentTabletPadding && undefined !== contentTabletPadding[ 3 ] ? contentTabletPadding[ 3 ] : '' ), ( undefined !== contentMobilePadding && undefined !== contentMobilePadding[ 3 ] ? contentMobilePadding[ 3 ] : '' ) );
	const previewTitlePaddingType = ( undefined !== titleStyles[ 0 ].paddingType && '' !== titleStyles[ 0 ].paddingType ? titleStyles[ 0 ].paddingType : 'px' );
	const titlePaddingMin = ( previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 0 : 0 );
	const titlePaddingMax = ( previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 12 : 200 );
	const titlePaddingStep = ( previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 0.1 : 1 );
	const previewTitlePaddingTop = getPreviewSize( getPreviewDevice, ( undefined !== titleStyles[ 0 ].padding && undefined !== titleStyles[ 0 ].padding[ 0 ] ? titleStyles[ 0 ].padding[ 0 ] : '' ), ( undefined !== titleStyles[ 0 ].paddingTablet && undefined !== titleStyles[ 0 ].paddingTablet[ 0 ] ? titleStyles[ 0 ].paddingTablet[ 0 ] : '' ), ( undefined !== titleStyles[ 0 ].paddingMobile && undefined !== titleStyles[ 0 ].paddingMobile[ 0 ] ? titleStyles[ 0 ].paddingMobile[ 0 ] : '' ) );
	const previewTitlePaddingRight = getPreviewSize( getPreviewDevice, ( undefined !== titleStyles[ 0 ].padding && undefined !== titleStyles[ 0 ].padding[ 1 ] ? titleStyles[ 0 ].padding[ 1 ] : '' ), ( undefined !== titleStyles[ 0 ].paddingTablet && undefined !== titleStyles[ 0 ].paddingTablet[ 1 ] ? titleStyles[ 0 ].paddingTablet[ 1 ] : '' ), ( undefined !== titleStyles[ 0 ].paddingMobile && undefined !== titleStyles[ 0 ].paddingMobile[ 1 ] ? titleStyles[ 0 ].paddingMobile[ 1 ] : '' ) );
	const previewTitlePaddingBottom = getPreviewSize( getPreviewDevice, ( undefined !== titleStyles[ 0 ].padding && undefined !== titleStyles[ 0 ].padding[ 2 ] ? titleStyles[ 0 ].padding[ 2 ] : '' ), ( undefined !== titleStyles[ 0 ].paddingTablet && undefined !== titleStyles[ 0 ].paddingTablet[ 2 ] ? titleStyles[ 0 ].paddingTablet[ 2 ] : '' ), ( undefined !== titleStyles[ 0 ].paddingMobile && undefined !== titleStyles[ 0 ].paddingMobile[ 2 ] ? titleStyles[ 0 ].paddingMobile[ 2 ] : '' ) );
	const previewTitlePaddingLeft = getPreviewSize( getPreviewDevice, ( undefined !== titleStyles[ 0 ].padding && undefined !== titleStyles[ 0 ].padding[ 3 ] ? titleStyles[ 0 ].padding[ 3 ] : '' ), ( undefined !== titleStyles[ 0 ].paddingTablet && undefined !== titleStyles[ 0 ].paddingTablet[ 3 ] ? titleStyles[ 0 ].paddingTablet[ 3 ] : '' ), ( undefined !== titleStyles[ 0 ].paddingMobile && undefined !== titleStyles[ 0 ].paddingMobile[ 3 ] ? titleStyles[ 0 ].paddingMobile[ 3 ] : '' ) );

	const setInitalLayout = ( key ) => {
		if ( 'skip' === key ) {
		} else if ( 'base' === key ) {
			setAttributes( {
				contentBorder : [ 0, 0, 0, 0 ],
				titleAlignment: 'left',
				showIcon      : true,
				iconStyle     : 'basic',
				iconSide      : 'right',
				titleStyles   : [ {
					size            : titleStyles[ 0 ].size,
					sizeType        : titleStyles[ 0 ].sizeType,
					lineHeight      : titleStyles[ 0 ].lineHeight,
					lineType        : titleStyles[ 0 ].lineType,
					letterSpacing   : titleStyles[ 0 ].letterSpacing,
					family          : titleStyles[ 0 ].family,
					google          : titleStyles[ 0 ].google,
					style           : titleStyles[ 0 ].style,
					weight          : titleStyles[ 0 ].weight,
					variant         : titleStyles[ 0 ].variant,
					subset          : titleStyles[ 0 ].subset,
					loadGoogle      : titleStyles[ 0 ].loadGoogle,
					padding         : [ 10, 14, 10, 14 ],
					marginTop       : 0,
					color           : '#555555',
					background      : '#f2f2f2',
					border          : [ '#555555', '#555555', '#555555', '#555555' ],
					borderRadius    : [ 0, 0, 0, 0 ],
					borderWidth     : [ 0, 0, 0, 0 ],
					colorHover      : '#444444',
					backgroundHover : '#eeeeee',
					borderHover     : [ '#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee' ],
					colorActive     : '#ffffff',
					backgroundActive: '#444444',
					borderActive    : [ '#444444', '#444444', '#444444', '#444444' ],
					textTransform   : titleStyles[ 0 ].textTransform,
				} ],
			} );
		} else if ( 'highlight' === key ) {
			setAttributes( {
				contentBorder : [ 0, 0, 0, 0 ],
				contentBgColor: '#ffffff',
				titleAlignment: 'left',
				showIcon      : true,
				iconStyle     : 'basic',
				iconSide      : 'right',
				titleStyles   : [ {
					size            : titleStyles[ 0 ].size,
					sizeType        : titleStyles[ 0 ].sizeType,
					lineHeight      : titleStyles[ 0 ].lineHeight,
					lineType        : titleStyles[ 0 ].lineType,
					letterSpacing   : titleStyles[ 0 ].letterSpacing,
					family          : titleStyles[ 0 ].family,
					google          : titleStyles[ 0 ].google,
					style           : titleStyles[ 0 ].style,
					weight          : titleStyles[ 0 ].weight,
					variant         : titleStyles[ 0 ].variant,
					subset          : titleStyles[ 0 ].subset,
					loadGoogle      : titleStyles[ 0 ].loadGoogle,
					padding         : [ 14, 16, 14, 16 ],
					marginTop       : 10,
					color           : '#555555',
					background      : '#f2f2f2',
					border          : [ '#555555', '#555555', '#555555', '#555555' ],
					borderRadius    : [ 6, 6, 6, 6 ],
					borderWidth     : [ 0, 0, 0, 0 ],
					colorHover      : '#444444',
					backgroundHover : '#eeeeee',
					borderHover     : [ '#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee' ],
					colorActive     : '#ffffff',
					backgroundActive: '#f3690e',
					borderActive    : [ '#f3690e', '#f3690e', '#f3690e', '#f3690e' ],
					textTransform   : titleStyles[ 0 ].textTransform,
				} ],
			} );
		} else if ( 'subtle' === key ) {
			setAttributes( {
				contentBorder : [ 0, 1, 1, 1 ],
				contentBgColor: '#ffffff',
				titleAlignment: 'left',
				showIcon      : true,
				iconStyle     : 'arrow',
				iconSide      : 'right',
				titleStyles   : [ {
					size            : titleStyles[ 0 ].size,
					sizeType        : titleStyles[ 0 ].sizeType,
					lineHeight      : titleStyles[ 0 ].lineHeight,
					lineType        : titleStyles[ 0 ].lineType,
					letterSpacing   : titleStyles[ 0 ].letterSpacing,
					family          : titleStyles[ 0 ].family,
					google          : titleStyles[ 0 ].google,
					style           : titleStyles[ 0 ].style,
					weight          : titleStyles[ 0 ].weight,
					variant         : titleStyles[ 0 ].variant,
					subset          : titleStyles[ 0 ].subset,
					loadGoogle      : titleStyles[ 0 ].loadGoogle,
					padding         : [ 14, 16, 14, 16 ],
					marginTop       : 10,
					color           : '#444444',
					background      : '#ffffff',
					border          : [ '#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee' ],
					borderRadius    : [ 0, 0, 0, 0 ],
					borderWidth     : [ 1, 1, 1, 2 ],
					colorHover      : '#444444',
					backgroundHover : '#ffffff',
					borderHover     : [ '#d4d4d4', '#d4d4d4', '#d4d4d4', '#d4d4d4' ],
					colorActive     : '#444444',
					backgroundActive: '#ffffff',
					borderActive    : [ '#eeeeee', '#eeeeee', '#eeeeee', '#0e9cd1' ],
					textTransform   : titleStyles[ 0 ].textTransform,
				} ],
			} );
		} else if ( 'bottom' === key ) {
			setAttributes( {
				contentBorder : [ 0, 0, 0, 0 ],
				contentBgColor: '#ffffff',
				titleAlignment: 'left',
				showIcon      : false,
				iconStyle     : 'arrow',
				iconSide      : 'right',
				titleStyles   : [ {
					size            : titleStyles[ 0 ].size,
					sizeType        : titleStyles[ 0 ].sizeType,
					lineHeight      : titleStyles[ 0 ].lineHeight,
					lineType        : titleStyles[ 0 ].lineType,
					letterSpacing   : titleStyles[ 0 ].letterSpacing,
					family          : titleStyles[ 0 ].family,
					google          : titleStyles[ 0 ].google,
					style           : titleStyles[ 0 ].style,
					weight          : titleStyles[ 0 ].weight,
					variant         : titleStyles[ 0 ].variant,
					subset          : titleStyles[ 0 ].subset,
					loadGoogle      : titleStyles[ 0 ].loadGoogle,
					padding         : [ 14, 10, 6, 16 ],
					marginTop       : 8,
					color           : '#444444',
					background      : '#ffffff',
					border          : [ '#f2f2f2', '#f2f2f2', '#f2f2f2', '#f2f2f2' ],
					borderRadius    : [ 0, 0, 0, 0 ],
					borderWidth     : [ 0, 0, 4, 0 ],
					colorHover      : '#444444',
					backgroundHover : '#ffffff',
					borderHover     : [ '#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee' ],
					colorActive     : '#333333',
					backgroundActive: '#ffffff',
					borderActive    : [ '#0e9cd1', '#0e9cd1', '#0e9cd1', '#0e9cd1' ],
					textTransform   : titleStyles[ 0 ].textTransform,
				} ],
			} );
		}
	};
	const saveTitleStyles = ( value ) => {
		const newUpdate = titleStyles.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			titleStyles: newUpdate,
		} );
	};
	const lgconfig = {
		google: {
			families: [ titleStyles[ 0 ].family + ( titleStyles[ 0 ].variant ? ':' + titleStyles[ 0 ].variant : '' ) ],
		},
	};
	const config = ( titleStyles[ 0 ].google ? lgconfig : '' );
	const classes = classnames( className, `kt-accordion-wrap kt-accordion-id${uniqueID} kt-accordion-has-${paneCount}-panes kt-accordion-block kt-pane-header-alignment-${titleAlignment}` );
	const normalSettings = (
		<>
			<PopColorControl
				label={__( 'Title Color', 'kadence-blocks' )}
				value={( titleStyles[ 0 ].color ? titleStyles[ 0 ].color : '' )}
				default={''}
				onChange={( value ) => saveTitleStyles( { color: value } )}
			/>
			<PopColorControl
				label={__( 'Title Background', 'kadence-blocks' )}
				value={( titleStyles[ 0 ].background ? titleStyles[ 0 ].background : '' )}
				default={''}
				onChange={( value ) => saveTitleStyles( { background: value } )}
			/>
			<BorderColorControls
				label={__( 'Title Border Color' )}
				values={titleStyles[ 0 ].border}
				control={titleBorderColorControl}
				onChange={( value ) => saveTitleStyles( { border: value } )}
				onControl={( value ) => setTitleBorderColorControl( value )}
			/>
		</>
	);
	const hoverSettings = (
		<>
			<PopColorControl
				label={__( 'Hover Color', 'kadence-blocks' )}
				value={( titleStyles[ 0 ].colorHover ? titleStyles[ 0 ].colorHover : '' )}
				default={''}
				onChange={( value ) => saveTitleStyles( { colorHover: value } )}
			/>
			<PopColorControl
				label={__( 'Hover Background', 'kadence-blocks' )}
				value={( titleStyles[ 0 ].backgroundHover ? titleStyles[ 0 ].backgroundHover : '' )}
				default={''}
				onChange={( value ) => saveTitleStyles( { backgroundHover: value } )}
			/>
			<BorderColorControls
				label={__( 'Hover Border Color' )}
				values={titleStyles[ 0 ].borderHover}
				control={titleBorderHoverColorControl}
				onChange={( value ) => saveTitleStyles( { borderHover: value } )}
				onControl={( value ) => setTitleBorderHoverColorControl( value )}
			/>
		</>
	);
	const activeSettings = (
		<>
			<PopColorControl
				label={__( 'Active Color', 'kadence-blocks' )}
				value={( titleStyles[ 0 ].colorActive ? titleStyles[ 0 ].colorActive : '' )}
				default={''}
				onChange={( value ) => saveTitleStyles( { colorActive: value } )}
			/>
			<PopColorControl
				label={__( 'Active Background', 'kadence-blocks' )}
				value={( titleStyles[ 0 ].backgroundActive ? titleStyles[ 0 ].backgroundActive : '' )}
				default={''}
				onChange={( value ) => saveTitleStyles( { backgroundActive: value } )}
			/>
			<BorderColorControls
				label={__( 'Active Border Color' )}
				colorDefault={( titleStyles[ 0 ].border && titleStyles[ 0 ].border[ 0 ] ? KadenceColorOutput( titleStyles[ 0 ].border[ 0 ] ) : '#444444' )}
				values={titleStyles[ 0 ].borderActive}
				control={titleBorderActiveColorControl}
				onChange={( value ) => saveTitleStyles( { borderActive: value } )}
				onControl={( value ) => setTitleBorderActiveColorControl( value )}
			/>
		</>
	);
	const accordionIconSet = [];
	accordionIconSet.basic = <>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
	</>;
	accordionIconSet.basiccircle = <>
		<circle cx="83.723" cy="50" r="50" fill="#444"/>
		<circle cx="322.768" cy="50" r="50" fill="#444"/>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
	</>;
	accordionIconSet.xclose = <>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444"/>
		<path d="M353.5,28.432l-9.887,-9.887l-53.023,53.023l9.887,9.887l53.023,-53.023Z" fill="#444"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#444"/>
	</>;
	accordionIconSet.xclosecircle = <>
		<circle cx="83.723" cy="50" r="50" fill="#444"/>
		<circle cx="322.768" cy="50" r="50" fill="#444"/>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff"/>
		<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#fff"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M290.59,71.568l9.887,9.887l53.023,-53.023l-9.887,-9.887l-53.023,53.023Z" fill="#fff"/>
	</>;
	accordionIconSet.arrow = <>
		<g fill="#444">
			<path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z"/>
			<path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z"/>
		</g>
		<g fill="#444">
			<path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z"/>
			<path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z"/>
		</g>
	</>;
	accordionIconSet.arrowcircle = <>
		<circle cx="83.723" cy="50" r="50" fill="#444"/>
		<circle cx="322.768" cy="50" r="50" fill="#444"/>
		<g fill="#fff">
			<path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z"/>
			<path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z"/>
		</g>
		<g fill="#fff">
			<path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z"/>
			<path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z"/>
		</g>
	</>;

	const renderIconSet = svg => (
		<svg className="accord-icon" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round"
			 strokeMiterlimit="1.414" style={{ fill: '#000000' }}>
			{accordionIconSet[ svg ]}
		</svg>
	);
	const renderCSS = (
		<style>
			{`
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header {
					color: ${KadenceColorOutput( titleStyles[ 0 ].color )};
					border-color: ${KadenceColorOutput( titleStyles[ 0 ].border[ 0 ] )} ${KadenceColorOutput( titleStyles[ 0 ].border[ 1 ] )} ${KadenceColorOutput( titleStyles[ 0 ].border[ 2 ] )} ${KadenceColorOutput( titleStyles[ 0 ].border[ 3 ] )};
					background-color: ${KadenceColorOutput( titleStyles[ 0 ].background )};
					${'' !== previewTitlePaddingTop ? `padding-top:${previewTitlePaddingTop + previewTitlePaddingType};` : ''}
					${'' !== previewTitlePaddingRight ? `padding-right:${previewTitlePaddingRight + previewTitlePaddingType};` : ''}
					${'' !== previewTitlePaddingBottom ? `padding-bottom:${previewTitlePaddingBottom + previewTitlePaddingType};` : ''}
					${'' !== previewTitlePaddingLeft ? `padding-left:${previewTitlePaddingLeft + previewTitlePaddingType};` : ''}
					margin-top:${( titleStyles[ 0 ].marginTop > 32 ? titleStyles[ 0 ].marginTop : 0 )}px;
					border-width:${titleStyles[ 0 ].borderWidth[ 0 ]}px ${titleStyles[ 0 ].borderWidth[ 1 ]}px ${titleStyles[ 0 ].borderWidth[ 2 ]}px ${titleStyles[ 0 ].borderWidth[ 3 ]}px;
					border-radius:${titleStyles[ 0 ].borderRadius[ 0 ]}px ${titleStyles[ 0 ].borderRadius[ 1 ]}px ${titleStyles[ 0 ].borderRadius[ 2 ]}px ${titleStyles[ 0 ].borderRadius[ 3 ]}px;
					font-size:${titleStyles[ 0 ].size[ 0 ]}${titleStyles[ 0 ].sizeType};
					line-height:${titleStyles[ 0 ].lineHeight[ 0 ]}${titleStyles[ 0 ].lineType};
					letter-spacing:${titleStyles[ 0 ].letterSpacing}px;
					text-transform:${titleStyles[ 0 ].textTransform};
					font-family:${titleStyles[ 0 ].family};
					font-style:${titleStyles[ 0 ].style};
					font-weight:${titleStyles[ 0 ].weight};
				}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header .kt-blocks-accordion-title {
					line-height:${titleStyles[ 0 ].lineHeight[ 0 ]}${titleStyles[ 0 ].lineType};
				}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header .kt-btn-svg-icon svg {
					width:${titleStyles[ 0 ].size[ 0 ]}${titleStyles[ 0 ].sizeType};
					height:${titleStyles[ 0 ].size[ 0 ]}${titleStyles[ 0 ].sizeType};
				}
				.kt-accordion-${uniqueID} .kt-accordion-panel-inner {
					${'' !== previewContentPaddingTop ? `padding-top:${previewContentPaddingTop + previewPaddingType};` : ''}
					${'' !== previewContentPaddingRight ? `padding-right:${previewContentPaddingRight + previewPaddingType};` : ''}
					${'' !== previewContentPaddingBottom ? `padding-bottom:${previewContentPaddingBottom + previewPaddingType};` : ''}
					${'' !== previewContentPaddingLeft ? `padding-left:${previewContentPaddingLeft + previewPaddingType};` : ''}
					background-color: ${KadenceColorOutput( contentBgColor )};
					border-color: ${KadenceColorOutput( contentBorderColor )};
					border-width:${contentBorder[ 0 ]}px ${contentBorder[ 1 ]}px ${contentBorder[ 2 ]}px ${contentBorder[ 3 ]}px;
					border-radius:${contentBorderRadius[ 0 ]}px ${contentBorderRadius[ 1 ]}px ${contentBorderRadius[ 2 ]}px ${contentBorderRadius[ 3 ]}px;
					min-height:${( minHeight ? minHeight + 'px' : '0' )};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ '' !== iconColor.standard ? KadenceColorOutput( iconColor.standard ) : KadenceColorOutput( titleStyles[ 0 ].color )};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:after {
					background-color: ${KadenceColorOutput( titleStyles[ 0 ].background )};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger {
					background-color: ${ '' !== iconColor.standard ? KadenceColorOutput(iconColor.standard) : KadenceColorOutput( titleStyles[ 0 ].color )};
				}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header:hover {
					color: ${KadenceColorOutput( titleStyles[ 0 ].colorHover )};
					border-color: ${KadenceColorOutput( titleStyles[ 0 ].borderHover[ 0 ] )} ${KadenceColorOutput( titleStyles[ 0 ].borderHover[ 1 ] )} ${KadenceColorOutput( titleStyles[ 0 ].borderHover[ 2 ] )} ${KadenceColorOutput( titleStyles[ 0 ].borderHover[ 3 ] )};
					background-color: ${KadenceColorOutput( titleStyles[ 0 ].backgroundHover )};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ '' !== iconColor.hover ? KadenceColorOutput(iconColor.hover) : KadenceColorOutput( titleStyles[ 0 ].colorHover )};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ '' !== iconColor.hover ? KadenceColorOutput(iconColor.hover) : KadenceColorOutput( titleStyles[ 0 ].backgroundHover )};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger {
					background-color: ${ '' !== iconColor.hover ? KadenceColorOutput(iconColor.hover) : KadenceColorOutput( titleStyles[ 0 ].colorHover )};
				}
				.kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1} .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-header {
					color: ${KadenceColorOutput( titleStyles[ 0 ].colorActive )};
					border-color: ${KadenceColorOutput( titleStyles[ 0 ].borderActive[ 0 ] )} ${KadenceColorOutput( titleStyles[ 0 ].borderActive[ 1 ] )} ${KadenceColorOutput( titleStyles[ 0 ].borderActive[ 2 ] )} ${KadenceColorOutput( titleStyles[ 0 ].borderActive[ 3 ] )};
					background-color: ${KadenceColorOutput( titleStyles[ 0 ].backgroundActive )};
				}
				.kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ '' !== iconColor.active ? KadenceColorOutput(iconColor.active) : KadenceColorOutput( titleStyles[ 0 ].colorActive )};
				}
				.kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger:after {
					background-color: ${KadenceColorOutput( titleStyles[ 0 ].backgroundActive )};
				}
				.kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger {
					background-color: ${KadenceColorOutput( titleStyles[ 0 ].colorActive )};
				}
				`}
		</style>
	);

	const blockProps = useBlockProps( {} );

	return (
		<div {...blockProps}>
			{renderCSS}
			<BlockControls>
				<BlockAlignmentToolbar
					value={blockAlignment}
					controls={[ 'center', 'wide', 'full' ]}
					onChange={value => setAttributes( { blockAlignment: value } )}
				/>
				<AlignmentToolbar
					value={titleAlignment}
					onChange={( nextAlign ) => {
						setAttributes( { titleAlignment: nextAlign } );
					}}
				/>
			</BlockControls>
			{ showSettings( 'allSettings', 'kadence/accordion' ) && (
				<InspectorControls>
					<InspectorControlTabs
						panelName={'accordion'}
						setActiveTab={ ( value ) => setActiveTab( value ) }
						activeTab={ activeTab }
					/>
					{ ( activeTab === 'general' ) &&
						<>
							<KadencePanelBody panelName={'kb-accordion-all'}>
								{ showSettings( 'paneControl', 'kadence/accordion' ) && (
									<Fragment>
										<ToggleControl
											label={__( 'Panes close when another opens', 'kadence-blocks' )}
											checked={linkPaneCollapse}
											onChange={( value ) => setAttributes( { linkPaneCollapse: value } )}
										/>
										<ToggleControl
											label={__( 'Start with all panes collapsed', 'kadence-blocks' )}
											checked={startCollapsed}
											onChange={( value ) => setAttributes( { startCollapsed: value } )}
										/>
										{!startCollapsed && (
											<Fragment>
												<h2>{__( 'Initial Open Accordion', 'kadence-blocks' )}</h2>
												<ButtonGroup aria-label={__( 'Initial Open Accordion', 'kadence-blocks' )}>
													{accordionBlock && accordionBlock[ 0 ] && accordionBlock[ 0 ].innerBlocks && (
														<Fragment>
															{map( accordionBlock[ 0 ].innerBlocks, ( { attributes } ) => (
																<Button
																	key={attributes.id - 1}
																	className="kt-init-open-pane"
																	isSmall
																	isPrimary={openPane === attributes.id - 1}
																	aria-pressed={openPane === attributes.id - 1}
																	onClick={() => setAttributes( { openPane: attributes.id - 1 } )}
																>
																	{__( 'Accordion Pane', 'kadence-blocks' ) + ' ' + ( attributes.id )}
																</Button>
															) )}
														</Fragment>
													)}
													{accordionBlock && accordionBlock.innerBlocks && (
														<Fragment>
															{map( accordionBlock.innerBlocks, ( { attributes } ) => (
																<Button
																	key={attributes.id - 1}
																	className="kt-init-open-pane"
																	isSmall
																	isPrimary={openPane === attributes.id - 1}
																	aria-pressed={openPane === attributes.id - 1}
																	onClick={() => setAttributes( { openPane: attributes.id - 1 } )}
																>
																	{__( 'Accordion Pane', 'kadence-blocks' ) + ' ' + ( attributes.id )}
																</Button>
															) )}
														</Fragment>
													)}
												</ButtonGroup>
											</Fragment>
										)}
									</Fragment>
								)}
							</KadencePanelBody>
							{ showSettings( 'titleColors', 'kadence/accordion' ) && (
								<KadencePanelBody
									title={__( 'Pane Title Color Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-accordion-pane-title-color-settings'}
								>
									<TabPanel className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
											  activeClass="active-tab"
											  tabs={[
												  {
													  name     : 'normal',
													  title    : __( 'Normal' ),
													  className: 'kt-normal-tab',
												  },
												  {
													  name     : 'hover',
													  title    : __( 'Hover' ),
													  className: 'kt-hover-tab',
												  },
												  {
													  name     : 'active',
													  title    : __( 'Active' ),
													  className: 'kt-active-tab',
												  },
											  ]}>
										{ ( tab ) => {
												let tabout;

												if ( tab.name ) {
													if ( 'hover' === tab.name ) {
														tabout = hoverSettings;
													} else if ( 'active' === tab.name ) {
														tabout = activeSettings;
													} else {
														tabout = normalSettings;
													}
												}
												return (
													<div className={tab.className} key={tab.className}>
														{tabout}
													</div>
												);
											}
										}
									</TabPanel>
								</KadencePanelBody>
							) }
							{ showSettings( 'titleIcon', 'kadence/accordion' ) && (
								<KadencePanelBody
									title={ __( 'Pane Title Trigger Icon', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-acordion-panel-title-trigger-icon' }
								>
									<ToggleControl
										label={ __( 'Show Icon', 'kadence-blocks' ) }
										checked={ showIcon }
										onChange={ ( value ) => setAttributes( { showIcon: value } ) }
									/>
									<h2>{ __( 'Icon Style', 'kadence-blocks' ) }</h2>
									<IconPicker
										icons={ [
											'basic',
											'basiccircle',
											'xclose',
											'xclosecircle',
											'arrow',
											'arrowcircle',
										] }
										value={ iconStyle }
										onChange={ value => setAttributes( { iconStyle: value } ) }
										appendTo="body"
										renderFunc={ renderIconSet }
										theme="accordion"
										showSearch={ false }
										noSelectedPlaceholder={ __( 'Select Icon Set', 'kadence-blocks' ) }
										isMulti={ false }
									/>
									<SelectControl
										label={ __( 'Icon Side', 'kadence-blocks' ) }
										value={ iconSide }
										options={ [
											{ value: 'right', label: __( 'Right' ) },
											{ value: 'left', label: __( 'Left' ) },
										] }
										onChange={ value => setAttributes( { iconSide: value } ) }
									/>

									<TabPanel className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
											  activeClass="active-tab"
											  tabs={[
												  {
													  name     : 'normal',
													  title    : __( 'Normal' ),
													  className: 'kt-normal-tab',
												  },
												  {
													  name     : 'hover',
													  title    : __( 'Hover' ),
													  className: 'kt-hover-tab',
												  },
												  {
													  name     : 'active',
													  title    : __( 'Active' ),
													  className: 'kt-active-tab',
												  },
											  ]}>
										{ ( tab ) => {

											if ( tab.name ) {
												if ( 'hover' === tab.name ) {
													return(
														<div className={tab.className} key={tab.className}>
															<PopColorControl
																label={__( 'Hover Icon Color', 'kadence-blocks' )}
																value={( iconColor.hover ? iconColor.hover : '' )}
																default={''}
																onChange={( value ) => setAttributes( { iconColor:  { ...iconColor, hover: value } } )}
															/>
														</div>
													);
												} else if ( 'active' === tab.name ) {
													return(
														<div className={tab.className} key={tab.className}>
															<PopColorControl
																label={__( 'Active Icon Color', 'kadence-blocks' )}
																value={( iconColor.active ? iconColor.active : '' )}
																default={''}
																onChange={( value ) => setAttributes( { iconColor:  { ...iconColor, active: value } } )}
															/>
														</div>
													);
												} else {
													return(
														<div className={tab.className} key={tab.className}>
															<PopColorControl
																label={__( 'Icon Color', 'kadence-blocks' )}
																value={( iconColor.standard ? iconColor.standard : '' )}
																default={''}
																onChange={( value ) => setAttributes( { iconColor:  { ...iconColor, standard: value } } )}
															/>
														</div>
													);
												}
											}
										} }
									</TabPanel>
								</KadencePanelBody>
							) }
						</>
					}
					{ ( activeTab === 'style' ) &&
						<>
							{ showSettings( 'titleSpacing', 'kadence/accordion' ) && (
								<KadencePanelBody
									title={__( 'Pane Title Spacing', 'kadence-blocks' )}
									panelName={'kb-accordion-pane-title-spacing'}
								>
									<ResponsiveMeasurementControls
										label={__( 'Pane Title Padding', 'kadence-blocks' )}
										control={titlePaddingControl}
										tabletControl={titlePaddingControl}
										mobileControl={titlePaddingControl}
										value={titleStyles[ 0 ].padding}
										tabletValue={undefined !== titleStyles[ 0 ].paddingTablet ? titleStyles[ 0 ].paddingTablet : [ '', '', '', '' ]}
										mobileValue={undefined !== titleStyles[ 0 ].paddingMobile ? titleStyles[ 0 ].paddingMobile : [ '', '', '', '' ]}
										onChange={( value ) => {
											saveTitleStyles( { padding: value } );
										}}
										onChangeTablet={( value ) => {
											saveTitleStyles( { paddingTablet: value } );
										}}
										onChangeMobile={( value ) => {
											saveTitleStyles( { paddingMobile: value } );
										}}
										onChangeControl={( value ) => setTitlePaddingControl( value )}
										onChangeTabletControl={( value ) => setTitlePaddingControl( value )}
										onChangeMobileControl={( value ) => setTitlePaddingControl( value )}
										allowEmpty={true}
										min={titlePaddingMin}
										max={titlePaddingMax}
										step={titlePaddingStep}
										unit={undefined !== titleStyles[ 0 ].paddingType ? titleStyles[ 0 ].paddingType : 'px'}
										units={[ 'px', 'em', 'rem', '%' ]}
										onUnit={( value ) => {
											saveTitleStyles( { paddingType: value } );
										}}
									/>
									<RangeControl
										label={__( 'Pane Spacer Between', 'kadence-blocks' )}
										value={titleStyles[ 0 ].marginTop}
										onChange={( value ) => saveTitleStyles( { marginTop: value } )}
										min={1}
										max={120}
									/>
								</KadencePanelBody>
							)}
							{ showSettings( 'titleBorder', 'kadence/accordion' ) && (
								<KadencePanelBody
									title={__( 'Pane Title Border', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-accordion-pane-title-border'}
								>
									<MeasurementControls
										label={__( 'Pane Title Border Width (px)', 'kadence-blocks' )}
										measurement={titleStyles[ 0 ].borderWidth}
										control={titleBorderControl}
										onChange={( value ) => saveTitleStyles( { borderWidth: value } )}
										onControl={( value ) => setTitleBorderControl( value )}
										min={0}
										max={100}
										step={1}
									/>
									<MeasurementControls
										label={__( 'Pane Title Border Radius (px)', 'kadence-blocks' )}
										measurement={titleStyles[ 0 ].borderRadius}
										control={titleBorderRadiusControl}
										onChange={( value ) => saveTitleStyles( { borderRadius: value } )}
										onControl={( value ) => setTitleBorderRadiusControl( value )}
										min={0}
										max={100}
										step={1}
										controlTypes={[
											{ key: 'linked', name: __( 'Linked' ), icon: radiusLinkedIcon },
											{ key: 'individual', name: __( 'Individual' ), icon: radiusIndividualIcon },
										]}
										firstIcon={topLeftIcon}
										secondIcon={topRightIcon}
										thirdIcon={bottomRightIcon}
										fourthIcon={bottomLeftIcon}
									/>
								</KadencePanelBody>
							)}
							{ showSettings( 'titleFont', 'kadence/accordion' ) && (
								<KadencePanelBody
									title={__( 'Pane Title Font Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-accordion-pane-title-font-settings'}
								>
									<TypographyControls
										fontSize={titleStyles[ 0 ].size}
										onFontSize={( value ) => saveTitleStyles( { size: value } )}
										fontSizeType={titleStyles[ 0 ].sizeType}
										onFontSizeType={( value ) => saveTitleStyles( { sizeType: value } )}
										lineHeight={titleStyles[ 0 ].lineHeight}
										onLineHeight={( value ) => saveTitleStyles( { lineHeight: value } )}
										lineHeightType={titleStyles[ 0 ].lineType}
										onLineHeightType={( value ) => saveTitleStyles( { lineType: value } )}
										letterSpacing={titleStyles[ 0 ].letterSpacing}
										onLetterSpacing={( value ) => saveTitleStyles( { letterSpacing: value } )}
										textTransform={titleStyles[ 0 ].textTransform}
										onTextTransform={( value ) => saveTitleStyles( { textTransform: value } )}
										fontFamily={titleStyles[ 0 ].family}
										onFontFamily={( value ) => saveTitleStyles( { family: value } )}
										onFontChange={( select ) => {
											saveTitleStyles( {
												family: select.value,
												google: select.google,
											} );
										}}
										onFontArrayChange={( values ) => saveTitleStyles( values )}
										googleFont={titleStyles[ 0 ].google}
										onGoogleFont={( value ) => saveTitleStyles( { google: value } )}
										loadGoogleFont={titleStyles[ 0 ].loadGoogle}
										onLoadGoogleFont={( value ) => saveTitleStyles( { loadGoogle: value } )}
										fontVariant={titleStyles[ 0 ].variant}
										onFontVariant={( value ) => saveTitleStyles( { variant: value } )}
										fontWeight={titleStyles[ 0 ].weight}
										onFontWeight={( value ) => saveTitleStyles( { weight: value } )}
										fontStyle={titleStyles[ 0 ].style}
										onFontStyle={( value ) => saveTitleStyles( { style: value } )}
										fontSubset={titleStyles[ 0 ].subset}
										onFontSubset={( value ) => saveTitleStyles( { subset: value } )}
									/>
								</KadencePanelBody>
							)}
							{ showSettings( 'paneContent', 'kadence/accordion' ) && (
								<KadencePanelBody
									title={__( 'Inner Content Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-accordion-inner-content-settings'}
								>
									<ResponsiveMeasurementControls
										label={__( 'Inner Content Padding', 'kadence-blocks' )}
										control={contentPaddingControl}
										tabletControl={contentPaddingControl}
										mobileControl={contentPaddingControl}
										value={contentPadding}
										tabletValue={contentTabletPadding}
										mobileValue={contentMobilePadding}
										onChange={( value ) => {
											setAttributes( { contentPadding: value } );
										}}
										onChangeTablet={( value ) => {
											setAttributes( { contentTabletPadding: value } );
										}}
										onChangeMobile={( value ) => {
											setAttributes( { contentMobilePadding: value } );
										}}
										onChangeControl={( value ) => setContentPaddingControl( value )}
										onChangeTabletControl={( value ) => setContentPaddingControl( value )}
										onChangeMobileControl={( value ) => setContentPaddingControl( value )}
										allowEmpty={true}
										min={paddingMin}
										max={paddingMax}
										step={paddingStep}
										unit={contentPaddingType}
										units={[ 'px', 'em', 'rem', '%' ]}
										onUnit={( value ) => setAttributes( { contentPaddingType: value } )}
									/>
									<PopColorControl
										label={__( 'Inner Content Background', 'kadence-blocks' )}
										value={( contentBgColor ? contentBgColor : '' )}
										default={''}
										onChange={( value ) => setAttributes( { contentBgColor: value } )}
									/>
									<PopColorControl
										label={__( 'Inner Content Border Color', 'kadence-blocks' )}
										value={( contentBorderColor ? contentBorderColor : '' )}
										default={''}
										onChange={( value ) => setAttributes( { contentBorderColor: value } )}
									/>
									<MeasurementControls
										label={__( 'Inner Content Border Width (px)', 'kadence-blocks' )}
										measurement={contentBorder}
										control={contentBorderControl}
										onChange={( value ) => setAttributes( { contentBorder: value } )}
										onControl={( value ) => setContentBorderControl( value )}
										min={0}
										max={40}
										step={1}
									/>
									<MeasurementControls
										label={__( 'Inner Content Border Radius (px)', 'kadence-blocks' )}
										measurement={contentBorderRadius}
										control={contentBorderRadiusControl}
										onChange={( value ) => setAttributes( { contentBorderRadius: value } )}
										onControl={( value ) => setContentBorderRadiusControl( value )}
										min={0}
										max={100}
										step={1}
										controlTypes={[
											{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: radiusLinkedIcon },
											{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: radiusIndividualIcon },
										]}
										firstIcon={topLeftIcon}
										secondIcon={topRightIcon}
										thirdIcon={bottomRightIcon}
										fourthIcon={bottomLeftIcon}
									/>
								</KadencePanelBody>
							)}
						</>
					}
					{( activeTab === 'advanced' ) &&
						<>
							{ showSettings( 'titleTag', 'kadence/accordion' ) && (
								<KadencePanelBody
									title={__( 'Title Tag Settings', 'kadence-blocks' )}
									panelName={'kb-accordion-title-tag-settings'}
								>
									<SelectControl
										label={__( 'Title Tag', 'kadence-blocks' )}
										value={ titleTag }
										options={[
											{ value: 'div', label: __( 'div' ) },
											{ value: 'h2', label: __( 'h2' ) },
											{ value: 'h3', label: __( 'h3' ) },
											{ value: 'h4', label: __( 'h4' ) },
											{ value: 'h5', label: __( 'h5' ) },
											{ value: 'h6', label: __( 'h6' ) },
										]}
										onChange={value => {
											updatePaneTag( value );
											setTitleTag( value );
										}}
									/>
								</KadencePanelBody>
							)}
							{ showSettings( 'structure', 'kadence/accordion' ) && (
								<KadencePanelBody
									title={__( 'Structure Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-accordion-structure-settings'}
								>
									<RangeControl
										label={__( 'Content Minimum Height', 'kadence-blocks' )}
										value={minHeight}
										onChange={( value ) => {
											setAttributes( {
												minHeight: value,
											} );
										}}
										min={0}
										max={1000}
									/>
									<RangeControl
										label={__( 'Max Width', 'kadence-blocks' )}
										value={maxWidth}
										onChange={( value ) => {
											setAttributes( {
												maxWidth: value,
											} );
										}}
										min={0}
										max={2000}
									/>
									<ToggleControl
										label={__( 'Enable FAQ Schema', 'kadence-blocks' )}
										checked={faqSchema}
										onChange={( value ) => {
											updateFaqSchema( value );
											setAttributes( { faqSchema: value } );
										}}
									/>
								</KadencePanelBody>
							)}
						</>
					}
				</InspectorControls>
			) }
			<div className={classes}>
				{ showPreset && (
					<div className="kt-select-starter-style-tabs">
						<div className="kt-select-starter-style-tabs-title">
							{__( 'Select Initial Style' )}
						</div>
						<ButtonGroup className="kt-init-tabs-btn-group" aria-label={__( 'Initial Style', 'kadence-blocks' )}>
							{map( startlayoutOptions, ( { name, key, icon } ) => (
								<Button
									key={key}
									className="kt-inital-tabs-style-btn"
									isSmall
									onClick={() => {
										setInitalLayout( key );
										setShowPreset( false );
									}}
								>
									{icon}
								</Button>
							) )}
						</ButtonGroup>
					</div>
				)}
				{!showPreset && (
					<Fragment>
						<div className="kt-accordion-selecter">{__( 'Accordion', 'kadence-blocks' )}</div>
						<div className="kt-accordion-wrap" style={{
							maxWidth: maxWidth + 'px',
						}}>
							{titleStyles[ 0 ].google && (
								<WebfontLoader config={config}>
								</WebfontLoader>
							)}
							<div
								className={`kt-accordion-inner-wrap kt-accordion-${uniqueID} kt-start-active-pane-${openPane + 1} kt-accodion-icon-style-${( iconStyle && showIcon ? iconStyle : 'none' )} kt-accodion-icon-side-${( iconSide ? iconSide : 'right' )}`}>
								<InnerBlocks
									template={getPanesTemplate( ( 0 === realPaneCount ? paneCount : realPaneCount ) )}
									templateLock={false}
									allowedBlocks={ALLOWED_BLOCKS}/>
							</div>
						</div>
						<div className="kt-accordion-add-selecter">
							<Button
								className="kt-accordion-add"
								isPrimary={ true }
								icon="plus"
								iconPosition="left"
								iconSize={ 16 }
								onClick={ () => {
									const newBlock = createBlock( 'kadence/pane', { id: paneCount + 1, titleTag: titleTag } );
									setAttributes( { paneCount: paneCount + 1 } );
									insertPane( newBlock );
								}}
							>
								{ __( 'Add Accordion Item', 'kadence-blocks' ) }
							</Button>
							{ realPaneCount > 1 && (
								<Button
									className="kt-accordion-remove"
									label={__( 'Remove Accordion Item', 'kadence-blocks' )}
									icon="minus"
									onClick={() => {
										const removeClientId = ( accordionBlock[ 0 ] ? accordionBlock[ 0 ].innerBlocks[ realPaneCount - 1 ].clientId : accordionBlock.innerBlocks[ realPaneCount - 1 ].clientId );
										removePane( removeClientId );
									}}
								/>
							)}
						</div>
					</Fragment>
				)}
			</div>
		</div>
	);
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			getBlock,
		} = select( 'core/block-editor' );
		const block = getBlock( clientId );
		return {
			accordionBlock  : block,
			realPaneCount   : block.innerBlocks.length,
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
	withDispatch( ( dispatch, { clientId }, { select } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' );
		const {
			removeBlock,
			updateBlockAttributes,
			insertBlock,
		} = dispatch( 'core/block-editor' );
		const block = getBlock( clientId );
		return {
			updatePaneTag( value ) {
				times( block.innerBlocks.length, n => {
					updateBlockAttributes( block.innerBlocks[ n ].clientId, {
						titleTag: value,
					} );
				} );
			},
			updateFaqSchema( value ) {
				times( block.innerBlocks.length, n => {
					updateBlockAttributes( block.innerBlocks[ n ].clientId, {
						faqSchema: value,
					} );
				} );
			},
			insertPane( newBlock ) {
				insertBlock( newBlock, parseInt( block.innerBlocks.length ), clientId );
			},
			removePane( paneId ) {
				removeBlock( paneId );
			},
		};
	} ),
] )( KadenceAccordionComponent );
