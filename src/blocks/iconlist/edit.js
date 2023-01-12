/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icons
 */
import { alignTopIcon, alignMiddleIcon, alignBottomIcon } from '@kadence/icons';

/**
 * Import Externals
 */
import { times, filter, map, get } from 'lodash';
/**
 * Import Kadence Components
 */
import {
	KadenceColorOutput,
	showSettings,
	getPreviewSize,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getFontSizeOptionOutput,
	setBlockDefaults,
	getUniqueId,
} from '@kadence/helpers';

import {
	PopColorControl,
	TypographyControls,
	KadenceIconPicker,
	ResponsiveRangeControls,
	IconRender,
	KadencePanelBody,
	URLInputControl,
	DynamicTextControl,
	MeasurementControls,
	KadenceWebfontLoader,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
} from '@kadence/components';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	RichText,
	BlockControls,
	BlockAlignmentToolbar,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	useEffect,
	useState,
	Fragment,
	Platform,
	forwardRef
} from '@wordpress/element';

import {
	RangeControl,
	ButtonGroup,
	Tooltip,
	Button,
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
} from '@wordpress/components';

import { withDispatch, useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	plusCircle,
} from '@wordpress/icons';

function KadenceIconLists( { attributes, className, setAttributes, isSelected, insertListItem, listBlock, container, clientId, updateBlockAttributes } ) {

	const { listCount, items, listStyles, columns, listLabelGap, listGap, tabletListGap, mobileListGap, columnGap, tabletColumnGap, mobileColumnGap, blockAlignment, uniqueID, listMargin, tabletListMargin, mobileListMargin, listMarginType, listPadding, tabletListPadding, mobileListPadding, listPaddingType, iconAlign, tabletColumns, mobileColumns, icon, iconSize, width, color, background, border, borderRadius, padding, borderWidth, style } = attributes;

	const [ focusIndex, setFocusIndex ] = useState( null );
	const [ activeTab, setActiveTab ] = useState( 'general' );
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
		setBlockDefaults( 'kadence/iconlist', attributes);

		if ( ! uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( undefined === attributes.noCustomDefaults || ! attributes.noCustomDefaults ) {
				if ( blockConfigObject[ 'kadence/iconlist' ] !== undefined && typeof blockConfigObject[ 'kadence/iconlist' ] === 'object' ) {
					Object.keys( blockConfigObject[ 'kadence/iconlist' ] ).map( ( attribute ) => {
						if ( attribute === 'items' ) {
							attributes[ attribute ] = attributes[ attribute ].map( ( item, index ) => {
								item.icon = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].icon;
								item.size = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].size;
								item.color = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].color;
								item.background = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].background;
								item.border = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].border;
								item.borderRadius = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].borderRadius;
								item.padding = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].padding;
								item.borderWidth = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].borderWidth;
								item.style = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].style;
								item.level = get( blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ], 'level', 0 );
								return item;
							} );
						}
					} );
				}
			}
		}

		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );


	function selfOrChildSelected( isSelected, clientId ) {
		const childSelected = useSelect( ( select ) =>
			select( 'core/block-editor' ).hasSelectedInnerBlock( clientId, true )
		);
		return isSelected || childSelected;
	}

	const previewListMarginTop = getPreviewSize( previewDevice, ( undefined !== listMargin ? listMargin[0] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 0 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 0 ] : '' ) );
	const previewListMarginRight = getPreviewSize( previewDevice, ( undefined !== listMargin ? listMargin[1] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 1 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 1 ] : '' ) );
	const previewListMarginBottom = getPreviewSize( previewDevice, ( undefined !== listMargin ? listMargin[2] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 2 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 2 ] : '' ) );
	const previewListMarginLeft = getPreviewSize( previewDevice, ( undefined !== listMargin ? listMargin[3] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 3 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 3 ] : '' ) );

	const previewListPaddingTop = getPreviewSize( previewDevice, ( undefined !== listPadding ? listPadding[0] : '' ), ( undefined !== tabletListPadding ? tabletListPadding[ 0 ] : '' ), ( undefined !== mobileListPadding ? mobileListPadding[ 0 ] : '' ) );
	const previewListPaddingRight = getPreviewSize( previewDevice, ( undefined !== listPadding ? listPadding[1] : '' ), ( undefined !== tabletListPadding ? tabletListPadding[ 1 ] : '' ), ( undefined !== mobileListPadding ? mobileListPadding[ 1 ] : '' ) );
	const previewListPaddingBottom = getPreviewSize( previewDevice, ( undefined !== listPadding ? listPadding[2] : '' ), ( undefined !== tabletListPadding ? tabletListPadding[ 2 ] : '' ), ( undefined !== mobileListPadding ? mobileListPadding[ 2 ] : '' ) );
	const previewListPaddingLeft = getPreviewSize( previewDevice, ( undefined !== listPadding ? listPadding[3] : '' ), ( undefined !== tabletListPadding ? tabletListPadding[ 3 ] : '' ), ( undefined !== mobileListPadding ? mobileListPadding[ 3 ] : '' ) );

	const previewColumnGap = getPreviewSize( previewDevice, ( undefined !== columnGap ? columnGap : '' ), ( undefined !== tabletColumnGap ? tabletColumnGap : '' ), ( undefined !== mobileColumnGap ? mobileColumnGap : '' ) );
	const previewListGap = getPreviewSize( previewDevice, ( undefined !== listGap ? listGap : '' ), ( undefined !== tabletListGap ? tabletListGap : '' ), ( undefined !== mobileListGap ? mobileListGap : '' ) );
	const listMarginMouseOver = mouseOverVisualizer();
	const listPaddingMouseOver = mouseOverVisualizer();

	const previewFontSize = getPreviewSize( previewDevice, ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 0 ] ? listStyles[ 0 ].size[ 0 ] : '' ), ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 1 ] ? listStyles[ 0 ].size[ 1 ] : '' ), ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 2 ] ? listStyles[ 0 ].size[ 2 ] : '' ) );
	const previewLineHeight = getPreviewSize( previewDevice, ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 0 ] ? listStyles[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 1 ] ? listStyles[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 2 ] ? listStyles[ 0 ].lineHeight[ 2 ] : '' ) );

	const previewIconSize = getPreviewSize( previewDevice, ( undefined !== iconSize?.[0] ? iconSize[0] : '' ), ( undefined !== iconSize?.[1] ? iconSize[1] : '' ), ( undefined !== iconSize?.[2] ? iconSize[2] : '' ) );

	const saveListStyles = ( value ) => {
		const newUpdate = listStyles.map( ( item, index ) => {
			if ( index === 0 ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			listStyles: newUpdate,
		} );
	};

	const { childBlocks, getBlockAttrs } = useSelect(
		( select ) => {
			return {
				childBlocks: select( 'core/block-editor' ).getBlockOrder( clientId ),
				getBlockAttrs: ( blockClientId ) => select( 'core/block-editor' ).getBlockAttributes( blockClientId ),
			};
		}, []);

	const firstInnerAttrs = getBlockAttrs( childBlocks[ 0 ] );
	const saveAllListItem = ( value ) => {
		updateBlockAttributes( childBlocks, value );
	};

	const iconAlignOptions = [
		{ key: 'top', name: __( 'Top', 'kadence-blocks' ), icon: alignTopIcon },
		{ key: 'middle', name: __( 'Middle', 'kadence-blocks' ), icon: alignMiddleIcon },
		{ key: 'bottom', name: __( 'Bottom', 'kadence-blocks' ), icon: alignBottomIcon },
	];

	const nonTransAttrs = [ 'listCount' ];

	const blockProps = useBlockProps( {
		className: className,
		// 'data-align': ( 'center' === blockAlignment || 'left' === blockAlignment || 'right' === blockAlignment ? blockAlignment : undefined )
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'kadence/listitem' ],
		template: [['kadence/listitem']],
		templateLock: false,
		templateInsertUpdatesSelection: true,
	} );

	return (
			<div {...blockProps}>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'left', 'right' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
					<ToolbarGroup>
						<ToolbarButton
							className="kb-icons-add-icon"
							icon={ plusCircle }
							onClick={ () => {
								const latestAttributes = listBlock.innerBlocks[listBlock.innerBlocks.length - 1].attributes;
								latestAttributes.uniqueID = '';
								latestAttributes.text = '';
								const newBlock = createBlock( 'kadence/listitem', latestAttributes );
								insertListItem( newBlock );
							} }
							label={  __( 'Add Another List Item', 'kadence-blocks' ) }
							showTooltip={ true }
						/>
					</ToolbarGroup>
					<CopyPasteAttributes
						attributes={ attributes }
						excludedAttrs={ nonTransAttrs } 
						defaultAttributes={ metadata['attributes'] } 
						blockSlug={ metadata['name'] } 
						onPaste={ attributesToPaste => setAttributes( attributesToPaste ) }
					/>
				</BlockControls>
				{ showSettings( 'allSettings', 'kadence/iconlist' ) && (
					<InspectorControls>

						<InspectorControlTabs
							panelName={ 'iconlist' }
							setActiveTab={ ( value ) => setActiveTab( value ) }
							activeTab={ activeTab }
							initialOpen={ 'style' }
						/>

						{( activeTab === 'general' ) &&
							<>
								<KadencePanelBody
									title={__( 'List Controls' )}
									initialOpen={true}
									panelName={'kb-icon-list-controls'}
								>
									{ showSettings( 'column', 'kadence/iconlist' ) && (
										<ResponsiveRangeControls
											label={__( 'List Columns', 'kadence-blocks' )}
											value={columns}
											onChange={value => setAttributes( { columns: value } )}
											tabletValue={( tabletColumns ? tabletColumns : '' )}
											onChangeTablet={( value ) => setAttributes( { tabletColumns: value } )}
											mobileValue={( mobileColumns ? mobileColumns : '' )}
											onChangeMobile={( value ) => setAttributes( { mobileColumns: value } )}
											min={1}
											max={3}
											step={1}
											showUnit={false}
										/>
									)}
									{ showSettings( 'spacing', 'kadence/iconlist' ) && (
										<Fragment>
											<ResponsiveRangeControls
												label={__( 'List Column Gap' )}
												value={columnGap}
												onChange={value => setAttributes( { columnGap: value } )}
												tabletValue={( tabletColumnGap ? tabletColumnGap : '' )}
												onChangeTablet={( value ) => setAttributes( { tabletColumnGap: value } )}
												mobileValue={( mobileColumnGap ? mobileColumnGap : '' )}
												onChangeMobile={( value ) => setAttributes( { mobileColumnGap: value } )}
												min={0}
												max={200}
												step={1}
												showUnit={false}
											/>
											<ResponsiveRangeControls
												label={__( 'List Vertical Spacing' )}
												value={listGap}
												onChange={value => setAttributes( { listGap: value } )}
												tabletValue={( tabletListGap ? tabletListGap : '' )}
												onChangeTablet={( value ) => setAttributes( { tabletListGap: value } )}
												mobileValue={( mobileListGap ? mobileListGap : '' )}
												onChangeMobile={( value ) => setAttributes( { mobileListGap: value } )}
												min={0}
												max={60}
												step={1}
												showUnit={false}
											/>
											<RangeControl
												label={__( 'List Horizontal Icon and Label Spacing' )}
												value={listLabelGap}
												onChange={value => {
													setAttributes( { listLabelGap: value } );
												}}
												min={0}
												max={60}
											/>
											<div className="kt-btn-size-settings-container">
												<h2 className="kt-beside-btn-group">{__( 'Icon Align' )}</h2>
												<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Icon Align' )}>
													{map( iconAlignOptions, ( { name, icon, key } ) => (
														<Tooltip text={name}>
															<Button
																key={key}
																className="kt-btn-size-btn"
																isSmall
																isPrimary={iconAlign === key}
																aria-pressed={iconAlign === key}
																onClick={() => setAttributes( { iconAlign: key } )}
															>
																{icon}
															</Button>
														</Tooltip>
													) )}
												</ButtonGroup>
											</div>
										</Fragment>
									)}
								</KadencePanelBody>
							</>
						}

						{( activeTab === 'style' ) &&
							<>
								<KadencePanelBody
									title={__('Icon Styling', 'kadence-blocks')}
									panelName={'kb-list-icon-styling'}
								>
									<KadenceIconPicker
										value={icon}
										onChange={value => {
											setAttributes({icon: value});
										}}
									/>
									<ResponsiveRangeControls
										label={__( 'Icon Size', 'kadence-blocks' )}
										value={( undefined !== iconSize?.[0] ? iconSize[0] : '' )}
										onChange={value => {
											setAttributes( { iconSize: [ value, ( undefined !== iconSize?.[1] ? iconSize[1] : '' ), ( undefined !== iconSize?.[2] ? iconSize[2] : '' ) ] } );
										}}
										tabletValue={( undefined !== iconSize?.[1] ? iconSize[1] : '' )}
										onChangeTablet={( value ) => {
											setAttributes( { iconSize: [ ( undefined !== iconSize?.[0] ? iconSize[0] : '' ), value, ( undefined !== iconSize?.[2] ? iconSize[2] : '' ) ] } );
										}}
										mobileValue={( undefined !== iconSize?.[2] ? iconSize[2] : '' )}
										onChangeMobile={( value ) => {
											setAttributes( { iconSize: [ ( undefined !== iconSize?.[0] ? iconSize[0] : '' ), ( undefined !== iconSize?.[1] ? iconSize[1] : '' ), value ] } );
										}}
										min={0}
										max={300}
										step={1}
										unit={'px'}
										showUnit={true}
										units={[ 'px' ]}
									/>
									{icon && 'fe' === icon.substring(0, 2) && (
										<RangeControl
											label={__('Line Width', 'kadence-blocks')}
											value={width}
											onChange={value => {
												setAttributes({width: value});
											}}
											step={0.5}
											min={0.5}
											max={4}
										/>
									)}
									<PopColorControl
										label={__('Icon Color', 'kadence-blocks')}
										value={(color ? color : '')}
										default={''}
										onChange={value => {
											setAttributes({color: value});
										}}
									/>
									<SelectControl
										label={__('Icon Style', 'kadence-blocks')}
										value={style}
										options={[
											{ value: 'default', label: __( 'Default', 'kadence-blocks' ) },
											{ value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
										]}
										onChange={value => {
											setAttributes({style: value});
										}}
									/>
									{style === 'stacked' && (
										<PopColorControl
											label={ __( 'Icon Background', 'kadence-blocks' ) }
											value={ ( background ? background : '' ) }
											default={ '' }
											onChange={ value => {
												setAttributes( { background: value } );
											} }
										/>
									)}
									{style === 'stacked' && (
										<PopColorControl
											label={ __( 'Border Color', 'kadence-blocks' ) }
											value={ ( border ? border : '' ) }
											default={''}
											onChange={ value => {
												setAttributes( { border: value } );
											} }
										/>
									)}
									{style === 'stacked' && (
										<RangeControl
											label={ __( 'Border Size (px)', 'kadence-blocks' ) }
											value={borderWidth}
											onChange={value => {
												setAttributes({ borderWidth: value });
											}}
											min={0}
											max={20}
										/>
									)}
									{style === 'stacked' && (
										<RangeControl
											label={ __( 'Border Radius (%)', 'kadence-blocks' ) }
											value={borderRadius}
											onChange={value => {
												setAttributes({ borderRadius: value });
											}}
											min={0}
											max={50}
										/>
									)}
									{style === 'stacked' && (
										<RangeControl
											label={ __( 'Padding (px)', 'kadence-blocks' ) }
											value={ padding }
											onChange={ value => {
												setAttributes( { padding: value } );
											} }
											min={0}
											max={180}
										/>
									)}
								</KadencePanelBody>
								{ showSettings( 'textStyle', 'kadence/iconlist' ) && (
									<KadencePanelBody
										title={__( 'List Text Styling' )}
										initialOpen={ false }
										panelName={'kb-list-text-styling'}
									>
										<PopColorControl
											label={__( 'Color Settings' )}
											value={( listStyles[0].color ? listStyles[0].color : '' )}
											default={''}
											onChange={value => {
												saveListStyles( { color: value } );
											}}
										/>
										<TypographyControls
											fontSize={listStyles[ 0 ].size}
											onFontSize={( value ) => saveListStyles( { size: value } )}
											fontSizeType={listStyles[ 0 ].sizeType}
											onFontSizeType={( value ) => saveListStyles( { sizeType: value } )}
											lineHeight={listStyles[ 0 ].lineHeight}
											onLineHeight={( value ) => saveListStyles( { lineHeight: value } )}
											lineHeightType={listStyles[ 0 ].lineType}
											onLineHeightType={( value ) => saveListStyles( { lineType: value } )}
											letterSpacing={listStyles[ 0 ].letterSpacing}
											onLetterSpacing={( value ) => saveListStyles( { letterSpacing: value } )}
											fontFamily={listStyles[ 0 ].family}
											onFontFamily={( value ) => saveListStyles( { family: value } )}
											onFontChange={( select ) => {
												saveListStyles( {
													family: select.value,
													google: select.google,
												} );
											}}
											onFontArrayChange={( values ) => saveListStyles( values )}
											googleFont={listStyles[ 0 ].google}
											onGoogleFont={( value ) => saveListStyles( { google: value } )}
											loadGoogleFont={listStyles[ 0 ].loadGoogle}
											onLoadGoogleFont={( value ) => saveListStyles( { loadGoogle: value } )}
											fontVariant={listStyles[ 0 ].variant}
											onFontVariant={( value ) => saveListStyles( { variant: value } )}
											fontWeight={listStyles[ 0 ].weight}
											onFontWeight={( value ) => saveListStyles( { weight: value } )}
											fontStyle={listStyles[ 0 ].style}
											onFontStyle={( value ) => saveListStyles( { style: value } )}
											fontSubset={listStyles[ 0 ].subset}
											onFontSubset={( value ) => saveListStyles( { subset: value } )}
											textTransform={listStyles[ 0 ].textTransform}
											onTextTransform={( value ) => saveListStyles( { textTransform: value } )}
										/>
									</KadencePanelBody>
								)}
							</>
						}

						{( activeTab === 'advanced' ) &&
							<>
								<KadencePanelBody panelName={'kb-icon-list-spacing-settings'}>
									<ResponsiveMeasureRangeControl
										label={__( 'Padding', 'kadence-blocks' )}
										value={ listPadding }
										tabletValue={ tabletListPadding}
										mobileValue={ mobileListPadding}
										onChange={( value ) => setAttributes( { listPadding: value } )}
										onChangeTablet={( value ) => setAttributes( { tabletListPadding: value } )}
										onChangeMobile={( value ) => setAttributes( { mobileListPadding: value } )}
										min={( listPaddingType === 'em' || listPaddingType === 'rem' ? -24 : -200 )}
										max={( listPaddingType === 'em' || listPaddingType === 'rem' ? 24 : 200 )}
										step={( listPaddingType === 'em' || listPaddingType === 'rem' ? 0.1 : 1 )}
										unit={listPaddingType}
										units={[ 'px', 'em', 'rem', '%' ]}
										onUnit={( value ) => setAttributes( { listPaddingType: value } )}
										onMouseOver={ listPaddingMouseOver.onMouseOver }
										onMouseOut={ listPaddingMouseOver.onMouseOut }
									/>
									<ResponsiveMeasureRangeControl
										label={__( 'Margin', 'kadence-blocks' )}
										value={ listMargin }
										tabletValue={ tabletListMargin}
										mobileValue={ mobileListMargin}
										onChange={( value ) => setAttributes( { listMargin: value } )}
										onChangeTablet={( value ) => setAttributes( { tabletListMargin: value } )}
										onChangeMobile={( value ) => setAttributes( { mobileListMargin: value } )}
										min={( listMarginType === 'em' || listMarginType === 'rem' ? -24 : -200 )}
										max={( listMarginType === 'em' || listMarginType === 'rem' ? 24 : 200 )}
										step={( listMarginType === 'em' || listMarginType === 'rem' ? 0.1 : 1 )}
										unit={listMarginType}
										units={[ 'px', 'em', 'rem', '%' ]}
										onUnit={( value ) => setAttributes( { listMarginType: value } )}
										onMouseOver={ listMarginMouseOver.onMouseOver }
										onMouseOut={ listMarginMouseOver.onMouseOut }
									/>
								</KadencePanelBody>


								{/*
								 <div className="kt-sidebar-settings-spacer"></div>
								 { showSettings( 'joinedIcons', 'kadence/iconlist' ) && (
									<KadencePanelBody
										title={__( 'Edit All Icon Styles Together' )}
										initialOpen={ false }
										panelName={'kb-icon-all-styles'}
									>
										<p>{__( 'PLEASE NOTE: This will override individual list item settings.' )}</p>
										<KadenceIconPicker
											value={firstInnerAttrs.icon}
											onChange={value => {
												if ( value !== firstInnerAttrs.icon ) {
													saveAllListItem( { icon: value } );
												}
											}}
										/>
										<RangeControl
											label={__( 'Icon Size' )}
											value={firstInnerAttrs.size}
											onChange={value => {
												saveAllListItem( { size: value } );
											}}
											min={5}
											max={250}
										/>
										{firstInnerAttrs.icon && 'fe' === firstInnerAttrs.icon.substring( 0, 2 ) && (
											<RangeControl
												label={__( 'Line Width' )}
												value={firstInnerAttrs.width}
												onChange={value => {
													saveAllListItem( { width: value } );
												}}
												step={0.5}
												min={0.5}
												max={4}
											/>
										)}
										<PopColorControl
											label={__( 'Icon Color' )}
											value={( firstInnerAttrs.color ? firstInnerAttrs.color : '' )}
											default={''}
											onChange={value => {
												saveAllListItem( { color: value } );
											}}
										/>
										<SelectControl
											label={__( 'Icon Style' )}
											value={firstInnerAttrs.style}
											options={[
												{ value: 'default', label: __( 'Default' ) },
												{ value: 'stacked', label: __( 'Stacked' ) },
											]}
											onChange={value => {
												saveAllListItem( { style: value } );
											}}
										/>
										{firstInnerAttrs.style !== 'default' && (
											<PopColorControl
												label={__( 'Icon Background' )}
												value={( firstInnerAttrs.background ? firstInnerAttrs.background : '' )}
												default={''}
												onChange={value => {
													saveAllListItem( { background: value } );
												}}
											/>
										)}
										{firstInnerAttrs.style !== 'default' && (
											<PopColorControl
												label={__( 'Border Color' )}
												value={( firstInnerAttrs.border ? firstInnerAttrs.border : '' )}
												default={''}
												onChange={value => {
													saveAllListItem( { border: value } );
												}}
											/>
										)}
										{firstInnerAttrs.style !== 'default' && (
											<RangeControl
												label={__( 'Border Size (px)' )}
												value={firstInnerAttrs.borderWidth}
												onChange={value => {
													saveAllListItem( { borderWidth: value } );
												}}
												min={0}
												max={20}
											/>
										)}
										{firstInnerAttrs.style !== 'default' && (
											<RangeControl
												label={__( 'Border Radius (%)' )}
												value={firstInnerAttrs.borderRadius}
												onChange={value => {
													saveAllListItem( { borderRadius: value } );
												}}
												min={0}
												max={50}
											/>
										)}
										{firstInnerAttrs.style !== 'default' && (
											<RangeControl
												label={__( 'Padding (px)' )}
												value={firstInnerAttrs.padding}
												onChange={value => {
													saveAllListItem( { padding: value } );
												}}
												min={0}
												max={180}
											/>
										)}
									</KadencePanelBody>
								)} */}

								<KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ metadata['name'] } excludedAttrs={ nonTransAttrs } preventMultiple={ [ 'items' ] } />

							</>
						}

					</InspectorControls>
				) }
				<style>
					{ `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-wrap { margin-bottom: ${ previewListGap }px; }` }
					{ `body:not(.rtl) .kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-single { margin-right: ${ listLabelGap }px; }` }
					{ `body.rtl .kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-single { margin-left: ${ listLabelGap }px; }` }
					{ `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-wrap {
						font-weight: ${ ( listStyles[ 0 ].weight ? listStyles[ 0 ].weight : '' ) };
						font-style: ${ ( listStyles[ 0 ].style ? listStyles[ 0 ].style : '' ) };
						color:  ${ ( listStyles[ 0 ].color ? KadenceColorOutput( listStyles[ 0 ].color ) : '' ) };
						font-size: ${ ( previewFontSize ? getFontSizeOptionOutput( previewFontSize, listStyles[ 0 ].sizeType ) : '' ) };
						line-height: ${ ( previewLineHeight ? previewLineHeight + listStyles[ 0 ].lineType : '' ) };
						letter-spacing: ${ ( listStyles[ 0 ].letterSpacing ? listStyles[ 0 ].letterSpacing + 'px' : '' ) };
						font-family: ${ ( listStyles[ 0 ].family ? listStyles[ 0 ].family : '' ) };
						text-transform: ${ ( listStyles[ 0 ].textTransform ? listStyles[ 0 ].textTransform : '' ) };
						column-gap: ${ ( previewColumnGap ? previewColumnGap + 'px' : '' ) };
					}` }
					{ ( previewIconSize ? `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-wrap .kt-svg-icon-list-single { font-size: ${ previewIconSize }px; }` : '' ) }
					{ ( color ? `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-wrap .kt-svg-icon-list-single { color: ${ KadenceColorOutput( color ) }; }` : '' ) }
					{ ( background ? `.kt-svg-icon-list-items${ uniqueID }.kb-icon-list-style-stacked .kt-svg-icon-list-item-wrap:not(.kt-svg-icon-list-style-default) .kt-svg-icon-list-single { background-color: ${ KadenceColorOutput( background ) }; }` : '' ) }
					{ ( padding ? `.kt-svg-icon-list-items${ uniqueID }.kb-icon-list-style-stacked .kt-svg-icon-list-item-wrap:not(.kt-svg-icon-list-style-default) .kt-svg-icon-list-single { padding: ${ padding }px; }` : '' ) }
					{ ( border ? `.kt-svg-icon-list-items${ uniqueID }.kb-icon-list-style-stacked .kt-svg-icon-list-item-wrap:not(.kt-svg-icon-list-style-default) .kt-svg-icon-list-single { border-color: ${ KadenceColorOutput( border ) }; }` : '' ) }
					{ ( borderWidth ? `.kt-svg-icon-list-items${ uniqueID }.kb-icon-list-style-stacked .kt-svg-icon-list-item-wrap:not(.kt-svg-icon-list-style-default) .kt-svg-icon-list-single { border-width: ${ borderWidth }px; }` : '' ) }
					{ ( borderRadius ? `.kt-svg-icon-list-items${ uniqueID }.kb-icon-list-style-stacked .kt-svg-icon-list-item-wrap:not(.kt-svg-icon-list-style-default) .kt-svg-icon-list-single { border-radius: ${ borderRadius }%; }` : '' ) }
			</style>
			{ listStyles?.[ 0 ]?.google && (
				<KadenceWebfontLoader typography={ listStyles } clientId={ clientId } id={ 'listStyles' } />
			) }
			<div ref={container}
				 className={`kt-svg-icon-list-container kt-svg-icon-list-items${uniqueID} kb-icon-list-style-${style} kt-svg-icon-list-columns-${columns}${( undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : '' )}${( undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : '' )}${( undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : '' )}`}
				 style={{
					marginTop: getSpacingOptionOutput( previewListMarginTop, listMarginType ),
					marginRight: getSpacingOptionOutput( previewListMarginRight, listMarginType ),
					marginBottom: getSpacingOptionOutput( previewListMarginBottom, listMarginType ),
					marginLeft: getSpacingOptionOutput( previewListMarginLeft, listMarginType ),
					paddingTop: getSpacingOptionOutput( previewListPaddingTop, listPaddingType ),
					paddingRight: getSpacingOptionOutput( previewListPaddingRight, listPaddingType ),
					paddingBottom: getSpacingOptionOutput( previewListPaddingBottom, listPaddingType ),
					paddingLeft: getSpacingOptionOutput( previewListPaddingLeft, listPaddingType ),
				 }}>

				<div {...innerBlocksProps} />
				<SpacingVisualizer
					type="inside"
					style={ {
						marginLeft: ( undefined !== previewListMarginLeft ? getSpacingOptionOutput( previewListMarginLeft, listMarginType ) : undefined ),
						marginRight: ( undefined !== previewListMarginRight ? getSpacingOptionOutput( previewListMarginRight, listMarginType ) : undefined ),
						marginTop: ( undefined !== previewListMarginTop ? getSpacingOptionOutput( previewListMarginTop, listMarginType ) : undefined ),
						marginBottom: ( undefined !== previewListMarginBottom ? getSpacingOptionOutput( previewListMarginBottom, listMarginType ) : undefined ),
					} }
					forceShow={ listPaddingMouseOver.isMouseOver }
					spacing={ [ getSpacingOptionOutput( previewListPaddingTop, listPaddingType ), getSpacingOptionOutput( previewListPaddingRight, listPaddingType ), getSpacingOptionOutput( previewListPaddingBottom, listPaddingType ), getSpacingOptionOutput( previewListPaddingLeft, listPaddingType ) ] }
				/>
				<SpacingVisualizer
					type="outsideVertical"
					forceShow={ listMarginMouseOver.isMouseOver }
					spacing={ [ getSpacingOptionOutput( previewListMarginTop, listMarginType ), getSpacingOptionOutput( previewListMarginRight, listMarginType ), getSpacingOptionOutput( previewListMarginBottom, listMarginType ), getSpacingOptionOutput( previewListMarginLeft, listMarginType ) ] }
				/>
			</div>
		</div>
	);
}

// export default compose( [
// 	withDispatch( ( dispatch, { clientId, rootClientId } ) => {
// 		const { removeBlock, updateBlockAttributes } = dispatch( 'core/block-editor' );
// 		return {
// 			onDelete: () => {
// 				removeBlock( clientId, rootClientId );
// 			},
// 			updateBlockAttributes( ...args ) {
// 				updateBlockAttributes( ...args );
// 			}
// 		};
// 	} ),
// ] )( KadenceIconLists );
const KadenceIconsListWrapper = withDispatch(
	( dispatch, ownProps, registry ) => ( {
		insertListItem( newBlock ) {
			const { clientId } = ownProps;
			const { insertBlock } = dispatch( blockEditorStore );
			const { getBlock } = registry.select( blockEditorStore );
			const block = getBlock( clientId );
			insertBlock( newBlock, parseInt( block.innerBlocks.length ), clientId );
		},
		onDelete( childID, rootClientId  ) {
			const { removeBlock } = registry.select( blockEditorStore );
			removeBlock( childID, rootClientId )
		},
		updateBlockAttributes( ...args ) {
			const { updateBlockAttributes } = registry.select( blockEditorStore );
			updateBlockAttributes( ...args );
		}
	} )
)( KadenceIconLists );
const KadenceListEdit = ( props ) => {
	const { clientId } = props;
	const { listBlock } = useSelect(
		( select ) => {
			const {
				getBlock,
			} = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return {
				listBlock: block,
			};
		},
		[ clientId ]
	);
	return <KadenceIconsListWrapper listBlock={ listBlock } { ...props } />;
};
export default KadenceListEdit;
