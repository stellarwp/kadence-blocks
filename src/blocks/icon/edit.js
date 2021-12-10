/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icons
 */
import editorIcons from '../../icons';

/**
 * Import Icon stuff
 */
import times from 'lodash/times';
import map from 'lodash/map';
import IconControl from '../../components/icons/icon-control';
import IconRender from '../../components/icons/icon-render';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import KadenceColorOutput from '../../components/color/kadence-color-output';
import StepControl from '../../step-control';
import VerticalAlignmentIcon from '../../components/common/vertical-align-icons';
import URLInputControl from '../../components/links/link-control';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

const {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.blockEditor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
	Button,
	Dashicon,
	TabPanel,
	ToolbarGroup,
	ButtonGroup,
	Tooltip,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kticonUniqueIDs = [];

class KadenceIcons extends Component {
	constructor() {
		super( ...arguments );
		this.saveArrayUpdate = this.saveArrayUpdate.bind( this );
		this.state = {
			marginControl: 'linked',
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kticonUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kticonUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			kticonUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kticonUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( this.props.context && this.props.context.queryId && this.props.context.postId ) {
			if ( ! this.props.attributes.inQueryBlock ) {
				this.props.setAttributes( {
					inQueryBlock: true,
				} );
			}
		} else if ( this.props.attributes.inQueryBlock ) {
			this.props.setAttributes( {
				inQueryBlock: false,
			} );
		}
	}
	saveArrayUpdate( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { icons } = attributes;

		const newItems = icons.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			icons: newItems,
		} );
	}
	render() {
		const { attributes: { iconCount, icons, blockAlignment, textAlignment, tabletTextAlignment, mobileTextAlignment, uniqueID, verticalAlignment }, className, setAttributes, clientId } = this.props;
		const { marginControl } = this.state;
		const controlTypes = [
			{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), micon: editorIcons.linked },
			{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), micon: editorIcons.individual },
		];
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
		const tabAlignControls = (
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
									<AlignmentToolbar
										value={ mobileTextAlignment }
										isCollapsed={ false }
										onChange={ ( nextAlign ) => {
											setAttributes( { mobileTextAlignment: nextAlign } );
										} }
									/>
								);
							} else if ( 'tablet' === tab.name ) {
								tabout = (
									<AlignmentToolbar
										value={ tabletTextAlignment }
										isCollapsed={ false }
										onChange={ ( nextAlign ) => {
											setAttributes( { tabletTextAlignment: nextAlign } );
										} }
									/>
								);
							} else {
								tabout = (
									<AlignmentToolbar
										value={ textAlignment }
										isCollapsed={ false }
										onChange={ ( nextAlign ) => {
											setAttributes( { textAlignment: nextAlign } );
										} }
									/>
								);
							}
						}
						return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const hoverSettings = ( index ) => {
			return (
				<Fragment>
					<AdvancedPopColorControl
						label={ __( 'Icon Hover Color', 'kadence-blocks' ) }
						colorValue={ ( icons[ index ].hColor ? icons[ index ].hColor : '' ) }
						colorDefault={ '' }
						onColorChange={ value => {
							this.saveArrayUpdate( { hColor: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Icon Style', 'kadence-blocks' ) }
						value={ icons[ index ].style }
						options={ [
							{ value: 'default', label: __( 'Default', 'kadence-blocks' ) },
							{ value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { style: value }, index );
						} }
					/>
					{ icons[ index ].style !== 'default' && (
						<Fragment>
							<AdvancedPopColorControl
								label={ __( 'Hover Background Color', 'kadence-blocks' ) }
								colorValue={ ( icons[ index ].hBackground ? icons[ index ].hBackground : '' ) }
								colorDefault={ '' }
								onColorChange={ value => {
									this.saveArrayUpdate( { hBackground: value }, index );
								} }
							/>
						</Fragment>
					) }
					{ icons[ index ].style !== 'default' && (
						<Fragment>
							<AdvancedPopColorControl
								label={ __( 'Hover Border Color', 'kadence-blocks' ) }
								colorValue={ ( icons[ index ].hBorder ? icons[ index ].hBorder : '' ) }
								colorDefault={ '' }
								onColorChange={ value => {
									this.saveArrayUpdate( { hBorder: value }, index );
								} }
							/>
						</Fragment>
					) }
				</Fragment>
			);
		};
		const normalSettings = ( index ) => {
			return (
				<Fragment>
					<AdvancedPopColorControl
						label={ __( 'Icon Color', 'kadence-blocks' ) }
						colorValue={ ( icons[ index ].color ? icons[ index ].color : '' ) }
						colorDefault={ '' }
						onColorChange={ value => {
							this.saveArrayUpdate( { color: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Icon Style', 'kadence-blocks' ) }
						value={ icons[ index ].style }
						options={ [
							{ value: 'default', label: __( 'Default', 'kadence-blocks' ) },
							{ value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { style: value }, index );
						} }
					/>
					{ icons[ index ].style !== 'default' && (
						<Fragment>
							<AdvancedPopColorControl
								label={ __( 'background Color', 'kadence-blocks' ) }
								colorValue={ ( icons[ index ].background ? icons[ index ].background : '' ) }
								colorDefault={ '' }
								onColorChange={ value => {
									this.saveArrayUpdate( { background: value }, index );
								} }
							/>
						</Fragment>
					) }
					{ icons[ index ].style !== 'default' && (
						<Fragment>
							<AdvancedPopColorControl
								label={ __( 'Border Color', 'kadence-blocks' ) }
								colorValue={ ( icons[ index ].border ? icons[ index ].border : '' ) }
								colorDefault={ '' }
								onColorChange={ value => {
									this.saveArrayUpdate( { border: value }, index );
								} }
							/>
						</Fragment>
					) }
				</Fragment>
			);
		};
		const renderIconSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Icon', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' ) }
					initialOpen={ ( 1 === iconCount ? true : false ) }
				>
					<IconControl
						value={ icons[ index ].icon }
						onChange={ value => {
							this.saveArrayUpdate( { icon: value }, index );
						} }
					/>
					<RangeControl
						label={ __( 'Icon Size', 'kadence-blocks' ) }
						value={ icons[ index ].size }
						onChange={ value => {
							this.saveArrayUpdate( { size: value }, index );
						} }
						min={ 5 }
						max={ 250 }
					/>
					{ icons[ index ].icon && 'fe' === icons[ index ].icon.substring( 0, 2 ) && (
						<RangeControl
							label={ __( 'Line Width' ) }
							value={ icons[ index ].width }
							onChange={ value => {
								this.saveArrayUpdate( { width: value }, index );
							} }
							step={ 0.5 }
							min={ 0.5 }
							max={ 4 }
						/>
					) }
					<h2 className="kt-tab-wrap-title kt-color-settings-title">{ __( 'Color Settings', 'kadence-blocks' ) }</h2>
					<TabPanel className="kt-inspect-tabs kt-hover-tabs"
						activeClass="active-tab"
						tabs={ [
							{
								name: 'normal' + index,
								title: __( 'Normal', 'kadence-blocks' ),
								className: 'kt-normal-tab',
							},
							{
								name: 'hover' + index,
								title: __( 'Hover', 'kadence-blocks' ),
								className: 'kt-hover-tab',
							},
						] }>
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
								return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
							}
						}
					</TabPanel>
					{ icons[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Border Size (px)', 'kadence-blocks' ) }
							value={ icons[ index ].borderWidth }
							onChange={ value => {
								this.saveArrayUpdate( { borderWidth: value }, index );
							} }
							min={ 0 }
							max={ 20 }
						/>
					) }
					{ icons[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Border Radius (%)', 'kadence-blocks' ) }
							value={ icons[ index ].borderRadius }
							onChange={ value => {
								this.saveArrayUpdate( { borderRadius: value }, index );
							} }
							min={ 0 }
							max={ 50 }
						/>
					) }
					{ icons[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Padding (px)', 'kadence-blocks' ) }
							value={ icons[ index ].padding }
							onChange={ value => {
								this.saveArrayUpdate( { padding: value }, index );
							} }
							min={ 0 }
							max={ 180 }
						/>
					) }
					<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Margin Control Type', 'kadence-blocks' ) }>
						{ map( controlTypes, ( { name, key, micon } ) => (
							<Tooltip text={ name }>
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ marginControl === key }
									aria-pressed={ marginControl === key }
									onClick={ () => this.setState( { marginControl: key } ) }
								>
									{ micon }
								</Button>
							</Tooltip>
						) ) }
					</ButtonGroup>
					{ marginControl && marginControl !== 'individual' && (
						<RangeControl
							label={ __( 'Margin (px)', 'kadence-blocks' ) }
							value={ ( icons[ index ].marginTop ? icons[ index ].marginTop : 0 ) }
							onChange={ ( value ) => {
								this.saveArrayUpdate( {
									marginTop: value,
									marginRight: value,
									marginBottom: value,
									marginLeft: value,
								}, index );
							} }
							min={ 0 }
							max={ 180 }
							step={ 1 }
						/>
					) }
					{ marginControl && marginControl === 'individual' && (
						<Fragment>
							<p>{ __( 'Margin (px)', 'kadence-blocks' ) }</p>
							<RangeControl
								className="kt-icon-rangecontrol"
								label={ editorIcons.outlinetop }
								value={ ( icons[ index ].marginTop ? icons[ index ].marginTop : 0 ) }
								onChange={ value => {
									this.saveArrayUpdate( { marginTop: value }, index );
								} }
								min={ 0 }
								max={ 180 }
								step={ 1 }
							/>
							<RangeControl
								className="kt-icon-rangecontrol"
								label={ editorIcons.outlineright }
								value={ ( icons[ index ].marginRight ? icons[ index ].marginRight : 0 ) }
								onChange={ value => {
									this.saveArrayUpdate( { marginRight: value }, index );
								} }
								min={ 0 }
								max={ 180 }
								step={ 1 }
							/>
							<RangeControl
								className="kt-icon-rangecontrol"
								label={ editorIcons.outlinebottom }
								value={ ( icons[ index ].marginBottom ? icons[ index ].marginBottom : 0 ) }
								onChange={ value => {
									this.saveArrayUpdate( { marginBottom: value }, index );
								} }
								min={ 0 }
								max={ 180 }
								step={ 1 }
							/>
							<RangeControl
								className="kt-icon-rangecontrol"
								label={ editorIcons.outlineleft }
								value={ ( icons[ index ].marginLeft ? icons[ index ].marginLeft : 0 ) }
								onChange={ value => {
									this.saveArrayUpdate( { marginLeft: value }, index );
								} }
								min={ 0 }
								max={ 180 }
								step={ 1 }
							/>
						</Fragment>
					) }
					<URLInputControl
						label={ __( 'Link', 'kadence-blocks' ) }
						url={ icons[ index ].link }
						onChangeUrl={ value => {
							this.saveArrayUpdate( { link: value }, index );
						} }
						additionalControls={ true }
						opensInNewTab={ ( icons[ index ].target && '_blank' == icons[ index ].target ? true : false ) }
						onChangeTarget={ value => {
							if ( value ) {
									this.saveArrayUpdate( { target: '_blank' }, index );
							} else {
									this.saveArrayUpdate( { target: '_self' }, index );
							}
						} }
						dynamicAttribute={ 'icons:' + index + ':link' }
						linkTitle={ icons[ index ].linkTitle }
						onChangeTitle={ value => {
							this.saveArrayUpdate( { linkTitle: value }, index );
						} }
						{ ...this.props }
					/>
					<TextControl
						label={ __( 'Title for Accessibility', 'kadence-blocks' ) }
						value={ icons[ index ].title }
						onChange={ value => {
							this.saveArrayUpdate( { title: value }, index );
						} }
					/>
				</PanelBody>
			);
		};
		const renderSettings = (
			<div>
				{ times( iconCount, n => renderIconSettings( n ) ) }
			</div>
		);
		const renderIconsPreview = ( index ) => {
			return (
				<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` } >
					{ icons[ index ].icon && (
						<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
							color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
							backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
							padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
							borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
							borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
							borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
							marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
							marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
							marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
							marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
						} } />
					) }
				</div>
			);
		};
		const renderIconCSS = ( index ) => {
			return (
				`.kt-svg-icons-${ uniqueID } .kt-svg-item-${ index }:hover .kt-svg-icon {
					${ ( undefined !== icons[ index ].hColor && icons[ index ].hColor ? 'color:' + KadenceColorOutput( icons[ index ].hColor ) + '!important;' : '' ) }
					${ ( undefined !== icons[ index ].hBackground && icons[ index ].hBackground ? 'background:' + KadenceColorOutput( icons[ index ].hBackground ) + '!important;' : '' ) }
					${ ( undefined !== icons[ index ].hBorder && icons[ index ].hBorder ? 'border-color:' + KadenceColorOutput( icons[ index ].hBorder ) + '!important;' : '' ) }
				}`
			);
		};
		const renderCSS = (
			<style>
				{ times( iconCount, n => renderIconCSS( n ) ) }
			</style>
		);
		return (
			<div className={ className }>
				{ renderCSS }
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'left', 'right' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
					<ToolbarGroup
						isCollapsed={ true }
						icon={ <VerticalAlignmentIcon value={ ( verticalAlignment ? verticalAlignment : 'bottom' ) } /> }
						label={ __( 'Vertical Align', 'kadence-blocks' )  }
						controls={ verticalAlignOptions }
					/>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ value => setAttributes( { textAlignment: value } ) }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody
						title={ __( 'Icon Count', 'kadence-blocks' ) }
						initialOpen={ true }
					>
						<StepControl
							label={ __( 'Number of Icons', 'kadence-blocks' ) }
							value={ iconCount }
							onChange={ newcount => {
								const newicons = icons;
								if ( newicons.length < newcount ) {
									const amount = Math.abs( newcount - newicons.length );
									{ times( amount, n => {
										newicons.push( {
											icon: newicons[ 0 ].icon,
											link: newicons[ 0 ].link,
											target: newicons[ 0 ].target,
											size: newicons[ 0 ].size,
											width: newicons[ 0 ].width,
											title: newicons[ 0 ].title,
											color: newicons[ 0 ].color,
											background: newicons[ 0 ].background,
											border: newicons[ 0 ].border,
											borderRadius: newicons[ 0 ].borderRadius,
											borderWidth: newicons[ 0 ].borderWidth,
											padding: newicons[ 0 ].padding,
											style: newicons[ 0 ].style,
											marginTop: ( newicons[ 0 ].marginTop ? newicons[ 0 ].marginTop : 0 ),
											marginRight: ( newicons[ 0 ].marginRight ? newicons[ 0 ].marginRight : 0 ),
											marginBottom: ( newicons[ 0 ].marginBottom ? newicons[ 0 ].marginBottom : 0 ),
											marginLeft: ( newicons[ 0 ].marginLeft ? newicons[ 0 ].marginLeft : 0 ),
											hColor: ( newicons[ 0 ].hColor ? newicons[ 0 ].hColor : '' ),
											hBackground: ( newicons[ 0 ].hBackground ? newicons[ 0 ].hBackground : '' ),
											hBorder: ( newicons[ 0 ].hBorder ? newicons[ 0 ].hBorder : '' ),
										} );
									} ); }
									setAttributes( { icons: newicons } );
									this.saveArrayUpdate( { title: icons[ 0 ].title }, 0 );
								}
								setAttributes( { iconCount: newcount } );
							} }
							min={ 1 }
							max={ 10 }
						/>
						<div className="kb-sidebar-alignment components-base-control">
							<p className="kb-component-label kb-responsive-label">{ __( 'Text Alignment', 'kadence-blocks' ) }</p>
							{ tabAlignControls }
						</div>
					</PanelBody>
					{ renderSettings }
				</InspectorControls>
				<div className={ `kt-svg-icons ${ clientId } kt-svg-icons-${ uniqueID }${ verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : '' }` } style={ {
					textAlign: ( textAlignment ? textAlignment : 'center' ),
				} } >
					{ times( iconCount, n => renderIconsPreview( n ) ) }
				</div>
			</div>
		);
	}
}
export default ( KadenceIcons );

