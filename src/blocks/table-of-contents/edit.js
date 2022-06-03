/**
 * BLOCK: Kadence TOC
 */

/**
 * Import External
 */
import { isEqual, map } from 'lodash';
import classnames from 'classnames';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
} from '@kadence/helpers';
import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	MeasurementControls,
	KadenceRange,
	WebfontLoader,
	BoxShadowControl,
	ResponsiveRangeControl,
	KadencePanelBody
} from '@kadence/components';

/**
 * Import Icons
 */
import {
	noneIcon,
	oneColumnIcon,
	threeColumnIcon,
	twoColumnIcon,
	bulletsIcon,
	numberedIcon,
	radiusLinkedIcon,
	radiusIndividualIcon,
	topLeftIcon,
	topRightIcon,
	bottomLeftIcon,
	bottomRightIcon,
} from '@kadence/icons';

/**
 * Internal dependencies
 */
import TableOfContentsList from './list';
import { getHeadingsFromContent, linearToNestedHeadingList } from './utils';

const { ENTER } = wp.keycodes;
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import { Component, Fragment, useState, useEffect, useLayoutEffect } from '@wordpress/element';

import {
	InspectorControls,
	RichText,
	BlockControls,
} from '@wordpress/block-editor';

import {
	ToolbarGroup,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

import {
	applyFilters,
} from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbtableUniqueIDs = [];

/**
 * Build the row edit
 */
function KadenceTableOfContents( { attributes, setAttributes, clientId, className, getPreviewDevice, isSelected, pageIndex, postContent, blockOrder, isTyping } ) {

	const {
		uniqueID,
		allowedHeaders,
		columns,
		listStyle,
		listGap,
		title,
		enableTitle,
		titleColor,
		titleSize,
		titleSizeType,
		titleLineHeight,
		titleLineType,
		titleLetterSpacing,
		titleTypography,
		titleGoogleFont,
		titleLoadGoogleFont,
		titleFontSubset,
		titleFontVariant,
		titleFontWeight,
		titleFontStyle,
		titlePadding,
		titleBorder,
		titleBorderColor,
		titleCollapseBorderColor,
		titleTextTransform,
		contentColor,
		contentHoverColor,
		contentSize,
		contentSizeType,
		contentLineHeight,
		contentLineType,
		contentLetterSpacing,
		contentTypography,
		contentGoogleFont,
		contentLoadGoogleFont,
		contentFontSubset,
		contentFontVariant,
		contentFontWeight,
		contentFontStyle,
		contentMargin,
		contentTextTransform,
		containerPadding,
		containerBorder,
		containerBorderColor,
		containerBackground,
		enableToggle,
		startClosed,
		toggleIcon,
		linkStyle,
		borderRadius,
		shadow,
		displayShadow,
		maxWidth,
		smoothScrollOffset,
		enableSmoothScroll,
		containerMobileMargin,
		containerTabletMargin,
		containerMargin,
		enableScrollSpy,
		contentActiveColor,
		enableDynamicSearch,
		enableTitleToggle,
		containerMarginUnit,
	} = attributes;

	const [ headings, setHeadings ] = useState( [] );
	const [ showContent, setShowContent ] = useState( true );
	const [ titlePaddingControl, setTitlePaddingControl ] = useState( 'linked' );
	const [ titleBorderControl, setTitleBorderControl ] = useState( 'linked' );
	const [ contentMarginControl, setContentMarginControl ] = useState( 'individual' );
	const [ containerBorderControl, setContainerBorderControl ] = useState( 'linked' );
	const [ containerPaddingControl, setContainerPaddingControl ] = useState( 'linked' );
	const [ borderRadiusControl, setBorderRadiusControl ] = useState( 'linked' );
	const [ containerMarginControl, setContainerMarginControl ] = useState( 'linked' );
	const [ containerTabletMarginControl, setContainerTabletMarginControl ] = useState( 'linked' );
	const [ containerMobileMarginControl, setContainerMobileMarginControl ] = useState( 'linked' );
	const [ user, setUser ] = useState( ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ) );

	useEffect( () => {
		if ( !uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/table-of-contents' ] !== undefined && typeof blockConfigObject[ 'kadence/table-of-contents' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/table-of-contents' ] ).map( ( attribute ) => {
					attributes[ attribute ] = blockConfigObject[ 'kadence/table-of-contents' ][ attribute ];
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kbtableUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( kbtableUniqueIDs.includes( uniqueID ) ) {
			uniqueID = '_' + clientId.substr( 2, 9 );
			kbtableUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			kbtableUniqueIDs.push( uniqueID );
		}
		if ( undefined !== titlePadding && undefined !== titlePadding[ 0 ] && titlePadding[ 0 ] === titlePadding[ 1 ] && titlePadding[ 0 ] === titlePadding[ 2 ] && titlePadding[ 0 ] === titlePadding[ 3 ] ) {
			setTitlePaddingControl( 'linked' );
		} else {
			setTitlePaddingControl( 'individual' );
		}
		if ( undefined !== titleBorder && undefined !== titleBorder[ 0 ] && titleBorder[ 0 ] === titleBorder[ 1 ] && titleBorder[ 0 ] === titleBorder[ 2 ] && titleBorder[ 0 ] === titleBorder[ 3 ] ) {
			setTitleBorderControl( 'linked' );
		} else {
			setTitleBorderControl( 'individual' );
		}
		if ( undefined !== containerBorder && undefined !== containerBorder[ 0 ] && containerBorder[ 0 ] === containerBorder[ 1 ] && containerBorder[ 0 ] === containerBorder[ 2 ] && containerBorder[ 0 ] === containerBorder[ 3 ] ) {
			setContainerBorderControl( 'linked' );
		} else {
			setContainerBorderControl( 'individual' );
		}
		if ( undefined !== containerPadding && undefined !== containerPadding[ 0 ] && containerPadding[ 0 ] === containerPadding[ 1 ] && containerPadding[ 0 ] === containerPadding[ 2 ] && containerPadding[ 0 ] === containerPadding[ 3 ] ) {
			setContainerPaddingControl( 'linked' );
		} else {
			setContainerPaddingControl( 'individual' );
		}
		if ( undefined !== contentMargin && undefined !== contentMargin[ 0 ] && contentMargin[ 0 ] === contentMargin[ 1 ] && contentMargin[ 0 ] === contentMargin[ 2 ] && contentMargin[ 0 ] === contentMargin[ 3 ] ) {
			setContentMarginControl( 'linked' );
		} else {
			setContentMarginControl( 'individual' );
		}
		if ( borderRadius && borderRadius[ 0 ] === borderRadius[ 1 ] && borderRadius[ 0 ] === borderRadius[ 2 ] && borderRadius[ 0 ] === borderRadius[ 3 ] ) {
			setBorderRadiusControl( 'linked' );
		} else {
			setBorderRadiusControl( 'individual' );
		}
		if ( containerMargin && containerMargin[ 0 ] === containerMargin[ 1 ] && containerMargin[ 0 ] === containerMargin[ 2 ] && containerMargin[ 0 ] === containerMargin[ 3 ] ) {
			setContainerMarginControl( 'linked' );
		} else {
			setContainerMarginControl( 'individual' );
		}
		if ( containerTabletMargin && containerTabletMargin[ 0 ] === containerTabletMargin[ 1 ] && containerTabletMargin[ 0 ] === containerTabletMargin[ 2 ] && containerTabletMargin[ 0 ] === containerTabletMargin[ 3 ] ) {
			setContainerTabletMarginControl( 'linked' );
		} else {
			setContainerTabletMarginControl( 'individual' );
		}
		if ( containerMobileMargin && containerMobileMargin[ 0 ] === containerMobileMargin[ 1 ] && containerMobileMargin[ 0 ] === containerMobileMargin[ 2 ] && containerMobileMargin[ 0 ] === containerMobileMargin[ 3 ] ) {
			setContainerMobileMarginControl( 'linked' );
		} else {
			setContainerMobileMarginControl( 'individual' );
		}
		if ( undefined !== startClosed && startClosed ) {
			setShowContent( false );
		}

	}, [] );

	useLayoutEffect( () => {
		let latestHeadings;
		const onlyIncludeCurrentPage = true;
		if ( onlyIncludeCurrentPage ) {
			const pagesOfContent = postContent.split( '<!--nextpage-->' );
			latestHeadings = getHeadingsFromContent(
				pagesOfContent[ pageIndex - 1 ],
				attributes,
			);
		} else {
			latestHeadings = getHeadingsFromContent( postContent, attributes );
		}
		if ( !isEqual( headings, latestHeadings ) ) {
			setHeadings( latestHeadings );
		}
	}, [ isTyping, blockOrder ] );


	const saveShadow = ( value ) => {
		const newItems = shadow.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			shadow: newItems,
		} );
	};

	const onToggle = () => {
		if ( enableToggle ) {
			setShowContent( !showContent );
		}
	};
	const gconfig = {
		google: {
			families: [ titleTypography + ( titleFontVariant ? ':' + titleFontVariant : '' ) ],
		},
	};
	const config = ( titleGoogleFont ? gconfig : '' );
	const cgconfig = {
		google: {
			families: [ contentTypography + ( contentFontVariant ? ':' + contentFontVariant : '' ) ],
		},
	};
	const cconfig = ( contentGoogleFont ? cgconfig : '' );
	const tableOfContentIconSet = [];
	tableOfContentIconSet.arrow = <Fragment>
		<g fill="#444">
			<path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z"/>
			<path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z"/>
		</g>
		<g fill="#444">
			<path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z"/>
			<path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z"/>
		</g>
	</Fragment>;
	tableOfContentIconSet.arrowcircle = <Fragment>
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
	</Fragment>;
	tableOfContentIconSet.basic = <Fragment>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
	</Fragment>;
	tableOfContentIconSet.basiccircle = <Fragment>
		<circle cx="83.723" cy="50" r="50" fill="#444"/>
		<circle cx="322.768" cy="50" r="50" fill="#444"/>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
	</Fragment>;
	tableOfContentIconSet.xclose = <Fragment>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444"/>
		<path d="M353.5,28.432l-9.887,-9.887l-53.023,53.023l9.887,9.887l53.023,-53.023Z" fill="#444"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#444"/>
	</Fragment>;
	tableOfContentIconSet.xclosecircle = <Fragment>
		<circle cx="83.723" cy="50" r="50" fill="#444"/>
		<circle cx="322.768" cy="50" r="50" fill="#444"/>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff"/>
		<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#fff"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M290.59,71.568l9.887,9.887l53.023,-53.023l-9.887,-9.887l-53.023,53.023Z" fill="#fff"/>
	</Fragment>;

	const renderIconSet = svg => (
		<svg className="accord-icon" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round"
			 strokeMiterlimit="1.414" style={{ fill: '#000000' }}>
			{tableOfContentIconSet[ svg ]}
		</svg>
	);
	const saveAllowedHeaders = ( value ) => {
		const newUpdate = allowedHeaders.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			allowedHeaders: newUpdate,
		} );
	};
	const columnOptions = [
		[
			{
				icon    : oneColumnIcon,
				title   : __( 'One Column', 'kadence-blocks' ),
				isActive: ( 1 === columns ? true : false ),
				onClick : () => setAttributes( { columns: 1 } ),
			},
		],
		[
			{
				icon    : twoColumnIcon,
				title   : __( 'Two columns', 'kadence-blocks' ),
				isActive: ( 2 === columns ? true : false ),
				onClick : () => setAttributes( { columns: 2 } ),
			},
		],
		[
			{
				icon    : threeColumnIcon,
				title   : __( 'Three Columns', 'kadence-blocks' ),
				isActive: ( 3 === columns ? true : false ),
				onClick : () => setAttributes( { columns: 3 } ),
			},
		],
	];
	const listOptions = [
		[
			{
				icon    : bulletsIcon,
				title   : __( 'Bullets', 'kadence-blocks' ),
				isActive: ( 'disc' === listStyle ? true : false ),
				onClick : () => setAttributes( { listStyle: 'disc' } ),
			},
		],
		[
			{
				icon    : numberedIcon,
				title   : __( 'Numbered', 'kadence-blocks' ),
				isActive: ( 'numbered' === listStyle ? true : false ),
				onClick : () => setAttributes( { listStyle: 'numbered' } ),
			},
		],
		[
			{
				icon    : noneIcon,
				title   : __( 'None', 'kadence-blocks' ),
				isActive: ( 'none' === listStyle ? true : false ),
				onClick : () => setAttributes( { listStyle: 'none' } ),
			},
		],
	];
	const previewContentSize = getPreviewSize( getPreviewDevice, ( undefined !== contentSize && undefined !== contentSize[ 0 ] ? contentSize[ 0 ] : '' ), ( undefined !== contentSize && undefined !== contentSize[ 1 ] ? contentSize[ 1 ] : '' ), ( undefined !== contentSize && undefined !== contentSize[ 2 ] ? contentSize[ 2 ] : '' ) );
	const previewContentHeight = getPreviewSize( getPreviewDevice, ( undefined !== contentLineHeight && undefined !== contentLineHeight[ 0 ] ? contentLineHeight[ 0 ] : '' ), ( undefined !== contentLineHeight && undefined !== contentLineHeight[ 1 ] ? contentLineHeight[ 1 ] : '' ), ( undefined !== contentLineHeight && undefined !== contentLineHeight[ 2 ] ? contentLineHeight[ 2 ] : '' ) );

	const previewListGap = getPreviewSize( getPreviewDevice, ( undefined !== listGap && undefined !== listGap[ 0 ] ? listGap[ 0 ] : '' ), ( undefined !== listGap && undefined !== listGap[ 1 ] ? listGap[ 1 ] : '' ), ( undefined !== listGap && undefined !== listGap[ 2 ] ? listGap[ 2 ] : '' ) );

	const previewMarginTop = getPreviewSize( getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[ 0 ] ? containerMargin[ 0 ] : '' ), ( undefined !== containerTabletMargin && undefined !== containerTabletMargin[ 0 ] ? containerTabletMargin[ 0 ] : '' ), ( undefined !== containerMobileMargin && undefined !== containerMobileMargin[ 0 ] ? containerMobileMargin[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[ 1 ] ? containerMargin[ 1 ] : '' ), ( undefined !== containerTabletMargin && undefined !== containerTabletMargin[ 1 ] ? containerTabletMargin[ 1 ] : '' ), ( undefined !== containerMobileMargin && undefined !== containerMobileMargin[ 1 ] ? containerMobileMargin[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[ 2 ] ? containerMargin[ 2 ] : '' ), ( undefined !== containerTabletMargin && undefined !== containerTabletMargin[ 2 ] ? containerTabletMargin[ 2 ] : '' ), ( undefined !== containerMobileMargin && undefined !== containerMobileMargin[ 2 ] ? containerMobileMargin[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[ 3 ] ? containerMargin[ 3 ] : '' ), ( undefined !== containerTabletMargin && undefined !== containerTabletMargin[ 3 ] ? containerTabletMargin[ 3 ] : '' ), ( undefined !== containerMobileMargin && undefined !== containerMobileMargin[ 3 ] ? containerMobileMargin[ 3 ] : '' ) );
	const previewMarginUnit = ( containerMarginUnit ? containerMarginUnit : 'px' );
	const classes = classnames( className, `kb-table-of-content-nav kb-table-of-content-id${uniqueID}` );
	const renderCSS = (
		<style>
			{`.kb-table-of-content-id${uniqueID} .kb-table-of-content-list li {
					margin-bottom: ${( previewListGap ? previewListGap + 'px' : 'auto' )};
				}
				.kb-table-of-content-id${uniqueID} .kb-table-of-content-list li .kb-table-of-contents-list-sub {
					margin-top: ${( previewListGap ? previewListGap + 'px' : 'auto' )};
				}
				.kb-table-of-content-id${uniqueID} .kb-table-of-contents__entry:hover {
					color: ${KadenceColorOutput( contentHoverColor )} !important;
				}
				.kb-table-of-content-id${uniqueID} .kb-table-of-contents-title-wrap.kb-toc-toggle-hidden {
					border-color: ${KadenceColorOutput( titleCollapseBorderColor )} !important;
				}
				.kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-basiccircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-basiccircle .kb-table-of-contents-icon-trigger:before, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-arrowcircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-arrowcircle .kb-table-of-contents-icon-trigger:before, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-xclosecircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-xclosecircle .kb-table-of-contents-icon-trigger:before {
					background-color: ${KadenceColorOutput( containerBackground )} !important;
				}`}
		</style>
	);
	const blockControls = (
		<BlockControls>
			<ToolbarGroup
				isCollapsed={false}
				label={__( 'Columns', 'kadence-blocks' )}
				controls={columnOptions}
			/>
			<ToolbarGroup
				isCollapsed={false}
				label={__( 'List Style', 'kadence-blocks' )}
				controls={listOptions}
			/>
		</BlockControls>
	);
	const inspectorControls = (
		<>
			{showSettings( 'allSettings', 'kadence/table-of-contents' ) && (
				<InspectorControls>
					{showSettings( 'container', 'kadence/table-of-contents' ) && (
						<KadencePanelBody
							title={__( 'Allowed Headers', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-toc-allowed-headers'}
						>
							<ToggleControl
								label={'h1'}
								checked={undefined !== allowedHeaders && undefined !== allowedHeaders[ 0 ] && undefined !== allowedHeaders[ 0 ].h1 ? allowedHeaders[ 0 ].h1 : true}
								onChange={value => saveAllowedHeaders( { h1: value } )}
							/>
							<ToggleControl
								label={'h2'}
								checked={undefined !== allowedHeaders && undefined !== allowedHeaders[ 0 ] && undefined !== allowedHeaders[ 0 ].h2 ? allowedHeaders[ 0 ].h2 : true}
								onChange={value => saveAllowedHeaders( { h2: value } )}
							/>
							<ToggleControl
								label={'h3'}
								checked={undefined !== allowedHeaders && undefined !== allowedHeaders[ 0 ] && undefined !== allowedHeaders[ 0 ].h3 ? allowedHeaders[ 0 ].h3 : true}
								onChange={value => saveAllowedHeaders( { h3: value } )}
							/>
							<ToggleControl
								label={'h4'}
								checked={undefined !== allowedHeaders && undefined !== allowedHeaders[ 0 ] && undefined !== allowedHeaders[ 0 ].h4 ? allowedHeaders[ 0 ].h4 : true}
								onChange={value => saveAllowedHeaders( { h4: value } )}
							/>
							<ToggleControl
								label={'h5'}
								checked={undefined !== allowedHeaders && undefined !== allowedHeaders[ 0 ] && undefined !== allowedHeaders[ 0 ].h5 ? allowedHeaders[ 0 ].h5 : true}
								onChange={value => saveAllowedHeaders( { h5: value } )}
							/>
							<ToggleControl
								label={'h6'}
								checked={undefined !== allowedHeaders && undefined !== allowedHeaders[ 0 ] && undefined !== allowedHeaders[ 0 ].h6 ? allowedHeaders[ 0 ].h6 : true}
								onChange={value => saveAllowedHeaders( { h6: value } )}
							/>
						</KadencePanelBody>
					)}
					{showSettings( 'title', 'kadence/table-of-contents' ) && (
						<KadencePanelBody
							title={__( 'Title Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-toc-title-settings'}
						>
							<ToggleControl
								label={__( 'Enable Title', 'kadence-blocks' )}
								checked={enableTitle}
								onChange={value => setAttributes( { enableTitle: value } )}
							/>
							{enableTitle && (
								<>
									<PopColorControl
										label={__( 'Title Color', 'kadence-blocks' )}
										value={( titleColor ? titleColor : '' )}
										default={''}
										onChange={( value ) => setAttributes( { titleColor: value } )}
									/>
									<TypographyControls
										fontSize={titleSize}
										onFontSize={( value ) => setAttributes( { titleSize: value } )}
										fontSizeType={titleSizeType}
										onFontSizeType={( value ) => setAttributes( { titleSizeType: value } )}
										lineHeight={titleLineHeight}
										onLineHeight={( value ) => setAttributes( { titleLineHeight: value } )}
										lineHeightType={titleLineType}
										onLineHeightType={( value ) => setAttributes( { titleLineType: value } )}
										letterSpacing={titleLetterSpacing}
										onLetterSpacing={( value ) => setAttributes( { titleLetterSpacing: value } )}
										fontFamily={titleTypography}
										onFontFamily={( value ) => setAttributes( { titleTypography: value } )}
										onFontChange={( select ) => {
											setAttributes( {
												titleTypography: select.value,
												titleGoogleFont: select.google,
											} );
										}}
										googleFont={titleGoogleFont}
										onGoogleFont={( value ) => setAttributes( { titleGoogleFont: value } )}
										loadGoogleFont={titleLoadGoogleFont}
										onLoadGoogleFont={( value ) => setAttributes( { titleLoadGoogleFont: value } )}
										fontVariant={titleFontVariant}
										onFontVariant={( value ) => setAttributes( { titleFontVariant: value } )}
										fontWeight={titleFontWeight}
										onFontWeight={( value ) => setAttributes( { titleFontWeight: value } )}
										fontStyle={titleFontStyle}
										onFontStyle={( value ) => setAttributes( { titleFontStyle: value } )}
										fontSubset={titleFontSubset}
										onFontSubset={( value ) => setAttributes( { titleFontSubset: value } )}
										padding={titlePadding}
										onPadding={( value ) => setAttributes( { titlePadding: value } )}
										paddingControl={titlePaddingControl}
										onPaddingControl={( value ) => setTitlePaddingControl( value )}
										textTransform={titleTextTransform}
										onTextTransform={( value ) => setAttributes( { titleTextTransform: value } )}
									/>
									<MeasurementControls
										label={__( 'Title Border Width (px)', 'kadence-blocks' )}
										measurement={titleBorder}
										control={titleBorderControl}
										onChange={( value ) => setAttributes( { titleBorder: value } )}
										onControl={( value ) => setTitleBorderControl( value )}
										min={0}
										max={100}
										step={1}
									/>
									<PopColorControl
										label={__( 'Title Border Color', 'kadence-blocks' )}
										swatchLabel={__( 'Normal Color', 'kadence-blocks' )}
										value={( titleBorderColor ? titleBorderColor : '' )}
										default={''}
										onChange={( value ) => setAttributes( { titleBorderColor: value } )}
										swatchLabel2={__( 'Collapsed Color', 'kadence-blocks' )}
										value2={( titleCollapseBorderColor ? titleCollapseBorderColor : '' )}
										default2={''}
										onChange2={( value ) => setAttributes( { titleCollapseBorderColor: value } )}
									/>
								</>
							)}
						</KadencePanelBody>
					)}
					{showSettings( 'collapse', 'kadence/table-of-contents' ) && (
						<>
							{enableTitle && (
								<KadencePanelBody
									title={__( 'Collapsible Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-toc-collapsible-settings'}
								>
									<ToggleControl
										label={__( 'Enable Collapsible Content', 'kadence-blocks' )}
										checked={enableToggle}
										onChange={value => setAttributes( { enableToggle: value } )}
									/>
									{enableTitle && (
										<Fragment>
											<ToggleControl
												label={__( 'Start Collapsed', 'kadence-blocks' )}
												checked={startClosed}
												onChange={value => setAttributes( { startClosed: value } )}
											/>
											<h2>{__( 'Icon Style', 'kadence-blocks' )}</h2>
											<FontIconPicker
												icons={[
													'arrow',
													'arrowcircle',
													'basic',
													'basiccircle',
													'xclose',
													'xclosecircle',
												]}
												value={toggleIcon}
												onChange={value => setAttributes( { toggleIcon: value } )}
												appendTo="body"
												renderFunc={renderIconSet}
												theme="accordion"
												showSearch={false}
												noSelectedPlaceholder={__( 'Select Icon Set', 'kadence-blocks' )}
												isMulti={false}
											/>
											<ToggleControl
												label={__( 'Enable title to toggle as well as icon', 'kadence-blocks' )}
												checked={enableTitleToggle}
												onChange={value => setAttributes( { enableTitleToggle: value } )}
											/>
										</Fragment>
									)}
								</KadencePanelBody>
							)}
						</>
					)}
					{showSettings( 'content', 'kadence/table-of-contents' ) && (
						<KadencePanelBody
							title={__( 'List Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-toc-list-settings'}
						>
							<ResponsiveRangeControl
								label={__( 'List Item Gap', 'kadence-blocks' )}
								value={listGap && listGap[ 0 ] ? listGap[ 0 ] : ''}
								mobileValue={listGap && listGap[ 2 ] ? listGap[ 2 ] : ''}
								tabletValue={listGap && listGap[ 1 ] ? listGap[ 1 ] : ''}
								onChange={( value ) => setAttributes( { listGap: [ value, ( listGap && listGap[ 1 ] ? listGap[ 1 ] : '' ), ( listGap && listGap[ 2 ] ? listGap[ 2 ] : '' ) ] } )}
								onChangeTablet={( value ) => setAttributes( { listGap: [ ( listGap && listGap[ 0 ] ? listGap[ 0 ] : '' ), value, ( listGap && listGap[ 2 ] ? listGap[ 2 ] : '' ) ] } )}
								onChangeMobile={( value ) => setAttributes( { listGap: [ ( listGap && listGap[ 0 ] ? listGap[ 0 ] : '' ), ( listGap && listGap[ 1 ] ? listGap[ 1 ] : '' ), value ] } )}
								min={0}
								max={60}
								step={1}
							/>
							<PopColorControl
								label={__( 'List Items Color', 'kadence-blocks' )}
								swatchLabel={__( 'Normal Color', 'kadence-blocks' )}
								value={( contentColor ? contentColor : '' )}
								default={''}
								onChange={( value ) => setAttributes( { contentColor: value } )}
								swatchLabel2={__( 'Hover Color', 'kadence-blocks' )}
								value2={( contentHoverColor ? contentHoverColor : '' )}
								default2={''}
								onChange2={( value ) => setAttributes( { contentHoverColor: value } )}
							/>
							<SelectControl
								label={__( 'List Link Style', 'kadence-blocks' )}
								value={linkStyle}
								options={[
									{ value: 'underline', label: __( 'Underline' ) },
									{ value: 'underline_hover', label: __( 'Underline on Hover' ) },
									{ value: 'plain', label: __( 'No underline' ) },
								]}
								onChange={value => setAttributes( { linkStyle: value } )}
							/>
							<TypographyControls
								fontSize={contentSize}
								onFontSize={( value ) => setAttributes( { contentSize: value } )}
								fontSizeType={contentSizeType}
								onFontSizeType={( value ) => setAttributes( { contentSizeType: value } )}
								lineHeight={contentLineHeight}
								onLineHeight={( value ) => setAttributes( { contentLineHeight: value } )}
								lineHeightType={contentLineType}
								onLineHeightType={( value ) => setAttributes( { contentLineType: value } )}
								letterSpacing={contentLetterSpacing}
								onLetterSpacing={( value ) => setAttributes( { contentLetterSpacing: value } )}
								fontFamily={contentTypography}
								onFontFamily={( value ) => setAttributes( { contentTypography: value } )}
								onFontChange={( select ) => {
									setAttributes( {
										contentTypography: select.value,
										contentGoogleFont: select.google,
									} );
								}}
								googleFont={contentGoogleFont}
								onGoogleFont={( value ) => setAttributes( { contentGoogleFont: value } )}
								loadGoogleFont={contentLoadGoogleFont}
								onLoadGoogleFont={( value ) => setAttributes( { contentLoadGoogleFont: value } )}
								fontVariant={contentFontVariant}
								onFontVariant={( value ) => setAttributes( { contentFontVariant: value } )}
								fontWeight={contentFontWeight}
								onFontWeight={( value ) => setAttributes( { contentFontWeight: value } )}
								fontStyle={contentFontStyle}
								onFontStyle={( value ) => setAttributes( { contentFontStyle: value } )}
								fontSubset={contentFontSubset}
								onFontSubset={( value ) => setAttributes( { contentFontSubset: value } )}
								textTransform={contentTextTransform}
								onTextTransform={( value ) => setAttributes( { contentTextTransform: value } )}
							/>
							<MeasurementControls
								label={__( 'List Container Margin', 'kadence-blocks' )}
								measurement={contentMargin}
								control={contentMarginControl}
								onChange={( value ) => setAttributes( { contentMargin: value } )}
								onControl={( value ) => setContentMarginControl( value )}
								min={-100}
								max={100}
								step={1}
							/>
						</KadencePanelBody>
					)}
					{showSettings( 'container', 'kadence/table-of-contents' ) && (
						<KadencePanelBody
							title={__( 'Container Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-toc-container-settings'}
						>
							<PopColorControl
								label={__( 'Container Background', 'kadence-blocks' )}
								value={( containerBackground ? containerBackground : '' )}
								default={''}
								onChange={( value ) => setAttributes( { containerBackground: value } )}
							/>
							<MeasurementControls
								label={__( 'Container Padding', 'kadence-blocks' )}
								measurement={containerPadding}
								control={containerPaddingControl}
								onChange={( value ) => setAttributes( { containerPadding: value } )}
								onControl={( value ) => setContainerPaddingControl( value )}
								min={0}
								max={100}
								step={1}
							/>
							<PopColorControl
								label={__( 'Border Color', 'kadence-blocks' )}
								value={( containerBorderColor ? containerBorderColor : '' )}
								default={''}
								onChange={( value ) => setAttributes( { containerBorderColor: value } )}
							/>
							<MeasurementControls
								label={__( 'Content Border Width (px)', 'kadence-blocks' )}
								measurement={containerBorder}
								control={containerBorderControl}
								onChange={( value ) => setAttributes( { containerBorder: value } )}
								onControl={( value ) => setContainerBorderControl( value )}
								min={0}
								max={100}
								step={1}
							/>
							<MeasurementControls
								label={__( 'Border Radius', 'kadence-blocks' )}
								measurement={borderRadius}
								control={borderRadiusControl}
								onChange={( value ) => setAttributes( { borderRadius: value } )}
								onControl={( value ) => setBorderRadiusControl( value )}
								min={0}
								max={200}
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
							<BoxShadowControl
								label={__( 'Box Shadow', 'kadence-blocks' )}
								enable={( undefined !== displayShadow ? displayShadow : false )}
								color={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' )}
								colorDefault={'#000000'}
								onArrayChange={( color, opacity ) => saveShadow( { color: color, opacity: opacity } )}
								opacity={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 0.2 )}
								hOffset={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].hOffset ? shadow[ 0 ].hOffset : 0 )}
								vOffset={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].vOffset ? shadow[ 0 ].vOffset : 0 )}
								blur={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].blur ? shadow[ 0 ].blur : 14 )}
								spread={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].spread ? shadow[ 0 ].spread : 0 )}
								inset={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].inset ? shadow[ 0 ].inset : false )}
								onEnableChange={value => {
									setAttributes( {
										displayShadow: value,
									} );
								}}
								onColorChange={value => {
									saveShadow( { color: value } );
								}}
								onOpacityChange={value => {
									saveShadow( { opacity: value } );
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
								onSpreadChange={value => {
									saveShadow( { spread: value } );
								}}
								onInsetChange={value => {
									saveShadow( { inset: value } );
								}}
							/>
							<KadenceRange
								label={__( 'Max Width', 'kadence-blocks' )}
								value={maxWidth ? maxWidth : ''}
								onChange={( value ) => setAttributes( { maxWidth: value } )}
								min={50}
								max={1400}
								step={1}
							/>
							<ResponsiveMeasurementControls
								label={__( 'Container Margin', 'kadence-blocks' )}
								value={containerMargin}
								control={containerMarginControl}
								onChange={( value ) => setAttributes( { containerMargin: value } )}
								onChangeControl={( value ) => setContainerMarginControl( value )}
								tabletValue={containerTabletMargin}
								tabletControl={containerTabletMarginControl}
								onChangeTablet={( value ) => setAttributes( { containerTabletMargin: value } )}
								onChangeTabletControl={( value ) => setContainerTabletMarginControl( value )}
								mobileValue={containerMobileMargin}
								mobileControl={containerMobileMarginControl}
								onChangeMobile={( value ) => setAttributes( { containerMobileMargin: value } )}
								onChangeMobileControl={( value ) => setContainerMobileMarginControl( value )}
								min={( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? -2 : -200 )}
								max={( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 12 : 200 )}
								step={( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 0.1 : 1 )}
								unit={containerMarginUnit}
								units={[ 'px', 'em', 'rem' ]}
								onUnit={( value ) => setAttributes( { containerMarginUnit: value } )}
							/>
						</KadencePanelBody>
					)}
					{showSettings( 'container', 'kadence/table-of-contents' ) && (
						<>
							<KadencePanelBody
								title={__( 'Scroll Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={'kb-toc-scroll-settings'}
							>
								<ToggleControl
									label={__( 'Enable Smooth Scroll to ID', 'kadence-blocks' )}
									checked={enableSmoothScroll}
									onChange={value => setAttributes( { enableSmoothScroll: value } )}
								/>
								{enableSmoothScroll && (
									<KadenceRange
										label={__( 'Scroll Offset', 'kadence-blocks' )}
										value={smoothScrollOffset ? smoothScrollOffset : ''}
										onChange={( value ) => setAttributes( { smoothScrollOffset: value } )}
										min={0}
										max={400}
										step={1}
									/>
								)}
								<ToggleControl
									label={__( 'Enable Highlighting Heading when scrolling in active area.', 'kadence-blocks' )}
									checked={enableScrollSpy}
									onChange={value => setAttributes( { enableScrollSpy: value } )}
								/>
								{enableScrollSpy && (
									<PopColorControl
										label={__( 'List Items Active Color', 'kadence-blocks' )}
										value={( contentActiveColor ? contentActiveColor : '' )}
										default={''}
										onChange={( value ) => setAttributes( { contentActiveColor: value } )}
									/>
								)}
							</KadencePanelBody>
						</>
					)}
					{showSettings( 'container', 'kadence/table-of-contents' ) && (
							<KadencePanelBody
								title={__( 'Non static content', 'kadence-blocks' )}
								initialOpen={false}
								panelName={'kb-toc-non-static-content'}
							>
								<ToggleControl
									label={__( 'Search for Headings in Non static content?', 'kadence-blocks' )}
									checked={enableDynamicSearch}
									onChange={value => setAttributes( { enableDynamicSearch: value } )}
								/>
							</KadencePanelBody>
					)}
				</InspectorControls>
			)}
		</>
	);
	const ListTag = ( listStyle === 'numbered' ? 'ol' : 'ul' );
	// if ( headings.length === 0 || headings[ 0 ].content === '' ) {
	// 	return (
	// 		<div className={ classes } >
	// 			{ blockControls }
	// 			{ inspectorControls }
	// 			<Placeholder
	// 				className="kb-table-of-content-wrap"
	// 				icon={ icons.block }
	// 				label={ __( 'Table of Contents', 'kadence-blocks' ) }
	// 				instructions={ __( 'Start adding Heading blocks to create a table of contents.', 'kadence-blocks' ) }
	// 			/>
	// 		</div>
	// 	);
	// }
	return (
		<Fragment>
			{renderCSS}
			{blockControls}
			{inspectorControls}
			<nav className={classes}>
				<div className="kb-table-of-content-wrap" style={{
					padding        : ( containerPadding && undefined !== containerPadding[ 0 ] ? containerPadding[ 0 ] + 'px ' + containerPadding[ 1 ] + 'px ' + containerPadding[ 2 ] + 'px ' + containerPadding[ 3 ] + 'px' : '' ),
					marginTop      : ( previewMarginTop ? previewMarginTop + previewMarginUnit : undefined ),
					marginRight    : ( previewMarginRight ? previewMarginRight + previewMarginUnit : undefined ),
					marginBottom   : ( previewMarginBottom ? previewMarginBottom + previewMarginUnit : undefined ),
					marginLeft     : ( previewMarginLeft ? previewMarginLeft + previewMarginUnit : undefined ),
					borderWidth    : ( containerBorder ? containerBorder[ 0 ] + 'px ' + containerBorder[ 1 ] + 'px ' + containerBorder[ 2 ] + 'px ' + containerBorder[ 3 ] + 'px' : '' ),
					backgroundColor: KadenceColorOutput( containerBackground ),
					borderColor    : KadenceColorOutput( containerBorderColor ),
					borderRadius   : ( borderRadius ? borderRadius[ 0 ] + 'px ' + borderRadius[ 1 ] + 'px ' + borderRadius[ 2 ] + 'px ' + borderRadius[ 3 ] + 'px' : '' ),
					boxShadow      : ( undefined !== displayShadow && displayShadow && undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].color ? ( undefined !== shadow[ 0 ].inset && shadow[ 0 ].inset ? 'inset ' : '' ) + ( undefined !== shadow[ 0 ].hOffset ? shadow[ 0 ].hOffset : 0 ) + 'px ' + ( undefined !== shadow[ 0 ].vOffset ? shadow[ 0 ].vOffset : 0 ) + 'px ' + ( undefined !== shadow[ 0 ].blur ? shadow[ 0 ].blur : 14 ) + 'px ' + ( undefined !== shadow[ 0 ].spread ? shadow[ 0 ].spread : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' ), ( undefined !== shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 1 ) ) : undefined ),
					maxWidth       : ( maxWidth ? maxWidth + 'px' : undefined ),
				}}>
					{enableTitle && (
						<div
							className={`kb-table-of-contents-title-wrap kb-toggle-icon-style-${( enableToggle && toggleIcon ? toggleIcon : 'none' )} kb-toc-toggle-${( showContent ? 'active' : 'hidden' )}`}
							style={{
								borderWidth: ( titleBorder ? titleBorder[ 0 ] + 'px ' + titleBorder[ 1 ] + 'px ' + titleBorder[ 2 ] + 'px ' + titleBorder[ 3 ] + 'px' : '' ),
								borderColor: KadenceColorOutput( titleBorderColor ),
								color      : titleColor ? KadenceColorOutput( titleColor ) : undefined,
								padding    : ( titlePadding && undefined !== titlePadding[ 0 ] ? titlePadding[ 0 ] + 'px ' + titlePadding[ 1 ] + 'px ' + titlePadding[ 2 ] + 'px ' + titlePadding[ 3 ] + 'px' : '' ),
							}}
						>
							{titleGoogleFont && (
								<WebfontLoader config={config}>
								</WebfontLoader>
							)}
							<RichText
								tagName="div"
								placeholder={__( 'Optional Title', 'kadence-blocks' )}
								format="string"
								value={title}
								onChange={value => {
									setAttributes( { title: value } );
								}}
								allowedFormats={applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] )}
								className={'kb-table-of-contents-title'}
								style={{
									color        : 'inherit',
									fontWeight   : titleFontWeight,
									fontStyle    : titleFontStyle,
									fontSize     : ( titleSize && titleSize[ 0 ] ? titleSize[ 0 ] + titleSizeType : undefined ),
									lineHeight   : ( titleLineHeight && titleLineHeight[ 0 ] ? titleLineHeight[ 0 ] + titleLineType : undefined ),
									letterSpacing: ( titleLetterSpacing ? titleLetterSpacing + 'px' : undefined ),
									textTransform: ( titleTextTransform ? titleTextTransform : undefined ),
									fontFamily   : ( titleTypography ? titleTypography : '' ),
								}}
								keepPlaceholderOnFocus
							/>
							{enableToggle && (
								<div
									className="kb-table-of-contents-icon-trigger"
									onClick={() => onToggle()}
									role="button"
									tabIndex="0"
									onKeyDown={( event ) => {
										const { keyCode } = event;
										if ( keyCode === ENTER ) {
											onToggle();
										}
									}}
								></div>
							)}
						</div>
					)}
					{headings.length === 0 && (
						<div className="kb-table-of-content-placeholder">
							<p>{__( 'Start adding Heading blocks to create a table of contents.', 'kadence-blocks' )}</p>
						</div>
					)}
					{( ( enableToggle && showContent ) || !enableToggle ) && (
						<ListTag
							className={`kb-table-of-content-list kb-table-of-content-list-columns-${columns} kb-table-of-content-list-style-${listStyle} kb-table-of-content-link-style-${linkStyle}`}
							style={{
								color        : contentColor ? KadenceColorOutput( contentColor ) : undefined,
								margin       : ( contentMargin && undefined !== contentMargin[ 0 ] ? contentMargin[ 0 ] + 'px ' + contentMargin[ 1 ] + 'px ' + contentMargin[ 2 ] + 'px ' + contentMargin[ 3 ] + 'px' : '' ),
								fontWeight   : contentFontWeight,
								fontStyle    : contentFontStyle,
								fontSize     : ( previewContentSize ? previewContentSize + contentSizeType : undefined ),
								lineHeight   : ( previewContentHeight ? previewContentHeight + contentLineType : undefined ),
								letterSpacing: ( contentLetterSpacing ? contentLetterSpacing + 'px' : undefined ),
								textTransform: ( contentTextTransform ? contentTextTransform : undefined ),
								fontFamily   : ( contentTypography ? contentTypography : '' ),
							}}
						>
							{contentGoogleFont && (
								<WebfontLoader config={cconfig}>
								</WebfontLoader>
							)}
							{headings.length !== 0 && (
								<TableOfContentsList
									nestedHeadingList={linearToNestedHeadingList( headings )}
									listTag={ListTag}
								/>
							)}
						</ListTag>
					)}
				</div>
			</nav>
		</Fragment>
	);
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			getBlock,
			getBlockIndex,
			getBlockName,
			getBlockOrder,
		} = select( 'core/block-editor' );
		const postContent = select( 'core/editor' ).getEditedPostContent();

		const blockIndex = getBlockIndex( clientId );
		const blockOrder = getBlockOrder();

		// Calculate which page the block will appear in on the front-end by
		// counting how many core/nextpage blocks precede it.
		// Unfortunately, this does not account for <!--nextpage--> tags in
		// other blocks, so in certain edge cases, this will calculate the
		// wrong page number. Thankfully, this issue only affects the editor
		// implementation.
		let page = 1;
		for ( let i = 0; i < blockIndex; i++ ) {
			if ( getBlockName( blockOrder[ i ] ) === 'core/nextpage' ) {
				page++;
			}
		}
		return {
			block           : getBlock( clientId ),
			postContent     : postContent,
			getBlock,
			pageIndex       : page,
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			blockOrder: select( 'core/block-editor' ).getBlockOrder(),
			isTyping: select( 'core/block-editor' ).isTyping(),
		};
	} ),
] )( KadenceTableOfContents );
