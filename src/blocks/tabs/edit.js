/**
 * BLOCK: Kadence Tabs
 */

/**
 * Import Icons
 */
import icons from './icon';

/**
 * Import External
 */
import times from 'lodash/times';
import map from 'lodash/map';
import classnames from 'classnames';
import memoize from 'memize';
import SelectSearch from 'react-select-search';
import fonts from '../../fonts';
import gFonts from '../../gfonts';
import WebfontLoader from '@dr-kobros/react-webfont-loader';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
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
	MediaUpload,
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	RichText,
	BlockControls,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	PanelColor,
	Dashicon,
	PanelBody,
	RangeControl,
	Toolbar,
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
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	render() {
		const { attributes: { uniqueID, tabCount, blockAlignment, mobileLayout, currentTab, tabletLayout, layout, innerPadding, minHeight, maxWidth, titles, titleColor, titleColorHover, titleColorActive, titleBg, titleBgHover, titleBgActive, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, borderRadius, titleBorderWidth, titleBorderControl, titleBorder, titleBorderHover, titleBorderActive, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, innerPaddingControl }, className, setAttributes } = this.props;
		const layoutClass = ( ! layout ? 'tabs' : layout );
		const borderTypes = [
			{ key: 'linked', name: __( 'Linked' ), icon: icons.linked },
			{ key: 'individual', name: __( 'Individual' ), icon: icons.individual },
		];
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
		];
		const standardWeights = [
			{ value: 'regular', label: 'Normal' },
			{ value: 'bold', label: 'Bold' },
		];
		const standardStyles = [
			{ value: 'normal', label: 'Normal' },
			{ value: 'italic', label: 'Italic' },
		];
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const config = ( googleFont ? gconfig : '' );
		const typographyWeights = ( googleFont && typography ? gFonts[ typography ].w.map( opt => ( { label: this.capitalizeFirstLetter( opt ), value: opt } ) ) : standardWeights );
		const typographyStyles = ( googleFont && typography ? gFonts[ typography ].i.map( opt => ( { label: this.capitalizeFirstLetter( opt ), value: opt } ) ) : standardStyles );
		const typographySubsets = ( googleFont && typography ? gFonts[ typography ].s.map( opt => ( { label: this.capitalizeFirstLetter( opt ), value: opt } ) ) : '' );
		const fontsarray = fonts.map( ( name ) => {
			return { name: name, value: name, google: true };
		} );
		const options = [
			{
				type: 'group',
				name: 'Standard Fonts',
				items: [
					{ name: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', google: false },
					{ name: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', google: false },
					{ name: '"Comic Sans MS", cursive, sans-serif', value: '"Comic Sans MS", cursive, sans-serif', google: false },
					{ name: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', google: false },
					{ name: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', google: false },
					{ name: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', google: false },
					{ name: '"Trebuchet MS", Helvetica, sans-serif', value: '"Trebuchet MS", Helvetica, sans-serif', google: false },
					{ name: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', google: false },
					{ name: 'Georgia, serif', value: 'Georgia, serif', google: false },
					{ name: '"Palatino Linotype", "Book Antiqua", Palatino, serif', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', google: false },
					{ name: '"Times New Roman", Times, serif', value: '"Times New Roman", Times, serif', google: false },
					{ name: 'Courier, monospace', value: 'Courier, monospace', google: false },
					{ name: '"Lucida Console", Monaco, monospace', value: '"Lucida Console", Monaco, monospace', google: false },
				],
			},
			{
				type: 'group',
				name: 'Google Fonts',
				items: fontsarray,
			},
		];
		const fontMin = ( sizeType === 'em' ? 0.2 : 5 );
		const fontMax = ( sizeType === 'em' ? 12 : 200 );
		const fontStep = ( sizeType === 'em' ? 0.1 : 1 );
		const lineMin = ( lineType === 'em' ? 0.2 : 5 );
		const lineMax = ( lineType === 'em' ? 12 : 200 );
		const lineStep = ( lineType === 'em' ? 0.1 : 1 );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const classes = classnames( className, `kt-tabs-wrap kt-tabs-has-${ tabCount }-tabs kt-active-tab-${ currentTab } kt-tabs-layout-${ layoutClass } kt-tabs- kt-tabs-tablet-layout-${ tabLayoutClass } kt-tabs-mobile-layout-${ mobileLayoutClass }` );
		const mLayoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: icons.tabs },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: icons.vtabs },
			{ key: 'accordion', name: __( 'Accordion' ), icon: icons.accordion },
		];
		const layoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: icons.tabs },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: icons.vtabs },
		];
		const onHover = () => {
			if ( 'title0' !== this.state.hovered ) {
				this.setState( {
					hovered: 'title0',
				} );
			}
		};
		const onHover1 = () => {
			if ( 'title1' !== this.state.hovered ) {
				this.setState( {
					hovered: 'title1',
				} );
			}
		};
		const onHover2 = () => {
			if ( 'title2' !== this.state.hovered ) {
				this.setState( {
					hovered: 'title2',
				} );
			}
		};
		const onHover3 = () => {
			if ( 'title3' !== this.state.hovered ) {
				this.setState( {
					hovered: 'title3',
				} );
			}
		};
		const onHover4 = () => {
			if ( 'title4' !== this.state.hovered ) {
				this.setState( {
					hovered: 'title4',
				} );
			}
		};
		const onMouseOut = () => {
			if ( 'false' !== this.state.hovered ) {
				this.setState( {
					hovered: 'false',
				} );
			}
		};
		const onTypeChange = ( select ) => {
			let variant;
			let weight;
			let subset;
			if ( select.google ) {
				if ( ! gFonts[ select.value ].v.includes( 'regular' ) ) {
					variant = gFonts[ select.value ].v[ 0 ];
				} else {
					variant = '';
				}
				if ( ! gFonts[ select.value ].w.includes( 'regular' ) ) {
					weight = gFonts[ select.value ].w[ 0 ];
				} else {
					weight = 'regular';
				}
				if ( gFonts[ select.value ].s.length > 1 ) {
					subset = 'latin';
				} else {
					subset = '';
				}
			} else {
				subset = '';
				variant = '';
				weight = 'regular';
			}
			setAttributes( {
				typography: select.value,
				googleFont: select.google,
				fontVariant: variant,
				fontWeight: weight,
				fontStyle: 'normal',
				fontSubset: subset,
			} );
		};
		const onTypeClear = () => {
			setAttributes( {
				typography: '',
				googleFont: false,
				loadGoogleFont: true,
				fontVariant: '',
				fontSubset: '',
				fontWeight: 'regular',
				fontStyle: 'normal',
			} );
		};
		const onWeightChange = ( select ) => {
			if ( googleFont ) {
				let variant;
				if ( 'italic' === fontStyle ) {
					if ( 'regular' === select ) {
						variant = 'italic';
					} else {
						variant = select + 'italic';
					}
				} else {
					variant = select;
				}
				setAttributes( {
					fontVariant: variant,
					fontWeight: select,
				} );
			} else {
				setAttributes( {
					fontVariant: '',
					fontWeight: select,
				} );
			}
		};
		const onGLoadChange = ( select ) => {
			setAttributes( {
				loadGoogleFont: select,
			} );
		};
		const onStyleChange = ( select ) => {
			if ( googleFont ) {
				let variant;
				if ( 'italic' === select ) {
					if ( ! fontWeight || 'regular' === fontWeight ) {
						variant = 'italic';
					} else {
						variant = fontWeight + 'italic';
					}
				} else {
					variant = ( fontWeight ? fontWeight : 'regular' );
				}
				setAttributes( {
					fontVariant: variant,
					fontStyle: select,
				} );
			} else {
				setAttributes( {
					fontVariant: '',
					fontStyle: select,
				} );
			}
		};
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
						max={ 12 }
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
					( tabName ) => {
						let tabout;
						if ( 'mobile' === tabName ) {
							tabout = mobileControls;
						} else if ( 'tablet' === tabName ) {
							tabout = tabletControls;
						} else {
							tabout = deskControls;
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const renderTitles = ( index ) => {
			let thecolor;
			let theborder;
			let thebackground;
			if ( 1 + index === currentTab ) {
				thecolor = titleColorActive;
			} else {
				thecolor = ( this.state.hovered && 'title' + index === this.state.hovered ? titleColorHover : titleColor );
			}
			if ( 1 + index === currentTab ) {
				thebackground = titleBgActive;
			} else {
				thebackground = ( this.state.hovered && 'title' + index === this.state.hovered ? titleBgHover : titleBg );
			}
			if ( 1 + index === currentTab ) {
				theborder = titleBorderActive;
			} else {
				theborder = ( this.state.hovered && 'title' + index === this.state.hovered ? titleBorderHover : titleBorder );
			}
			return (
				<Fragment>
					<li className={ `kt-title-item kt-title-item-${ index } kt-tabs-svg-show-${ ( ! titles[ index ].onlyIcon ? 'always' : 'only' ) } kt-tab-title-${ ( 1 + index === currentTab ? 'active' : 'inactive' ) }` } onMouseOut={ onMouseOut } onMouseOver={ () => {
						if ( 1 === index ) {
							onHover1();
						} else if ( 2 === index ) {
							onHover2();
						} else if ( 3 === index ) {
							onHover3();
						} else if ( 4 === index ) {
							onHover4();
						} else {
							onHover();
						}
					} }>
						<span className={ `kt-tab-title kt-tab-title-${ 1 + index } ` } style={ {
							backgroundColor: thebackground,
							color: thecolor,
							fontSize: size + sizeType,
							lineHeight: lineHeight + lineType,
							fontWeight: fontWeight,
							fontStyle: fontStyle,
							letterSpacing: letterSpacing + 'px',
							fontFamily: ( typography ? typography : '' ),
							borderTopLeftRadius: borderRadius + 'px',
							borderTopRightRadius: borderRadius + 'px',
							borderWidth: titleBorderWidth[ 0 ] + 'px ' + titleBorderWidth[ 1 ] + 'px ' + titleBorderWidth[ 2 ] + 'px ' + titleBorderWidth[ 3 ] + 'px',
							borderColor: theborder,
						} } >
							{ titles[ index ].icon && 'left' === titles[ index ].iconSide && (
								<GenIcon className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! size ? '14' : size ) } icon={ ( 'fa' === titles[ index ].icon.substring( 0, 2 ) ? FaIco[ titles[ index ].icon ] : Ico[ titles[ index ].icon ] ) } />
							) }
							<RichText
								tagName="span"
								placeholder={ __( 'Tab Title' ) }
								value={ titles[ index ].text }
								unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
								onChange={ value => {
									this.saveArrayUpdate( { text: value }, index );
								} }
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
								className={ 'kt-button-text' }
								keepPlaceholderOnFocus
							/>
							{ titles[ index ].icon && 'left' !== titles[ index ].iconSide && (
								<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ titles[ index ].icon } kt-btn-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! size ? '14' : size ) } icon={ ( 'fa' === titles[ index ].icon.substring( 0, 2 ) ? FaIco[ titles[ index ].icon ] : Ico[ titles[ index ].icon ] ) } />
							) }
						</span>
					</li>
				</Fragment>
			);
		};
		const renderPreviewArray = (
			<Fragment>
				{ times( tabCount, n => renderTitles( n ) ) }
			</Fragment>
		);
		const normalSettings = (
			<Fragment>
				<PanelColor
					title={ __( 'Title Color' ) }
					colorValue={ titleColor }
				>
					<ColorPalette
						value={ titleColor }
						onChange={ ( value ) => setAttributes( { titleColor: value } ) }
					/>
				</PanelColor>
				<PanelColor
					title={ __( 'Title Background' ) }
					colorValue={ titleBg }
				>
					<ColorPalette
						value={ titleBg }
						onChange={ ( value ) => setAttributes( { titleBg: value } ) }
					/>
				</PanelColor>
				<PanelColor
					title={ __( 'Title Border Color' ) }
					colorValue={ titleBorder }
				>
					<ColorPalette
						value={ titleBorder }
						onChange={ ( value ) => setAttributes( { titleBorder: value } ) }
					/>
				</PanelColor>
			</Fragment>
		);
		const hoverSettings = (
			<Fragment>
				<PanelColor
					title={ __( 'Hover Color' ) }
					colorValue={ titleColorHover }
				>
					<ColorPalette
						value={ titleColorHover }
						onChange={ ( value ) => setAttributes( { titleColorHover: value } ) }
					/>
				</PanelColor>
				<PanelColor
					title={ __( 'Hover Background' ) }
					colorValue={ titleBgHover }
				>
					<ColorPalette
						value={ titleBgHover }
						onChange={ ( value ) => setAttributes( { titleBgHover: value } ) }
					/>
				</PanelColor>
				<PanelColor
					title={ __( 'Hover Border Color' ) }
					colorValue={ titleBorderHover }
				>
					<ColorPalette
						value={ titleBorderHover }
						onChange={ ( value ) => setAttributes( { titleBorderHover: value } ) }
					/>
				</PanelColor>
			</Fragment>
		);
		const activeSettings = (
			<Fragment>
				<PanelColor
					title={ __( 'Active Color' ) }
					colorValue={ titleColorActive }
				>
					<ColorPalette
						value={ titleColorActive }
						onChange={ ( value ) => setAttributes( { titleColorActive: value } ) }
					/>
				</PanelColor>
				<PanelColor
					title={ __( 'Active Background' ) }
					colorValue={ titleBgActive }
				>
					<ColorPalette
						value={ titleBgActive }
						onChange={ ( value ) => setAttributes( { titleBgActive: value } ) }
					/>
				</PanelColor>
				<PanelColor
					title={ __( 'Active Border Color' ) }
					colorValue={ titleBorderActive }
				>
					<ColorPalette
						value={ titleBorderActive }
						onChange={ ( value ) => setAttributes( { titleBorderActive: value } ) }
					/>
				</PanelColor>
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
					( tabName ) => {
						let tabout;
						if ( 'mobile' === tabName ) {
							tabout = sizeMobileControls;
						} else if ( 'tablet' === tabName ) {
							tabout = sizeTabletControls;
						} else {
							tabout = sizeDeskControls;
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		return (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'wide', 'full' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
				</BlockControls>
				<InspectorControls>
					{ tabControls }
					<PanelBody
						title={ __( 'Content Spacing/Border' ) }
						initialOpen={ false }
					>
						<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Border Control Type' ) }>
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
								label={ __( 'Title Border Width' ) }
								value={ ( titleBorderWidth ? titleBorderWidth[ 0 ] : '' ) }
								onChange={ ( value ) => setAttributes( { titleBorderWidth: [ value, value, value, value ] } ) }
								min={ 0 }
								max={ 20 }
								step={ 1 }
							/>
						) }
						{ innerPaddingControl && innerPaddingControl === 'individual' && (
							<Fragment>
								<p>{ __( 'Title Border Width' ) }</p>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinetop }
									value={ ( titleBorderWidth ? titleBorderWidth[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titleBorderWidth: [ value, titleBorderWidth[ 1 ], titleBorderWidth[ 2 ], titleBorderWidth[ 3 ] ] } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineright }
									value={ ( titleBorderWidth ? titleBorderWidth[ 1 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titleBorderWidth: [ titleBorderWidth[ 0 ], value, titleBorderWidth[ 2 ], titleBorderWidth[ 3 ] ] } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinebottom }
									value={ ( titleBorderWidth ? titleBorderWidth[ 2 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titleBorderWidth: [ titleBorderWidth[ 0 ], titleBorderWidth[ 1 ], value, titleBorderWidth[ 3 ] ] } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineleft }
									value={ ( titleBorderWidth ? titleBorderWidth[ 3 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titleBorderWidth: [ titleBorderWidth[ 0 ], titleBorderWidth[ 1 ], titleBorderWidth[ 2 ], value ] } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
							</Fragment>
						) }
						<RangeControl
							label={ __( 'Inner Padding (px)' ) }
							value={ innerPadding }
							className="kt-padding-inputs kt-top-padding"
							onChange={ ( value ) => {
								setAttributes( {
									innerPadding: value,
								} );
							} }
							min={ 0 }
							max={ 500 }
						/>
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
									( tabName ) => {
										let tabout;
										if ( 'hover' === tabName ) {
											tabout = hoverSettings;
										} else if ( 'active' === tabName ) {
											tabout = activeSettings;
										} else {
											tabout = normalSettings;
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
									label={ __( 'Title Border Width' ) }
									value={ ( titleBorderWidth ? titleBorderWidth[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { titleBorderWidth: [ value, value, value, value ] } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
							) }
							{ titleBorderControl && titleBorderControl === 'individual' && (
								<Fragment>
									<p>{ __( 'Title Border Width' ) }</p>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlinetop }
										value={ ( titleBorderWidth ? titleBorderWidth[ 0 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderWidth: [ value, titleBorderWidth[ 1 ], titleBorderWidth[ 2 ], titleBorderWidth[ 3 ] ] } ) }
										min={ 0 }
										max={ 20 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlineright }
										value={ ( titleBorderWidth ? titleBorderWidth[ 1 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderWidth: [ titleBorderWidth[ 0 ], value, titleBorderWidth[ 2 ], titleBorderWidth[ 3 ] ] } ) }
										min={ 0 }
										max={ 20 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlinebottom }
										value={ ( titleBorderWidth ? titleBorderWidth[ 2 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderWidth: [ titleBorderWidth[ 0 ], titleBorderWidth[ 1 ], value, titleBorderWidth[ 3 ] ] } ) }
										min={ 0 }
										max={ 20 }
										step={ 1 }
									/>
									<RangeControl
										className="kt-icon-rangecontrol"
										label={ icons.outlineleft }
										value={ ( titleBorderWidth ? titleBorderWidth[ 3 ] : '' ) }
										onChange={ ( value ) => setAttributes( { titleBorderWidth: [ titleBorderWidth[ 0 ], titleBorderWidth[ 1 ], titleBorderWidth[ 2 ], value ] } ) }
										min={ 0 }
										max={ 20 }
										step={ 1 }
									/>
								</Fragment>
							) }
						</PanelBody>
						<PanelBody
							title={ __( 'Font Settings' ) }
							initialOpen={ false }
						>
							<h2 className="kt-heading-fontfamily-title">{ __( 'Font Family' ) }</h2>
							{ typography && (
								<IconButton
									label={ __( 'clear' ) }
									className="kt-font-clear-btn"
									icon="no-alt"
									onClick={ onTypeClear }
								/>
							) }
							<SelectSearch
								height={ 30 }
								search={ true }
								multiple={ false }
								value={ typography }
								onChange={ onTypeChange }
								options={ options }
								placeholder={ __( 'Select a font family' ) }
							/>
							{ typography && (
								<SelectControl
									label={ __( 'Font Weight' ) }
									value={ fontWeight }
									options={ typographyWeights }
									onChange={ onWeightChange }
								/>
							) }
							{ typography && (
								<SelectControl
									label={ __( 'Font Style' ) }
									value={ fontStyle }
									options={ typographyStyles }
									onChange={ onStyleChange }
								/>
							) }
							{ typography && googleFont && (
								<SelectControl
									label={ __( 'Font Subset' ) }
									value={ fontSubset }
									options={ typographySubsets }
									onChange={ ( value ) => setAttributes( { fontSubset: value } ) }
								/>
							) }
							{ typography && googleFont && (
								<ToggleControl
									label={ __( 'Load Google Font on Frontend' ) }
									checked={ loadGoogleFont }
									onChange={ onGLoadChange }
								/>
							) }
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
							padding: innerPadding + 'px',
							minHeight: minHeight + 'px',
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
