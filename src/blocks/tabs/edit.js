/**
 * BLOCK: Kadence Tabs
 */

/**
 * Import Icons
 */
import {
	accordionIcon,
	tabsBoldIcon,
	tabsCenterIcon,
	tabsIcon,
	tabsSimpleIcon,
	tabsVerticalIcon,
	vTabsIcon
} from '@kadence/icons';

/**
 * Import External
 */
import classnames from 'classnames';
import memoize from 'memize';
import { times, filter, map } from 'lodash';
import {
	KadenceColorOutput,
	showSettings,
	getSpacingOptionOutput,
	getPreviewSize,
	getFontSizeOptionOutput,
	setBlockDefaults,
	getUniqueId
} from '@kadence/helpers';
import {
	PopColorControl,
	TypographyControls,
	WebfontLoader,
	KadenceIconPicker,
	IconRender,
	KadencePanelBody,
	MeasurementControls,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	InspectorControlTabs,
	CopyPasteAttributes,
	SmallResponsiveControl,
	ResponsiveMeasurementControls,
	ResponsiveRangeControls,
} from '@kadence/components';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

import {
	createBlock,
} from '@wordpress/blocks';
import { withSelect, withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {
	useState,
	Fragment,
	useRef,
	useEffect
} from '@wordpress/element';
import {
	InnerBlocks,
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	useBlockProps
} from '@wordpress/block-editor';
import {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	Dashicon,
	RangeControl,
	ToggleControl,
	SelectControl,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import {
	applyFilters,
} from '@wordpress/hooks';
import {
	plusCircle,
} from '@wordpress/icons';
/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
import Select from 'react-select';

const ALLOWED_BLOCKS = [ 'kadence/tab' ];

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */
const getPanesTemplate = memoize( ( panes ) => {
	return times( panes, n => [ 'kadence/tab', { id: n + 1 } ] );
} );
/**
 * Build the row edit
 */
function KadenceTabs( { attributes, clientId, className, setAttributes, tabsBlock, realTabsCount, tabsInner, resetOrder, moveTab, insertTab, removeTab, previewDevice } ) {

	const {
		uniqueID,
		showPresets,
		tabCount,
		blockAlignment,
		mobileLayout,
		currentTab,
		tabletLayout,
		layout,
		innerPadding,
		tabletInnerPadding,
		mobileInnerPadding,
		innerPaddingType,
		minHeight,
		maxWidth,
		titles,
		titleColor,
		titleColorHover,
		titleColorActive,
		titleBg,
		titleBgHover,
		titleBgActive,
		size,
		sizeType,
		lineType,
		lineHeight,
		tabLineHeight,
		tabSize,
		mobileSize,
		mobileLineHeight,
		letterSpacing,
		titleBorderWidth,
		titleBorderControl,
		titleBorder,
		titleBorderHover,
		titleBorderActive,
		typography,
		fontVariant,
		fontWeight,
		fontStyle,
		fontSubset,
		googleFont,
		loadGoogleFont,
		contentBorder,
		contentBorderColor,
		titlePadding,
		tabletTitlePadding,
		mobileTitlePadding,
		titlePaddingUnit,
		titleMargin,
		tabletTitleMargin,
		mobileTitleMargin,
		titleMarginUnit,
		contentBgColor,
		tabAlignment,
		titleBorderRadius,
		tabletTitleBorderRadius,
		mobileTitleBorderRadius,
		titleBorderRadiusUnit,
		iSize,
		startTab,
		enableSubtitle,
		subtitleFont,
		tabWidth,
		gutter,
		widthType,
		textTransform,
		contentBorderRadius,
		tabletContentBorderRadius,
		mobileContentBorderRadius,
		contentBorderRadiusUnit,
		verticalTabWidth,
		verticalTabWidthUnit,
	} = attributes;

	const [ showPreset, setShowPreset ] = useState( false );
	const [ activeTab, setActiveTab ] = useState( 'general' );

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( ! uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/tabs' ] !== undefined && typeof blockConfigObject[ 'kadence/tabs' ] === 'object' ) {
				setBlockDefaults( 'kadence/tabs', attributes);
			} else {
				setShowPreset( true );
			}
		}
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );

	const previewInnerPaddingTop = getPreviewSize( previewDevice, ( undefined !== innerPadding ? innerPadding[0] : '' ), ( undefined !== tabletInnerPadding ? tabletInnerPadding[ 0 ] : '' ), ( undefined !== mobileInnerPadding ? mobileInnerPadding[ 0 ] : '' ) );
	const previewInnerPaddingRight = getPreviewSize( previewDevice, ( undefined !== innerPadding ? innerPadding[1] : '' ), ( undefined !== tabletInnerPadding ? tabletInnerPadding[ 1 ] : '' ), ( undefined !== mobileInnerPadding ? mobileInnerPadding[ 1 ] : '' ) );
	const previewInnerPaddingBottom = getPreviewSize( previewDevice, ( undefined !== innerPadding ? innerPadding[2] : '' ), ( undefined !== tabletInnerPadding ? tabletInnerPadding[ 2 ] : '' ), ( undefined !== mobileInnerPadding ? mobileInnerPadding[ 2 ] : '' ) );
	const previewInnerPaddingLeft = getPreviewSize( previewDevice, ( undefined !== innerPadding ? innerPadding[3] : '' ), ( undefined !== tabletInnerPadding ? tabletInnerPadding[ 3 ] : '' ), ( undefined !== mobileInnerPadding ? mobileInnerPadding[ 3 ] : '' ) );

	const previewSubFontSize = getPreviewSize( previewDevice, ( undefined !== subtitleFont[ 0 ].size && undefined !== subtitleFont[ 0 ].size[ 0 ] ? subtitleFont[ 0 ].size[ 0 ] : '' ), ( undefined !== subtitleFont[ 0 ].size && undefined !== subtitleFont[ 0 ].size[ 1 ] ? subtitleFont[ 0 ].size[ 1 ] : '' ), ( undefined !== subtitleFont[ 0 ].size && undefined !== subtitleFont[ 0 ].size[ 2 ] ? subtitleFont[ 0 ].size[ 2 ] : '' ) );
	const previewSubLineHeight = getPreviewSize( previewDevice, ( undefined !== subtitleFont[ 0 ].lineHeight && undefined !== subtitleFont[ 0 ].lineHeight[ 0 ] ? subtitleFont[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== subtitleFont[ 0 ].lineHeight && undefined !== subtitleFont[ 0 ].lineHeight[ 1 ] ? subtitleFont[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== subtitleFont[ 0 ].lineHeight && undefined !== subtitleFont[ 0 ].lineHeight[ 2 ] ? subtitleFont[ 0 ].lineHeight[ 2 ] : '' ) );

	const previewFontSize = getPreviewSize( previewDevice, ( undefined !== size ? size : '' ), ( undefined !== tabSize ? tabSize : '' ), ( undefined !== mobileSize ? mobileSize : '' ) );
	const previewLineHeight = getPreviewSize( previewDevice, ( undefined !== lineHeight ? lineHeight : '' ), ( undefined !== tabLineHeight ? tabLineHeight : '' ), ( undefined !== mobileLineHeight ? mobileLineHeight : '' ) );

	const previewContentRadiusTop = getPreviewSize( previewDevice, ( undefined !== contentBorderRadius?.[0] ? contentBorderRadius[ 0 ] : '' ), ( undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[ 0 ] : '' ), ( undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[ 0 ] : '' ) );
	const previewContentRadiusRight = getPreviewSize( previewDevice, ( undefined !== contentBorderRadius ? contentBorderRadius[ 1 ] : '' ), ( undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[ 1 ] : '' ), ( undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[ 1 ] : '' ) );
	const previewContentRadiusBottom = getPreviewSize( previewDevice, ( undefined !== contentBorderRadius ? contentBorderRadius[ 2 ] : '' ), ( undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[ 2 ] : '' ), ( undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[ 2 ] : '' ) );
	const previewContentRadiusLeft = getPreviewSize( previewDevice, ( undefined !== contentBorderRadius ? contentBorderRadius[ 3 ] : '' ), ( undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[ 3 ] : '' ), ( undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[ 3 ] : '' ) );


	const previewTitleRadiusTop = getPreviewSize( previewDevice, ( undefined !== titleBorderRadius?.[0] ? titleBorderRadius[ 0 ] : '' ), ( undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[ 0 ] : '' ), ( undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[ 0 ] : '' ) );
	const previewTitleRadiusRight = getPreviewSize( previewDevice, ( undefined !== titleBorderRadius ? titleBorderRadius[ 1 ] : '' ), ( undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[ 1 ] : '' ), ( undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[ 1 ] : '' ) );
	const previewTitleRadiusBottom = getPreviewSize( previewDevice, ( undefined !== titleBorderRadius ? titleBorderRadius[ 2 ] : '' ), ( undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[ 2 ] : '' ), ( undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[ 2 ] : '' ) );
	const previewTitleRadiusLeft = getPreviewSize( previewDevice, ( undefined !== titleBorderRadius ? titleBorderRadius[ 3 ] : '' ), ( undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[ 3 ] : '' ), ( undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[ 3 ] : '' ) );
	const previewTitleMarginTop = getPreviewSize(previewDevice, (undefined !== titleMargin[0] ? titleMargin[0] : ''), (undefined !== tabletTitleMargin[0] ? tabletTitleMargin[0] : ''), (undefined !== mobileTitleMargin[0] ? mobileTitleMargin[0] : ''));
	const previewTitleMarginRight = getPreviewSize(previewDevice, (undefined !== titleMargin[1] ? titleMargin[1] : ''), (undefined !== tabletTitleMargin[1] ? tabletTitleMargin[1] : ''), (undefined !== mobileTitleMargin[1] ? mobileTitleMargin[1] : ''));
	const previewTitleMarginBottom = getPreviewSize(previewDevice, (undefined !== titleMargin[2] ? titleMargin[2] : ''), (undefined !== tabletTitleMargin[2] ? tabletTitleMargin[2] : ''), (undefined !== mobileTitleMargin[2] ? mobileTitleMargin[2] : ''));
	const previewTitleMarginLeft = getPreviewSize(previewDevice, (undefined !== titleMargin[3] ? titleMargin[3] : ''), (undefined !== tabletTitleMargin[3] ? tabletTitleMargin[3] : ''), (undefined !== mobileTitleMargin[3] ? mobileTitleMargin[3] : ''));
	const previewTitlePaddingTop = getPreviewSize(previewDevice, (undefined !== titlePadding[0] ? titlePadding[0] : ''), (undefined !== tabletTitlePadding[0] ? tabletTitlePadding[0] : ''), (undefined !== mobileTitlePadding[0] ? mobileTitlePadding[0] : ''));
	const previewTitlePaddingRight = getPreviewSize(previewDevice, (undefined !== titlePadding[1] ? titlePadding[1] : ''), (undefined !== tabletTitlePadding[1] ? tabletTitlePadding[1] : ''), (undefined !== mobileTitlePadding[1] ? mobileTitlePadding[1] : ''));
	const previewTitlePaddingBottom = getPreviewSize(previewDevice, (undefined !== titlePadding[2] ? titlePadding[2] : ''), (undefined !== tabletTitlePadding[2] ? tabletTitlePadding[2] : ''), (undefined !== mobileTitlePadding[2] ? mobileTitlePadding[2] : ''));
	const previewTitlePaddingLeft = getPreviewSize(previewDevice, (undefined !== titlePadding[3] ? titlePadding[3] : ''), (undefined !== tabletTitlePadding[3] ? tabletTitlePadding[3] : ''), (undefined !== mobileTitlePadding[3] ? mobileTitlePadding[3] : ''));
	const previewLayout = getPreviewSize( previewDevice, ( undefined !== layout ? layout : 'tabs' ), ( undefined !== tabletLayout && '' !== tabletLayout && 'inherit' !== tabletLayout ? tabletLayout : '' ), ( undefined !== mobileLayout && '' !== mobileLayout && 'inherit' !== mobileLayout ? mobileLayout : '' ) );
	const previewVerticalTabWidth = getPreviewSize( previewDevice, ( verticalTabWidth && verticalTabWidth[ 0 ] ? verticalTabWidth[ 0 ] : '' ) , ( verticalTabWidth && verticalTabWidth[ 1 ] ? verticalTabWidth[ 1 ] : '' ), ( verticalTabWidth && verticalTabWidth[ 2 ] ? verticalTabWidth[ 2 ] : '' ) );
	const previewVerticalTabWidthUnit = ( verticalTabWidthUnit ? verticalTabWidthUnit : 'px' );
	const saveArrayUpdate = ( value, index ) => {
		const newItems = titles.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			titles: newItems,
		} );
	}

	const onMove = ( oldIndex, newIndex ) => {
		const newTitles = [ ...titles ];
		newTitles.splice( newIndex, 1, titles[ oldIndex ] );
		newTitles.splice( oldIndex, 1, titles[ newIndex ] );
		setAttributes( { titles: newTitles, currentTab: parseInt( newIndex + 1 ) } );
		if ( startTab === ( oldIndex + 1 ) ) {
			setAttributes( { startTab: ( newIndex + 1 ) } );
		} else if ( startTab === ( newIndex + 1 ) ) {
			setAttributes( { startTab: ( oldIndex + 1 ) } );
		}
		//moveTab( tabsBlock.innerBlocks[ oldIndex ].clientId, newIndex );
		moveTab( oldIndex, newIndex );
		resetOrder();
		setAttributes( { currentTab: parseInt( newIndex + 1 ) } );
	}

	const onMoveForward = ( oldIndex ) => {
		return () => {
			if ( oldIndex === realTabsCount - 1 ) {
				return;
			}
			onMove( oldIndex, oldIndex + 1 );
		};
	}

	const onMoveBack = ( oldIndex ) => {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			onMove( oldIndex, oldIndex - 1 );
		};
	}

		const layoutClass = ( ! layout ? 'tabs' : layout );
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
		];
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const sgconfig = {
			google: {
				families: [ ( subtitleFont && subtitleFont[ 0 ] && subtitleFont[ 0 ].family ? subtitleFont[ 0 ].family : '' ) + ( subtitleFont && subtitleFont[ 0 ] && subtitleFont[ 0 ].variant ? ':' + subtitleFont[ 0 ].variant : '' ) ],
			},
		};
		const sconfig = ( subtitleFont && subtitleFont[ 0 ] && subtitleFont[ 0 ].google ? sgconfig : '' );
		const saveSubtitleFont = ( value ) => {
			let tempSubFont;
			if ( undefined === subtitleFont || ( undefined !== subtitleFont && undefined === subtitleFont[ 0 ] ) ) {
				tempSubFont = [ {
					size: [ '', '', '' ],
					sizeType: 'px',
					lineHeight: [ '', '', '' ],
					lineType: 'px',
					letterSpacing: '',
					textTransform: '',
					family: '',
					google: false,
					style: '',
					weight: '',
					variant: '',
					subset: '',
					loadGoogle: true,
					padding: [ 0, 0, 0, 0 ],
					paddingControl: 'linked',
					margin: [ 0, 0, 0, 0 ],
					marginControl: 'linked',
				} ];
			} else {
				tempSubFont = subtitleFont;
			}
			const newUpdate = tempSubFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				subtitleFont: newUpdate,
			} );
		};
		const startlayoutOptions = [
			{ key: 'skip', name: __( 'Skip' ), icon: __( 'Skip' ) },
			{ key: 'simple', name: __( 'Simple' ), icon: tabsSimpleIcon },
			{ key: 'boldbg', name: __( 'Boldbg' ), icon: tabsBoldIcon },
			{ key: 'center', name: __( 'Center' ), icon: tabsCenterIcon },
			{ key: 'vertical', name: __( 'Vertical' ), icon: tabsVerticalIcon },
		];
		const setInitalLayout = ( key ) => {
			if ( 'skip' === key ) {
			} else if ( 'simple' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'left',
					size: 1.1,
					sizeType: 'em',
					lineHeight: 1.4,
					lineType: 'em',
					titleBorderWidth: [ 1, 1, 0, 1 ],
					titleBorderControl: 'individual',
					titleBorderRadius: [ 4, 4, 0, 0 ],
					titlePadding: [ 8, 20, 8, 20 ],
					titleMargin: [ 0, 8, -1, 0 ],
					titleColor: '#444444',
					titleColorHover: '#444444',
					titleColorActive: '#444444',
					titleBg: '#ffffff',
					titleBgHover: '#ffffff',
					titleBgActive: '#ffffff',
					titleBorder: '#eeeeee',
					titleBorderHover: '#e2e2e2',
					titleBorderActive: '#bcbcbc',
					contentBgColor: '#ffffff',
					contentBorderColor: '#bcbcbc',
					contentBorder: [ 1, 1, 1, 1 ],
				} );
			} else if ( 'boldbg' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'left',
					size: 1.1,
					sizeType: 'em',
					lineHeight: 1.4,
					lineType: 'em',
					titleBorderWidth: [ 0, 0, 0, 0 ],
					titleBorderControl: 'linked',
					titleBorderRadius: [ 4, 4, 0, 0 ],
					titlePadding: [ 8, 20, 8, 20 ],
					titleMargin: [ 0, 8, 0, 0 ],
					titleColor: '#222222',
					titleColorHover: '#222222',
					titleColorActive: '#ffffff',
					titleBg: '#eeeeee',
					titleBgHover: '#e2e2e2',
					titleBgActive: '#0a6689',
					titleBorder: '#eeeeee',
					titleBorderHover: '#eeeeee',
					titleBorderActive: '#eeeeee',
					contentBgColor: '#ffffff',
					contentBorderColor: '#0a6689',
					contentBorder: [ 3, 0, 0, 0 ],
				} );
			} else if ( 'center' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'center',
					size: 1.1,
					sizeType: 'em',
					lineHeight: 1.4,
					lineType: 'em',
					titleBorderWidth: [ 0, 0, 4, 0 ],
					titleBorderControl: 'individual',
					titleBorderRadius: [ 4, 4, 0, 0 ],
					titlePadding: [ 8, 20, 8, 20 ],
					titleMargin: [ 0, 8, 0, 0 ],
					titleColor: '#555555',
					titleColorHover: '#555555',
					titleColorActive: '#0a6689',
					titleBg: '#ffffff',
					titleBgHover: '#ffffff',
					titleBgActive: '#ffffff',
					titleBorder: '#ffffff',
					titleBorderHover: '#eeeeee',
					titleBorderActive: '#0a6689',
					contentBgColor: '#ffffff',
					contentBorderColor: '#eeeeee',
					contentBorder: [ 1, 0, 0, 0 ],
				} );
			} else if ( 'vertical' === key ) {
				setAttributes( {
					layout: 'vtabs',
					mobileLayout: 'accordion',
					tabAlignment: 'left',
					size: 1.1,
					sizeType: 'em',
					lineHeight: 1.4,
					lineType: 'em',
					titleBorderWidth: [ 4, 0, 4, 4 ],
					titleBorderControl: 'individual',
					titleBorderRadius: [ 10, 0, 0, 10 ],
					titlePadding: [ 12, 8, 12, 20 ],
					titleMargin: [ 0, -4, 10, 0 ],
					titleColor: '#444444',
					titleColorHover: '#444444',
					titleColorActive: '#444444',
					titleBg: '#eeeeee',
					titleBgHover: '#e9e9e9',
					titleBgActive: '#ffffff',
					titleBorder: '#eeeeee',
					titleBorderHover: '#e9e9e9',
					titleBorderActive: '#eeeeee',
					contentBgColor: '#ffffff',
					contentBorderColor: '#eeeeee',
					contentBorder: [ 4, 4, 4, 4 ],
					minHeight: 400,
				} );
			}
		};
		const config = ( googleFont ? gconfig : '' );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );

		const classes = classnames( className, `wp-block-kadence-tabs kt-tabs-wrap kt-tabs-id${ uniqueID } kt-tabs-has-${ tabCount }-tabs kt-active-tab-${ currentTab } kt-tabs-layout-${ layoutClass } kt-tabs-block kt-tabs-tablet-layout-${ tabLayoutClass } kt-tabs-mobile-layout-${ mobileLayoutClass } kt-tab-alignment-${ tabAlignment }` );

		const nonTransAttrs = ['currentTab', 'tabCount'];

		const isAccordionPreview = ( ( previewDevice == 'Tablet' && tabletLayout == 'accordion' ) || ( previewDevice == 'Mobile' && mobileLayout == 'accordion' ) );

		const mLayoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: tabsIcon },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: vTabsIcon },
			{ key: 'accordion', name: __( 'Accordion' ), icon: accordionIcon },
		];
		const layoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: tabsIcon },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: vTabsIcon },
		];

		const initialTabOptions = times( tabCount, ( n ) => {
			return { value: ( n + 1), label: titles[n].text };
		});

		const mobileControls = (
			<Fragment>
				<ButtonGroup aria-label={ __( 'Mobile Layout' ) }>
					{ map( mLayoutOptions, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-layout-btn kt-tablayout"
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
		);
		const tabletControls = (
			<Fragment>
				<ButtonGroup aria-label={ __( 'Tablet Layout' ) }>
					{ map( mLayoutOptions, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-layout-btn kt-tablayout"
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
		);
		const deskControls = (
			<Fragment>
				<ButtonGroup aria-label={ __( 'Layout' ) }>
					{ map( layoutOptions, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-layout-btn kt-tablayout"
								isSmall
								isPrimary={ layout === key }
								aria-pressed={ layout === key }
								onClick={ () => {
									setAttributes( {
										layout: key,
									} );
								} }
							>
								{ icon }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
				<p class="kadence-control-title" style={{marginTop: "5px"}}>{ __( 'Set initial Open Tab') }</p>
				<Select
					value={initialTabOptions.filter(function(option) {
						return option.value === startTab;
					})}
					onChange={ ( selection ) => { setAttributes( { startTab: selection.value } ) } }
					options={ initialTabOptions }
					maxMenuHeight={ 300 }
					placeholder={ __('Select an initial tab', 'kadence-blocks' ) }
				/>
			</Fragment>
		);

		const saveFontAttribute = ( key, value ) => {
			let ucKey = key.charAt(0).toUpperCase() + key.slice(1);

			setAttributes( {
				[ key ]: value[0],
				[ 'tab' + ucKey ]: value[1],
				[ 'mobile' + ucKey ]: value[2],
			} );
		}

		const renderTitles = ( index ) => {
			const subFont = ( subtitleFont && subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].sizeType ? subtitleFont : [ {
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: false,
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
				padding: [ 0, 0, 0, 0 ],
				paddingControl: 'linked',
				margin: [ 0, 0, 0, 0 ],
				marginControl: 'linked',
			} ] );
			return (
				<Fragment>
					<li className={ `kt-title-item kt-title-item-${ index } kt-tabs-svg-show-${ ( titles[ index ] && titles[ index ].onlyIcon ? 'only' : 'always' ) } kt-tabs-icon-side-${ ( titles[ index ] && titles[ index ].iconSide ? titles[ index ].iconSide : 'right' ) } kt-tabs-has-icon-${ ( titles[ index ] && titles[ index ].icon ? 'true' : 'false' ) } kt-tab-title-${ ( 1 + index === currentTab ? 'active' : 'inactive' ) }${ ( enableSubtitle ? ' kb-tabs-have-subtitle' : '' ) }` } style={ {
						marginTop: ( previewTitleMarginTop ? getSpacingOptionOutput( previewTitleMarginTop, titleMarginUnit ) : '' ),
						marginRight: ( 'tabs' === layout && widthType === 'percent' ? '0px' : previewTitleMarginRight ? getSpacingOptionOutput( previewTitleMarginRight, titleMarginUnit ) : '' ),
						marginBottom: ( previewTitleMarginBottom ? getSpacingOptionOutput( previewTitleMarginBottom, titleMarginUnit ) : '' ),
						marginLeft: ( 'tabs' === layout && widthType === 'percent' ? '0px' : previewTitleMarginLeft ? getSpacingOptionOutput( previewTitleMarginLeft, titleMarginUnit ) : '' ),
					} }>
						<div className={ `kt-tab-title kt-tab-title-${ 1 + index }` } style={ {
							backgroundColor: KadenceColorOutput( titleBg ),
							color: KadenceColorOutput( titleColor ),
							fontSize: previewFontSize ? getFontSizeOptionOutput( previewFontSize, sizeType ) : undefined,
							lineHeight: previewLineHeight ? previewLineHeight + lineType : undefined,
							fontWeight: fontWeight,
							fontStyle: fontStyle,
							letterSpacing: letterSpacing + 'px',
							textTransform: textTransform ? textTransform : undefined,
							fontFamily: ( typography ? typography : '' ),
							borderWidth: ( titleBorderWidth ? titleBorderWidth[ 0 ] + 'px ' + titleBorderWidth[ 1 ] + 'px ' + titleBorderWidth[ 2 ] + 'px ' + titleBorderWidth[ 3 ] + 'px' : '' ),
							borderTopLeftRadius: previewTitleRadiusTop + titleBorderRadiusUnit,
							borderTopRightRadius: previewTitleRadiusRight + titleBorderRadiusUnit,
							borderBottomRightRadius: previewTitleRadiusBottom + titleBorderRadiusUnit,
							borderBottomLeftRadius: previewTitleRadiusLeft + titleBorderRadiusUnit,
							paddingTop: ( previewTitlePaddingTop ? getSpacingOptionOutput( previewTitlePaddingTop, titlePaddingUnit ) : '' ),
							paddingRight: ( previewTitlePaddingRight ? getSpacingOptionOutput( previewTitlePaddingRight, titlePaddingUnit ) : '' ),
							paddingBottom: ( previewTitlePaddingBottom ? getSpacingOptionOutput( previewTitlePaddingBottom, titlePaddingUnit ) : '' ),
							paddingLeft: ( previewTitlePaddingLeft ? getSpacingOptionOutput( previewTitlePaddingLeft, titlePaddingUnit ) : '' ),
							borderColor: KadenceColorOutput( titleBorder ),
							marginRight: ( 'tabs' === layout && widthType === 'percent' ? gutter[ 0 ] + 'px' : undefined ),
						} } onClick={ () => setAttributes( { currentTab: 1 + index } ) } onKeyPress={ () => setAttributes( { currentTab: 1 + index } ) } tabIndex="0" role="button">
							{ titles[ index ] && titles[ index ].icon && 'right' !== titles[ index ].iconSide && (
								<IconRender className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! iSize ? '14' : iSize ) } htmltag="span" />
							) }
							{ ( undefined === enableSubtitle || ! enableSubtitle ) && (
								<RichText
									tagName="div"
									placeholder={ __( 'Tab Title', 'kadence-blocks' ) }
									value={ ( titles[ index ] && titles[ index ].text ? titles[ index ].text : '' ) }
									unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
									onChange={ value => {
										saveArrayUpdate( { text: value }, index );
									} }
									allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
									className={ 'kt-title-text' }
									style={ {
										lineHeight: lineHeight + lineType,
									} }
									keepPlaceholderOnFocus
								/>
							) }
							{ enableSubtitle && (
								<div className="kb-tab-titles-wrap">
									<RichText
										tagName="div"
										placeholder={ __( 'Tab Title', 'kadence-blocks' ) }
										value={ ( titles[ index ] && titles[ index ].text ? titles[ index ].text : '' ) }
										unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
										onChange={ value => {
											saveArrayUpdate( { text: value }, index );
										} }
										allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
										className={ 'kt-title-text' }
										style={ {
											lineHeight: lineHeight + lineType,
										} }
										keepPlaceholderOnFocus
									/>
									<RichText
										tagName="div"
										placeholder={ __( 'Tab subtitle', 'kadence-blocks' ) }
										value={ ( undefined !== titles[ index ] && undefined !== titles[ index ].subText ? titles[ index ].subText : '' ) }
										unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
										onChange={ value => {
											saveArrayUpdate( { subText: value }, index );
										} }
										allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
										className={ 'kt-title-sub-text' }
										style={ {
											fontWeight: subFont[ 0 ].weight,
											fontStyle: subFont[ 0 ].style,
											fontSize: previewSubFontSize ? getFontSizeOptionOutput( previewSubFontSize, subFont[ 0 ].sizeType ) : undefined,
											lineHeight: previewSubLineHeight ? previewSubLineHeight + subFont[ 0 ].lineType : undefined,
											textTransform: ( subFont[ 0 ].textTransform ? subFont[ 0 ].textTransform : undefined ),
											letterSpacing: subFont[ 0 ].letterSpacing + 'px',
											fontFamily: ( subFont[ 0 ].family ? subFont[ 0 ].family : '' ),
											padding: ( subFont[ 0 ].padding ? subFont[ 0 ].padding[ 0 ] + 'px ' + subFont[ 0 ].padding[ 1 ] + 'px ' + subFont[ 0 ].padding[ 2 ] + 'px ' + subFont[ 0 ].padding[ 3 ] + 'px' : '' ),
											margin: ( subFont[ 0 ].margin ? subFont[ 0 ].margin[ 0 ] + 'px ' + subFont[ 0 ].margin[ 1 ] + 'px ' + subFont[ 0 ].margin[ 2 ] + 'px ' + subFont[ 0 ].margin[ 3 ] + 'px' : '' ),
										} }
										keepPlaceholderOnFocus
									/>
								</div>
							) }
							{ titles[ index ] && titles[ index ].icon && 'right' === titles[ index ].iconSide && (
								<IconRender className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! iSize ? '14' : iSize ) } htmltag="span" />
							) }
						</div>
						<div className="kadence-blocks-tab-item__control-menu">
							{ index !== 0 && (
								<Button
									icon={ ( 'vtabs' === layout ? 'arrow-up' : 'arrow-left' ) }
									onClick={ index === 0 ? undefined : onMoveBack( index ) }
									className="kadence-blocks-tab-item__move-back"
									label={ ( 'vtabs' === layout ? __( 'Move Item Up', 'kadence-blocks' ) : __( 'Move Item Back', 'kadence-blocks' ) ) }
									aria-disabled={ index === 0 }
									disabled={ index === 0 }
								/>
							) }
							{ ( index + 1 ) !== tabCount && (
								<Button
									icon={ ( 'vtabs' === layout ? 'arrow-down' : 'arrow-right' ) }
									onClick={ ( index + 1 ) === tabCount ? undefined : onMoveForward( index ) }
									className="kadence-blocks-tab-item__move-forward"
									label={ ( 'vtabs' === layout ? __( 'Move Item Down', 'kadence-blocks' ) : __( 'Move Item Forward', 'kadence-blocks' ) ) }
									aria-disabled={ ( index + 1 ) === tabCount }
									disabled={ ( index + 1 ) === tabCount }
								/>
							) }
							{ tabCount > 1 && (
								<Button
									icon="no-alt"
									onClick={ () => {
										const currentItems = filter( titles, ( item, i ) => index !== i );
										const newCount = tabCount - 1;
										let newStartTab;
										if ( startTab === ( index + 1 ) ) {
											newStartTab = '';
										} else if ( startTab > ( index + 1 ) ) {
											newStartTab = startTab - 1;
										} else {
											newStartTab = startTab;
										}
										removeTab( index );
										setAttributes( { titles: currentItems, tabCount: newCount, currentTab: ( index === 0 ? 1 : index ), startTab: newStartTab } );
										resetOrder();
									} }
									className="kadence-blocks-tab-item__remove"
									label={ __( 'Remove Item', 'kadence-blocks' ) }
									disabled={ ! currentTab === ( index + 1 ) }
								/>
							) }
						</div>
					</li>
				</Fragment>
			);
		};
		const renderPreviewArray = (
			<Fragment>
				{ times( tabCount, n => renderTitles( n ) ) }
			</Fragment>
		);
		const renderAnchorSettings = ( index ) => {
			return (
				<KadencePanelBody
					title={ __( 'Tab', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Anchor', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-tab-anchor-' + index }
				>
					<TextControl
						label={ __( 'HTML Anchor', 'kadence-blocks' ) }
						help={ __( 'Anchors lets you link directly to a tab.', 'kadence-blocks' ) }
						value={ titles[ index ] && titles[ index ].anchor ? titles[ index ].anchor : '' }
						onChange={ ( nextValue ) => {
							nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
							saveArrayUpdate( { anchor: nextValue }, index );
						} } />
				</KadencePanelBody>
			);
		};
		const renderTitleSettings = ( index ) => {
			return (
				<KadencePanelBody
					title={ __( 'Tab', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Icon', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-tab-icon-' + index }
				>
					<KadenceIconPicker
						value={ titles[ index ] && titles[ index ].icon ? titles[ index ].icon : '' }
						allowClear={ true }
						onChange={ value => {
							saveArrayUpdate( { icon: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Icon Location', 'kadence-blocks' ) }
						value={ ( titles[ index ] && titles[ index ].iconSide ? titles[ index ].iconSide : 'right' ) }
						options={ [
							{ value: 'right', label: __( 'Right', 'kadence-blocks' ) },
							{ value: 'left', label: __( 'Left', 'kadence-blocks' ) },
							{ value: 'top', label: __( 'Top', 'kadence-blocks' ) },
						] }
						onChange={ value => {
							saveArrayUpdate( { iconSide: value }, index );
						} }
					/>
					<ToggleControl
						label={ __( 'Show Only Icon?', 'kadence-blocks' ) }
						checked={ ( titles[ index ] && titles[ index ].onlyIcon ? titles[ index ].onlyIcon : false ) }
						onChange={ value => {
							saveArrayUpdate( { onlyIcon: value }, index );
						} }
					/>
				</KadencePanelBody>
			);
		};
		const normalSettings = (
			<Fragment>
				<PopColorControl
					label={ __( 'Title Color', 'kadence-blocks' ) }
					value={ ( titleColor ? titleColor : '' ) }
					default={ '#444444' }
					onChange={ ( value ) => setAttributes( { titleColor: value } ) }
				/>
				<PopColorControl
					label={ __( 'Title Background', 'kadence-blocks' ) }
					value={ ( titleBg ? titleBg : '' ) }
					default={ '' }
					onChange={ ( value ) => setAttributes( { titleBg: value } ) }
				/>
				<PopColorControl
					label={ __( 'Title Border Color', 'kadence-blocks' ) }
					value={ ( titleBorder ? titleBorder : '' ) }
					default={ '' }
					onChange={ ( value ) => setAttributes( { titleBorder: value } ) }
				/>
			</Fragment>
		);
		const hoverSettings = (
			<Fragment>
				<PopColorControl
					label={ __( 'Hover Color', 'kadence-blocks' ) }
					value={ ( titleColorHover ? titleColorHover : '' ) }
					default={ '#222222' }
					onChange={ ( value ) => setAttributes( { titleColorHover: value } ) }
				/>
				<PopColorControl
					label={ __( 'Hover Background', 'kadence-blocks' ) }
					value={ ( titleBgHover ? titleBgHover : '' ) }
					default={ '#e2e2e2' }
					onChange={ ( value ) => setAttributes( { titleBgHover: value } ) }
				/>
				<PopColorControl
					label={ __( 'Hover Border Color', 'kadence-blocks' ) }
					value={ ( titleBorderHover ? titleBorderHover : '' ) }
					default={ '#eeeeee' }
					onChange={ ( value ) => setAttributes( { titleBorderHover: value } ) }
				/>
			</Fragment>
		);
		const activeSettings = (
			<Fragment>
				<PopColorControl
					label={ __( 'Active Color', 'kadence-blocks' ) }
					value={ ( titleColorActive ? titleColorActive : '' ) }
					default={ '#222222' }
					onChange={ ( value ) => setAttributes( { titleColorActive: value } ) }
				/>
				<PopColorControl
					label={ __( 'Active Background', 'kadence-blocks' ) }
					value={ ( titleBgActive ? titleBgActive : '' ) }
					default={ '#eeeeee' }
					onChange={ ( value ) => setAttributes( { titleBgActive: value } ) }
				/>
				<PopColorControl
					label={ __( 'Active Border Color', 'kadence-blocks' ) }
					value={ ( titleBorderActive ? titleBorderActive : '' ) }
					default={ '#eeeeee' }
					onChange={ ( value ) => setAttributes( { titleBorderActive: value } ) }
				/>
			</Fragment>
		);

		const percentDesktopContent = (
			<Fragment>
				<RangeControl
					label={__('Columns', 'kadence-blocks')}
					value={(tabWidth && undefined !== tabWidth[0] ? tabWidth[0] : '')}
					onChange={(value) => setAttributes({tabWidth: [value, tabWidth[1], tabWidth[2]]})}
					min={1}
					max={8}
					step={1}
				/>
				<RangeControl
					label={__('Gutter', 'kadence-blocks')}
					value={(gutter && undefined !== gutter[0] ? gutter[0] : '')}
					onChange={(value) => setAttributes({gutter: [value, gutter[1], gutter[2]]})}
					min={0}
					max={50}
					step={1}
				/>
			</Fragment>
		);
		const percentTabletContent = (
			<Fragment>
				<RangeControl
					label={__('Tablet Columns', 'kadence-blocks')}
					value={(tabWidth && undefined !== tabWidth[1] ? tabWidth[1] : '')}
					onChange={(value) => setAttributes({tabWidth: [tabWidth[0], value, tabWidth[2]]})}
					min={1}
					max={8}
					step={1}
				/>
				<RangeControl
					label={__('Tablet Gutter', 'kadence-blocks')}
					value={(gutter && undefined !== gutter[1] ? gutter[1] : '')}
					onChange={(value) => setAttributes({gutter: [gutter[0], value, gutter[2]]})}
					min={0}
					max={50}
					step={1}
				/>
			</Fragment>
		);
		const percentMobileContent = (
			<Fragment>
				<RangeControl
					label={__('Mobile Columns', 'kadence-blocks')}
					value={(tabWidth && undefined !== tabWidth[2] ? tabWidth[2] : '')}
					onChange={(value) => setAttributes({tabWidth: [tabWidth[0], tabWidth[1], value]})}
					min={1}
					max={8}
					step={1}
				/>
				<RangeControl
					label={__('Mobile Gutter', 'kadence-blocks')}
					value={(gutter && undefined !== gutter[2] ? gutter[2] : '')}
					onChange={(value) => setAttributes({gutter: [gutter[0], gutter[1], value]})}
					min={0}
					max={50}
					step={1}
				/>
			</Fragment>
		);

		//generate accordion ordering for tab title and content elements
		let accordionOrderStyle = '';
		if( isAccordionPreview ) {
			times( tabCount, n => {
				let output = `
					.kt-title-item-${n} {
						order: ${2*n}
					}
					.kt-inner-tab-${n+1} {
						order: ${(2*n)+1}
					}
				`;
				accordionOrderStyle += output;
			})
		}

		const renderCSS = (
			<style>
				{ `.kt-tabs-id${ uniqueID } .kt-title-item:hover .kt-tab-title {
					color: ${ KadenceColorOutput( titleColorHover ) } !important;
					border-color: ${ KadenceColorOutput( titleBorderHover ) } !important;
					background-color: ${ KadenceColorOutput( titleBgHover ) } !important;
				}
				.kt-tabs-id${ uniqueID } .kt-title-item.kt-tab-title-active .kt-tab-title, .kt-tabs-id${ uniqueID } .kt-title-item.kt-tab-title-active:hover .kt-tab-title {
					color: ${ KadenceColorOutput( titleColorActive ) } !important;
					border-color: ${ KadenceColorOutput( titleBorderActive ) } !important;
					background-color: ${ KadenceColorOutput( titleBgActive ) } !important;
				}
				.kt-tabs-id${ uniqueID } > .kt-tabs-wrap > .kt-tabs-content-wrap > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-tab="${ currentTab }"] {
					display: block;
				}
				${ accordionOrderStyle }
				` }

			</style>
		);

		const ref = useRef();
		const blockProps = useBlockProps( {
			ref,
			className: 'wp-block-kadence-tabs'
		} );

		return (
			<div {...blockProps}>
				{ renderCSS }
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'wide', 'full' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
					<AlignmentToolbar
						value={ tabAlignment }
						onChange={ ( nextAlign ) => {
							setAttributes( { tabAlignment: nextAlign } );
						} }
					/>
					<CopyPasteAttributes
						attributes={ attributes }
						excludedAttrs={ nonTransAttrs }
						defaultAttributes={ metadata['attributes'] }
						blockSlug={ metadata['name'] }
						onPaste={ attributesToPaste => setAttributes( attributesToPaste ) }
					/>
					<ToolbarGroup group="add-block">
						<ToolbarButton
							className="kb-icons-add-icon"
							icon={ plusCircle }
							onClick={ () => {
								const newBlock = createBlock( 'kadence/tab', { id: tabCount + 1 } );
								setAttributes( { tabCount: tabCount + 1 } );
								insertTab( newBlock );
								//wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, clientId );
								const newtabs = titles;
								newtabs.push( {
									text: sprintf( __( 'Tab %d', 'kadence-blocks' ), tabCount + 1 ),
									icon: titles[ 0 ].icon,
									iconSide: titles[ 0 ].iconSide,
									onlyIcon: titles[ 0 ].onlyIcon,
									subText: '',
								} );
								setAttributes( { titles: newtabs } );
								saveArrayUpdate( { iconSide: titles[ 0 ].iconSide }, 0 );
							} }
							label={  __( 'Add Tab', 'kadence-blocks' ) }
							showTooltip={ true }
						/>
					</ToolbarGroup>
				</BlockControls>
				{ showSettings( 'allSettings', 'kadence/tabs' ) && (
					<InspectorControls>

						<InspectorControlTabs
							panelName={ 'tabs' }
							setActiveTab={( value ) => setActiveTab( value )}
							activeTab={ activeTab }
						/>

						{activeTab === 'general' && (
							<>
								{showSettings('tabLayout', 'kadence/tabs') && (
									<KadencePanelBody panelName={'kb-tab-layout-select'}>
										<SmallResponsiveControl
											label={__('Layout', 'kadence-blocks')}
											desktopChildren={ deskControls }
											tabletChildren={ tabletControls }
											mobileChildren={ mobileControls }
										>
										</SmallResponsiveControl>
									</KadencePanelBody>
								)}
								{!showSettings('tabLayout', 'kadence/tabs') && (
									<KadencePanelBody panelName={'kb-tab-layout'}>
										<h2>{__('Set Initial Open Tab', 'kadence-blocks')}</h2>
										<ButtonGroup aria-label={__('Initial Open Tab', 'kadence-blocks')}>
											{times(tabCount, n => (
												<Button
													key={n + 1}
													className="kt-init-open-tab"
													isSmall
													isPrimary={startTab === n + 1}
													aria-pressed={startTab === n + 1}
													onClick={() => setAttributes({startTab: n + 1})}
												>
													{__('Tab') + ' ' + (n + 1)}
												</Button>
											))}
										</ButtonGroup>
									</KadencePanelBody>
								)}
								{showSettings('tabContent', 'kadence/tabs') && (
									<KadencePanelBody
										title={__('Content Settings', 'kadence-blocks')}
										panelName={'kb-tab-content-settings'}
									>
										<PopColorControl
											label={__('Content Background', 'kadence-blocks')}
											value={(contentBgColor ? contentBgColor : '')}
											default={''}
											onChange={(value) => setAttributes({contentBgColor: value})}
										/>

										<PopColorControl
											label={__('Border Color', 'kadence-blocks')}
											value={(contentBorderColor ? contentBorderColor : '')}
											default={''}
											onChange={(value) => setAttributes({contentBorderColor: value})}
										/>
										<MeasurementControls
											label={__('Border Width (px)', 'kadence-blocks')}
											measurement={contentBorder}
											onChange={(value) => setAttributes({contentBorder: value})}
											min={0}
											max={100}
											step={1}
										/>
										<ResponsiveMeasurementControls
											label={ __( 'Border Radius', 'kadence-blocks' ) }
											value={ contentBorderRadius }
											tabletValue={ tabletContentBorderRadius }
											mobileValue={ mobileContentBorderRadius }
											onChange={ ( value ) => setAttributes( { contentBorderRadius: value } ) }
											onChangeTablet={ ( value ) => setAttributes( { tabletContentBorderRadius: value } ) }
											onChangeMobile={ ( value ) => setAttributes( { mobileContentBorderRadius: value } ) }
											min={ 0 }
											max={ ( contentBorderRadiusUnit === 'em' || contentBorderRadiusUnit === 'rem' ? 24 : 100 ) }
											step={ ( contentBorderRadiusUnit === 'em' || contentBorderRadiusUnit === 'rem' ? 0.1 : 1 ) }
											unit={ contentBorderRadiusUnit }
											units={ [ 'px', 'em', 'rem', '%' ] }
											onUnit={ ( value ) => setAttributes( { contentBorderRadiusUnit: value } ) }
											isBorderRadius={ true }
											allowEmpty={true}
										/>
									</KadencePanelBody>
								)}

							</>
						)}

						{ activeTab === 'style' && (
							<>
								{showSettings('titleColor', 'kadence/tabs') && (
									<KadencePanelBody
										title={__('Tab Title Color Settings', 'kadence-blocks')}
										panelName={'kb-tab-title-color'}
									>
										<TabPanel className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
												  activeClass="active-tab"
												  tabs={[
													  {
														  name: 'normal',
														  title: __('Normal'),
														  className: 'kt-normal-tab',
													  },
													  {
														  name: 'hover',
														  title: __('Hover'),
														  className: 'kt-hover-tab',
													  },
													  {
														  name: 'active',
														  title: __('Active'),
														  className: 'kt-active-tab',
													  },
												  ]}>
											{
												(tab) => {
													let tabout;
													if (tab.name) {
														if ('hover' === tab.name) {
															tabout = hoverSettings;
														} else if ('active' === tab.name) {
															tabout = activeSettings;
														} else {
															tabout = normalSettings;
														}
													}
													return <div className={tab.className}
																key={tab.className}>{tabout}</div>;
												}
											}
										</TabPanel>
									</KadencePanelBody>
								)}
								{showSettings('titleSpacing', 'kadence/tabs') && (
									<KadencePanelBody
										title={__('Tab Title Width/Spacing/Border', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-tab-title-spacing'}
									>
										{ 'vtabs' === previewLayout && (
											<ResponsiveRangeControls
												label={__( 'Tab Title Width', 'kadence-blocks' )}
												value={( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 0 ] ? verticalTabWidth[ 0 ] : '' )}
												onChange={value => {
													setAttributes( { verticalTabWidth: [ value, ( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 1 ] ? verticalTabWidth[ 1 ] : '' ), ( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 2 ] ? verticalTabWidth[ 2 ] : '' ) ] } );
												}}
												tabletValue={( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 1 ] ? verticalTabWidth[ 1 ] : '' )}
												onChangeTablet={( value ) => {
													setAttributes( { verticalTabWidth: [ ( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 0 ] ? verticalTabWidth[ 0 ] : '' ), value, ( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 2 ] ? verticalTabWidth[ 2 ] : '' ) ] } );
												}}
												mobileValue={( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 2 ] ? verticalTabWidth[ 2 ] : '' )}
												onChangeMobile={( value ) => {
													setAttributes( { verticalTabWidth: [ ( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 0 ] ? verticalTabWidth[ 0 ] : '' ), ( undefined !== verticalTabWidth && undefined !== verticalTabWidth[ 1 ] ? verticalTabWidth[ 1 ] : '' ), value ] } );
												}}
												min={0}
												max={( verticalTabWidthUnit === 'px' ? 2000 : 100 )}
												step={1}
												unit={verticalTabWidthUnit ? verticalTabWidthUnit : '%'}
												onUnit={( value ) => {
													setAttributes( { verticalTabWidthUnit: value } );
												}}
												units={[ 'px', '%', 'vw' ]}
											/>
										) }
										{'tabs' === layout && (
											<Fragment>
												<h2>{__('Tab Title Width', 'kadence-blocks')}</h2>
												<TabPanel className="kt-inspect-tabs kt-hover-tabs"
														  activeClass="active-tab"
														  initialTabName={widthType}
														  onSelect={value => setAttributes({widthType: value})}
														  tabs={[
															  {
																  name: 'normal',
																  title: __('Normal'),
																  className: 'kt-normal-tab',
															  },
															  {
																  name: 'percent',
																  title: __('% Width'),
																  className: 'kt-hover-tab',
															  },
														  ]}>
													{
														(tab) => {
															let tabout;
															if (tab.name) {
																if ('percent' === tab.name) {
																	tabout = (
																		<Fragment>
																			<SmallResponsiveControl
																				desktopChildren={ percentDesktopContent }
																				tabletChildren={ percentTabletContent }
																				mobileChildren={ percentMobileContent }
																			>
																			</SmallResponsiveControl>

																			<ResponsiveMeasureRangeControl
																				label={__( 'Title Padding', 'kadence-blocks' )}
																				value={titlePadding}
																				onChange={( value ) => setAttributes( { titlePadding: value } )}
																				tabletValue={tabletTitlePadding}
																				onChangeTablet={( value ) => setAttributes( { tabletTitlePadding: value } )}
																				mobileValue={mobileTitlePadding}
																				onChangeMobile={( value ) => setAttributes( { mobileTitlePadding: value } )}
																				min={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? -2 : -200 )}
																				max={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 12 : 200 )}
																				step={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 0.1 : 1 )}
																				unit={titlePaddingUnit}
																				units={[ 'px', 'em', 'rem' ]}
																				onUnit={( value ) => setAttributes( { titlePaddingUnit: value } )}
																			/>
																			<ResponsiveMeasureRangeControl
																				label={__( 'Title Margin', 'kadence-blocks' )}
																				value={titleMargin}
																				onChange={( value ) => setAttributes( { titleMargin: value } )}
																				tabletValue={tabletTitleMargin}
																				onChangeTablet={( value ) => setAttributes( { tabletTitleMargin: value } )}
																				mobileValue={mobileTitleMargin}
																				onChangeMobile={( value ) => setAttributes( { mobileTitleMargin: value } )}
																				min={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? -2 : -200 )}
																				max={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 12 : 200 )}
																				step={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 0.1 : 1 )}
																				unit={titleMarginUnit}
																				units={[ 'px', 'em', 'rem' ]}
																				onUnit={( value ) => setAttributes( { titleMarginUnit: value } )}
																			/>
																			{ __('Left & right title margins are ignored in % width tabs', 'kadence-blocks') }

																			<br/><br/>
																		</Fragment>
																	);
																} else {
																	tabout = (
																		<Fragment>
																			<ResponsiveMeasureRangeControl
																				label={__( 'Title Padding', 'kadence-blocks' )}
																				value={titlePadding}
																				onChange={( value ) => setAttributes( { titlePadding: value } )}
																				tabletValue={tabletTitlePadding}
																				onChangeTablet={( value ) => setAttributes( { tabletTitlePadding: value } )}
																				mobileValue={mobileTitlePadding}
																				onChangeMobile={( value ) => setAttributes( { mobileTitlePadding: value } )}
																				min={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? -2 : -200 )}
																				max={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 12 : 200 )}
																				step={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 0.1 : 1 )}
																				unit={titlePaddingUnit}
																				units={[ 'px', 'em', 'rem' ]}
																				onUnit={( value ) => setAttributes( { titlePaddingUnit: value } )}
																			/>
																			<ResponsiveMeasureRangeControl
																				label={__( 'Title Margin', 'kadence-blocks' )}
																				value={titleMargin}
																				onChange={( value ) => setAttributes( { titleMargin: value } )}
																				tabletValue={tabletTitleMargin}
																				onChangeTablet={( value ) => setAttributes( { tabletTitleMargin: value } )}
																				mobileValue={mobileTitleMargin}
																				onChangeMobile={( value ) => setAttributes( { mobileTitleMargin: value } )}
																				min={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? -2 : -200 )}
																				max={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 12 : 200 )}
																				step={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 0.1 : 1 )}
																				unit={titleMarginUnit}
																				units={[ 'px', 'em', 'rem' ]}
																				onUnit={( value ) => setAttributes( { titleMarginUnit: value } )}
																			/>
																		</Fragment>
																	);
																}
															}
															return <div className={tab.className}
																		key={tab.className}>{tabout}</div>;
														}
													}
												</TabPanel>
											</Fragment>
										)}
										{'tabs' !== layout && (
											<Fragment>
												<ResponsiveMeasureRangeControl
													label={__( 'Title Padding', 'kadence-blocks' )}
													value={titlePadding}
													onChange={( value ) => setAttributes( { titlePadding: value } )}
													tabletValue={tabletTitlePadding}
													onChangeTablet={( value ) => setAttributes( { tabletTitlePadding: value } )}
													mobileValue={mobileTitlePadding}
													onChangeMobile={( value ) => setAttributes( { mobileTitlePadding: value } )}
													min={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? -2 : -200 )}
													max={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 12 : 200 )}
													step={( titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 0.1 : 1 )}
													unit={titlePaddingUnit}
													units={[ 'px', 'em', 'rem' ]}
													onUnit={( value ) => setAttributes( { titlePaddingUnit: value } )}
												/>
												<ResponsiveMeasureRangeControl
													label={__( 'Title Margin', 'kadence-blocks' )}
													value={titleMargin}
													onChange={( value ) => setAttributes( { titleMargin: value } )}
													tabletValue={tabletTitleMargin}
													onChangeTablet={( value ) => setAttributes( { tabletTitleMargin: value } )}
													mobileValue={mobileTitleMargin}
													onChangeMobile={( value ) => setAttributes( { mobileTitleMargin: value } )}
													min={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? -2 : -200 )}
													max={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 12 : 200 )}
													step={( titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 0.1 : 1 )}
													unit={titleMarginUnit}
													units={[ 'px', 'em', 'rem' ]}
													onUnit={( value ) => setAttributes( { titleMarginUnit: value } )}
												/>
											</Fragment>
										)}
										<MeasurementControls
											label={__('Title Border Width (px)', 'kadence-blocks')}
											measurement={titleBorderWidth}
											control={titleBorderControl}
											onChange={(value) => setAttributes({titleBorderWidth: value})}
											onControl={(value) => setAttributes({titleBorderControl: value})}
											min={0}
											max={20}
											step={1}
										/>
										<ResponsiveMeasurementControls
											label={ __( 'Title Border Radius', 'kadence-blocks' ) }
											value={ titleBorderRadius }
											tabletValue={ tabletTitleBorderRadius }
											mobileValue={ mobileTitleBorderRadius }
											onChange={ ( value ) => setAttributes( { titleBorderRadius: value } ) }
											onChangeTablet={ ( value ) => setAttributes( { tabletTitleBorderRadius: value } ) }
											onChangeMobile={ ( value ) => setAttributes( { mobileTitleBorderRadius: value } ) }
											min={ 0 }
											max={ ( titleBorderRadiusUnit === 'em' || titleBorderRadiusUnit === 'rem' ? 24 : 100 ) }
											step={ ( titleBorderRadiusUnit === 'em' || titleBorderRadiusUnit === 'rem' ? 0.1 : 1 ) }
											unit={ titleBorderRadiusUnit }
											units={ [ 'px', 'em', 'rem', '%' ] }
											onUnit={ ( value ) => setAttributes( { titleBorderRadiusUnit: value } ) }
											isBorderRadius={ true }
											allowEmpty={true}
										/>
									</KadencePanelBody>
								)}
								{showSettings('titleFont', 'kadence/tabs') && (
									<KadencePanelBody
										title={__('Tab Title Font Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-tab-title-font'}
									>
										<TypographyControls
											fontSize={ [ size, tabSize, mobileSize ] }
											onFontSize={(value) => saveFontAttribute( 'size', value )}
											fontSizeType={ sizeType ? sizeType : 'px'}
											onFontSizeType={(value) => setAttributes({sizeType: value})}
											lineHeight={ [ lineHeight, tabLineHeight, mobileLineHeight ] }
											onLineHeight={(value) => saveFontAttribute( 'lineHeight', value )}
											lineHeightType={ lineType ? lineType : 'px' }
											onLineHeightType={(value) => setAttributes({lineType: value})}
											fontFamily={typography}
											onFontFamily={(value) => setAttributes({typography: value})}
											googleFont={googleFont}
											onFontChange={(select) => {
												setAttributes({
													typography: select.value,
													googleFont: select.google,
												});
											}}
											onGoogleFont={(value) => setAttributes({googleFont: value})}
											loadGoogleFont={loadGoogleFont}
											onLoadGoogleFont={(value) => setAttributes({loadGoogleFont: value})}
											fontVariant={fontVariant}
											onFontVariant={(value) => setAttributes({fontVariant: value})}
											fontWeight={fontWeight}
											onFontWeight={(value) => setAttributes({fontWeight: value})}
											fontStyle={fontStyle}
											onFontStyle={(value) => setAttributes({fontStyle: value})}
											fontSubset={fontSubset}
											onFontSubset={(value) => setAttributes({fontSubset: value})}
											textTransform={textTransform}
											onTextTransform={(value) => setAttributes({textTransform: value})}
											letterSpacing={(letterSpacing ? letterSpacing : '')}
											onLetterSpacing={(value) => setAttributes({letterSpacing: value})}
										/>
									</KadencePanelBody>
								)}
								{showSettings('titleIcon', 'kadence/tabs') && (
									<KadencePanelBody
										title={__('Tab Title Icon Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-tab-title-icon'}
									>
										<RangeControl
											label={__('Icon Size', 'kadence-blocks')}
											value={(iSize ? iSize : '')}
											onChange={(value) => setAttributes({iSize: value})}
											min={2}
											max={120}
											step={1}
										/>
										{times(tabCount, n => renderTitleSettings(n))}
									</KadencePanelBody>
								)}
								{showSettings('subtitle', 'kadence/tabs') && (
									<KadencePanelBody
										title={__('Tab Subtitle Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-tab-subtitle-settings'}
									>
										<ToggleControl
											label={__('Show Subtitles?', 'kadence-blocks')}
											checked={(undefined !== enableSubtitle ? enableSubtitle : false)}
											onChange={value => {
												setAttributes({enableSubtitle: value});
											}}
										/>
										{enableSubtitle && (
											<TypographyControls
												fontSize={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].size ? subtitleFont[0].size : ['', '', ''])}
												onFontSize={(value) => saveSubtitleFont({size: value})}
												fontSizeType={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].sizeType ? subtitleFont[0].sizeType : 'px')}
												onFontSizeType={(value) => saveSubtitleFont({sizeType: value})}
												lineHeight={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].lineHeight ? subtitleFont[0].lineHeight : ['', '', ''])}
												onLineHeight={(value) => saveSubtitleFont({lineHeight: value})}
												lineHeightType={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].lineType ? subtitleFont[0].lineType : 'px')}
												onLineHeightType={(value) => saveSubtitleFont({lineType: value})}
												letterSpacing={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].letterSpacing ? subtitleFont[0].letterSpacing : '')}
												onLetterSpacing={(value) => saveSubtitleFont({letterSpacing: value})}
												fontFamily={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].family ? subtitleFont[0].family : '')}
												onFontFamily={(value) => saveSubtitleFont({family: value})}
												onFontChange={(select) => {
													saveSubtitleFont({
														family: select.value,
														google: select.google,
													});
												}}
												onFontArrayChange={(values) => saveSubtitleFont(values)}
												googleFont={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].google ? subtitleFont[0].google : false)}
												onGoogleFont={(value) => saveSubtitleFont({google: value})}
												loadGoogleFont={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].loadGoogle ? subtitleFont[0].loadGoogle : true)}
												onLoadGoogleFont={(value) => saveSubtitleFont({loadGoogle: value})}
												fontVariant={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].variant ? subtitleFont[0].variant : '')}
												onFontVariant={(value) => saveSubtitleFont({variant: value})}
												fontWeight={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].weight ? subtitleFont[0].weight : '')}
												onFontWeight={(value) => saveSubtitleFont({weight: value})}
												fontStyle={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].style ? subtitleFont[0].style : '')}
												onFontStyle={(value) => saveSubtitleFont({style: value})}
												fontSubset={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].subset ? subtitleFont[0].subset : '')}
												onFontSubset={(value) => saveSubtitleFont({subset: value})}
												textTransform={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].textTransform ? subtitleFont[0].textTransform : '')}
												onTextTransform={(value) => saveSubtitleFont({textTransform: value})}
												padding={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].padding ? subtitleFont[0].padding : [0, 0, 0, 0])}
												onPadding={(value) => saveSubtitleFont({padding: value})}
												paddingControl={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].paddingControl ? subtitleFont[0].paddingControl : 'linked')}
												onPaddingControl={(value) => saveSubtitleFont({paddingControl: value})}
												margin={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].margin ? subtitleFont[0].margin : [0, 0, 0, 0])}
												onMargin={(value) => saveSubtitleFont({margin: value})}
												marginControl={(subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].marginControl ? subtitleFont[0].marginControl : 'linked')}
												onMarginControl={(value) => saveSubtitleFont({marginControl: value})}
											/>
										)}
									</KadencePanelBody>
								)}
								{showSettings('titleAnchor', 'kadence/tabs') && (
									<KadencePanelBody
										title={__('Tab Anchor Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-tab-anchor-settings'}
									>
										{times(tabCount, n => renderAnchorSettings(n))}
									</KadencePanelBody>
								)}
							</>
						)}

						{ activeTab === 'advanced' && (
							<>
								<KadencePanelBody panelName={'kb-tabs-spacing-settings'}>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={innerPadding}
										onChange={(value) => setAttributes({innerPadding: value})}
										tabletValue={tabletInnerPadding}
										onChangeTablet={(value) => setAttributes({tabletInnerPadding: value})}
										mobileValue={mobileInnerPadding}
										onChangeMobile={(value) => setAttributes({mobileInnerPadding: value})}
										min={0}
										max={(innerPaddingType === 'em' || innerPaddingType === 'rem' ? 12 : 200)}
										step={(innerPaddingType === 'em' || innerPaddingType === 'rem' ? 0.1 : 1)}
										unit={innerPaddingType}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({innerPaddingType: value})}
									/>

									{showSettings('structure', 'kadence/tabs') && (
										<>
											<RangeControl
												label={__('Content Minimum Height', 'kadence-blocks')}
												value={minHeight}
												onChange={(value) => {
													setAttributes({
														minHeight: value,
													});
												}}
												min={0}
												max={1000}
											/>
											<RangeControl
												label={__('Max Width', 'kadence-blocks')}
												value={maxWidth}
												onChange={(value) => {
													setAttributes({
														maxWidth: value,
													});
												}}
												min={0}
												max={2000}
											/>
										</>
									)}

								</KadencePanelBody>

								<div className="kt-sidebar-settings-spacer"></div>

								<KadenceBlockDefaults
									attributes={attributes}
									defaultAttributes={metadata['attributes']}
									blockSlug={metadata['name']}
									excludedAttrs={nonTransAttrs}
									preventMultiple={['titles']}
								/>

							</>
						)}

					</InspectorControls>
				) }
				<div className={ classes } >
					{ showPreset && (
						<div className="kt-select-starter-style-tabs">
							<div className="kt-select-starter-style-tabs-title">
								{ __( 'Select Initial Style' ) }
							</div>
							<ButtonGroup className="kt-init-tabs-btn-group" aria-label={ __( 'Initial Style', 'kadence-blocks' ) }>
								{ map( startlayoutOptions, ( { name, key, icon } ) => (
									<Button
										key={ key }
										className="kt-inital-tabs-style-btn"
										isSmall
										onClick={ () => {
											setInitalLayout( key );
											setShowPreset( false );
										} }
									>
										{ icon }
									</Button>
								) ) }
							</ButtonGroup>
						</div>
					) }
					{ ! showPreset && (
						<div className="kt-tabs-wrap" style={ {
							maxWidth: maxWidth + 'px',
						} }>
							{/* <div className="kb-add-new-tab-contain">
								<Button
									className="kt-tab-add"
									isPrimary={ true }
									onClick={ () => {
										const newBlock = createBlock( 'kadence/tab', { id: tabCount + 1 } );
										setAttributes( { tabCount: tabCount + 1 } );
										insertTab( newBlock );
										//wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, clientId );
										const newtabs = titles;
										newtabs.push( {
											text: sprintf( __( 'Tab %d', 'kadence-blocks' ), tabCount + 1 ),
											icon: titles[ 0 ].icon,
											iconSide: titles[ 0 ].iconSide,
											onlyIcon: titles[ 0 ].onlyIcon,
											subText: '',
										} );
										setAttributes( { titles: newtabs } );
										saveArrayUpdate( { iconSide: titles[ 0 ].iconSide }, 0 );
									} }
								>
									<Dashicon icon="plus" />
									{ __( 'Add Tab', 'kadence-blocks' ) }
								</Button>
							</div> */}
							<ul className={ `kt-tabs-title-list${ ( 'tabs' === layout && widthType === 'percent' ? ' kb-tabs-list-columns kb-tab-title-columns-' + tabWidth[ 0 ] : '' ) }` } style={{
								width: 'vtabs' === previewLayout ? previewVerticalTabWidth + previewVerticalTabWidthUnit : undefined,
							}}>
								{ renderPreviewArray }
							</ul>
							{ googleFont && (
								<WebfontLoader config={ config }>
								</WebfontLoader>
							) }
							{ enableSubtitle && subtitleFont && subtitleFont[ 0 ] && subtitleFont[ 0 ].google && (
								<WebfontLoader config={ sconfig }>
								</WebfontLoader>
							) }
							<div className="kt-tabs-content-wrap" style={ {
								paddingTop: getSpacingOptionOutput( previewInnerPaddingTop, innerPaddingType ),
								paddingBottom: getSpacingOptionOutput( previewInnerPaddingBottom, innerPaddingType ),
								paddingLeft: getSpacingOptionOutput( previewInnerPaddingLeft, innerPaddingType ),
								paddingRight: getSpacingOptionOutput( previewInnerPaddingRight, innerPaddingType ),
								borderWidth: ( contentBorder ? contentBorder[ 0 ] + 'px ' + contentBorder[ 1 ] + 'px ' + contentBorder[ 2 ] + 'px ' + contentBorder[ 3 ] + 'px' : '' ),
								borderTopLeftRadius: previewContentRadiusTop + contentBorderRadiusUnit,
								borderTopRightRadius: previewContentRadiusRight + contentBorderRadiusUnit,
								borderBottomRightRadius: previewContentRadiusBottom + contentBorderRadiusUnit,
								borderBottomLeftRadius: previewContentRadiusLeft + contentBorderRadiusUnit,
								minHeight: minHeight + 'px',
								backgroundColor: KadenceColorOutput( contentBgColor ),
								borderColor: KadenceColorOutput( contentBorderColor ),
							} }>
								<InnerBlocks
									template={ getPanesTemplate( tabCount ) }
									templateLock="all"
									allowedBlocks={ ALLOWED_BLOCKS } />
							</div>
						</div>
					) }
				</div>
			</div>
		);
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			getBlock,
			getBlockOrder,
		} = select( 'core/block-editor' );
		const block = getBlock( clientId );
		return {
			tabsBlock: block,
			realTabsCount: block.innerBlocks.length,
			tabsInner: getBlockOrder( clientId ),
			previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
	withDispatch( ( dispatch, { clientId }, { select } ) => {
		const {
			getBlock,
			getBlocks,
		} = select( 'core/block-editor' );
		const {
			moveBlockToPosition,
			updateBlockAttributes,
			insertBlock,
			replaceInnerBlocks,
		} = dispatch( 'core/block-editor' );
		const block = getBlock( clientId );
		const innerBlocks = getBlocks( clientId );
		return {
			resetOrder() {
				times( block.innerBlocks.length, n => {
					updateBlockAttributes( block.innerBlocks[ n ].clientId, {
						id: n + 1,
					} );
				} );
			},
			moveTab( tabId, newIndex ) {
				innerBlocks.splice( newIndex, 0, innerBlocks.splice( tabId, 1 )[0] );
				replaceInnerBlocks( clientId, innerBlocks );
			},
			insertTab( newBlock ) {
				insertBlock( newBlock, parseInt( block.innerBlocks.length ), clientId );
			},
			removeTab( tabId ) {
				innerBlocks.splice( tabId, 1 );
				replaceInnerBlocks( clientId, innerBlocks );
			},
		};
	} ),
] )( KadenceTabs );
