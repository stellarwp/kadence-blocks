/**
 * BLOCK: Kadence Tabs
 */

/**
 * Import Icons
 */
import icons from '../../icons';

/**
 * Import External
 */
import times from 'lodash/times';
import map from 'lodash/map';
import classnames from 'classnames';
import memoize from 'memize';
import WebfontLoader from '../../fontloader';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import IcoNames from '../../svgiconsnames';
import FaIco from '../../faicons';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import TypographyControls from '../../typography-control';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
} = wp.components;
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;

const ALLOWED_BLOCKS = [ 'kadence/tab' ];
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
class KadenceTabs extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			hovered: 'false',
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfig = kadence_blocks_params.config[ 'kadence/tabs' ];
			if ( blockConfig !== undefined && typeof blockConfig === 'object' ) {
				Object.keys( blockConfig ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfig[ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else if ( this.props.attributes.uniqueID && this.props.attributes.uniqueID !== '_' + this.props.clientId.substr( 2, 9 ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}
	}
	saveArrayUpdate( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { titles } = attributes;

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
	render() {
		const { attributes: { uniqueID, tabCount, blockAlignment, mobileLayout, currentTab, tabletLayout, layout, innerPadding, minHeight, maxWidth, titles, titleColor, titleColorHover, titleColorActive, titleBg, titleBgHover, titleBgActive, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, borderRadius, titleBorderWidth, titleBorderControl, titleBorder, titleBorderHover, titleBorderActive, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, innerPaddingControl, contentBorder, contentBorderControl, contentBorderColor, titlePadding, titlePaddingControl, titleMargin, titleMarginControl, contentBgColor, tabAlignment, titleBorderRadiusControl, titleBorderRadius, iSize }, className, setAttributes } = this.props;
		const layoutClass = ( ! layout ? 'tabs' : layout );
		const borderTypes = [
			{ key: 'linked', name: __( 'Linked' ), icon: icons.linked },
			{ key: 'individual', name: __( 'Individual' ), icon: icons.individual },
		];
		const radiusTypes = [
			{ key: 'linked', name: __( 'Linked' ), icon: icons.radiuslinked },
			{ key: 'individual', name: __( 'Individual' ), icon: icons.radiusindividual },
		];
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
		];
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const config = ( googleFont ? gconfig : '' );
		const fontMin = ( sizeType === 'em' ? 0.2 : 5 );
		const fontMax = ( sizeType === 'em' ? 12 : 200 );
		const fontStep = ( sizeType === 'em' ? 0.1 : 1 );
		const lineMin = ( lineType === 'em' ? 0.2 : 5 );
		const lineMax = ( lineType === 'em' ? 12 : 200 );
		const lineStep = ( lineType === 'em' ? 0.1 : 1 );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const classes = classnames( className, `kt-tabs-wrap kt-tabs-id${ uniqueID } kt-tabs-has-${ tabCount }-tabs kt-active-tab-${ currentTab } kt-tabs-layout-${ layoutClass } kt-tabs-block kt-tabs-tablet-layout-${ tabLayoutClass } kt-tabs-mobile-layout-${ mobileLayoutClass } kt-tab-alignment-${ tabAlignment }` );
		const mLayoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: icons.tabs },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: icons.vtabs },
			{ key: 'accordion', name: __( 'Accordion' ), icon: icons.accordion },
		];
		const layoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: icons.tabs },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: icons.vtabs },
		];
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		const mobileControls = (
			<div>
				<PanelBody>
					<p className="components-base-control__label">{ __( 'Mobile Layout' ) }</p>
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
				</PanelBody>
			</div>
		);
		const tabletControls = (
			<PanelBody>
				<p className="components-base-control__label">{ __( 'Tablet Layout' ) }</p>
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
			</PanelBody>
		);

		const deskControls = (
			<Fragment>
				<PanelBody>
					<RangeControl
						label={ __( 'Tabs' ) }
						value={ tabCount }
						onChange={ ( nexttabs ) => {
							const newtabs = titles;
							if ( newtabs.length < nexttabs ) {
								const amount = Math.abs( nexttabs - newtabs.length );
								{ times( amount, n => {
									const tabnumber = nexttabs - n;
									newtabs.push( {
										text: sprintf( __( 'Tab %d' ), tabnumber ),
										icon: titles[ 0 ].icon,
										iconSide: titles[ 0 ].iconSide,
										onlyIcon: titles[ 0 ].iconHover,
									} );
								} ); }
								setAttributes( { titles: newtabs } );
							}
							setAttributes( {
								tabCount: nexttabs,
							} );
						} }
						min={ 1 }
						max={ 24 }
					/>
					<p className="components-base-control__label">{ __( 'Layout' ) }</p>
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
				</PanelBody>
			</Fragment>
		);
		const tabControls = (
			<TabPanel className="kt-inspect-tabs"
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
								tabout = mobileControls;
							} else if ( 'tablet' === tab.name ) {
								tabout = tabletControls;
							} else {
								tabout = deskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const renderTitles = ( index ) => {
			return (
				<Fragment>
					<li className={ `kt-title-item kt-title-item-${ index } kt-tabs-svg-show-${ ( ! titles[ index ].onlyIcon ? 'always' : 'only' ) } kt-tabs-icon-side-${ ( titles[ index ].iconSide ? titles[ index ].iconSide : 'right' ) } kt-tabs-has-icon-${ ( titles[ index ].icon ? 'true' : 'false' ) } kt-tab-title-${ ( 1 + index === currentTab ? 'active' : 'inactive' ) }` } style={ {
						margin: ( titleMargin ? titleMargin[ 0 ] + 'px ' + titleMargin[ 1 ] + 'px ' + titleMargin[ 2 ] + 'px ' + titleMargin[ 3 ] + 'px' : '' ),
					} }>
						<div className={ `kt-tab-title kt-tab-title-${ 1 + index }` } style={ {
							backgroundColor: titleBg,
							color: titleColor,
							fontSize: size + sizeType,
							lineHeight: lineHeight + lineType,
							fontWeight: fontWeight,
							fontStyle: fontStyle,
							letterSpacing: letterSpacing + 'px',
							fontFamily: ( typography ? typography : '' ),
							borderTopLeftRadius: borderRadius + 'px',
							borderTopRightRadius: borderRadius + 'px',
							borderWidth: ( titleBorderWidth ? titleBorderWidth[ 0 ] + 'px ' + titleBorderWidth[ 1 ] + 'px ' + titleBorderWidth[ 2 ] + 'px ' + titleBorderWidth[ 3 ] + 'px' : '' ),
							borderRadius: ( titleBorderRadius ? titleBorderRadius[ 0 ] + 'px ' + titleBorderRadius[ 1 ] + 'px ' + titleBorderRadius[ 2 ] + 'px ' + titleBorderRadius[ 3 ] + 'px' : '' ),
							padding: ( titlePadding ? titlePadding[ 0 ] + 'px ' + titlePadding[ 1 ] + 'px ' + titlePadding[ 2 ] + 'px ' + titlePadding[ 3 ] + 'px' : '' ),
							borderColor: titleBorder,
						} } onClick={ () => setAttributes( { currentTab: 1 + index } ) } onKeyPress={ () => setAttributes( { currentTab: 1 + index } ) } tabIndex="0" role="button">
							{ titles[ index ].icon && 'right' !== titles[ index ].iconSide && (
								<GenIcon className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! iSize ? '14' : iSize ) } icon={ ( 'fa' === titles[ index ].icon.substring( 0, 2 ) ? FaIco[ titles[ index ].icon ] : Ico[ titles[ index ].icon ] ) } />
							) }
							<RichText
								tagName="div"
								placeholder={ __( 'Tab Title' ) }
								value={ titles[ index ].text }
								unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
								onChange={ value => {
									this.saveArrayUpdate( { text: value }, index );
								} }
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
								className={ 'kt-title-text' }
								style={ {
									lineHeight: lineHeight + lineType,
								} }
								keepPlaceholderOnFocus
							/>
							{ titles[ index ].icon && 'right' === titles[ index ].iconSide && (
								<GenIcon className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! iSize ? '14' : iSize ) } icon={ ( 'fa' === titles[ index ].icon.substring( 0, 2 ) ? FaIco[ titles[ index ].icon ] : Ico[ titles[ index ].icon ] ) } />
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
		const renderTitleSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Tab' ) + ' ' + ( index + 1 ) + ' ' + __( 'Icon' ) }
					initialOpen={ false }
				>
					<FontIconPicker
						icons={ IcoNames }
						value={ titles[ index ].icon }
						onChange={ value => {
							this.saveArrayUpdate( { icon: value }, index );
						} }
						appendTo="body"
						renderFunc={ renderSVG }
						theme="default"
						isMulti={ false }
					/>
					<SelectControl
						label={ __( 'Icon Location' ) }
						value={ titles[ index ].iconSide }
						options={ [
							{ value: 'right', label: __( 'Right' ) },
							{ value: 'left', label: __( 'Left' ) },
							{ value: 'top', label: __( 'Top' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { iconSide: value }, index );
						} }
					/>
					<ToggleControl
						label={ __( 'Show Only Icon?' ) }
						checked={ titles[ index ].onlyIcon }
						onChange={ value => {
							this.saveArrayUpdate( { onlyIcon: value }, index );
						} }
					/>
				</PanelBody>
			);
		};
		const normalSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Title Color' ) }</p>
				<ColorPalette
					value={ titleColor }
					onChange={ ( value ) => setAttributes( { titleColor: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Title Background' ) }</p>
				<ColorPalette
					value={ titleBg }
					onChange={ ( value ) => setAttributes( { titleBg: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Title Border Color' ) }</p>
				<ColorPalette
					value={ titleBorder }
					onChange={ ( value ) => setAttributes( { titleBorder: value } ) }
				/>
			</Fragment>
		);
		const hoverSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Hover Color' ) }</p>
				<ColorPalette
					value={ titleColorHover }
					onChange={ ( value ) => setAttributes( { titleColorHover: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Hover Background' ) }</p>
				<ColorPalette
					value={ titleBgHover }
					onChange={ ( value ) => setAttributes( { titleBgHover: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Hover Border Color' ) }</p>
				<ColorPalette
					value={ titleBorderHover }
					onChange={ ( value ) => setAttributes( { titleBorderHover: value } ) }
				/>
			</Fragment>
		);
		const activeSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Active Color' ) }</p>
				<ColorPalette
					value={ titleColorActive }
					onChange={ ( value ) => setAttributes( { titleColorActive: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Active Background' ) }</p>
				<ColorPalette
					value={ titleBgActive }
					onChange={ ( value ) => setAttributes( { titleBgActive: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Active Border Color' ) }</p>
				<ColorPalette
					value={ titleBorderActive }
					onChange={ ( value ) => setAttributes( { titleBorderActive: value } ) }
				/>
			</Fragment>
		);
		const sizeDeskControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Font Size' ) }
					value={ ( size ? size : '' ) }
					onChange={ ( value ) => setAttributes( { size: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Line Height' ) }
					value={ ( lineHeight ? lineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { lineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const sizeTabletControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Tablet Font Size' ) }
					value={ ( tabSize ? tabSize : '' ) }
					onChange={ ( value ) => setAttributes( { tabSize: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Tablet Line Height' ) }
					value={ ( tabLineHeight ? tabLineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { tabLineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const sizeMobileControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Mobile Font Size' ) }
					value={ ( mobileSize ? mobileSize : '' ) }
					onChange={ ( value ) => setAttributes( { mobileSize: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Mobile Line Height' ) }
					value={ ( mobileLineHeight ? mobileLineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { mobileLineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const sizeTabControls = (
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
							// check which size tab to show.
							if ( 'mobile' === tab.name ) {
								tabout = sizeMobileControls;
							} else if ( 'tablet' === tab.name ) {
								tabout = sizeTabletControls;
							} else {
								tabout = sizeDeskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const renderCSS = (
			<style>
				{ `.kt-tabs-id${ uniqueID } .kt-title-item:hover .kt-tab-title {
					color: ${ titleColorHover } !important;
					border-color: ${ titleBorderHover } !important;
					background-color: ${ titleBgHover } !important;
				}
				.kt-tabs-id${ uniqueID } .kt-title-item.kt-tab-title-active .kt-tab-title, .kt-tabs-id${ uniqueID } .kt-title-item.kt-tab-title-active:hover .kt-tab-title {
					color: ${ titleColorActive } !important;
					border-color: ${ titleBorderActive } !important;
					background-color: ${ titleBgActive } !important;
				}` }
			</style>
		);
		return (
			<Fragment>
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
				</BlockControls>
				<InspectorControls>
					{ tabControls }
					<PanelBody
						title={ __( 'Content Settings' ) }
						initialOpen={ false }
					>
						<p className="kt-setting-label">{ __( 'Content Background' ) }</p>
						<ColorPalette
							value={ contentBgColor }
							onChange={ ( value ) => setAttributes( { contentBgColor: value } ) }
						/>
						<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Padding Control Type' ) }>
							{ map( borderTypes, ( { name, key, icon } ) => (
								<Tooltip text={ name }>
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ innerPaddingControl === key }
										aria-pressed={ innerPaddingControl === key }
										onClick={ () => setAttributes( { innerPaddingControl: key } ) }
									>
										{ icon }
									</Button>
								</Tooltip>
							) ) }
						</ButtonGroup>
						{ innerPaddingControl && innerPaddingControl !== 'individual' && (
							<RangeControl
								label={ __( 'Inner Content Padding (px)' ) }
								value={ ( innerPadding ? innerPadding[ 0 ] : '' ) }
								onChange={ ( value ) => setAttributes( { innerPadding: [ value, value, value, value ] } ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
						) }
						{ innerPaddingControl && innerPaddingControl === 'individual' && (
							<Fragment>
								<p className="kt-setting-label">{ __( 'Inner Content Padding (px)' ) }</p>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinetop }
									value={ ( innerPadding ? innerPadding[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { innerPadding: [ value, innerPadding[ 1 ], innerPadding[ 2 ], innerPadding[ 3 ] ] } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineright }
									value={ ( innerPadding ? innerPadding[ 1 ] : '' ) }
									onChange={ ( value ) => setAttributes( { innerPadding: [ innerPadding[ 0 ], value, innerPadding[ 2 ], innerPadding[ 3 ] ] } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinebottom }
									value={ ( innerPadding ? innerPadding[ 2 ] : '' ) }
									onChange={ ( value ) => setAttributes( { innerPadding: [ innerPadding[ 0 ], innerPadding[ 1 ], value, innerPadding[ 3 ] ] } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineleft }
									value={ ( innerPadding ? innerPadding[ 3 ] : '' ) }
									onChange={ ( value ) => setAttributes( { innerPadding: [ innerPadding[ 0 ], innerPadding[ 1 ], innerPadding[ 2 ], value ] } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
							</Fragment>
						) }
						<p className="kt-setting-label">{ __( 'Border Color' ) }</p>
						<ColorPalette
							value={ contentBorderColor }
							onChange={ ( value ) => setAttributes( { contentBorderColor: value } ) }
						/>
						<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Border Control Type' ) }>
							{ map( borderTypes, ( { name, key, icon } ) => (
								<Tooltip text={ name }>
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ contentBorderControl === key }
										aria-pressed={ contentBorderControl === key }
										onClick={ () => setAttributes( { contentBorderControl: key } ) }
									>
										{ icon }
									</Button>
								</Tooltip>
							) ) }
						</ButtonGroup>
						{ contentBorderControl && contentBorderControl !== 'individual' && (
							<RangeControl
								label={ __( 'Content Border Width (px)' ) }
								value={ ( contentBorder ? contentBorder[ 0 ] : '' ) }
								onChange={ ( value ) => setAttributes( { contentBorder: [ value, value, value, value ] } ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
						) }
						{ contentBorderControl && contentBorderControl === 'individual' && (
							<Fragment>
								<p className="kt-setting-label">{ __( 'Content Border Width (px)' ) }</p>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinetop }
									value={ ( contentBorder ? contentBorder[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { contentBorder: [ value, contentBorder[ 1 ], contentBorder[ 2 ], contentBorder[ 3 ] ] } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineright }
									value={ ( contentBorder ? contentBorder[ 1 ] : '' ) }
									onChange={ ( value ) => setAttributes( { contentBorder: [ contentBorder[ 0 ], value, contentBorder[ 2 ], contentBorder[ 3 ] ] } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinebottom }
									value={ ( contentBorder ? contentBorder[ 2 ] : '' ) }
									onChange={ ( value ) => setAttributes( { contentBorder: [ contentBorder[ 0 ], contentBorder[ 1 ], value, contentBorder[ 3 ] ] } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineleft }
									value={ ( contentBorder ? contentBorder[ 3 ] : '' ) }
									onChange={ ( value ) => setAttributes( { contentBorder: [ contentBorder[ 0 ], contentBorder[ 1 ], contentBorder[ 2 ], value ] } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
							</Fragment>
						) }
					</PanelBody>
					<PanelBody title={ __( 'Tab Title Settings' ) }>
						<PanelBody
							title={ __( 'Color Settings' ) }
							initialOpen={ false }
						>
							<TabPanel className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
								activeClass="active-tab"
								tabs={ [
									{
										name: 'normal',
										title: __( 'Normal' ),
										className: 'kt-normal-tab',
									},
									{
										name: 'hover',
										title: __( 'Hover' ),
										className: 'kt-hover-tab',
									},
									{
										name: 'active',
										title: __( 'Active' ),
										className: 'kt-active-tab',
									},
								] }>
								{
									( tab ) => {
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
										return <div>{ tabout }</div>;
									}
								}
							</TabPanel>
						</PanelBody>
						<PanelBody
							title={ __( 'Title Spacing/Border' ) }
							initialOpen={ false }
						>
							<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Padding Control Type' ) }>
								{ map( borderTypes, ( { name, key, icon } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ titlePaddingControl === key }
											aria-pressed={ titlePaddingControl === key }
											onClick={ () => setAttributes( { titlePaddingControl: key } ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
							{ titlePaddingControl && titlePaddingControl !== 'individual' && (
								<RangeControl
									label={ __( 'Title Paddding (px)' ) }
									value={ ( titlePadding ? titlePadding[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titlePadding: [ value, value, value, value ] } ) }
									min={ 0 }
									max={ 50 }
									step={ 1 }
								/>
							) }
							{ titlePaddingControl && titlePaddingControl === 'individual' && (
								<Fragment>
									<p className="kt-setting-label">{ __( 'Title Paddding (px)' ) }</p>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlinetop }
										value={ ( titlePadding ? titlePadding[ 0 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titlePadding: [ value, ( titlePadding ? titlePadding[ 1 ] : 0 ), ( titlePadding ? titlePadding[ 2 ] : 0 ), ( titlePadding ? titlePadding[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 50 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlineright }
										value={ ( titlePadding ? titlePadding[ 1 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titlePadding: [ ( titlePadding ? titlePadding[ 0 ] : 0 ), value, ( titlePadding ? titlePadding[ 2 ] : 0 ), ( titlePadding ? titlePadding[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 50 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlinebottom }
										value={ ( titlePadding ? titlePadding[ 2 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titlePadding: [ ( titlePadding ? titlePadding[ 0 ] : 0 ), ( titlePadding ? titlePadding[ 1 ] : 0 ), value, ( titlePadding ? titlePadding[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 50 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlineleft }
										value={ ( titlePadding ? titlePadding[ 3 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titlePadding: [ ( titlePadding ? titlePadding[ 0 ] : 0 ), ( titlePadding ? titlePadding[ 1 ] : 0 ), ( titlePadding ? titlePadding[ 2 ] : 0 ), value ] } ) }
										min={ 0 }
										max={ 50 }
										step={ 1 }
									/>
								</Fragment>
							) }
							<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Margin Control Type' ) }>
								{ map( borderTypes, ( { name, key, icon } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ titleMarginControl === key }
											aria-pressed={ titleMarginControl === key }
											onClick={ () => setAttributes( { titleMarginControl: key } ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
							{ titleMarginControl && titleMarginControl !== 'individual' && (
								<RangeControl
									label={ __( 'Title Margin (px)' ) }
									value={ ( titleMargin ? titleMargin[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titleMargin: [ value, value, value, value ] } ) }
									min={ -25 }
									max={ 25 }
									step={ 1 }
								/>
							) }
							{ titleMarginControl && titleMarginControl === 'individual' && (
								<Fragment>
									<p className="kt-setting-label">{ __( 'Title Margin (px)' ) }</p>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlinetop }
										value={ ( titleMargin ? titleMargin[ 0 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleMargin: [ value, ( titleMargin ? titleMargin[ 1 ] : 0 ), ( titleMargin ? titleMargin[ 2 ] : 0 ), ( titleMargin ? titleMargin[ 3 ] : 0 ) ] } ) }
										min={ -25 }
										max={ 25 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlineright }
										value={ ( titleMargin ? titleMargin[ 1 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleMargin: [ ( titleMargin ? titleMargin[ 0 ] : 0 ), value, ( titleMargin ? titleMargin[ 2 ] : 0 ), ( titleMargin ? titleMargin[ 3 ] : 0 ) ] } ) }
										min={ -25 }
										max={ 50 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlinebottom }
										value={ ( titleMargin ? titleMargin[ 2 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleMargin: [ ( titleMargin ? titleMargin[ 0 ] : 0 ), ( titleMargin ? titleMargin[ 1 ] : 0 ), value, ( titleMargin ? titleMargin[ 3 ] : 0 ) ] } ) }
										min={ -25 }
										max={ 25 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlineleft }
										value={ ( titleMargin ? titleMargin[ 3 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleMargin: [ ( titleMargin ? titleMargin[ 0 ] : 0 ), ( titleMargin ? titleMargin[ 1 ] : 0 ), ( titleMargin ? titleMargin[ 2 ] : 0 ), value ] } ) }
										min={ -25 }
										max={ 50 }
										step={ 1 }
									/>
								</Fragment>
							) }
							<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Border Control Type' ) }>
								{ map( borderTypes, ( { name, key, icon } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ titleBorderControl === key }
											aria-pressed={ titleBorderControl === key }
											onClick={ () => setAttributes( { titleBorderControl: key } ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
							{ titleBorderControl && titleBorderControl !== 'individual' && (
								<RangeControl
									label={ __( 'Title Border Width (px)' ) }
									value={ ( titleBorderWidth ? titleBorderWidth[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titleBorderWidth: [ value, value, value, value ] } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
							) }
							{ titleBorderControl && titleBorderControl === 'individual' && (
								<Fragment>
									<p className="kt-setting-label">{ __( 'Title Border Width (px)' ) }</p>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlinetop }
										value={ ( titleBorderWidth ? titleBorderWidth[ 0 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderWidth: [ value, ( titleBorderWidth ? titleBorderWidth[ 1 ] : 0 ), ( titleBorderWidth ? titleBorderWidth[ 2 ] : 0 ), ( titleBorderWidth ? titleBorderWidth[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 20 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlineright }
										value={ ( titleBorderWidth ? titleBorderWidth[ 1 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderWidth: [ ( titleBorderWidth ? titleBorderWidth[ 0 ] : 0 ), value, ( titleBorderWidth ? titleBorderWidth[ 2 ] : 0 ), ( titleBorderWidth ? titleBorderWidth[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 20 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlinebottom }
										value={ ( titleBorderWidth ? titleBorderWidth[ 2 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderWidth: [ ( titleBorderWidth ? titleBorderWidth[ 0 ] : 0 ), ( titleBorderWidth ? titleBorderWidth[ 1 ] : 0 ), value, ( titleBorderWidth ? titleBorderWidth[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 20 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlineleft }
										value={ ( titleBorderWidth ? titleBorderWidth[ 3 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderWidth: [ ( titleBorderWidth ? titleBorderWidth[ 0 ] : 0 ), ( titleBorderWidth ? titleBorderWidth[ 1 ] : 0 ), ( titleBorderWidth ? titleBorderWidth[ 2 ] : 0 ), value ] } ) }
										min={ 0 }
										max={ 20 }
										step={ 1 }
									/>
								</Fragment>
							) }
							<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Border Radius Control Type' ) }>
								{ map( radiusTypes, ( { name, key, icon } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ titleBorderRadiusControl === key }
											aria-pressed={ titleBorderRadiusControl === key }
											onClick={ () => setAttributes( { titleBorderRadiusControl: key } ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
							{ titleBorderRadiusControl && titleBorderRadiusControl !== 'individual' && (
								<RangeControl
									label={ __( 'Title Border Radius (px)' ) }
									value={ ( titleBorderRadius ? titleBorderRadius[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titleBorderRadius: [ value, value, value, value ] } ) }
									min={ 0 }
									max={ 50 }
									step={ 1 }
								/>
							) }
							{ titleBorderRadiusControl && titleBorderRadiusControl === 'individual' && (
								<Fragment>
									<p className="kt-setting-label">{ __( 'Title Border Radius (px)' ) }</p>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.topleft }
										value={ ( titleBorderRadius ? titleBorderRadius[ 0 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderRadius: [ value, ( titleBorderRadius ? titleBorderRadius[ 1 ] : 0 ), ( titleBorderRadius ? titleBorderRadius[ 2 ] : 0 ), ( titleBorderRadius ? titleBorderRadius[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 50 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.topright }
										value={ ( titleBorderRadius ? titleBorderRadius[ 1 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderRadius: [ titleBorderRadius[ 0 ], value, ( titleBorderRadius ? titleBorderRadius[ 2 ] : 0 ), ( titleBorderRadius ? titleBorderRadius[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 50 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.bottomright }
										value={ ( titleBorderRadius ? titleBorderRadius[ 2 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderRadius: [ titleBorderRadius[ 0 ], ( titleBorderRadius ? titleBorderRadius[ 1 ] : 0 ), value, ( titleBorderRadius ? titleBorderRadius[ 3 ] : 0 ) ] } ) }
										min={ 0 }
										max={ 50 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.bottomleft }
										value={ ( titleBorderRadius ? titleBorderRadius[ 3 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderRadius: [ titleBorderRadius[ 0 ], ( titleBorderRadius ? titleBorderRadius[ 1 ] : 0 ), ( titleBorderRadius ? titleBorderRadius[ 2 ] : 0 ), value ] } ) }
										min={ 0 }
										max={ 50 }
										step={ 1 }
									/>
								</Fragment>
							) }
						</PanelBody>
						<PanelBody
							title={ __( 'Font Settings' ) }
							initialOpen={ false }
						>
							<TypographyControls
								fontFamily={ typography }
								onFontFamily={ ( value ) => setAttributes( { typography: value } ) }
								googleFont={ googleFont }
								onFontChange={ ( select ) => {
									setAttributes( {
										typography: select.value,
										googleFont: select.google,
									} );
								} }
								onGoogleFont={ ( value ) => setAttributes( { googleFont: value } ) }
								loadGoogleFont={ loadGoogleFont }
								onLoadGoogleFont={ ( value ) => setAttributes( { loadGoogleFont: value } ) }
								fontVariant={ fontVariant }
								onFontVariant={ ( value ) => setAttributes( { fontVariant: value } ) }
								fontWeight={ fontWeight }
								onFontWeight={ ( value ) => setAttributes( { fontWeight: value } ) }
								fontStyle={ fontStyle }
								onFontStyle={ ( value ) => setAttributes( { fontStyle: value } ) }
								fontSubset={ fontSubset }
								onFontSubset={ ( value ) => setAttributes( { fontSubset: value } ) }
							/>
							<h2 className="kt-heading-size-title">{ __( 'Size Controls' ) }</h2>
							{ sizeTabControls }
							<RangeControl
								label={ __( 'Letter Spacing' ) }
								value={ ( letterSpacing ? letterSpacing : '' ) }
								onChange={ ( value ) => setAttributes( { letterSpacing: value } ) }
								min={ -5 }
								max={ 15 }
								step={ 0.1 }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Icon Settings' ) }
							initialOpen={ false }
						>
							<RangeControl
								label={ __( 'Icon Size' ) }
								value={ ( iSize ? iSize : '' ) }
								onChange={ ( value ) => setAttributes( { iSize: value } ) }
								min={ 2 }
								max={ 120 }
								step={ 1 }
							/>
							{ times( tabCount, n => renderTitleSettings( n ) ) }
						</PanelBody>
					</PanelBody>
					<PanelBody
						title={ __( 'Structure Settings' ) }
						initialOpen={ false }
					>
						<RangeControl
							label={ __( 'Content Minimium Height' ) }
							value={ minHeight }
							onChange={ ( value ) => {
								setAttributes( {
									minHeight: value,
								} );
							} }
							min={ 0 }
							max={ 1000 }
						/>
						<RangeControl
							label={ __( 'Max Width' ) }
							value={ maxWidth }
							onChange={ ( value ) => {
								setAttributes( {
									maxWidth: value,
								} );
							} }
							min={ 0 }
							max={ 2000 }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ classes } >
					<div className="kt-tabs-wrap" style={ {
						maxWidth: maxWidth + 'px',
					} }>
						<ul className="kt-tabs-title-list">
							{ renderPreviewArray }
						</ul>
						{ googleFont && (
							<WebfontLoader config={ config }>
							</WebfontLoader>
						) }
						<div className="kt-tabs-content-wrap" style={ {
							padding: ( innerPadding ? innerPadding[ 0 ] + 'px ' + innerPadding[ 1 ] + 'px ' + innerPadding[ 2 ] + 'px ' + innerPadding[ 3 ] + 'px' : '' ),
							borderWidth: ( contentBorder ? contentBorder[ 0 ] + 'px ' + contentBorder[ 1 ] + 'px ' + contentBorder[ 2 ] + 'px ' + contentBorder[ 3 ] + 'px' : '' ),
							minHeight: minHeight + 'px',
							backgroundColor: contentBgColor,
							borderColor: contentBorderColor,
						} }>
							<InnerBlocks
								template={ getPanesTemplate( tabCount ) }
								templateLock="all"
								allowedBlocks={ ALLOWED_BLOCKS } />
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}
export default ( KadenceTabs );
