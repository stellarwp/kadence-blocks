/**
 * BLOCK: Kadence Tabs
 */

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktaccordUniqueIDs = [];
/**
 * Import Icons
 */
import icons from '../../icons';

/**
 * Import External
 */
import times from 'lodash/times';
import classnames from 'classnames';
import memoize from 'memize';
import WebfontLoader from '../../fontloader';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import TypographyControls from '../../typography-control';
import MeasurementControls from '../../measurement-control';
import BorderColorControls from '../../border-color-control';

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
	BlockControls,
	AlignmentToolbar,
	ColorPalette,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	TabPanel,
	Button,
	ButtonGroup,
	PanelBody,
	Dashicon,
	RangeControl,
	ToggleControl,
	SelectControl,
} = wp.components;
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

const ALLOWED_BLOCKS = [ 'kadence/pane' ];
/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */
const getPanesTemplate = memoize( ( panes ) => {
	return times( panes, n => [ 'kadence/pane', { id: n + 1 } ] );
} );

/**
 * Build the row edit
 */
class KadenceAccordionComponent extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			contentPaddingControl: 'linked',
			contentBorderRadiusControl: 'linked',
			contentBorderControl: 'linked',
			titleBorderControl: 'linked',
			titlePaddingControl: 'individual',
			titleBorderRadiusControl: 'linked',
			titleBorderColorControl: 'linked',
			titleBorderHoverColorControl: 'linked',
			titleBorderActiveColorControl: 'linked',
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfig = kadence_blocks_params.config[ 'kadence/accordion' ];
			if ( blockConfig !== undefined && typeof blockConfig === 'object' ) {
				Object.keys( blockConfig ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfig[ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else if ( ktaccordUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else {
			ktaccordUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( this.props.attributes.titleStyles[ 0 ].padding[ 0 ] === this.props.attributes.titleStyles[ 0 ].padding[ 1 ] && this.props.attributes.titleStyles[ 0 ].padding[ 0 ] === this.props.attributes.titleStyles[ 0 ].padding[ 2 ] && this.props.attributes.titleStyles[ 0 ].padding[ 0 ] === this.props.attributes.titleStyles[ 0 ].padding[ 3 ] ) {
			this.setState( { titlePaddingControl: 'linked' } );
		} else {
			this.setState( { titlePaddingControl: 'individual' } );
		}
		if ( this.props.attributes.titleStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderWidth[ 1 ] && this.props.attributes.titleStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderWidth[ 2 ] && this.props.attributes.titleStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderWidth[ 3 ] ) {
			this.setState( { titleBorderControl: 'linked' } );
		} else {
			this.setState( { titleBorderControl: 'individual' } );
		}
		if ( this.props.attributes.titleStyles[ 0 ].borderRadius[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderRadius[ 1 ] && this.props.attributes.titleStyles[ 0 ].borderRadius[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderRadius[ 2 ] && this.props.attributes.titleStyles[ 0 ].borderRadius[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderRadius[ 3 ] ) {
			this.setState( { titleBorderRadiusControl: 'linked' } );
		} else {
			this.setState( { titleBorderRadiusControl: 'individual' } );
		}
		if ( this.props.attributes.contentBorder[ 0 ] === this.props.attributes.contentBorder[ 1 ] && this.props.attributes.contentBorder[ 0 ] === this.props.attributes.contentBorder[ 2 ] && this.props.attributes.contentBorder[ 0 ] === this.props.attributes.contentBorder[ 3 ] ) {
			this.setState( { contentBorderControl: 'linked' } );
		} else {
			this.setState( { contentBorderControl: 'individual' } );
		}
		if ( this.props.attributes.contentBorderRadius[ 0 ] === this.props.attributes.contentBorderRadius[ 1 ] && this.props.attributes.contentBorderRadius[ 0 ] === this.props.attributes.contentBorderRadius[ 2 ] && this.props.attributes.contentBorderRadius[ 0 ] === this.props.attributes.contentBorderRadius[ 3 ] ) {
			this.setState( { contentBorderRadiusControl: 'linked' } );
		} else {
			this.setState( { contentBorderRadiusControl: 'individual' } );
		}
		if ( this.props.attributes.contentPadding[ 0 ] === this.props.attributes.contentPadding[ 1 ] && this.props.attributes.contentPadding[ 0 ] === this.props.attributes.contentPadding[ 2 ] && this.props.attributes.contentPadding[ 0 ] === this.props.attributes.contentPadding[ 3 ] ) {
			this.setState( { contentPaddingControl: 'linked' } );
		} else {
			this.setState( { contentPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.titleStyles[ 0 ].border[ 0 ] === this.props.attributes.titleStyles[ 0 ].border[ 1 ] && this.props.attributes.titleStyles[ 0 ].border[ 0 ] === this.props.attributes.titleStyles[ 0 ].border[ 2 ] && this.props.attributes.titleStyles[ 0 ].border[ 0 ] === this.props.attributes.titleStyles[ 0 ].border[ 3 ] ) {
			this.setState( { titleBorderColorControl: 'linked' } );
		} else {
			this.setState( { titleBorderColorControl: 'individual' } );
		}
		if ( this.props.attributes.titleStyles[ 0 ].borderHover[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderHover[ 1 ] && this.props.attributes.titleStyles[ 0 ].borderHover[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderHover[ 2 ] && this.props.attributes.titleStyles[ 0 ].borderHover[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderHover[ 3 ] ) {
			this.setState( { titleBorderHoverColorControl: 'linked' } );
		} else {
			this.setState( { titleBorderHoverColorControl: 'individual' } );
		}
		if ( this.props.attributes.titleStyles[ 0 ].borderActive[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderActive[ 1 ] && this.props.attributes.titleStyles[ 0 ].borderActive[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderActive[ 2 ] && this.props.attributes.titleStyles[ 0 ].borderActive[ 0 ] === this.props.attributes.titleStyles[ 0 ].borderActive[ 3 ] ) {
			this.setState( { titleBorderActiveColorControl: 'linked' } );
		} else {
			this.setState( { titleBorderActiveColorControl: 'individual' } );
		}
	}
	render() {
		const { attributes: { uniqueID, paneCount, blockAlignment, openPane, titleStyles, contentPadding, minHeight, maxWidth, contentBorder, contentBorderColor, contentBorderRadius, contentBgColor, titleAlignment, startCollapsed, linkPaneCollapse, showIcon, iconStyle, iconSide }, className, setAttributes } = this.props;
		const { titleBorderRadiusControl, titleBorderControl, titlePaddingControl, contentBorderControl, contentBorderRadiusControl, contentPaddingControl, titleBorderColorControl, titleBorderHoverColorControl, titleBorderActiveColorControl } = this.state;
		const saveTitleStyles = ( value ) => {
			const newUpdate = titleStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				titleStyles: newUpdate,
			} );
		};
		const lgconfig = {
			google: {
				families: [ titleStyles[ 0 ].family + ( titleStyles[ 0 ].variant ? ':' + titleStyles[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleStyles[ 0 ].google ? lgconfig : '' );
		const classes = classnames( className, `kt-accordion-wrap kt-accordion-id${ uniqueID } kt-accordion-has-${ paneCount }-panes kt-accordion-block kt-pane-header-alignment-${ titleAlignment }` );
		const normalSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Title Color' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].color }
					onChange={ ( value ) => saveTitleStyles( { color: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Title Background' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].background }
					onChange={ ( value ) => saveTitleStyles( { background: value } ) }
				/>
				<BorderColorControls
					label={ __( 'Title Border Color' ) }
					values={ titleStyles[ 0 ].border }
					control={ titleBorderColorControl }
					onChange={ ( value ) => saveTitleStyles( { border: value } ) }
					onControl={ ( value ) => this.setState( { titleBorderColorControl: value } ) }
				/>
			</Fragment>
		);
		const hoverSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Hover Color' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].colorHover }
					onChange={ ( value ) => saveTitleStyles( { colorHover: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Hover Background' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].backgroundHover }
					onChange={ ( value ) => saveTitleStyles( { backgroundHover: value } ) }
				/>
				<BorderColorControls
					label={ __( 'Hover Border Color' ) }
					values={ titleStyles[ 0 ].borderHover }
					control={ titleBorderHoverColorControl }
					onChange={ ( value ) => saveTitleStyles( { borderHover: value } ) }
					onControl={ ( value ) => this.setState( { titleBorderHoverColorControl: value } ) }
				/>
			</Fragment>
		);
		const activeSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Active Color' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].colorActive }
					onChange={ ( value ) => saveTitleStyles( { colorActive: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Active Background' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].backgroundActive }
					onChange={ ( value ) => saveTitleStyles( { backgroundActive: value } ) }
				/>
				<BorderColorControls
					label={ __( 'Active Border Color' ) }
					values={ titleStyles[ 0 ].borderActive }
					control={ titleBorderActiveColorControl }
					onChange={ ( value ) => saveTitleStyles( { borderActive: value } ) }
					onControl={ ( value ) => this.setState( { titleBorderActiveColorControl: value } ) }
				/>
			</Fragment>
		);
		const accordionIconSet = [];
		accordionIconSet.basic = <Fragment><rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444" /><path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" /><path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" /><path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" /></Fragment>;
		accordionIconSet.basiccircle = <Fragment><circle cx="83.723" cy="50" r="50" fill="#444" /><circle cx="322.768" cy="50" r="50" fill="#444" /><rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff" /><path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" /><path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" /><path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" /></Fragment>;
		accordionIconSet.xclose = <Fragment><rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444" /><path d="M353.5,28.432l-9.887,-9.887l-53.023,53.023l9.887,9.887l53.023,-53.023Z" fill="#444" /><path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" /><path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#444" /></Fragment>;
		accordionIconSet.xclosecircle = <Fragment><circle cx="83.723" cy="50" r="50" fill="#444" /><circle cx="322.768" cy="50" r="50" fill="#444" /><rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff" /><path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#fff" /><path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" /><path d="M290.59,71.568l9.887,9.887l53.023,-53.023l-9.887,-9.887l-53.023,53.023Z" fill="#fff" /></Fragment>;
		accordionIconSet.arrow = <Fragment><g fill="#444"><path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z" /><path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z" /></g><g fill="#444"><path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z" /><path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z" /></g></Fragment>;
		accordionIconSet.arrowcircle = <Fragment><circle cx="83.723" cy="50" r="50" fill="#444" /><circle cx="322.768" cy="50" r="50" fill="#444" /><g fill="#fff"><path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z" /><path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z" /></g><g fill="#fff"><path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z" /><path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z" /></g></Fragment>;

		const renderIconSet = svg => (
			<svg className="accord-icon" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" style={ { fill: '#000000' } }>
				{ accordionIconSet[ svg ] }
			</svg>
		);
		const renderCSS = (
			<style>
				{ `
				.kt-accordion-${ uniqueID } .kt-blocks-accordion-header {
					color: ${ titleStyles[ 0 ].color };
					border-color: ${ titleStyles[ 0 ].border[ 0 ] } ${ titleStyles[ 0 ].border[ 1 ] } ${ titleStyles[ 0 ].border[ 2 ] } ${ titleStyles[ 0 ].border[ 3 ] };
					background-color: ${ titleStyles[ 0 ].background };
					padding:${ titleStyles[ 0 ].padding[ 0 ] }px ${ titleStyles[ 0 ].padding[ 1 ] }px ${ titleStyles[ 0 ].padding[ 2 ] }px ${ titleStyles[ 0 ].padding[ 3 ] }px;
					margin-top:${ ( titleStyles[ 0 ].marginTop > 32 ? titleStyles[ 0 ].marginTop : 0 ) }px;
					border-width:${ titleStyles[ 0 ].borderWidth[ 0 ] }px ${ titleStyles[ 0 ].borderWidth[ 1 ] }px ${ titleStyles[ 0 ].borderWidth[ 2 ] }px ${ titleStyles[ 0 ].borderWidth[ 3 ] }px;
					border-radius:${ titleStyles[ 0 ].borderRadius[ 0 ] }px ${ titleStyles[ 0 ].borderRadius[ 1 ] }px ${ titleStyles[ 0 ].borderRadius[ 2 ] }px ${ titleStyles[ 0 ].borderRadius[ 3 ] }px;
					font-size:${ titleStyles[ 0 ].size[ 0 ] }${ titleStyles[ 0 ].sizeType };
					line-height:${ titleStyles[ 0 ].lineHeight[ 0 ] }${ titleStyles[ 0 ].lineType };
					letter-spacing:${ titleStyles[ 0 ].letterSpacing }px;
					text-transform:${ titleStyles[ 0 ].textTransform };
					font-family:${ titleStyles[ 0 ].family };
					font-style:${ titleStyles[ 0 ].style };
					font-weight:${ titleStyles[ 0 ].weight };
				}
				.kt-accordion-${ uniqueID } .kt-blocks-accordion-header .kt-blocks-accordion-title {
					line-height:${ titleStyles[ 0 ].lineHeight[ 0 ] }${ titleStyles[ 0 ].lineType };
				}
				.kt-accordion-${ uniqueID } .kt-blocks-accordion-header .kt-btn-svg-icon svg {
					width:${ titleStyles[ 0 ].size[ 0 ] }${ titleStyles[ 0 ].sizeType };
					height:${ titleStyles[ 0 ].size[ 0 ] }${ titleStyles[ 0 ].sizeType };
				}
				.kt-accordion-${ uniqueID } .kt-accordion-panel-inner {
					padding:${ contentPadding[ 0 ] }px ${ contentPadding[ 1 ] }px ${ contentPadding[ 2 ] }px ${ contentPadding[ 3 ] }px;
					background-color: ${ contentBgColor };
					border-color: ${ contentBorderColor };
					border-width:${ contentBorder[ 0 ] }px ${ contentBorder[ 1 ] }px ${ contentBorder[ 2 ] }px ${ contentBorder[ 3 ] }px;
					border-radius:${ contentBorderRadius[ 0 ] }px ${ contentBorderRadius[ 1 ] }px ${ contentBorderRadius[ 2 ] }px ${ contentBorderRadius[ 3 ] }px;
					min-height:${ ( minHeight ? minHeight + 'px' : '0' ) };
				}
				.kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ titleStyles[ 0 ].color };
				}
				.kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ titleStyles[ 0 ].background };
				}
				.kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger {
					background-color: ${ titleStyles[ 0 ].color };
				}
				.kt-accordion-${ uniqueID } .kt-blocks-accordion-header:hover {
					color: ${ titleStyles[ 0 ].colorHover };
					border-color: ${ titleStyles[ 0 ].borderHover[ 0 ] } ${ titleStyles[ 0 ].borderHover[ 1 ] } ${ titleStyles[ 0 ].borderHover[ 2 ] } ${ titleStyles[ 0 ].borderHover[ 3 ] };
					background-color: ${ titleStyles[ 0 ].backgroundHover };
				}
				.kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ titleStyles[ 0 ].colorHover };
				}
				.kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ titleStyles[ 0 ].backgroundHover };
				}
				.kt-accordion-${ uniqueID }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger {
					background-color: ${ titleStyles[ 0 ].colorHover };
				}
				.kt-accordion-${ uniqueID }.kt-start-active-pane-${ openPane + 1 } .kt-accordion-pane-${ openPane + 1 } .kt-blocks-accordion-header {
					color: ${ titleStyles[ 0 ].colorActive };
					border-color: ${ titleStyles[ 0 ].borderActive[ 0 ] } ${ titleStyles[ 0 ].borderActive[ 1 ] } ${ titleStyles[ 0 ].borderActive[ 2 ] } ${ titleStyles[ 0 ].borderActive[ 3 ] };
					background-color: ${ titleStyles[ 0 ].backgroundActive };
				}
				.kt-accordion-${ uniqueID }.kt-start-active-pane-${ openPane + 1 }:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-pane-${ openPane + 1 } .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${ uniqueID }.kt-start-active-pane-${ openPane + 1 }:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-pane-${ openPane + 1 } .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ titleStyles[ 0 ].colorActive };
				}
				.kt-accordion-${ uniqueID }.kt-start-active-pane-${ openPane + 1 }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${ openPane + 1 } .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${ uniqueID }.kt-start-active-pane-${ openPane + 1 }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${ openPane + 1 } .kt-blocks-accordion-icon-trigger:after {
					background-color: ${ titleStyles[ 0 ].backgroundActive };
				}
				.kt-accordion-${ uniqueID }.kt-start-active-pane-${ openPane + 1 }:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${ openPane + 1 } .kt-blocks-accordion-icon-trigger {
					background-color: ${ titleStyles[ 0 ].colorActive };
				}
				` }
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
						value={ titleAlignment }
						onChange={ ( nextAlign ) => {
							setAttributes( { titleAlignment: nextAlign } );
						} }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody>
						<RangeControl
							label={ __( 'Accordion Panes' ) }
							value={ paneCount }
							onChange={ ( nexttabs ) => {
								setAttributes( {
									paneCount: nexttabs,
								} );
							} }
							min={ 1 }
							max={ 24 }
						/>
						<ToggleControl
							label={ __( 'Panes close when another opens' ) }
							checked={ linkPaneCollapse }
							onChange={ ( value ) => setAttributes( { linkPaneCollapse: value } ) }
						/>
						<ToggleControl
							label={ __( 'Start with all panes collapsed' ) }
							checked={ startCollapsed }
							onChange={ ( value ) => setAttributes( { startCollapsed: value } ) }
						/>
						{ ! startCollapsed && (
							<Fragment>
								<h2>{ __( 'Inital Open Accordion' ) }</h2>
								<ButtonGroup aria-label={ __( 'Inital Open Accordion' ) }>
									{ times( paneCount, n => (
										<Button
											key={ n }
											className="kt-init-open-pane"
											isSmall
											isPrimary={ openPane === n }
											aria-pressed={ openPane === n }
											onClick={ () => setAttributes( { openPane: n } ) }
										>
											{ __( 'Accordion Pane' ) + ' ' + ( n + 1 ) }
										</Button>
									) ) }
								</ButtonGroup>
							</Fragment>
						) }
					</PanelBody>
					<PanelBody
						title={ __( 'Pane Title Color Settings' ) }
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
						title={ __( 'Pane Title Trigger Icon' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Show Icon' ) }
							checked={ showIcon }
							onChange={ ( value ) => setAttributes( { showIcon: value } ) }
						/>
						<h2>{ __( 'Icon Style' ) }</h2>
						<FontIconPicker
							icons={ [
								'basic',
								'basiccircle',
								'xclose',
								'xclosecircle',
								'arrow',
								'arrowcircle',
							] }
							value={ iconStyle }
							onChange={ value => setAttributes( { iconStyle: value } ) }
							appendTo="body"
							renderFunc={ renderIconSet }
							theme="accordion"
							showSearch={ false }
							noSelectedPlaceholder={ __( 'Select Icon Set' ) }
							isMulti={ false }
						/>
						<SelectControl
							label={ __( 'Icon Side' ) }
							value={ iconSide }
							options={ [
								{ value: 'right', label: __( 'Right' ) },
								{ value: 'left', label: __( 'Left' ) },
							] }
							onChange={ value => setAttributes( { iconSide: value } ) }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Pane Title Spacing' ) }
						initialOpen={ false }
					>
						<MeasurementControls
							label={ __( 'Pane Title Padding (px)' ) }
							measurement={ titleStyles[ 0 ].padding }
							control={ titlePaddingControl }
							onChange={ ( value ) => saveTitleStyles( { padding: value } ) }
							onControl={ ( value ) => this.setState( { titlePaddingControl: value } ) }
							min={ 0 }
							max={ 40 }
							step={ 1 }
						/>
						<RangeControl
							label={ __( 'Pane Spacer Between' ) }
							value={ titleStyles[ 0 ].marginTop }
							onChange={ ( value ) => saveTitleStyles( { marginTop: value } ) }
							min={ 1 }
							max={ 120 }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Pane Title Border' ) }
						initialOpen={ false }
					>
						<MeasurementControls
							label={ __( 'Pane Title Border Width (px)' ) }
							measurement={ titleStyles[ 0 ].borderWidth }
							control={ titleBorderControl }
							onChange={ ( value ) => saveTitleStyles( { borderWidth: value } ) }
							onControl={ ( value ) => this.setState( { titleBorderControl: value } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
						<MeasurementControls
							label={ __( 'Pane Title Border Radius (px)' ) }
							measurement={ titleStyles[ 0 ].borderRadius }
							control={ titleBorderRadiusControl }
							onChange={ ( value ) => saveTitleStyles( { borderRadius: value } ) }
							onControl={ ( value ) => this.setState( { titleBorderRadiusControl: value } ) }
							min={ 0 }
							max={ 100 }
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
					<PanelBody
						title={ __( 'Pane Title Font Settings' ) }
						initialOpen={ false }
					>
						<TypographyControls
							fontSize={ titleStyles[ 0 ].size }
							onFontSize={ ( value ) => saveTitleStyles( { size: value } ) }
							fontSizeType={ titleStyles[ 0 ].sizeType }
							onFontSizeType={ ( value ) => saveTitleStyles( { sizeType: value } ) }
							lineHeight={ titleStyles[ 0 ].lineHeight }
							onLineHeight={ ( value ) => saveTitleStyles( { lineHeight: value } ) }
							lineHeightType={ titleStyles[ 0 ].lineType }
							onLineHeightType={ ( value ) => saveTitleStyles( { lineType: value } ) }
							letterSpacing={ titleStyles[ 0 ].letterSpacing }
							onLetterSpacing={ ( value ) => saveTitleStyles( { letterSpacing: value } ) }
							textTransform={ titleStyles[ 0 ].textTransform }
							onTextTransform={ ( value ) => saveTitleStyles( { textTransform: value } ) }
							fontFamily={ titleStyles[ 0 ].family }
							onFontFamily={ ( value ) => saveTitleStyles( { family: value } ) }
							onFontChange={ ( select ) => {
								saveTitleStyles( {
									family: select.value,
									google: select.google,
								} );
							} }
							onFontArrayChange={ ( values ) => saveTitleStyles( values ) }
							googleFont={ titleStyles[ 0 ].google }
							onGoogleFont={ ( value ) => saveTitleStyles( { google: value } ) }
							loadGoogleFont={ titleStyles[ 0 ].loadGoogle }
							onLoadGoogleFont={ ( value ) => saveTitleStyles( { loadGoogle: value } ) }
							fontVariant={ titleStyles[ 0 ].variant }
							onFontVariant={ ( value ) => saveTitleStyles( { variant: value } ) }
							fontWeight={ titleStyles[ 0 ].weight }
							onFontWeight={ ( value ) => saveTitleStyles( { weight: value } ) }
							fontStyle={ titleStyles[ 0 ].style }
							onFontStyle={ ( value ) => saveTitleStyles( { style: value } ) }
							fontSubset={ titleStyles[ 0 ].subset }
							onFontSubset={ ( value ) => saveTitleStyles( { subset: value } ) }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Inner Content Settings' ) }
						initialOpen={ false }
					>
						<MeasurementControls
							label={ __( 'Inner Content Padding (px)' ) }
							measurement={ contentPadding }
							control={ contentPaddingControl }
							onChange={ ( value ) => setAttributes( { contentPadding: value } ) }
							onControl={ ( value ) => this.setState( { contentPaddingControl: value } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
						<p className="kt-setting-label">{ __( 'Inner Content Background' ) }</p>
						<ColorPalette
							value={ contentBgColor }
							onChange={ ( value ) => setAttributes( { contentBgColor: value } ) }
						/>
						<p className="kt-setting-label">{ __( 'Inner Content Border Color' ) }</p>
						<ColorPalette
							value={ contentBorderColor }
							onChange={ ( value ) => setAttributes( { contentBorderColor: value } ) }
						/>
						<MeasurementControls
							label={ __( 'Inner Content Border Width (px)' ) }
							measurement={ contentBorder }
							control={ contentBorderControl }
							onChange={ ( value ) => setAttributes( { contentBorder: value } ) }
							onControl={ ( value ) => this.setState( { contentBorderControl: value } ) }
							min={ 0 }
							max={ 40 }
							step={ 1 }
						/>
						<MeasurementControls
							label={ __( 'Inner Content Border Radius (px)' ) }
							measurement={ contentBorderRadius }
							control={ contentBorderRadiusControl }
							onChange={ ( value ) => setAttributes( { contentBorderRadius: value } ) }
							onControl={ ( value ) => this.setState( { contentBorderRadiusControl: value } ) }
							min={ 0 }
							max={ 100 }
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
					<div className="kt-accordion-selecter">{ __( 'Accordion' ) }</div>
					<div className="kt-accordion-wrap" style={ {
						maxWidth: maxWidth + 'px',
					} }>
						{ titleStyles[ 0 ].google && (
							<WebfontLoader config={ config }>
							</WebfontLoader>
						) }
						<div className={ `kt-accordion-inner-wrap kt-accordion-${ uniqueID } kt-start-active-pane-${ openPane + 1 } kt-accodion-icon-style-${ ( iconStyle && showIcon ? iconStyle : 'none' ) } kt-accodion-icon-side-${ ( iconSide ? iconSide : 'right' ) }` }>
							<InnerBlocks
								template={ getPanesTemplate( paneCount ) }
								templateLock="all"
								allowedBlocks={ ALLOWED_BLOCKS } />
						</div>
					</div>
					<div className="kt-accordion-add-selecter">
						<Button
							className="kt-accordion-add"
							isPrimary={ true }
							onClick={ () => setAttributes( { paneCount: paneCount + 1 } ) }
						>
							<Dashicon icon="plus" />
							{ __( 'Add Accordion Item' ) }
						</Button>
					</div>
				</div>
			</Fragment>
		);
	}
}
export default ( KadenceAccordionComponent );