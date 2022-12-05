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
	getSpacingOptionOutput
} from '@kadence/helpers';

import {
	WebfontLoader,
	PopColorControl,
	TypographyControls,
	KadenceIconPicker,
	ResponsiveRangeControls,
	IconRender,
	KadencePanelBody,
	URLInputControl,
	DynamicTextControl,
	MeasurementControls,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
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
	SelectControl,
} from '@wordpress/components';

import { compose } from '@wordpress/compose';
import { withDispatch, withSelect, useSelect } from '@wordpress/data';
import {
	plus,
} from '@wordpress/icons';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kticonlistUniqueIDs = [];

function KadenceIconLists( { attributes, className, setAttributes, isSelected, container, getPreviewDevice, clientId } ) {

	const { listCount, items, listStyles, columns, listLabelGap, listGap, tabletListGap, mobileListGap, columnGap, tabletColumnGap, mobileColumnGap, blockAlignment, uniqueID, listMargin, tabletListMargin, mobileListMargin, listMarginType, iconAlign, tabletColumns, mobileColumns } = attributes;

	const [ focusIndex, setFocusIndex ] = useState( null );
	const [ activeTab, setActiveTab ] = useState( 'general' );

	useEffect( () => {
		if ( !uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
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
					} else {
						attributes[ attribute ] = blockConfigObject[ 'kadence/iconlist' ][ attribute ];
					}
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kticonlistUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( kticonlistUniqueIDs.includes( uniqueID ) ) {
			if( uniqueID !== '_' + clientId.substr( 2, 9 ) ) {
				setAttributes( { uniqueID: '_' + clientId.substr( 2, 9 ) } );
				kticonlistUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
			}
		} else {
			kticonlistUniqueIDs.push( uniqueID );
		}

	}, [] );

	function selfOrChildSelected( isSelected, clientId ) {
		const childSelected = useSelect( ( select ) =>
			select( 'core/block-editor' ).hasSelectedInnerBlock( clientId, true )
		);
		return isSelected || childSelected;
	}

	const previewListMarginTop = getPreviewSize( getPreviewDevice, ( undefined !== listMargin ? listMargin[0] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 0 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 0 ] : '' ) );
	const previewListMarginRight = getPreviewSize( getPreviewDevice, ( undefined !== listMargin ? listMargin[1] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 1 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 1 ] : '' ) );
	const previewListMarginBottom = getPreviewSize( getPreviewDevice, ( undefined !== listMargin ? listMargin[2] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 2 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 2 ] : '' ) );
	const previewListMarginLeft = getPreviewSize( getPreviewDevice, ( undefined !== listMargin ? listMargin[3] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 3 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 3 ] : '' ) );

	const previewColumnGap = getPreviewSize( getPreviewDevice, ( undefined !== columnGap ? columnGap : '' ), ( undefined !== tabletColumnGap ? tabletColumnGap : '' ), ( undefined !== mobileColumnGap ? mobileColumnGap : '' ) );
	const previewListGap = getPreviewSize( getPreviewDevice, ( undefined !== listGap ? listGap : '' ), ( undefined !== tabletListGap ? tabletListGap : '' ), ( undefined !== mobileListGap ? mobileListGap : '' ) );
	const listMarginMouseOver = mouseOverVisualizer();

	const gconfig = {
		google: {
			families: [ listStyles[ 0 ].family + ( listStyles[ 0 ].variant ? ':' + listStyles[ 0 ].variant : '' ) ],
		},
	};

	const config = ( listStyles[ 0 ].google ? gconfig : '' );
	const previewFontSize = getPreviewSize( getPreviewDevice, ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 0 ] ? listStyles[ 0 ].size[ 0 ] : '' ), ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 1 ] ? listStyles[ 0 ].size[ 1 ] : '' ), ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 2 ] ? listStyles[ 0 ].size[ 2 ] : '' ) );
	const previewLineHeight = getPreviewSize( getPreviewDevice, ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 0 ] ? listStyles[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 1 ] ? listStyles[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 2 ] ? listStyles[ 0 ].lineHeight[ 2 ] : '' ) );

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
	const saveAllListItem = ( value ) => {
		const newUpdate = items.map( ( item, index ) => {
			item = { ...item, ...value };
			return item;
		} );
		setAttributes( {
			items: newUpdate,
		} );
	};

	const iconAlignOptions = [
		{ key: 'top', name: __( 'Top', 'kadence-blocks' ), icon: alignTopIcon },
		{ key: 'middle', name: __( 'Middle', 'kadence-blocks' ), icon: alignMiddleIcon },
		{ key: 'bottom', name: __( 'Bottom', 'kadence-blocks' ), icon: alignBottomIcon },
	];

	const blockToolControls = ( index ) => {
		const isLineSelected = ( isSelected && focusIndex === index && kadence_blocks_params.dynamic_enabled );
		if ( !isLineSelected ) {
			return;
		}
		return <DynamicTextControl dynamicAttribute={'items:' + index + ':text'} {...attributes} />;
	};

	const renderToolControls = (
		<div>
			{times( listCount, n => blockToolControls( n ) )}
		</div>
	);

	const blockProps = useBlockProps( {
		className: className,
		// 'data-align': ( 'center' === blockAlignment || 'left' === blockAlignment || 'right' === blockAlignment ? blockAlignment : undefined )
	} );

	const hasChildBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId ).length > 0;

	return (
			<div {...blockProps}>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'left', 'right' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
				</BlockControls>
				{ showSettings( 'allSettings', 'kadence/iconlist' ) && (
					<InspectorControls>

						<InspectorControlTabs
							panelName={ 'icon-list' }
							setActiveTab={ ( value ) => setActiveTab( value ) }
							activeTab={ activeTab }
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
								{ showSettings( 'textStyle', 'kadence/iconlist' ) && (
									<KadencePanelBody
										title={__( 'List Text Styling' )}
										panelName={'kb-list-text-styling'}
									>
										<PopColorControl
											label={__( 'Color Settings' )}
											value={( listStyles[ 0 ].color ? listStyles[ 0 ].color : '' )}
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
								<KadencePanelBody>
									<ResponsiveMeasureRangeControl
										label={__( 'List Margin', 'kadence-blocks' )}
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

								<div className="kt-sidebar-settings-spacer"></div>

								{/*{ showSettings( 'joinedIcons', 'kadence/iconlist' ) && (*/}
								{/*	<KadencePanelBody*/}
								{/*		title={__( 'Edit All Icon Styles Together' )}*/}
								{/*		initialOpen={ false }*/}
								{/*		panelName={'kb-icon-all-styles'}*/}
								{/*	>*/}
								{/*		<p>{__( 'PLEASE NOTE: This will override individual list item settings.' )}</p>*/}
								{/*		<KadenceIconPicker*/}
								{/*			value={items[ 0 ].icon}*/}
								{/*			onChange={value => {*/}
								{/*				if ( value !== items[ 0 ].icon ) {*/}
								{/*					saveAllListItem( { icon: value } );*/}
								{/*				}*/}
								{/*			}}*/}
								{/*		/>*/}
								{/*		<RangeControl*/}
								{/*			label={__( 'Icon Size' )}*/}
								{/*			value={items[ 0 ].size}*/}
								{/*			onChange={value => {*/}
								{/*				saveAllListItem( { size: value } );*/}
								{/*			}}*/}
								{/*			min={5}*/}
								{/*			max={250}*/}
								{/*		/>*/}
								{/*		{items[ 0 ].icon && 'fe' === items[ 0 ].icon.substring( 0, 2 ) && (*/}
								{/*			<RangeControl*/}
								{/*				label={__( 'Line Width' )}*/}
								{/*				value={items[ 0 ].width}*/}
								{/*				onChange={value => {*/}
								{/*					saveAllListItem( { width: value } );*/}
								{/*				}}*/}
								{/*				step={0.5}*/}
								{/*				min={0.5}*/}
								{/*				max={4}*/}
								{/*			/>*/}
								{/*		)}*/}
								{/*		<PopColorControl*/}
								{/*			label={__( 'Icon Color' )}*/}
								{/*			value={( items[ 0 ].color ? items[ 0 ].color : '' )}*/}
								{/*			default={''}*/}
								{/*			onChange={value => {*/}
								{/*				saveAllListItem( { color: value } );*/}
								{/*			}}*/}
								{/*		/>*/}
								{/*		<SelectControl*/}
								{/*			label={__( 'Icon Style' )}*/}
								{/*			value={items[ 0 ].style}*/}
								{/*			options={[*/}
								{/*				{ value: 'default', label: __( 'Default' ) },*/}
								{/*				{ value: 'stacked', label: __( 'Stacked' ) },*/}
								{/*			]}*/}
								{/*			onChange={value => {*/}
								{/*				saveAllListItem( { style: value } );*/}
								{/*			}}*/}
								{/*		/>*/}
								{/*		{items[ 0 ].style !== 'default' && (*/}
								{/*			<PopColorControl*/}
								{/*				label={__( 'Icon Background' )}*/}
								{/*				value={( items[ 0 ].background ? items[ 0 ].background : '' )}*/}
								{/*				default={''}*/}
								{/*				onChange={value => {*/}
								{/*					saveAllListItem( { background: value } );*/}
								{/*				}}*/}
								{/*			/>*/}
								{/*		)}*/}
								{/*		{items[ 0 ].style !== 'default' && (*/}
								{/*			<PopColorControl*/}
								{/*				label={__( 'Border Color' )}*/}
								{/*				value={( items[ 0 ].border ? items[ 0 ].border : '' )}*/}
								{/*				default={''}*/}
								{/*				onChange={value => {*/}
								{/*					saveAllListItem( { border: value } );*/}
								{/*				}}*/}
								{/*			/>*/}
								{/*		)}*/}
								{/*		{items[ 0 ].style !== 'default' && (*/}
								{/*			<RangeControl*/}
								{/*				label={__( 'Border Size (px)' )}*/}
								{/*				value={items[ 0 ].borderWidth}*/}
								{/*				onChange={value => {*/}
								{/*					saveAllListItem( { borderWidth: value } );*/}
								{/*				}}*/}
								{/*				min={0}*/}
								{/*				max={20}*/}
								{/*			/>*/}
								{/*		)}*/}
								{/*		{items[ 0 ].style !== 'default' && (*/}
								{/*			<RangeControl*/}
								{/*				label={__( 'Border Radius (%)' )}*/}
								{/*				value={items[ 0 ].borderRadius}*/}
								{/*				onChange={value => {*/}
								{/*					saveAllListItem( { borderRadius: value } );*/}
								{/*				}}*/}
								{/*				min={0}*/}
								{/*				max={50}*/}
								{/*			/>*/}
								{/*		)}*/}
								{/*		{items[ 0 ].style !== 'default' && (*/}
								{/*			<RangeControl*/}
								{/*				label={__( 'Padding (px)' )}*/}
								{/*				value={items[ 0 ].padding}*/}
								{/*				onChange={value => {*/}
								{/*					saveAllListItem( { padding: value } );*/}
								{/*				}}*/}
								{/*				min={0}*/}
								{/*				max={180}*/}
								{/*			/>*/}
								{/*		)}*/}
								{/*	</KadencePanelBody>*/}
								{/*)}*/}

								<KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ 'kadence/iconlist' } excludedAttrs={ [ 'listCount' ] } preventMultiple={ [ 'items' ] } />

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
							font-size: ${ ( previewFontSize ? previewFontSize + listStyles[ 0 ].sizeType : '' ) };
							line-height: ${ ( previewLineHeight ? previewLineHeight + listStyles[ 0 ].lineType : '' ) };
							letter-spacing: ${ ( listStyles[ 0 ].letterSpacing ? listStyles[ 0 ].letterSpacing + 'px' : '' ) };
							font-family: ${ ( listStyles[ 0 ].family ? listStyles[ 0 ].family : '' ) };
							text-transform: ${ ( listStyles[ 0 ].textTransform ? listStyles[ 0 ].textTransform : '' ) };
							column-gap: ${ ( previewColumnGap ? previewColumnGap + 'px' : '' ) };
						}`
				}
			</style>
			{listStyles[ 0 ].google && (
				<WebfontLoader config={config}>
				</WebfontLoader>
			)}
			<div ref={container}
				 className={`kt-svg-icon-list-container kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns}${( undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : '' )}${( undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : '' )}${( undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : '' )}`}
				 style={{
					 marginTop: getSpacingOptionOutput( previewListMarginTop, listMarginType),
					 marginRight: getSpacingOptionOutput( previewListMarginRight, listMarginType),
					 marginBottom: getSpacingOptionOutput( previewListMarginBottom, listMarginType),
					 marginLeft: getSpacingOptionOutput( previewListMarginLeft, listMarginType),
				 }}>

				<InnerBlocks
					template={ [ [ 'kadence/listitem' ] ] }
					templateLock={ false }
					templateInsertUpdatesSelection={ true }
					allowedBlocks={ [ 'kadence/listitem' ] }
					renderAppender={ () => selfOrChildSelected(isSelected, clientId ) && <InnerBlocks.ButtonBlockAppender/> }
				/>
				
			</div>
		</div>
	);
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
	withDispatch( ( dispatch, { clientId, rootClientId } ) => {
		const { removeBlock } = dispatch( 'core/block-editor' );
		return {
			onDelete: () => {
				removeBlock( clientId, rootClientId );
			},
		};
	} ),
] )( KadenceIconLists );
