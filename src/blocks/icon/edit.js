/**
 * BLOCK: Kadence Icon
 */
/**
 * Import externals
 */
import { times, map } from 'lodash';
import {
	PopColorControl,
	StepControls,
	IconControl,
	IconRender,
	KadencePanelBody,
	URLInputControl,
	VerticalAlignmentIcon,
	ResponsiveMeasurementControls,
	ResponsiveRangeControls,
	InspectorControlTabs,
	RangeControl,
	KadenceRadioButtons,
	ResponsiveAlignControls,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	KadenceIconPicker
} from '@kadence/components';
import {
	KadenceColorOutput,
	getPreviewSize,
	setBlockDefaults
} from '@kadence/helpers';
import { useSelect, useDispatch } from '@wordpress/data';

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
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	useBlockProps
} from '@wordpress/block-editor';
import {
	Fragment,
	useEffect,
	useState
} from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	Button,
	Dashicon,
	TabPanel,
	ToolbarGroup,
} from '@wordpress/components';

function KadenceIcons( { attributes, className, setAttributes, clientId, context } ) {
	const { iconCount, inQueryBlock, icons, blockAlignment, textAlignment, tabletTextAlignment, mobileTextAlignment, uniqueID, verticalAlignment } = attributes;

	const [ marginControl, setMarginControl ] = useState( 'individual' );
	const [ paddingControl, setPaddingControl ] = useState( 'linked' );
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
		let smallID = '_' + clientId.substr( 2, 9 );
		if ( ! uniqueID ) {
			attributes = setBlockDefaults( 'kadence/icon', attributes);

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
		if ( context && ( context.queryId || Number.isFinite( context.queryId ) ) && context.postId ) {
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
	}, [] );
	const saveArrayUpdate = ( value, index ) => {
		const newItems = icons.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			icons: newItems,
		} );
	};

	const blockProps = useBlockProps( {
		className: className,
	} );
	const verticalAlignOptions = [
		[
			{
				icon    : <VerticalAlignmentIcon value={'top'} isPressed={( verticalAlignment === 'top' ? true : false )}/>,
				title   : __( 'Align Top', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'top' ? true : false ),
				onClick : () => setAttributes( { verticalAlignment: 'top' } ),
			},
		],
		[
			{
				icon    : <VerticalAlignmentIcon value={'middle'} isPressed={( verticalAlignment === 'middle' ? true : false )}/>,
				title   : __( 'Align Middle', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'middle' ? true : false ),
				onClick : () => setAttributes( { verticalAlignment: 'middle' } ),
			},
		],
		[
			{
				icon    : <VerticalAlignmentIcon value={'bottom'} isPressed={( verticalAlignment === 'bottom' ? true : false )}/>,
				title   : __( 'Align Bottom', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'bottom' ? true : false ),
				onClick : () => setAttributes( { verticalAlignment: 'bottom' } ),
			},
		],
	];
	const renderAdvancedIconSettings = ( index ) => {
		return (
			<KadencePanelBody
				title={ __( 'Icon', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Spacing Settings', 'kadence-blocks' )}
				initialOpen={ ( 1 === iconCount ? true : false ) }
				panelName={'iconSpacing'}
				index={index}
				blockSlug={ 'kadence/icon' }
			>
				{ icons[ index ].style !== 'default' && (
					<ResponsiveMeasurementControls
						label={__( 'Icon Padding', 'kadence-blocks' )}
						value={ ( icons[ index ].padding ? icons[ index ].padding : ['', '', '', ''] ) }
						control={ paddingControl }
						onChange={ ( value ) => saveArrayUpdate( { padding: value }, index ) }
						onChangeControl={ ( value ) => setPaddingControl( value ) }
						tabletValue={ ( icons[ index ].tabletPadding ? icons[ index ].tabletPadding : ['', '', '', ''] ) }
						onChangeTablet={( value ) => saveArrayUpdate( { tabletPadding: value }, index ) }
						mobileValue={ ( icons[ index ].mobilePadding ? icons[ index ].mobilePadding : ['', '', '', ''] ) }
						onChangeMobile={( value ) => saveArrayUpdate( { mobilePadding: value }, index ) }
						min={ 0 }
						max={ ( ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) === 'em' || ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) === 'rem' ? 12 : 200 ) }
						step={ ( ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) === 'em' || ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) === 'rem' ? 0.1 : 1 ) }
						unit={ ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) }
						units={ [ 'px', 'em', 'rem' ] }
						onUnit={ ( value ) => saveArrayUpdate( { paddingUnit: value }, index ) }
					/>
				) }
				<ResponsiveMeasurementControls
					label={__( 'Icon Margin', 'kadence-blocks' )}
					value={ ( icons[ index ].margin ? icons[ index ].margin : ['', '', '', ''] ) }
					control={ marginControl }
					onChange={ ( value ) => saveArrayUpdate( { margin: value }, index ) }
					onChangeControl={ ( value ) => setMarginControl( value ) }
					tabletValue={ ( icons[ index ].tabletMargin ? icons[ index ].tabletMargin : ['', '', '', ''] ) }
					onChangeTablet={( value ) => saveArrayUpdate( { tabletMargin: value }, index ) }
					mobileValue={ ( icons[ index ].mobileMargin ? icons[ index ].mobileMargin : ['', '', '', ''] ) }
					onChangeMobile={( value ) => saveArrayUpdate( { mobileMargin: value }, index ) }
					min={ ( ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'em' || ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'rem' ? -2 : -200 ) }
					max={ ( ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'em' || ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'rem' ? 12 : 200 ) }
					step={ ( ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'em' || ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'rem' ? 0.1 : 1 ) }
					unit={ ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) }
					units={ [ 'px', 'em', 'rem' ] }
					onUnit={ ( value ) => saveArrayUpdate( { marginUnit: value }, index ) }
				/>
			</KadencePanelBody>
		);
	};
	const renderIconSettings = ( index ) => {
		return (
			<KadencePanelBody
				title={__( 'Icon', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' )}
				initialOpen={( 1 === iconCount ? true : false )}
				panelName={'kb-icon-settings-' + index}
			>

				<KadenceIconPicker
					value={icons[ index ].icon}
					onChange={value => {
						saveArrayUpdate( { icon: value }, index );
					}}
				/>

				<br/><br/>

				<IconControl
					value={icons[ index ].icon}
					onChange={value => {
						saveArrayUpdate( { icon: value }, index );
					}}
				/>
				<ResponsiveRangeControls
					label={__( 'Icon Size', 'kadence-blocks' )}
					value={icons[ index ].size ? icons[ index ].size : ''}
					onChange={value => {
						saveArrayUpdate( { size: value }, index );
					}}
					tabletValue={ ( undefined !== icons[ index ].tabletSize ? icons[ index ].tabletSize : '' ) }
					onChangeTablet={( value ) => {
						saveArrayUpdate( { tabletSize: value }, index );
					}}
					mobileValue={( undefined !== icons[ index ].mobileSize ? icons[ index ].mobileSize : '' )}
					onChangeMobile={( value ) => {
						saveArrayUpdate( { mobileSize: value }, index );
					}}
					min={ 0 }
					max={ 300 }
					step={1}
					unit={'px'}
					showUnit={true}
				/>
				{ icons[ index ].icon && 'fe' === icons[ index ].icon.substring( 0, 2 ) && (
					<RangeControl
						label={__( 'Line Width' )}
						value={icons[ index ].width}
						onChange={value => {
							saveArrayUpdate( { width: value }, index );
						}}
						step={0.5}
						min={0.5}
						max={4}
					/>
				) }
				<KadenceRadioButtons
					label={__( 'Icon Style', 'kadence-blocks' )}
					value={icons[ index ].style}
					options={[
						{ value: 'default', label: __( 'Default', 'kadence-blocks' ) },
						{ value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
					]}
					onChange={value => saveArrayUpdate( { style: value }, index )}
				/>
				<PopColorControl
					label={ __( 'Icon Color', 'kadence-blocks' ) }
					value={ ( icons[ index ].color ? icons[ index ].color : '' ) }
					default={''}
					onChange={ value => {
						saveArrayUpdate( { color: value }, index );
					} }
					swatchLabel2={ __( 'Hover Color', 'kadence-blocks' ) }
					value2={( icons[ index ].hColor ? icons[ index ].hColor : '' )}
					default2={''}
					onChange2={value => {
						saveArrayUpdate( { hColor: value }, index );
					}}
				/>
				{icons[ index ].style !== 'default' && (
					<>
						<PopColorControl
							label={ __( 'Background Color', 'kadence-blocks' ) }
							value={ ( icons[ index ].background ? icons[ index ].background : '' ) }
							default={''}
							onChange={ value => {
								saveArrayUpdate( { background: value }, index );
							} }
							swatchLabel2={ __( 'Hover Background', 'kadence-blocks' ) }
							value2={( icons[ index ].hBackground ? icons[ index ].hBackground : '' )}
							default2={''}
							onChange2={value => {
								saveArrayUpdate( { hBackground: value }, index );
							}}
						/>
						<PopColorControl
							label={ __( 'Border Color', 'kadence-blocks' ) }
							value={ ( icons[ index ].border ? icons[ index ].border : '' ) }
							default={''}
							onChange={ value => {
								saveArrayUpdate( { border: value }, index );
							} }
							swatchLabel2={ __( 'Hover Border', 'kadence-blocks' ) }
							value2={( icons[ index ].hBorder ? icons[ index ].hBorder : '' )}
							default2={''}
							onChange2={value => {
								saveArrayUpdate( { hBorder: value }, index );
							}}
						/>
						<RangeControl
							label={__( 'Border Size (px)', 'kadence-blocks' )}
							value={icons[ index ].borderWidth}
							onChange={value => {
								saveArrayUpdate( { borderWidth: value }, index );
							}}
							min={0}
							max={20}
						/>
						<RangeControl
							label={__( 'Border Radius (%)', 'kadence-blocks' )}
							value={icons[ index ].borderRadius}
							onChange={value => {
								saveArrayUpdate( { borderRadius: value }, index );
							}}
							min={0}
							max={50}
						/>
					</>
				) }				
				<URLInputControl
					label={__( 'Link', 'kadence-blocks' )}
					url={icons[ index ].link}
					onChangeUrl={value => {
						saveArrayUpdate( { link: value }, index );
					}}
					additionalControls={true}
					opensInNewTab={( icons[ index ].target && '_blank' == icons[ index ].target ? true : false )}
					onChangeTarget={value => {
						if ( value ) {
							saveArrayUpdate( { target: '_blank' }, index );
						} else {
							saveArrayUpdate( { target: '_self' }, index );
						}
					}}
					dynamicAttribute={'icons:' + index + ':link'}
					linkTitle={icons[ index ].linkTitle}
					onChangeTitle={value => {
						saveArrayUpdate( { linkTitle: value }, index );
					}}
					{...attributes}
				/>
				<TextControl
					label={__( 'Title for Accessibility', 'kadence-blocks' )}
					value={icons[ index ].title}
					onChange={value => {
						saveArrayUpdate( { title: value }, index );
					}}
				/>
			</KadencePanelBody>
		);
	};
	const renderSettings = (
		<div>
			{times( iconCount, n => renderIconSettings( n ) )}
		</div>
	);
	const renderAdvancedSettings = (
		<div>
			{times( iconCount, n => renderAdvancedIconSettings( n ) )}
		</div>
	);
	const renderIconsPreview = ( index ) => {
		const previewSize = getPreviewSize( previewDevice, ( icons[ index ].size ? icons[ index ].size : undefined ), ( undefined !== icons[ index ].tabletSize && icons[ index ].tabletSize ? icons[ index ].tabletSize : undefined ), ( undefined !== icons[ index ].mobileSize && icons[ index ].mobileSize ? icons[ index ].mobileSize : undefined ) );

		const previewMarginTop = getPreviewSize( previewDevice, ( icons[ index ].margin && undefined !== icons[ index ].margin[ 0 ] ? icons[ index ].margin[ 0 ] : undefined ), ( icons[ index ].tabletMargin && undefined !== icons[ index ].tabletMargin[ 0 ] ? icons[ index ].tabletMargin[ 0 ] : undefined ), ( icons[ index ].mobileMargin && undefined !== icons[ index ].mobileMargin[ 0 ] ? icons[ index ].mobileMargin[ 0 ] : undefined ) );
		const previewMarginRight = getPreviewSize( previewDevice, ( icons[ index ].margin && undefined !== icons[ index ].margin[ 1 ] ? icons[ index ].margin[ 1 ] : undefined ), ( icons[ index ].tabletMargin && undefined !== icons[ index ].tabletMargin[ 1 ] ? icons[ index ].tabletMargin[ 1 ] : undefined ), ( icons[ index ].mobileMargin && undefined !== icons[ index ].mobileMargin[ 1 ] ? icons[ index ].mobileMargin[ 1 ] : undefined ) );
		const previewMarginBottom = getPreviewSize( previewDevice, ( icons[ index ].margin && undefined !== icons[ index ].margin[ 2 ] ? icons[ index ].margin[ 2 ] : undefined ), ( icons[ index ].tabletMargin && undefined !== icons[ index ].tabletMargin[ 2 ] ? icons[ index ].tabletMargin[ 2 ] : undefined ), ( icons[ index ].mobileMargin && undefined !== icons[ index ].mobileMargin[ 2 ] ? icons[ index ].mobileMargin[ 2 ] : undefined ) );
		const previewMarginLeft	 = getPreviewSize( previewDevice, ( icons[ index ].margin && undefined !== icons[ index ].margin[ 3 ] ? icons[ index ].margin[ 3 ] : undefined ), ( icons[ index ].tabletMargin && undefined !== icons[ index ].tabletMargin[ 3 ] ? icons[ index ].tabletMargin[ 3 ] : undefined ), ( icons[ index ].mobileMargin && undefined !== icons[ index ].mobileMargin[ 3 ] ? icons[ index ].mobileMargin[ 3 ] : undefined ) );

		const previewPaddingTop = getPreviewSize( previewDevice, ( icons[ index ].padding && undefined !== icons[ index ].padding[ 0 ] ? icons[ index ].padding[ 0 ] : undefined ), ( icons[ index ].tabletPadding && undefined !== icons[ index ].tabletPadding[ 0 ] ? icons[ index ].tabletPadding[ 0 ] : undefined ), ( icons[ index ].mobilePadding && undefined !== icons[ index ].mobilePadding[ 0 ] ? icons[ index ].mobilePadding[ 0 ] : undefined ) );
		const previewPaddingRight = getPreviewSize( previewDevice, ( icons[ index ].padding && undefined !== icons[ index ].padding[ 1 ] ? icons[ index ].padding[ 1 ] : undefined ), ( icons[ index ].tabletPadding && undefined !== icons[ index ].tabletPadding[ 1 ] ? icons[ index ].tabletPadding[ 1 ] : undefined ), ( icons[ index ].mobilePadding && undefined !== icons[ index ].mobilePadding[ 1 ] ? icons[ index ].mobilePadding[ 1 ] : undefined ) );
		const previewPaddingBottom = getPreviewSize( previewDevice, ( icons[ index ].padding && undefined !== icons[ index ].padding[ 2 ] ? icons[ index ].padding[ 2 ] : undefined ), ( icons[ index ].tabletPadding && undefined !== icons[ index ].tabletPadding[ 2 ] ? icons[ index ].tabletPadding[ 2 ] : undefined ), ( icons[ index ].mobilePadding && undefined !== icons[ index ].mobilePadding[ 2 ] ? icons[ index ].mobilePadding[ 2 ] : undefined ) );
		const previewPaddingLeft	 = getPreviewSize( previewDevice, ( icons[ index ].padding && undefined !== icons[ index ].padding[ 3 ] ? icons[ index ].padding[ 3 ] : undefined ), ( icons[ index ].tabletPadding && undefined !== icons[ index ].tabletPadding[ 3 ] ? icons[ index ].tabletPadding[ 3 ] : undefined ), ( icons[ index ].mobilePadding && undefined !== icons[ index ].mobilePadding[ 3 ] ? icons[ index ].mobilePadding[ 3 ] : undefined ) );

		const previewPaddingUnit = undefined !== icons[ index ].paddingUnit && icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px';
		const previewMarginUnit = undefined !== icons[ index ].marginUnit && icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px';
		return (
			<div className={`kt-svg-style-${icons[ index ].style} kt-svg-icon-wrap kt-svg-item-${index}`}>
				{icons[ index ].icon && (
					<IconRender
						className={`kt-svg-icon kt-svg-icon-${icons[ index ].icon}`} name={icons[ index ].icon} size={ previewSize }
						strokeWidth={( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined )} title={( icons[ index ].title ? icons[ index ].title : '' )}
						style={ {
							color          : ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
							backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
							paddingTop        : ( previewPaddingTop && icons[ index ].style !== 'default' ? previewPaddingTop + previewPaddingUnit : undefined ),
							paddingRight        : ( previewPaddingRight && icons[ index ].style !== 'default' ? previewPaddingRight + previewPaddingUnit : undefined ),
							paddingBottom        : ( previewPaddingBottom && icons[ index ].style !== 'default' ? previewPaddingBottom + previewPaddingUnit : undefined ),
							paddingLeft        : ( previewPaddingLeft && icons[ index ].style !== 'default' ? previewPaddingLeft + previewPaddingUnit : undefined ),
							borderColor    : ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
							borderWidth    : ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
							borderRadius   : ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
							marginTop      : ( previewMarginTop ? previewMarginTop + previewMarginUnit : undefined ),
							marginRight    : ( previewMarginRight ? previewMarginRight + previewMarginUnit : undefined ),
							marginBottom   : ( previewMarginBottom ? previewMarginBottom + previewMarginUnit : undefined ),
							marginLeft     : ( previewMarginLeft ? previewMarginLeft + previewMarginUnit : undefined ),
						} }
					/>
				) }
			</div>
		);
	};
	const renderIconCSS = ( index ) => {
		return (
			`.kt-svg-icons-${uniqueID} .kt-svg-item-${index}:hover .kt-svg-icon {
					${( undefined !== icons[ index ].hColor && icons[ index ].hColor ? 'color:' + KadenceColorOutput( icons[ index ].hColor ) + '!important;' : '' )}
					${( undefined !== icons[ index ].hBackground && icons[ index ].hBackground ? 'background:' + KadenceColorOutput( icons[ index ].hBackground ) + '!important;' : '' )}
					${( undefined !== icons[ index ].hBorder && icons[ index ].hBorder ? 'border-color:' + KadenceColorOutput( icons[ index ].hBorder ) + '!important;' : '' )}
				}`
		);
	};
	const renderCSS = (
		<style>
			{times( iconCount, n => renderIconCSS( n ) )}
		</style>
	);
	const previewTextAlign = getPreviewSize( previewDevice, ( textAlignment ? textAlignment : undefined ), ( undefined !== tabletTextAlignment && tabletTextAlignment ? tabletTextAlignment : undefined ), ( undefined !== mobileTextAlignment && mobileTextAlignment ? mobileTextAlignment : undefined ) );
	return (
		<div {...blockProps}>
			{renderCSS}
			<BlockControls>
				<BlockAlignmentToolbar
					value={blockAlignment}
					controls={[ 'center', 'left', 'right' ]}
					onChange={value => setAttributes( { blockAlignment: value } )}
				/>
				<ToolbarGroup
					isCollapsed={true}
					icon={<VerticalAlignmentIcon value={( verticalAlignment ? verticalAlignment : 'bottom' )}/>}
					label={__( 'Vertical Align', 'kadence-blocks' )}
					controls={verticalAlignOptions}
				/>
				<AlignmentToolbar
					value={textAlignment}
					onChange={value => setAttributes( { textAlignment: value } )}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={ 'kadence/icon' }>

				<InspectorControlTabs
					panelName={ 'icon' }
					allowedTabs={ [ 'general', 'advanced' ] }
					setActiveTab={ ( value ) => setActiveTab( value ) }
					activeTab={ activeTab }
				/>

				{( activeTab === 'general' ) &&
					<>
						<KadencePanelBody
							title={__( 'Icon Count', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-icon-count'}
						>
							<StepControls
								label={__( 'Number of Icons', 'kadence-blocks' )}
								value={iconCount}
								onChange={ newcount => {
									const newicons = icons;
									if ( newicons.length < newcount ) {
										const amount = Math.abs( newcount - newicons.length );
										{
											times( amount, n => {
												newicons.push( {
													icon        : newicons[ 0 ].icon,
													link        : newicons[ 0 ].link,
													target      : newicons[ 0 ].target,
													size        : newicons[ 0 ].size,
													tabletSize  : ( newicons[ 0 ].tabletSize ? newicons[ 0 ].tabletSize : '' ),
													mobileSize  : ( newicons[ 0 ].mobileSize ? newicons[ 0 ].mobileSize : '' ),
													width       : newicons[ 0 ].width,
													title       : newicons[ 0 ].title,
													color       : newicons[ 0 ].color,
													background  : newicons[ 0 ].background,
													border      : newicons[ 0 ].border,
													borderRadius: newicons[ 0 ].borderRadius,
													borderWidth : newicons[ 0 ].borderWidth,
													padding     : newicons[ 0 ].padding,
													style       : newicons[ 0 ].style,
													paddingUnit  : ( newicons[ 0 ].paddingUnit ? newicons[ 0 ].paddingUnit : 'px' ),
													marginUnit  : ( newicons[ 0 ].marginUnit ? newicons[ 0 ].marginUnit : 'px' ),
													margin      : ( newicons[ 0 ].margin ? newicons[ 0 ].margin : [ '', '', '', '' ] ),
													padding      : ( newicons[ 0 ].padding ? newicons[ 0 ].padding : [ 20, 20, 20, 20 ] ),
													tabletMargin      : ( newicons[ 0 ].tabletMargin ? newicons[ 0 ].tabletMargin : [ '', '', '', '' ] ),
													mobileMargin      : ( newicons[ 0 ].mobileMargin ? newicons[ 0 ].mobileMargin : [ '', '', '', '' ] ),
													tabletPadding      : ( newicons[ 0 ].tabletPadding ? newicons[ 0 ].tabletPadding : [ '', '', '', '' ] ),
													mobilePadding      : ( newicons[ 0 ].mobilePadding ? newicons[ 0 ].mobilePadding : [ '', '', '', '' ] ),
													hColor      : ( newicons[ 0 ].hColor ? newicons[ 0 ].hColor : '' ),
													hBackground : ( newicons[ 0 ].hBackground ? newicons[ 0 ].hBackground : '' ),
													hBorder     : ( newicons[ 0 ].hBorder ? newicons[ 0 ].hBorder : '' ),
												} );
											} );
										}
										setAttributes( { icons: newicons } );
										saveArrayUpdate( { title: icons[ 0 ].title }, 0 );
									}
									setAttributes( { iconCount: newcount } );
								}}
								min={1}
								max={10}
							/>
							<ResponsiveAlignControls
								label={__( 'Icons Alignment', 'kadence-blocks' )}
								value={( textAlignment ? textAlignment : '' )}
								mobileValue={( mobileTextAlignment ? mobileTextAlignment : '' )}
								tabletValue={( tabletTextAlignment ? tabletTextAlignment : '' )}
								onChange={( nextAlign ) => setAttributes( { textAlignment: nextAlign } )}
								onChangeTablet={( nextAlign ) => setAttributes( { tabletTextAlignment: nextAlign } )}
								onChangeMobile={( nextAlign ) => setAttributes( { mobileTextAlignment: nextAlign } )}
							/>
						</KadencePanelBody>
						{renderSettings}

					</>
				}
				{ ( activeTab === 'advanced' ) &&
					<>
						{ renderAdvancedSettings }

						<KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ 'kadence/icon' } excludedAttrs={ [ 'iconCount' ] } preventMultiple={ [ 'icons' ] } />

					</>
				}
			</KadenceInspectorControls>
			<div className={`kt-svg-icons ${clientId} kt-svg-icons-${uniqueID}${previewTextAlign ? ' kb-icon-halign-' + previewTextAlign : ''}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`}>
				{times( iconCount, n => renderIconsPreview( n ) )}
			</div>
		</div>
	);
}

export default ( KadenceIcons );

