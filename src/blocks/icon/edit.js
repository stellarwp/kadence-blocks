/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icons
 */
import {
	individualIcon,
	linkedIcon,
	outlineBottomIcon,
	outlineLeftIcon,
	outlineRightIcon,
	outlineTopIcon,
} from '@kadence/icons';

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
	InspectorControlTabs
} from '@kadence/components';
import { KadenceColorOutput } from '@kadence/helpers';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
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
	RangeControl,
	TextControl,
	SelectControl,
	Button,
	Dashicon,
	TabPanel,
	ToolbarGroup,
	ButtonGroup,
	Tooltip,
} from '@wordpress/components';


/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kticonUniqueIDs = [];

function KadenceIcons( { attributes, className, setAttributes, clientId, context } ) {

	const { iconCount, inQueryBlock, icons, blockAlignment, textAlignment, tabletTextAlignment, mobileTextAlignment, uniqueID, verticalAlignment } = attributes;

	const [ marginControl, setMarginControl ] = useState( 'linked' );
	const [ activeTab, setActiveTab ] = useState( 'general' );

	useEffect( () => {
		if ( !uniqueID ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kticonUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( kticonUniqueIDs.includes( uniqueID ) ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kticonUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			kticonUniqueIDs.push( uniqueID );
		}
		if ( context && context.queryId && context.postId ) {
			if ( !inQueryBlock ) {
				setAttributes( {
					inQueryBlock: true,
				} );
			}
		} else if ( inQueryBlock ) {
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

	const controlTypes = [
		{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), micon: linkedIcon },
		{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), micon: individualIcon },
	];

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
	const tabAlignControls = (
		<TabPanel className="kt-size-tabs"
				  activeClass="active-tab"
				  tabs={[
					  {
						  name     : 'desk',
						  title    : <Dashicon icon="desktop"/>,
						  className: 'kt-desk-tab',
					  },
					  {
						  name     : 'tablet',
						  title    : <Dashicon icon="tablet"/>,
						  className: 'kt-tablet-tab',
					  },
					  {
						  name     : 'mobile',
						  title    : <Dashicon icon="smartphone"/>,
						  className: 'kt-mobile-tab',
					  },
				  ]}>
			{
				( tab ) => {
					let tabout;
					if ( tab.name ) {
						if ( 'mobile' === tab.name ) {
							tabout = (
								<AlignmentToolbar
									value={mobileTextAlignment}
									isCollapsed={false}
									onChange={( nextAlign ) => {
										setAttributes( { mobileTextAlignment: nextAlign } );
									}}
								/>
							);
						} else if ( 'tablet' === tab.name ) {
							tabout = (
								<AlignmentToolbar
									value={tabletTextAlignment}
									isCollapsed={false}
									onChange={( nextAlign ) => {
										setAttributes( { tabletTextAlignment: nextAlign } );
									}}
								/>
							);
						} else {
							tabout = (
								<AlignmentToolbar
									value={textAlignment}
									isCollapsed={false}
									onChange={( nextAlign ) => {
										setAttributes( { textAlignment: nextAlign } );
									}}
								/>
							);
						}
					}
					return <div className={tab.className} key={tab.className}>{tabout}</div>;
				}
			}
		</TabPanel>
	);
	const hoverSettings = ( index ) => {
		return (
			<Fragment>
				<PopColorControl
					label={__( 'Icon Hover Color', 'kadence-blocks' )}
					value={( icons[ index ].hColor ? icons[ index ].hColor : '' )}
					default={''}
					onChange={value => {
						saveArrayUpdate( { hColor: value }, index );
					}}
				/>
				<SelectControl
					label={__( 'Icon Style', 'kadence-blocks' )}
					value={icons[ index ].style}
					options={[
						{ value: 'default', label: __( 'Default', 'kadence-blocks' ) },
						{ value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
					]}
					onChange={value => {
						saveArrayUpdate( { style: value }, index );
					}}
				/>
				{icons[ index ].style !== 'default' && (
					<Fragment>
						<PopColorControl
							label={__( 'Hover Background Color', 'kadence-blocks' )}
							value={( icons[ index ].hBackground ? icons[ index ].hBackground : '' )}
							default={''}
							onChange={value => {
								saveArrayUpdate( { hBackground: value }, index );
							}}
						/>
					</Fragment>
				)}
				{icons[ index ].style !== 'default' && (
					<Fragment>
						<PopColorControl
							label={__( 'Hover Border Color', 'kadence-blocks' )}
							value={( icons[ index ].hBorder ? icons[ index ].hBorder : '' )}
							default={''}
							onChange={value => {
								saveArrayUpdate( { hBorder: value }, index );
							}}
						/>
					</Fragment>
				)}
			</Fragment>
		);
	};
	const normalSettings = ( index ) => {
		return (
			<Fragment>
				<PopColorControl
					label={__( 'Icon Color', 'kadence-blocks' )}
					value={( icons[ index ].color ? icons[ index ].color : '' )}
					default={''}
					onChange={value => {
						saveArrayUpdate( { color: value }, index );
					}}
				/>
				<SelectControl
					label={__( 'Icon Style', 'kadence-blocks' )}
					value={icons[ index ].style}
					options={[
						{ value: 'default', label: __( 'Default', 'kadence-blocks' ) },
						{ value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
					]}
					onChange={value => {
						saveArrayUpdate( { style: value }, index );
					}}
				/>
				{icons[ index ].style !== 'default' && (
					<Fragment>
						<PopColorControl
							label={__( 'background Color', 'kadence-blocks' )}
							value={( icons[ index ].background ? icons[ index ].background : '' )}
							default={''}
							onChange={value => {
								saveArrayUpdate( { background: value }, index );
							}}
						/>
					</Fragment>
				)}
				{icons[ index ].style !== 'default' && (
					<Fragment>
						<PopColorControl
							label={__( 'Border Color', 'kadence-blocks' )}
							value={( icons[ index ].border ? icons[ index ].border : '' )}
							default={''}
							onChange={value => {
								saveArrayUpdate( { border: value }, index );
							}}
						/>
					</Fragment>
				)}
			</Fragment>
		);
	};
	const renderIconSettings = ( index ) => {
		return (
			<KadencePanelBody
				title={__( 'Icon', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' )}
				initialOpen={( 1 === iconCount ? true : false )}
				panelName={'kb-icon-settings-' + index}
			>
				<IconControl
					value={icons[ index ].icon}
					onChange={value => {
						saveArrayUpdate( { icon: value }, index );
					}}
				/>
				<RangeControl
					label={__( 'Icon Size', 'kadence-blocks' )}
					value={icons[ index ].size}
					onChange={value => {
						saveArrayUpdate( { size: value }, index );
					}}
					min={5}
					max={250}
				/>
				{icons[ index ].icon && 'fe' === icons[ index ].icon.substring( 0, 2 ) && (
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
				)}
				<h2 className="kt-tab-wrap-title kt-color-settings-title">{__( 'Color Settings', 'kadence-blocks' )}</h2>
				<TabPanel className="kt-inspect-tabs kt-hover-tabs"
						  activeClass="active-tab"
						  tabs={[
							  {
								  name     : 'normal' + index,
								  title    : __( 'Normal', 'kadence-blocks' ),
								  className: 'kt-normal-tab',
							  },
							  {
								  name     : 'hover' + index,
								  title    : __( 'Hover', 'kadence-blocks' ),
								  className: 'kt-hover-tab',
							  },
						  ]}>
					{
						( tab ) => {
							let tabout;
							if ( tab.name ) {
								if ( 'hover' + index === tab.name ) {
									tabout = hoverSettings( index );
								} else {
									tabout = normalSettings( index );
								}
							}
							return <div className={tab.className} key={tab.className}>{tabout}</div>;
						}
					}
				</TabPanel>
				{icons[ index ].style !== 'default' && (
					<RangeControl
						label={__( 'Border Size (px)', 'kadence-blocks' )}
						value={icons[ index ].borderWidth}
						onChange={value => {
							saveArrayUpdate( { borderWidth: value }, index );
						}}
						min={0}
						max={20}
					/>
				)}
				{icons[ index ].style !== 'default' && (
					<RangeControl
						label={__( 'Border Radius (%)', 'kadence-blocks' )}
						value={icons[ index ].borderRadius}
						onChange={value => {
							saveArrayUpdate( { borderRadius: value }, index );
						}}
						min={0}
						max={50}
					/>
				)}
				{icons[ index ].style !== 'default' && (
					<RangeControl
						label={__( 'Padding (px)', 'kadence-blocks' )}
						value={icons[ index ].padding}
						onChange={value => {
							saveArrayUpdate( { padding: value }, index );
						}}
						min={0}
						max={180}
					/>
				)}
				<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={__( 'Margin Control Type', 'kadence-blocks' )}>
					{map( controlTypes, ( { name, key, micon } ) => (
						<Tooltip text={name}>
							<Button
								key={key}
								className="kt-size-btn"
								isSmall
								isPrimary={marginControl === key}
								aria-pressed={marginControl === key}
								onClick={() => setMarginControl( key )}
							>
								{micon}
							</Button>
						</Tooltip>
					) )}
				</ButtonGroup>
				{marginControl && marginControl !== 'individual' && (
					<RangeControl
						label={__( 'Margin (px)', 'kadence-blocks' )}
						value={( icons[ index ].marginTop ? icons[ index ].marginTop : 0 )}
						onChange={( value ) => {
							saveArrayUpdate( {
								marginTop   : value,
								marginRight : value,
								marginBottom: value,
								marginLeft  : value,
							}, index );
						}}
						min={0}
						max={180}
						step={1}
					/>
				)}
				{marginControl && marginControl === 'individual' && (
					<Fragment>
						<p>{__( 'Margin (px)', 'kadence-blocks' )}</p>
						<RangeControl
							className="kt-icon-rangecontrol"
							label={outlineTopIcon}
							value={( icons[ index ].marginTop ? icons[ index ].marginTop : 0 )}
							onChange={value => {
								saveArrayUpdate( { marginTop: value }, index );
							}}
							min={0}
							max={180}
							step={1}
						/>
						<RangeControl
							className="kt-icon-rangecontrol"
							label={outlineRightIcon}
							value={( icons[ index ].marginRight ? icons[ index ].marginRight : 0 )}
							onChange={value => {
								saveArrayUpdate( { marginRight: value }, index );
							}}
							min={0}
							max={180}
							step={1}
						/>
						<RangeControl
							className="kt-icon-rangecontrol"
							label={outlineBottomIcon}
							value={( icons[ index ].marginBottom ? icons[ index ].marginBottom : 0 )}
							onChange={value => {
								saveArrayUpdate( { marginBottom: value }, index );
							}}
							min={0}
							max={180}
							step={1}
						/>
						<RangeControl
							className="kt-icon-rangecontrol"
							label={outlineLeftIcon}
							value={( icons[ index ].marginLeft ? icons[ index ].marginLeft : 0 )}
							onChange={value => {
								saveArrayUpdate( { marginLeft: value }, index );
							}}
							min={0}
							max={180}
							step={1}
						/>
					</Fragment>
				)}
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
	const renderIconsPreview = ( index ) => {
		return (
			<div className={`kt-svg-style-${icons[ index ].style} kt-svg-icon-wrap kt-svg-item-${index}`}>
				{icons[ index ].icon && (
					<IconRender className={`kt-svg-icon kt-svg-icon-${icons[ index ].icon}`} name={icons[ index ].icon} size={icons[ index ].size}
								strokeWidth={( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined )} title={( icons[ index ].title ? icons[ index ].title : '' )}
								style={{
									color          : ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
									padding        : ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor    : ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
									borderWidth    : ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius   : ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									marginTop      : ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
									marginRight    : ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
									marginBottom   : ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
									marginLeft     : ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
								}}/>
				)}
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
			<InspectorControls>

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
								onChange={newcount => {
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
													width       : newicons[ 0 ].width,
													title       : newicons[ 0 ].title,
													color       : newicons[ 0 ].color,
													background  : newicons[ 0 ].background,
													border      : newicons[ 0 ].border,
													borderRadius: newicons[ 0 ].borderRadius,
													borderWidth : newicons[ 0 ].borderWidth,
													padding     : newicons[ 0 ].padding,
													style       : newicons[ 0 ].style,
													marginTop   : ( newicons[ 0 ].marginTop ? newicons[ 0 ].marginTop : 0 ),
													marginRight : ( newicons[ 0 ].marginRight ? newicons[ 0 ].marginRight : 0 ),
													marginBottom: ( newicons[ 0 ].marginBottom ? newicons[ 0 ].marginBottom : 0 ),
													marginLeft  : ( newicons[ 0 ].marginLeft ? newicons[ 0 ].marginLeft : 0 ),
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
							<div className="kb-sidebar-alignment components-base-control">
								<p className="kb-component-label kb-responsive-label">{__( 'Text Alignment', 'kadence-blocks' )}</p>
								{tabAlignControls}
							</div>
						</KadencePanelBody>
						{renderSettings}

					</>
				}
			</InspectorControls>
			<div className={`kt-svg-icons ${clientId} kt-svg-icons-${uniqueID}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`} style={{
				textAlign: ( textAlignment ? textAlignment : 'center' ),
			}}>
				{times( iconCount, n => renderIconsPreview( n ) )}
			</div>
		</div>
	);
}

export default ( KadenceIcons );

