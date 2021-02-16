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
import TypographyControls from '../../typography-control';
import MeasurementControls from '../../measurement-control';
import filter from 'lodash/filter';
import IconControl from '../../icon-control';
import IconRender from '../../icon-render';
import KadenceColorOutput from '../../kadence-color-output';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
/**
 * Import Css
 */
import './editor.scss';
const {
	createBlock,
} = wp.blocks;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.blockEditor;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	TextControl,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;

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
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kttabsUniqueIDs = [];
/**
 * Build the row edit
 */
class KadenceTabs extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.onMoveForward = this.onMoveForward.bind( this );
		this.onMoveBack = this.onMoveBack.bind( this );
		this.state = {
			hovered: 'false',
			showPreset: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const oldBlockConfig = kadence_blocks_params.config[ 'kadence/tabs' ];
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/tabs' ] !== undefined && typeof blockConfigObject[ 'kadence/tabs' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/tabs' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/tabs' ][ attribute ];
				} );
			} else if ( oldBlockConfig !== undefined && typeof oldBlockConfig === 'object' ) {
				Object.keys( oldBlockConfig ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = oldBlockConfig[ attribute ];
				} );
			}
			if ( this.props.attributes.showPresets ) {
				this.setState( { showPreset: true } );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kttabsUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kttabsUniqueIDs.push( this.props.attributes.uniqueID );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/tabs' ] !== undefined && typeof blockSettings[ 'kadence/tabs' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/tabs' ] } );
		}
	}
	showSettings( key ) {
		if ( undefined === this.state.settings[ key ] || 'all' === this.state.settings[ key ] ) {
			return true;
		} else if ( 'contributor' === this.state.settings[ key ] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'author' === this.state.settings[ key ] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'editor' === this.state.settings[ key ] && ( 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'admin' === this.state.settings[ key ] && 'admin' === this.state.user ) {
			return true;
		}
		return false;
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
	onMove( oldIndex, newIndex ) {
		const titles = [ ...this.props.attributes.titles ];
		titles.splice( newIndex, 1, this.props.attributes.titles[ oldIndex ] );
		titles.splice( oldIndex, 1, this.props.attributes.titles[ newIndex ] );
		this.props.setAttributes( { titles: titles, currentTab: parseInt( newIndex + 1 ) } );
		if ( this.props.attributes.startTab === ( oldIndex + 1 ) ) {
			this.props.setAttributes( { startTab: ( newIndex + 1 ) } );
		} else if ( this.props.attributes.startTab === ( newIndex + 1 ) ) {
			this.props.setAttributes( { startTab: ( oldIndex + 1 ) } );
		}
		this.props.moveTab( this.props.tabsBlock.innerBlocks[ oldIndex ].clientId, newIndex );
		this.props.resetOrder();
		this.props.setAttributes( { currentTab: parseInt( newIndex + 1 ) } );
	}

	onMoveForward( oldIndex ) {
		return () => {
			if ( oldIndex === this.props.realTabsCount - 1 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex + 1 );
		};
	}

	onMoveBack( oldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex - 1 );
		};
	}
	render() {
		const { attributes: { uniqueID, tabCount, blockAlignment, mobileLayout, currentTab, tabletLayout, layout, innerPadding, minHeight, maxWidth, titles, titleColor, titleColorHover, titleColorActive, titleBg, titleBgHover, titleBgActive, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, borderRadius, titleBorderWidth, titleBorderControl, titleBorder, titleBorderHover, titleBorderActive, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, innerPaddingControl, contentBorder, contentBorderControl, contentBorderColor, titlePadding, titlePaddingControl, titleMargin, titleMarginControl, contentBgColor, tabAlignment, titleBorderRadiusControl, titleBorderRadius, iSize, startTab, enableSubtitle, subtitleFont, tabWidth, gutter, widthType }, clientId, className, setAttributes } = this.props;
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
			{ key: 'simple', name: __( 'Simple' ), icon: icons.tabsSimple },
			{ key: 'boldbg', name: __( 'Boldbg' ), icon: icons.tabsBold },
			{ key: 'center', name: __( 'Center' ), icon: icons.tabsCenter },
			{ key: 'vertical', name: __( 'Vertical' ), icon: icons.tabsVertical },
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
					titleBorderRadiusControl: 'individual',
					titlePadding: [ 8, 20, 8, 20 ],
					titlePaddingControl: 'individual',
					titleMargin: [ 0, 8, -1, 0 ],
					titleMarginControl: 'individual',
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
					contentBorderControl: 'linked',
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
					titleBorderRadiusControl: 'individual',
					titlePadding: [ 8, 20, 8, 20 ],
					titlePaddingControl: 'individual',
					titleMargin: [ 0, 8, 0, 0 ],
					titleMarginControl: 'individual',
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
					contentBorderControl: 'individual',
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
					titleBorderRadiusControl: 'individual',
					titlePadding: [ 8, 20, 8, 20 ],
					titlePaddingControl: 'individual',
					titleMargin: [ 0, 8, 0, 0 ],
					titleMarginControl: 'individual',
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
					contentBorderControl: 'individual',
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
					titleBorderRadiusControl: 'individual',
					titlePadding: [ 12, 8, 12, 20 ],
					titlePaddingControl: 'individual',
					titleMargin: [ 0, -4, 10, 0 ],
					titleMarginControl: 'individual',
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
					contentBorderControl: 'linked',
					minHeight: 400,
				} );
			}
		};
		const config = ( googleFont ? gconfig : '' );
		const fontMin = ( sizeType === 'em' ? 0.2 : 5 );
		const fontMax = ( sizeType === 'em' ? 12 : 200 );
		const fontStep = ( sizeType === 'em' ? 0.1 : 1 );
		const lineMin = ( lineType === 'px' ? 5 : 0.2 );
		const lineMax = ( lineType === 'px' ? 200 : 12 );
		const lineStep = ( lineType === 'px' ? 1 : 0.1 );
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
					<h2>{ __( 'Set initial Open Tab' ) }</h2>
					<ButtonGroup aria-label={ __( 'initial Open Tab' ) }>
						{ times( tabCount, n => (
							<Button
								key={ n + 1 }
								className="kt-init-open-tab"
								isSmall
								isPrimary={ startTab === n + 1 }
								aria-pressed={ startTab === n + 1 }
								onClick={ () => setAttributes( { startTab: n + 1 } ) }
							>
								{ __( 'Tab' ) + ' ' + ( n + 1 ) }
							</Button>
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
						return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
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
						margin: ( titleMargin ? titleMargin[ 0 ] + 'px ' + ( 'tabs' === layout && widthType === 'percent' ? '0px ' : titleMargin[ 1 ] + 'px ' ) + titleMargin[ 2 ] + 'px ' + ( 'tabs' === layout && widthType === 'percent' ? '0px ' : titleMargin[ 3 ] + 'px ' ) : '' ),
					} }>
						<div className={ `kt-tab-title kt-tab-title-${ 1 + index }` } style={ {
							backgroundColor: KadenceColorOutput( titleBg ),
							color: KadenceColorOutput( titleColor ),
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
							borderColor: KadenceColorOutput( titleBorder ),
							marginRight: ( 'tabs' === layout && widthType === 'percent' ? gutter[ 0 ] + 'px' : undefined ),
						} } onClick={ () => setAttributes( { currentTab: 1 + index } ) } onKeyPress={ () => setAttributes( { currentTab: 1 + index } ) } tabIndex="0" role="button">
							{ titles[ index ] && titles[ index ].icon && 'right' !== titles[ index ].iconSide && (
								<IconRender className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! iSize ? '14' : iSize ) } htmltag="span" />
							) }
							{ ( undefined === enableSubtitle || ! enableSubtitle ) && (
								<RichText
									tagName="div"
									placeholder={ __( 'Tab Title' ) }
									value={ ( titles[ index ] && titles[ index ].text ? titles[ index ].text : '' ) }
									unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
									onChange={ value => {
										this.saveArrayUpdate( { text: value }, index );
									} }
									allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
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
										placeholder={ __( 'Tab Title' ) }
										value={ ( titles[ index ] && titles[ index ].text ? titles[ index ].text : '' ) }
										unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
										onChange={ value => {
											this.saveArrayUpdate( { text: value }, index );
										} }
										allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
										className={ 'kt-title-text' }
										style={ {
											lineHeight: lineHeight + lineType,
										} }
										keepPlaceholderOnFocus
									/>
									<RichText
										tagName="div"
										placeholder={ __( 'Tab subtitle' ) }
										value={ ( undefined !== titles[ index ] && undefined !== titles[ index ].subText ? titles[ index ].subText : '' ) }
										unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
										onChange={ value => {
											this.saveArrayUpdate( { subText: value }, index );
										} }
										allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
										className={ 'kt-title-sub-text' }
										style={ {
											fontWeight: subFont[ 0 ].weight,
											fontStyle: subFont[ 0 ].style,
											fontSize: subFont[ 0 ].size[ 0 ] + subFont[ 0 ].sizeType,
											lineHeight: ( subFont[ 0 ].lineHeight && subFont[ 0 ].lineHeight[ 0 ] ? subFont[ 0 ].lineHeight[ 0 ] + subFont[ 0 ].lineType : undefined ),
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
								<IconButton
									icon={ ( 'vtabs' === layout ? 'arrow-up' : 'arrow-left' ) }
									onClick={ index === 0 ? undefined : this.onMoveBack( index ) }
									className="kadence-blocks-tab-item__move-back"
									label={ ( 'vtabs' === layout ? __( 'Move Item Up' ) : __( 'Move Item Back' ) ) }
									aria-disabled={ index === 0 }
									disabled={ index === 0 }
								/>
							) }
							{ ( index + 1 ) !== tabCount && (
								<IconButton
									icon={ ( 'vtabs' === layout ? 'arrow-down' : 'arrow-right' ) }
									onClick={ ( index + 1 ) === tabCount ? undefined : this.onMoveForward( index ) }
									className="kadence-blocks-tab-item__move-forward"
									label={ ( 'vtabs' === layout ? __( 'Move Item Down' ) : __( 'Move Item Forward' ) ) }
									aria-disabled={ ( index + 1 ) === tabCount }
									disabled={ ( index + 1 ) === tabCount }
								/>
							) }
							{ tabCount > 1 && (
								<IconButton
									icon="no-alt"
									onClick={ () => {
										const removeClientId = this.props.tabsBlock.innerBlocks[ index ].clientId;
										const currentItems = filter( this.props.attributes.titles, ( item, i ) => index !== i );
										const newCount = tabCount - 1;
										let newStartTab;
										if ( startTab === ( index + 1 ) ) {
											newStartTab = '';
										} else if ( startTab > ( index + 1 ) ) {
											newStartTab = startTab - 1;
										} else {
											newStartTab = startTab;
										}
										setAttributes( { titles: currentItems, tabCount: newCount, currentTab: ( index === 0 ? 1 : index ), startTab: newStartTab } );
										this.props.removeTab( removeClientId );
										this.props.resetOrder();
									} }
									className="kadence-blocks-tab-item__remove"
									label={ __( 'Remove Item' ) }
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
				<PanelBody
					title={ __( 'Tab' ) + ' ' + ( index + 1 ) + ' ' + __( 'Anchor' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'HTML Anchor' ) }
						help={ __( 'Anchors lets you link directly to a tab.' ) }
						value={ titles[ index ] && titles[ index ].anchor ? titles[ index ].anchor : '' }
						onChange={ ( nextValue ) => {
							nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
							this.saveArrayUpdate( { anchor: nextValue }, index );
						} } />
				</PanelBody>
			);
		};
		const renderTitleSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Tab' ) + ' ' + ( index + 1 ) + ' ' + __( 'Icon' ) }
					initialOpen={ false }
				>
					<IconControl
						value={ titles[ index ] && titles[ index ].icon ? titles[ index ].icon : '' }
						onChange={ value => {
							this.saveArrayUpdate( { icon: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Icon Location' ) }
						value={ ( titles[ index ] && titles[ index ].iconSide ? titles[ index ].iconSide : 'right' ) }
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
						checked={ ( titles[ index ] && titles[ index ].onlyIcon ? titles[ index ].onlyIcon : false ) }
						onChange={ value => {
							this.saveArrayUpdate( { onlyIcon: value }, index );
						} }
					/>
				</PanelBody>
			);
		};
		const normalSettings = (
			<Fragment>
				<AdvancedPopColorControl
					label={ __( 'Title Color' ) }
					colorValue={ ( titleColor ? titleColor : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleColor: value } ) }
				/>
				<AdvancedPopColorControl
					label={ __( 'Title Background' ) }
					colorValue={ ( titleBg ? titleBg : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBg: value } ) }
				/>
				<AdvancedPopColorControl
					label={ __( 'Title Border Color' ) }
					colorValue={ ( titleBorder ? titleBorder : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBorder: value } ) }
				/>
			</Fragment>
		);
		const hoverSettings = (
			<Fragment>
				<AdvancedPopColorControl
					label={ __( 'Hover Color' ) }
					colorValue={ ( titleColorHover ? titleColorHover : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleColorHover: value } ) }
				/>
				<AdvancedPopColorControl
					label={ __( 'Hover Background' ) }
					colorValue={ ( titleBgHover ? titleBgHover : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBgHover: value } ) }
				/>
				<AdvancedPopColorControl
					label={ __( 'Hover Border Color' ) }
					colorValue={ ( titleBorderHover ? titleBorderHover : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBorderHover: value } ) }
				/>
			</Fragment>
		);
		const activeSettings = (
			<Fragment>
				<AdvancedPopColorControl
					label={ __( 'Active Color' ) }
					colorValue={ ( titleColorActive ? titleColorActive : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleColorActive: value } ) }
				/>
				<AdvancedPopColorControl
					label={ __( 'Active Background' ) }
					colorValue={ ( titleBgActive ? titleBgActive : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBgActive: value } ) }
				/>
				<AdvancedPopColorControl
					label={ __( 'Active Border Color' ) }
					colorValue={ ( titleBorderActive ? titleBorderActive : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBorderActive: value } ) }
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
						return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
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
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						{ this.showSettings( 'tabLayout' ) && (
							tabControls
						) }
						{ ! this.showSettings( 'tabLayout' ) && (
							<PanelBody>
								<h2>{ __( 'Set Initial Open Tab' ) }</h2>
								<ButtonGroup aria-label={ __( 'Initial Open Tab' ) }>
									{ times( tabCount, n => (
										<Button
											key={ n + 1 }
											className="kt-init-open-tab"
											isSmall
											isPrimary={ startTab === n + 1 }
											aria-pressed={ startTab === n + 1 }
											onClick={ () => setAttributes( { startTab: n + 1 } ) }
										>
											{ __( 'Tab' ) + ' ' + ( n + 1 ) }
										</Button>
									) ) }
								</ButtonGroup>
							</PanelBody>
						) }
						{ this.showSettings( 'tabContent' ) && (
							<PanelBody
								title={ __( 'Content Settings' ) }
								initialOpen={ false }
							>
								<AdvancedPopColorControl
									label={ __( 'Content Background' ) }
									colorValue={ ( contentBgColor ? contentBgColor : '' ) }
									colorDefault={ '' }
									onColorChange={ ( value ) => setAttributes( { contentBgColor: value } ) }
								/>
								<MeasurementControls
									label={ __( 'Inner Content Padding (px)' ) }
									measurement={ innerPadding }
									control={ innerPaddingControl }
									onChange={ ( value ) => setAttributes( { innerPadding: value } ) }
									onControl={ ( value ) => setAttributes( { innerPaddingControl: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<AdvancedPopColorControl
									label={ __( 'Border Color' ) }
									colorValue={ ( contentBorderColor ? contentBorderColor : '' ) }
									colorDefault={ '' }
									onColorChange={ ( value ) => setAttributes( { contentBorderColor: value } ) }
								/>
								<MeasurementControls
									label={ __( 'Content Border Width (px)' ) }
									measurement={ contentBorder }
									control={ contentBorderControl }
									onChange={ ( value ) => setAttributes( { contentBorder: value } ) }
									onControl={ ( value ) => setAttributes( { contentBorderControl: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'titleColor' ) && (
							<PanelBody
								title={ __( 'Tab Title Color Settings' ) }
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
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</PanelBody>
						) }
						{ this.showSettings( 'titleSpacing' ) && (
							<PanelBody
								title={ __( 'Tab Title Width/Spacing/Border' ) }
								initialOpen={ false }
							>
								{ 'tabs' === layout && (
									<Fragment>
										<h2>{ __( 'Tab Title Width' ) }</h2>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											initialTabName={ widthType }
											onSelect={ value => setAttributes( { widthType: value } ) }
											tabs={ [
												{
													name: 'normal',
													title: __( 'Normal' ),
													className: 'kt-normal-tab',
												},
												{
													name: 'percent',
													title: __( '% Width' ),
													className: 'kt-hover-tab',
												},
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'percent' === tab.name ) {
															tabout = (
																<Fragment>
																	<TabPanel className="kt-size-tabs kb-device-choice"
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
																			( innerTab ) => {
																				let tabContentOut;
																				if ( innerTab.name ) {
																					if ( 'mobile' === innerTab.name ) {
																						tabContentOut = (
																							<Fragment>
																								<RangeControl
																									label={ __( 'Mobile Columns' ) }
																									value={ ( tabWidth && undefined !== tabWidth[ 2 ] ? tabWidth[ 2 ] : '' ) }
																									onChange={ ( value ) => setAttributes( { tabWidth: [ tabWidth[ 0 ], tabWidth[ 1 ], value ] } ) }
																									min={ 1 }
																									max={ 8 }
																									step={ 1 }
																								/>
																								<RangeControl
																									label={ __( 'Mobile Gutter' ) }
																									value={ ( gutter && undefined !== gutter[ 2 ] ? gutter[ 2 ] : '' ) }
																									onChange={ ( value ) => setAttributes( { gutter: [ gutter[ 0 ], gutter[ 1 ], value ] } ) }
																									min={ 0 }
																									max={ 50 }
																									step={ 1 }
																								/>
																							</Fragment>
																						);
																					} else if ( 'tablet' === innerTab.name ) {
																						tabContentOut = (
																							<Fragment>
																								<RangeControl
																									label={ __( 'Tablet Columns' ) }
																									value={ ( tabWidth && undefined !== tabWidth[ 1 ] ? tabWidth[ 1 ] : '' ) }
																									onChange={ ( value ) => setAttributes( { tabWidth: [ tabWidth[ 0 ], value, tabWidth[ 2 ] ] } ) }
																									min={ 1 }
																									max={ 8 }
																									step={ 1 }
																								/>
																								<RangeControl
																									label={ __( 'Tablet Gutter' ) }
																									value={ ( gutter && undefined !== gutter[ 1 ] ? gutter[ 1 ] : '' ) }
																									onChange={ ( value ) => setAttributes( { gutter: [ gutter[ 0 ], value, gutter[ 2 ] ] } ) }
																									min={ 0 }
																									max={ 50 }
																									step={ 1 }
																								/>
																							</Fragment>
																						);
																					} else {
																						tabContentOut = (
																							<Fragment>
																								<RangeControl
																									label={ __( 'Columns' ) }
																									value={ ( tabWidth && undefined !== tabWidth[ 0 ] ? tabWidth[ 0 ] : '' ) }
																									onChange={ ( value ) => setAttributes( { tabWidth: [ value, tabWidth[ 1 ], tabWidth[ 2 ] ] } ) }
																									min={ 1 }
																									max={ 8 }
																									step={ 1 }
																								/>
																								<RangeControl
																									label={ __( 'Gutter' ) }
																									value={ ( gutter && undefined !== gutter[ 0 ] ? gutter[ 0 ] : '' ) }
																									onChange={ ( value ) => setAttributes( { gutter: [ value, gutter[ 1 ], gutter[ 2 ] ] } ) }
																									min={ 0 }
																									max={ 50 }
																									step={ 1 }
																								/>
																							</Fragment>
																						);
																					}
																				}
																				return <div>{ tabContentOut }</div>;
																			}
																		}
																	</TabPanel>
																	<MeasurementControls
																		label={ __( 'Title Padding (px)' ) }
																		measurement={ titlePadding }
																		control={ titlePaddingControl }
																		onChange={ ( value ) => setAttributes( { titlePadding: value } ) }
																		onControl={ ( value ) => setAttributes( { titlePaddingControl: value } ) }
																		min={ 0 }
																		max={ 50 }
																		step={ 1 }
																	/>
																	<RangeControl
																		label={ __( 'Top Margin (px)' ) }
																		value={ ( titleMargin && undefined !== titleMargin[ 0 ] ? titleMargin[ 0 ] : '' ) }
																		onChange={ ( value ) => setAttributes( { titleMargin: [ value, titleMargin[ 1 ], titleMargin[ 2 ], titleMargin[ 3 ] ] } ) }
																		min={ -25 }
																		max={ 25 }
																		step={ 1 }
																	/>
																	<RangeControl
																		label={ __( 'Bottom Margin (px)' ) }
																		value={ ( titleMargin && undefined !== titleMargin[ 2 ] ? titleMargin[ 2 ] : '' ) }
																		onChange={ ( value ) => setAttributes( { titleMargin: [ titleMargin[ 0 ], titleMargin[ 1 ], value, titleMargin[ 3 ] ] } ) }
																		min={ -25 }
																		max={ 25 }
																		step={ 1 }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<MeasurementControls
																		label={ __( 'Title Padding (px)' ) }
																		measurement={ titlePadding }
																		control={ titlePaddingControl }
																		onChange={ ( value ) => setAttributes( { titlePadding: value } ) }
																		onControl={ ( value ) => setAttributes( { titlePaddingControl: value } ) }
																		min={ 0 }
																		max={ 50 }
																		step={ 1 }
																	/>
																	<MeasurementControls
																		label={ __( 'Title Margin (px)' ) }
																		measurement={ titleMargin }
																		control={ titleMarginControl }
																		onChange={ ( value ) => setAttributes( { titleMargin: value } ) }
																		onControl={ ( value ) => setAttributes( { titleMarginControl: value } ) }
																		min={ -25 }
																		max={ 25 }
																		step={ 1 }
																	/>
																</Fragment>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
									</Fragment>
								) }
								{ 'tabs' !== layout && (
									<Fragment>
										<MeasurementControls
											label={ __( 'Title Padding (px)' ) }
											measurement={ titlePadding }
											control={ titlePaddingControl }
											onChange={ ( value ) => setAttributes( { titlePadding: value } ) }
											onControl={ ( value ) => setAttributes( { titlePaddingControl: value } ) }
											min={ 0 }
											max={ 50 }
											step={ 1 }
										/>
										<MeasurementControls
											label={ __( 'Title Margin (px)' ) }
											measurement={ titleMargin }
											control={ titleMarginControl }
											onChange={ ( value ) => setAttributes( { titleMargin: value } ) }
											onControl={ ( value ) => setAttributes( { titleMarginControl: value } ) }
											min={ -25 }
											max={ 25 }
											step={ 1 }
										/>
									</Fragment>
								) }
								<MeasurementControls
									label={ __( 'Title Border Width (px)' ) }
									measurement={ titleBorderWidth }
									control={ titleBorderControl }
									onChange={ ( value ) => setAttributes( { titleBorderWidth: value } ) }
									onControl={ ( value ) => setAttributes( { titleBorderControl: value } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
								<MeasurementControls
									label={ __( 'Title Border Radius (px)' ) }
									measurement={ titleBorderRadius }
									control={ titleBorderRadiusControl }
									onChange={ ( value ) => setAttributes( { titleBorderRadius: value } ) }
									onControl={ ( value ) => setAttributes( { titleBorderRadiusControl: value } ) }
									min={ 0 }
									max={ 50 }
									step={ 1 }
									controlTypes={ [
										{ key: 'linked', name: __( 'Linked' ), icon: icons.radiuslinked },
										{ key: 'individual', name: __( 'Individual' ), icon: icons.radiusindividual },
									] }
									firstIcon={ icons.topleft }
									secondIcon={ icons.topright }
									thirdIcon={ icons.bottomright }
									fourthIcon={ icons.bottomleft }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'titleFont' ) && (
							<PanelBody
								title={ __( 'Tab Title Font Settings' ) }
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
						) }
						{ this.showSettings( 'titleIcon' ) && (
							<PanelBody
								title={ __( 'Tab Title Icon Settings' ) }
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
						) }
						{ this.showSettings( 'subtitle' ) && (
							<PanelBody
								title={ __( 'Tab Subtitle Settings' ) }
								initialOpen={ false }
							>
								<ToggleControl
									label={ __( 'Show Subtitles?' ) }
									checked={ ( undefined !== enableSubtitle ? enableSubtitle : false ) }
									onChange={ value => {
										setAttributes( { enableSubtitle: value } );
									} }
								/>
								{ enableSubtitle && (
									<TypographyControls
										fontSize={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].size ? subtitleFont[ 0 ].size : [ '', '', '' ] ) }
										onFontSize={ ( value ) => saveSubtitleFont( { size: value } ) }
										fontSizeType={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].sizeType ? subtitleFont[ 0 ].sizeType : 'px' ) }
										onFontSizeType={ ( value ) => saveSubtitleFont( { sizeType: value } ) }
										lineHeight={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].lineHeight ? subtitleFont[ 0 ].lineHeight : [ '', '', '' ] ) }
										onLineHeight={ ( value ) => saveSubtitleFont( { lineHeight: value } ) }
										lineHeightType={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].lineType ? subtitleFont[ 0 ].lineType : 'px' ) }
										onLineHeightType={ ( value ) => saveSubtitleFont( { lineType: value } ) }
										letterSpacing={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].letterSpacing ? subtitleFont[ 0 ].letterSpacing : '' ) }
										onLetterSpacing={ ( value ) => saveSubtitleFont( { letterSpacing: value } ) }
										fontFamily={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].family ? subtitleFont[ 0 ].family : '' ) }
										onFontFamily={ ( value ) => saveSubtitleFont( { family: value } ) }
										onFontChange={ ( select ) => {
											saveSubtitleFont( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => saveSubtitleFont( values ) }
										googleFont={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].google ? subtitleFont[ 0 ].google : false ) }
										onGoogleFont={ ( value ) => saveSubtitleFont( { google: value } ) }
										loadGoogleFont={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].loadGoogle ? subtitleFont[ 0 ].loadGoogle : true ) }
										onLoadGoogleFont={ ( value ) => saveSubtitleFont( { loadGoogle: value } ) }
										fontVariant={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].variant ? subtitleFont[ 0 ].variant : '' ) }
										onFontVariant={ ( value ) => saveSubtitleFont( { variant: value } ) }
										fontWeight={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].weight ? subtitleFont[ 0 ].weight : '' ) }
										onFontWeight={ ( value ) => saveSubtitleFont( { weight: value } ) }
										fontStyle={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].style ? subtitleFont[ 0 ].style : '' ) }
										onFontStyle={ ( value ) => saveSubtitleFont( { style: value } ) }
										fontSubset={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].subset ? subtitleFont[ 0 ].subset : '' ) }
										onFontSubset={ ( value ) => saveSubtitleFont( { subset: value } ) }
										padding={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].padding ? subtitleFont[ 0 ].padding : [ 0, 0, 0, 0 ] ) }
										onPadding={ ( value ) => saveSubtitleFont( { padding: value } ) }
										paddingControl={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].paddingControl ? subtitleFont[ 0 ].paddingControl : 'linked' ) }
										onPaddingControl={ ( value ) => saveSubtitleFont( { paddingControl: value } ) }
										margin={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].margin ? subtitleFont[ 0 ].margin : [ 0, 0, 0, 0 ] ) }
										onMargin={ ( value ) => saveSubtitleFont( { margin: value } ) }
										marginControl={ ( subtitleFont && undefined !== subtitleFont[ 0 ] && undefined !== subtitleFont[ 0 ].marginControl ? subtitleFont[ 0 ].marginControl : 'linked' ) }
										onMarginControl={ ( value ) => saveSubtitleFont( { marginControl: value } ) }
									/>
								) }
							</PanelBody>
						) }
						{ this.showSettings( 'titleAnchor' ) && (
							<PanelBody
								title={ __( 'Tab Anchor Settings' ) }
								initialOpen={ false }
							>
								{ times( tabCount, n => renderAnchorSettings( n ) ) }
							</PanelBody>
						) }
						{ this.showSettings( 'structure' ) && (
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
						) }
					</InspectorControls>
				) }
				<div className={ classes } >
					{ this.state.showPreset && (
						<div className="kt-select-starter-style-tabs">
							<div className="kt-select-starter-style-tabs-title">
								{ __( 'Select Initial Style' ) }
							</div>
							<ButtonGroup className="kt-init-tabs-btn-group" aria-label={ __( 'Initial Style' ) }>
								{ map( startlayoutOptions, ( { name, key, icon } ) => (
									<Button
										key={ key }
										className="kt-inital-tabs-style-btn"
										isSmall
										onClick={ () => {
											setInitalLayout( key );
											this.setState( { showPreset: false } );
										} }
									>
										{ icon }
									</Button>
								) ) }
							</ButtonGroup>
						</div>
					) }
					{ ! this.state.showPreset && (
						<div className="kt-tabs-wrap" style={ {
							maxWidth: maxWidth + 'px',
						} }>
							<div className="kb-add-new-tab-contain">
								<Button
									className="kt-tab-add"
									isPrimary={ true }
									onClick={ () => {
										const newBlock = createBlock( 'kadence/tab', { id: tabCount + 1 } );
										setAttributes( { tabCount: tabCount + 1 } );
										this.props.insertTab( newBlock );
										//wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, clientId );
										const newtabs = titles;
										newtabs.push( {
											text: sprintf( __( 'Tab %d' ), tabCount + 1 ),
											icon: titles[ 0 ].icon,
											iconSide: titles[ 0 ].iconSide,
											onlyIcon: titles[ 0 ].onlyIcon,
											subText: '',
										} );
										setAttributes( { titles: newtabs } );
										this.saveArrayUpdate( { iconSide: titles[ 0 ].iconSide }, 0 );
									} }
								>
									<Dashicon icon="plus" />
									{ __( 'Add Tab' ) }
								</Button>
							</div>
							<ul className={ `kt-tabs-title-list${ ( 'tabs' === layout && widthType === 'percent' ? ' kb-tabs-list-columns kb-tab-title-columns-' + tabWidth[ 0 ] : '' ) }` }>
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
								padding: ( innerPadding ? innerPadding[ 0 ] + 'px ' + innerPadding[ 1 ] + 'px ' + innerPadding[ 2 ] + 'px ' + innerPadding[ 3 ] + 'px' : '' ),
								borderWidth: ( contentBorder ? contentBorder[ 0 ] + 'px ' + contentBorder[ 1 ] + 'px ' + contentBorder[ 2 ] + 'px ' + contentBorder[ 3 ] + 'px' : '' ),
								minHeight: minHeight + 'px',
								backgroundColor: KadenceColorOutput( contentBgColor ),
								borderColor: KadenceColorOutput( contentBorderColor ),
							} }>
								<InnerBlocks
									template={ getPanesTemplate( tabCount ) }
									templateLock={ false }
									allowedBlocks={ ALLOWED_BLOCKS } />
							</div>
						</div>
					) }
				</div>
			</Fragment>
		);
	}
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
		};
	} ),
	withDispatch( ( dispatch, { clientId }, { select } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' );
		const {
			moveBlockToPosition,
			removeBlock,
			updateBlockAttributes,
			insertBlock,
		} = dispatch( 'core/block-editor' );
		const block = getBlock( clientId );
		return {
			resetOrder() {
				times( block.innerBlocks.length, n => {
					updateBlockAttributes( block.innerBlocks[ n ].clientId, {
						id: n + 1,
					} );
				} );
			},
			moveTab( tabId, newIndex ) {
				moveBlockToPosition( tabId, clientId, clientId, parseInt( newIndex ) );
			},
			insertTab( newBlock ) {
				insertBlock( newBlock, parseInt( block.innerBlocks.length ), clientId );
			},
			removeTab( tabId ) {
				removeBlock( tabId );
			},
		};
	} ),
] )( KadenceTabs );
