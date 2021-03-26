/**
 * BLOCK: Kadence Advanced Btn
 *
 * Editor for Advanced Btn
 */
import times from 'lodash/times';
import map from 'lodash/map';
import IconControl from '../../icon-control';
import IconRender from '../../icon-render';
import TypographyControls from '../../typography-control';
import BoxShadowControl from '../../box-shadow-control';
import WebfontLoader from '../../fontloader';
import hexToRGBA from '../../hex-to-rgba';
import StepControl from '../../step-control';
import URLInputInline from '../../inline-link-control';
import KadenceColorOutput from '../../kadence-color-output';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import MeasurementControls from '../../measurement-control';
import classnames from 'classnames';
import ButtonStyleCopyPaste from './copy-paste-style';
import flow from 'lodash/flow';
import filter from 'lodash/filter';
import KadenceRange from '../../components/range/range-control';
import ResponsiveMeasuremenuControls from '../../components/measurement/responsive-measurement-control';
import SmallResponsiveControl from '../../components/responsive/small-responsive-control';
import URLInputControl from '../../components/common/link-control';

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	position: 'bottom right',
};

/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
const { withSelect } = wp.data;
const { compose } = wp.compose;
const {
	RichText,
	URLInput,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
} = wp.blockEditor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	IconButton,
	Dashicon,
	TabPanel,
	Button,
	PanelRow,
	PanelBody,
	RangeControl,
	TextControl,
	ButtonGroup,
	SelectControl,
	ToggleControl,
	DropdownMenu,
	MenuGroup,
	MenuItem,
} = wp.components;
const { DELETE } = wp.keycodes;
const {
	applyFilters,
} = wp.hooks;
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktadvancedbuttonUniqueIDs = [];

class KadenceAdvancedButton extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.saveArrayUpdate = this.saveArrayUpdate.bind( this );
		this.bindContainer = this.bindContainer.bind( this );
		this.deselectButton = this.deselectButton.bind( this );
		this.onSelectButton = this.onSelectButton.bind( this );
		this.onMoveForward = this.onMoveForward.bind( this );
		this.onMove = this.onMove.bind( this );
		this.onMoveBackward = this.onMoveBackward.bind( this );
		this.onRemoveButton = this.onRemoveButton.bind( this );
		this.onKeyRemoveButton = this.onKeyRemoveButton.bind( this );
		this.onDuplicateButton = this.onDuplicateButton.bind( this );
		this.state = {
			btnFocused: 'false',
			selectedButton: null,
			btnLink: false,
			marginControl: 'individual',
			iconPaddingControl: 'individual',
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const oldBlockConfig = kadence_blocks_params.config[ 'kadence/advancedbtn' ];
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/advancedbtn' ] !== undefined && typeof blockConfigObject[ 'kadence/advancedbtn' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/advancedbtn' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/advancedbtn' ][ attribute ];
				} );
			} else if ( oldBlockConfig !== undefined && typeof oldBlockConfig === 'object' ) {
				Object.keys( oldBlockConfig ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = oldBlockConfig[ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktadvancedbuttonUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktadvancedbuttonUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktadvancedbuttonUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktadvancedbuttonUniqueIDs.push( this.props.attributes.uniqueID );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/advancedbtn' ] !== undefined && typeof blockSettings[ 'kadence/advancedbtn' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/advancedbtn' ] } );
		}
		if ( this.props.attributes.btns && this.props.attributes.btns[ 0 ] && undefined === this.props.attributes.btns[ 0 ].btnSize ) {
			this.saveArrayUpdate( { btnSize: 'custom' }, 0 );
		}
		if ( this.props.attributes.btns && this.props.attributes.btns[ 1 ] && undefined === this.props.attributes.btns[ 1 ].btnSize ) {
			this.saveArrayUpdate( { btnSize: 'custom' }, 1 );
		}
		if ( this.props.attributes.btns && this.props.attributes.btns[ 2 ] && undefined === this.props.attributes.btns[ 2 ].btnSize ) {
			this.saveArrayUpdate( { btnSize: 'custom' }, 2 );
		}
		if ( this.props.attributes.btns && this.props.attributes.btns[ 3 ] && undefined === this.props.attributes.btns[ 3 ].btnSize ) {
			this.saveArrayUpdate( { btnSize: 'custom' }, 3 );
		}
		if ( this.props.attributes.btns && this.props.attributes.btns[ 4 ] && undefined === this.props.attributes.btns[ 4 ].btnSize ) {
			this.saveArrayUpdate( { btnSize: 'custom' }, 4 );
		}
		if ( undefined === this.props.attributes.widthType ) {
			if ( this.props.attributes.forceFullwidth ) {
				this.props.setAttributes( { widthType: 'full' } );
			}
		}
		if ( this.props.attributes.margin && this.props.attributes.margin[ 0 ] && this.props.attributes.margin[ 0 ].desk && this.props.attributes.margin[ 0 ].desk[ 0 ] && this.props.attributes.margin[ 0 ].desk[ 0 ] === this.props.attributes.margin[ 0 ].desk[ 1 ] && this.props.attributes.margin[ 0 ].desk[ 0 ] === this.props.attributes.margin[ 0 ].desk[ 2 ] && this.props.attributes.margin[ 0 ].desk[ 0 ] === this.props.attributes.margin[ 0 ].desk[ 3 ] ) {
			this.setState( { marginControl: 'linked' } );
		} else {
			this.setState( { marginControl: 'individual' } );
		}
	}
	componentDidUpdate( prevProps ) {
		if ( ! this.props.isSelected && prevProps.isSelected && this.state.btnFocused ) {
			this.setState( {
				btnFocused: 'false',
			} );
		}
		if ( ! this.props.isSelected && prevProps.isSelected ) {
			this.setState( {
				selectedButton: null,
			} );
		}
	}
	deselectButton() {
		this.setState( {
			selectedButton: null,
		} );
	}
	bindContainer( ref ) {
		this.container = ref;
	}
	onSelectButton( index ) {
		return () => {
			if ( this.state.selectedButton !== index ) {
				this.setState( {
					selectedButton: index,
				} );
			}
		};
	}
	onMove( oldIndex, newIndex ) {
		const btns = [ ...this.props.attributes.btns ];
		btns.splice( newIndex, 1, this.props.attributes.btns[ oldIndex ] );
		btns.splice( oldIndex, 1, this.props.attributes.btns[ newIndex ] );
		this.setState( { selectedButton: newIndex } );
		this.props.setAttributes( {
			btns: btns,
		} );
	}

	onMoveForward( oldIndex ) {
		return () => {
			if ( oldIndex === this.props.attributes.btns.length - 1 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex + 1 );
		};
	}

	onMoveBackward( oldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex - 1 );
		};
	}

	onRemoveButton( index ) {
		return () => {
			const newcount = Math.abs( this.props.attributes.btnCount - 1 );
			const btns = filter( this.props.attributes.btns, ( item, i ) => index !== i );
			this.setState( { selectedButton: null } );
			this.props.setAttributes( {
				btns: btns,
				btnCount: newcount,
			} );
		};
	}
	onKeyRemoveButton( index ) {
		const newcount = Math.abs( this.props.attributes.btnCount - 1 );
		const btns = filter( this.props.attributes.btns, ( item, i ) => index !== i );
		this.setState( { selectedButton: null } );
		this.props.setAttributes( {
			btns: btns,
			btnCount: newcount,
		} );
	}
	onDuplicateButton( index ) {
		return () => {
			const newcount = Math.abs( this.props.attributes.btnCount + 1 );
			const btns = this.props.attributes.btns;
			const duplicate = btns[ index ];
			btns.splice( index + 1, 0, duplicate );
			this.setState( { selectedButton: index + 1 } );
			this.props.setAttributes( {
				btns: btns,
				btnCount: newcount,
			} );
			this.saveArrayUpdate( { iconSide: btns[ 0 ].iconSide }, 0 );
		};
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
		const { btns } = attributes;
		const newItems = btns.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			btns: newItems,
		} );
	}
	getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}
	render() {
		const { attributes: { uniqueID, btnCount, btns, hAlign, letterSpacing, fontStyle, fontWeight, typography, googleFont, loadGoogleFont, fontSubset, fontVariant, forceFullwidth, thAlign, mhAlign, widthType, widthUnit, textTransform, margin, marginUnit, kadenceAOSOptions, kadenceAnimation, collapseFullwidth }, className, setAttributes, isSelected } = this.props;
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const saveMargin = ( value ) => {
			const newUpdate = margin.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				margin: newUpdate,
			} );
		};
		const previewMarginTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].desk && '' !== margin[ 0 ].desk[ 0 ] ? margin[ 0 ].desk[ 0 ] : '' ), ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].tablet && '' !== margin[ 0 ].tablet[ 0 ] ? margin[ 0 ].tablet[ 0 ] : '' ), ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].mobile && '' !== margin[ 0 ].mobile[ 0 ] ? margin[ 0 ].mobile[ 0 ] : '' ) );
		const previewMarginRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].desk && '' !== margin[ 0 ].desk[ 1 ] ? margin[ 0 ].desk[ 1 ] : '' ), ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].tablet && '' !== margin[ 0 ].tablet[ 1 ] ? margin[ 0 ].tablet[ 1 ] : '' ), ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].mobile && '' !== margin[ 0 ].mobile[ 1 ] ? margin[ 0 ].mobile[ 1 ] : '' ) );
		const previewMarginBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].desk && '' !== margin[ 0 ].desk[ 2 ] ? margin[ 0 ].desk[ 2 ] : '' ), ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].tablet && '' !== margin[ 0 ].tablet[ 2 ] ? margin[ 0 ].tablet[ 2 ] : '' ), ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].mobile && '' !== margin[ 0 ].mobile[ 2 ] ? margin[ 0 ].mobile[ 2 ] : '' ) );
		const previewMarginLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].desk && '' !== margin[ 0 ].desk[ 3 ] ? margin[ 0 ].desk[ 3 ] : '' ), ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].tablet && '' !== margin[ 0 ].tablet[ 3 ] ? margin[ 0 ].tablet[ 3 ] : '' ), ( undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].mobile && '' !== margin[ 0 ].mobile[ 3 ] ? margin[ 0 ].mobile[ 3 ] : '' ) );
		const marginMin = ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 );
		const marginMax = ( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 );
		const marginStep = ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 );
		const marginTypes = [
			{ key: 'px', name: 'px' },
			{ key: 'em', name: 'em' },
			{ key: '%', name: '%' },
			{ key: 'vh', name: 'vh' },
			{ key: 'rem', name: 'rem' },
		];
		const btnSizes = [
			{ key: 'small', name: __( 'S' ) },
			{ key: 'standard', name: __( 'M' ) },
			{ key: 'large', name: __( 'L' ) },
			{ key: 'custom', name: <Dashicon icon="admin-generic" /> },
		];
		const btnWidths = [
			{ key: 'auto', name: __( 'Auto' ) },
			{ key: 'fixed', name: __( 'Fixed' ) },
			{ key: 'full', name: __( 'Full' ) },
		];
		const unitTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: '%', name: __( '%' ) },
		];
		const gradTypes = [
			{ key: 'linear', name: __( 'Linear' ) },
			{ key: 'radial', name: __( 'Radial' ) },
		];
		const bgType = [
			{ key: 'solid', name: __( 'Solid' ) },
			{ key: 'gradient', name: __( 'Gradient' ) },
		];
		const config = ( googleFont ? gconfig : '' );
		const renderBtns = ( index ) => {
			const isButtonSelected = ( isSelected && this.state.selectedButton === index );
			const fieldClassName = classnames( {
				'btn-area-wrap': true,
				'is-selected': isButtonSelected,
				[ `kt-btn-${ index }-area` ]: true,
			} );
			let btnSize;
			if ( undefined !== btns[ index ].paddingLR || undefined !== btns[ index ].paddingBT ) {
				btnSize = 'custom';
			} else {
				btnSize = 'standard';
			}
			let btnbg;
			let btnGrad;
			let btnGrad2;
			if ( undefined !== btns[ index ].backgroundType && 'gradient' === btns[ index ].backgroundType ) {
				btnGrad = ( 'transparent' === btns[ index ].background || undefined === btns[ index ].background ? 'rgba(255,255,255,0)' : KadenceColorOutput( btns[ index ].background, ( btns[ index ].backgroundOpacity !== undefined ? btns[ index ].backgroundOpacity : 1 ) ) );
				btnGrad2 = ( undefined !== btns[ index ].gradient && undefined !== btns[ index ].gradient[ 0 ] && '' !== btns[ index ].gradient[ 0 ] ? KadenceColorOutput( btns[ index ].gradient[ 0 ], ( undefined !== btns[ index ].gradient && btns[ index ].gradient[ 1 ] !== undefined ? btns[ index ].gradient[ 1 ] : 1 ) ) : hexToRGBA( '#999999', ( undefined !== btns[ index ].gradient && btns[ index ].gradient[ 1 ] !== undefined ? btns[ index ].gradient[ 1 ] : 1 ) ) );
				if ( undefined !== btns[ index ].gradient && 'radial' === btns[ index ].gradient[ 4 ] ) {
					btnbg = `radial-gradient(at ${ ( undefined === btns[ index ].gradient[ 6 ] ? 'center center' : btns[ index ].gradient[ 6 ] ) }, ${ btnGrad } ${ ( undefined === btns[ index ].gradient[ 2 ] ? '0' : btns[ index ].gradient[ 2 ] ) }%, ${ btnGrad2 } ${ ( undefined === btns[ index ].gradient[ 3 ] ? '100' : btns[ index ].gradient[ 3 ] ) }%)`;
				} else if ( undefined === btns[ index ].gradient || 'radial' !== btns[ index ].gradient[ 4 ] ) {
					btnbg = `linear-gradient(${ ( undefined !== btns[ index ].gradient && undefined !== btns[ index ].gradient[ 5 ] ? btns[ index ].gradient[ 5 ] : '180' ) }deg, ${ btnGrad } ${ ( undefined !== btns[ index ].gradient && undefined !== btns[ index ].gradient[ 2 ] ? btns[ index ].gradient[ 2 ] : '0' ) }%, ${ btnGrad2 } ${ ( undefined !== btns[ index ].gradient && undefined !== btns[ index ].gradient[ 3 ] ? btns[ index ].gradient[ 3 ] : '100' ) }%)`;
				}
			} else {
				btnbg = ( 'transparent' === btns[ index ].background || undefined === btns[ index ].background ? undefined : KadenceColorOutput( btns[ index ].background, ( btns[ index ].backgroundOpacity !== undefined ? btns[ index ].backgroundOpacity : 1 ) ) );
			}
			//const ariaLabel = sprintf( __( 'Button %1$d of %2$d', 'kadence-blocks' ), ( index + 1 ), btns.length );
			const ariaLabel =  __( 'Button', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' );
			const moveable = ( index === 0 && ( ( index + 1 ) === btns.length ) ? false : true );
			const btnClassName = classnames( {
				'kt-button': true,
				[ `kt-button-${ index }` ]: true,
				[ `kt-btn-size-${ ( btns[ index ].btnSize ? btns[ index ].btnSize : btnSize ) }` ]: true,
				[ `kt-btn-style-${ ( btns[ index ].btnStyle ? btns[ index ].btnStyle : 'basic' ) }` ]: true,
				[ `kb-btn-global-${ btns[ index ].inheritStyles }` ]: btns[ index ].inheritStyles,
				'wp-block-button__link': btns[ index ].inheritStyles && 'inherit' === btns[ index ].inheritStyles,
				[ `kb-btn-only-icon` ]: ( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[0] ),
				[ `kb-btn-tablet-only-icon` ]:( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[1] ),
				[ `kb-btn-mobile-only-icon` ]: ( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[2] ),
			} );
			const topIconPadding = ( btns[ index ].icon ? this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== btns[ index ].iconPadding && undefined !== btns[ index ].iconPadding[0] && '' !== btns[ index ].iconPadding[0] ? btns[ index ].iconPadding[0] : '' ), ( undefined !== btns[ index ].iconTabletPadding && undefined !== btns[ index ].iconTabletPadding[0] && '' !== btns[ index ].iconTabletPadding[0] ? btns[ index ].iconTabletPadding[0] : '' ), ( undefined !== btns[ index ].iconMobilePadding && undefined !== btns[ index ].iconMobilePadding[0] && '' !== btns[ index ].iconMobilePadding[0] ? btns[ index ].iconMobilePadding[0] : '' ) ) : '' );
			const rightIconPadding = ( btns[ index ].icon ? this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== btns[ index ].iconPadding && undefined !== btns[ index ].iconPadding[1] && '' !== btns[ index ].iconPadding[1] ? btns[ index ].iconPadding[1] : '' ), ( undefined !== btns[ index ].iconTabletPadding && undefined !== btns[ index ].iconTabletPadding[1] && '' !== btns[ index ].iconTabletPadding[1] ? btns[ index ].iconTabletPadding[1] : '' ), ( undefined !== btns[ index ].iconMobilePadding && undefined !== btns[ index ].iconMobilePadding[1] && '' !== btns[ index ].iconMobilePadding[1] ? btns[ index ].iconMobilePadding[1] : '' ) ) : '' );
			const bottomIconPadding = ( btns[ index ].icon ? this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== btns[ index ].iconPadding && undefined !== btns[ index ].iconPadding[2] && '' !== btns[ index ].iconPadding[2] ? btns[ index ].iconPadding[2] : '' ), ( undefined !== btns[ index ].iconTabletPadding && undefined !== btns[ index ].iconTabletPadding[2] && '' !== btns[ index ].iconTabletPadding[2] ? btns[ index ].iconTabletPadding[2] : '' ), ( undefined !== btns[ index ].iconMobilePadding && undefined !== btns[ index ].iconMobilePadding[2] && '' !== btns[ index ].iconMobilePadding[2] ? btns[ index ].iconMobilePadding[2] : '' ) ) : '' );
			const leftIconPadding = ( btns[ index ].icon ? this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== btns[ index ].iconPadding && undefined !== btns[ index ].iconPadding[3] && '' !== btns[ index ].iconPadding[3] ? btns[ index ].iconPadding[3] : '' ), ( undefined !== btns[ index ].iconTabletPadding && undefined !== btns[ index ].iconTabletPadding[3] && '' !== btns[ index ].iconTabletPadding[3] ? btns[ index ].iconTabletPadding[3] : '' ), ( undefined !== btns[ index ].iconMobilePadding && undefined !== btns[ index ].iconMobilePadding[3] && '' !== btns[ index ].iconMobilePadding[3] ? btns[ index ].iconMobilePadding[3] : '' ) ) : '' );
			return (
				<div
					className={ fieldClassName }
					style={ {
						marginRight: btns[ index ].gap + 'px',
					} }
					tabIndex="0"
					ref={ this.bindContainer }
					aria-label={ ariaLabel }
					role="button"
					onClick={ this.onSelectButton( index ) }
					unstableOnFocus={ this.onSelectButton( index ) }
					onKeyDown={ ( event ) => {
						const { keyCode } = event;
						if ( keyCode === DELETE ) {
							//this.onKeyRemoveButton( index );
						}
					} }
				>
					<span className={ `kt-button-wrap kt-btn-${ index }-action kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) }` }>
						<span className={ btnClassName } style={ {
							background: ( undefined !== btnbg ? btnbg : undefined ),
							color: ( undefined !== btns[ index ].color ? KadenceColorOutput( btns[ index ].color ) : undefined ),
							fontSize: ( undefined !== btns[ index ].size ? this.getPreviewSize( this.props.getPreviewDevice, btns[ index ].size, ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 0 ] ? btns[ index ].responsiveSize[ 0 ] : '' ), ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 1 ] ? btns[ index ].responsiveSize[ 1 ] : '' ) ) + ( undefined !== btns[ index ].sizeType ? btns[ index ].sizeType : 'px' ) : undefined ),
							fontWeight: fontWeight,
							fontStyle: fontStyle,
							letterSpacing: letterSpacing + 'px',
							textTransform: ( textTransform ? textTransform : undefined ),
							fontFamily: ( typography ? typography : '' ),
							borderRadius: ( undefined !== btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
							borderWidth: ( undefined !== btns[ index ].borderWidth ? btns[ index ].borderWidth + 'px' : undefined ),
							borderColor: ( undefined === btns[ index ].border ? '#555555' : KadenceColorOutput( btns[ index ].border, ( btns[ index ].borderOpacity !== undefined ? btns[ index ].borderOpacity : 1 ) ) ),
							paddingLeft: ( undefined !== btns[ index ].paddingLR && 'custom' === btns[ index ].btnSize ? btns[ index ].paddingLR + 'px' : undefined ),
							paddingRight: ( undefined !== btns[ index ].paddingLR && 'custom' === btns[ index ].btnSize ? btns[ index ].paddingLR + 'px' : undefined ),
							paddingTop: ( undefined !== btns[ index ].paddingBT && 'custom' === btns[ index ].btnSize ? btns[ index ].paddingBT + 'px' : undefined ),
							paddingBottom: ( undefined !== btns[ index ].paddingBT && 'custom' === btns[ index ].btnSize ? btns[ index ].paddingBT + 'px' : undefined ),
							width: ( undefined !== widthType && 'fixed' === widthType && undefined !== btns[ index ].width && undefined !== btns[ index ].width[ 0 ] ? btns[ index ].width[ 0 ] + ( undefined !== widthUnit ? widthUnit : 'px' ) : undefined ),
							boxShadow: ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] && btns[ index ].boxShadow[ 0 ] ? ( undefined !== btns[ index ].boxShadow[ 7 ] && btns[ index ].boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ), ( undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 1 ) ) : undefined ),
						} } >
							{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
								<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } style={ {
									paddingTop: ( topIconPadding ? topIconPadding + 'px' : undefined ),
									paddingRight: ( rightIconPadding ? rightIconPadding + 'px' : undefined ),
									paddingBottom: ( bottomIconPadding ? bottomIconPadding + 'px' : undefined ),
									paddingLeft: ( leftIconPadding ? leftIconPadding + 'px' : undefined ),
								} } />
							) }
							<RichText
								tagName="div"
								placeholder={ __( 'Button...', 'kadence-blocks' ) }
								value={ btns[ index ].text }
								unstableOnFocus={ () => {
									if ( 1 === index ) {
										onFocusBtn1();
									} else if ( 2 === index ) {
										onFocusBtn2();
									} else if ( 3 === index ) {
										onFocusBtn3();
									} else if ( 4 === index ) {
										onFocusBtn4();
									} else {
										onFocusBtn();
									}
								} }
								onChange={ value => {
									this.saveArrayUpdate( { text: value }, index );
								} }
								allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
								className={ 'kt-button-text' }
								keepPlaceholderOnFocus
							/>
							{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
								<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } style={ {
									paddingTop: ( topIconPadding ? topIconPadding + 'px' : undefined ),
									paddingRight: ( rightIconPadding ? rightIconPadding + 'px' : undefined ),
									paddingBottom: ( bottomIconPadding ? bottomIconPadding + 'px' : undefined ),
									paddingLeft: ( leftIconPadding ? leftIconPadding + 'px' : undefined ),
								} } />
							) }
						</span>
					</span>
					{ isButtonSelected && (
						<URLInputInline
							url={ btns[ index ].link || '' }
							onChangeUrl={ value => {
								this.saveArrayUpdate( { link: value }, index );
							} }
							opensInNewTab={ ( undefined !== btns[ index ].target && '_blank' === btns[ index ].target ? true : false ) }
							onChangeTarget={ value => {
								if ( true === value ) {
									this.saveArrayUpdate( { target: '_blank' }, index );
								} else {
									this.saveArrayUpdate( { target: '_self' }, index );
								}
							} }
							linkNoFollow={ ( undefined !== btns[ index ].noFollow ? btns[ index ].noFollow : false ) }
							onChangeFollow={ value => {
								this.saveArrayUpdate( { noFollow: value }, index );
							} }
							linkSponsored={ ( undefined !== btns[ index ].sponsored ? btns[ index ].sponsored : false ) }
							onChangeSponsored={ value => {
								this.saveArrayUpdate( { sponsored: value }, index );
							} }
							linkDownload={ ( undefined !== btns[ index ].download ? btns[ index ].download : false ) }
							onChangeDownload={ value => {
								this.saveArrayUpdate( { download: value }, index );
							} }
						/>
					) }
					{ isButtonSelected && (
						<Fragment>
							<div className="kadence-blocks-button-item-controls kadence-blocks-button-item__move-menu">
								<ButtonStyleCopyPaste
									onPasteWrap={ value => setAttributes( value ) }
									onPasteButton={ value => this.saveArrayUpdate( value, index ) }
									blockAttributes={ this.props.attributes }
									buttonIndex={ index }
								/>
								{ moveable && (
									<DropdownMenu
										className="block-editor-block-settings-menu kadence-blocks-button-item__move-menu_item"
										icon={ 'move' }
										label={ __( 'Move Button', 'kadence-blocks' ) }
										popoverProps={ POPOVER_PROPS }
									>
										{ ( { onClose } ) => (
											<Fragment>
												<MenuGroup>
													<MenuItem
														icon="arrow-left"
														onClick={ flow( onClose, this.onMoveBackward( index ) ) }
														disabled={ index === 0 }
														label={ __( 'Move Left', 'kadence-blocks' ) }
													>
														{ __( 'Move Left', 'kadence-blocks' ) }
													</MenuItem>
													<MenuItem
														icon={ 'arrow-right' }
														onClick={ flow( onClose, this.onMoveForward( index ) ) }
														disabled={ ( index + 1 ) === btns.length }
														label={ __( 'Move Right', 'kadence-blocks' ) }
													>
														{ __( 'Move Right', 'kadence-blocks' ) }
													</MenuItem>
												</MenuGroup>
											</Fragment>
										) }
									</DropdownMenu>
								) }
							</div>
							<div className="kadence-blocks-button-item-controls kadence-blocks-button-item__inline-menu">
								<IconButton
									icon="admin-page"
									onClick={ this.onDuplicateButton( index ) }
									className="kadence-blocks-button-item__duplicate"
									label={ __( 'Duplicate Button', 'kadence-blocks' ) }
									disabled={ ! isButtonSelected }
								/>
								<IconButton
									icon="no-alt"
									onClick={ this.onRemoveButton( index ) }
									className="kadence-blocks-button-item__remove"
									label={ __( 'Remove Button', 'kadence-blocks' ) }
									disabled={ ! isButtonSelected || 1 === btns.length }
								/>
							</div>
						</Fragment>
					) }
				</div>
			);
		};
		const onFocusBtn = () => {
			if ( 'btn0' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn0',
				} );
			}
		};
		const onFocusBtn1 = () => {
			if ( 'btn1' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn1',
				} );
			}
		};
		const onFocusBtn2 = () => {
			if ( 'btn2' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn2',
				} );
			}
		};
		const onFocusBtn3 = () => {
			if ( 'btn3' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn3',
				} );
			}
		};
		const onFocusBtn4 = () => {
			if ( 'btn4' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn4',
				} );
			}
		};
		const defineWidthType = ( type ) => {
			if ( 'full' === type ) {
				setAttributes( { forceFullwidth: true } );
				setAttributes( { widthType: type } );
			} else {
				setAttributes( { forceFullwidth: false } );
				setAttributes( { widthType: type } );
			}
		};
		const defineWidthTypeToggle = ( value ) => {
			if ( value ) {
				setAttributes( { forceFullwidth: true } );
				setAttributes( { widthType: 'full' } );
			} else {
				setAttributes( { forceFullwidth: false } );
				setAttributes( { widthType: 'full' } );
			}
		};
		const buttonStyleOptions = [
			{ key: '', name: __( 'Default', 'kadence-blocks' ) },
			{ key: 'inherit', name: __( 'Theme', 'kadence-blocks' ) },
			// { key: 'leftabove', name: __( 'Left Above' ), icon: icons.infoLeftAbove },
			// { key: 'left', name: __( 'Left' ), icon: icons.infoLeft },
			// { key: 'overlay', name: __( 'Overlay' ), icon: icons.infoTopOverlay },
			// { key: 'overlayleft', name: __( 'Overlay Left' ), icon: icons.infoLeftOverlay },
		];
		const tabControls = ( index ) => {
			const isButtonSelected = ( isSelected && this.state.selectedButton === index );
			return (
				<PanelBody
					title={ __( 'Button', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					opened={ ( true === isButtonSelected ? true : undefined ) }
				>
					<Fragment>
						<h2 className="side-h2-label">{ __( 'Button Inherit Styles', 'kadence-blocks' ) }</h2>
						<ButtonGroup className="kt-style-btn-group kb-button-global-styles" aria-label={ __( 'Button Global Styles', 'kadence-blocks' ) }>
							{ map( buttonStyleOptions, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-style-btn"
									isSmall
									isPrimary={ ( undefined !== btns[ index ].inheritStyles && btns[ index ].inheritStyles === key ? true : false ) }
									aria-pressed={ ( undefined !== btns[ index ].inheritStyles && btns[ index ].inheritStyles === key ? true : false ) }
									onClick={ () => {
										//this.saveArrayUpdate( { inheritStyles: key }, index );
										if ( key === 'inherit' ) {
											this.saveArrayUpdate( { color: '', background: '', backgroundType: 'solid', border: '', colorHover: '', backgroundHover: '', backgroundHoverType: 'solid', borderHover: '', inheritStyles: key }, index );
										} else {
											this.saveArrayUpdate( { inheritStyles: key }, index );
										}
									} }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
					</Fragment>
					<URLInputControl
						label={ __( 'Button Link', 'kadence-blocks' ) }
						url={ btns[ index ].link }
						onChangeUrl={ value => {
							this.saveArrayUpdate( { link: value }, index );
						} }
						additionalControls={ true }
						changeTargetType={ true }
						opensInNewTab={ ( undefined !== btns[ index ].target ? btns[ index ].target : '' ) }
						onChangeTarget={ value => {
							this.saveArrayUpdate( { target: value }, index );
						} }
						linkNoFollow={ ( undefined !== btns[ index ].noFollow ? btns[ index ].noFollow : false ) }
						onChangeFollow={ value => {
							this.saveArrayUpdate( { noFollow: value }, index );
						} }
						linkSponsored={ ( undefined !== btns[ index ].sponsored ? btns[ index ].sponsored : false ) }
						onChangeSponsored={ value => {
							this.saveArrayUpdate( { sponsored: value }, index );
						} }
						linkDownload={ ( undefined !== btns[ index ].download ? btns[ index ].download : false ) }
						onChangeDownload={ value => {
							this.saveArrayUpdate( { download: value }, index );
						} }
					/>
					{ this.showSettings( 'sizeSettings' ) && (
						<Fragment>
							<ResponsiveRangeControls
								label={ __( 'Font Size', 'kadence-blocks' ) }
								value={ btns[ index ].size ? btns[ index ].size : '' }
								onChange={ value => {
									this.saveArrayUpdate( { size: value }, index );
								} }
								tabletValue={ ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 0 ] ? btns[ index ].responsiveSize[ 0 ] : '' ) }
								onChangeTablet={ ( value ) => {
									this.saveArrayUpdate( { responsiveSize: [ value, ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 1 ] ? btns[ index ].responsiveSize[ 1 ] : '' ) ] }, index );
								} }
								mobileValue={ ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 1 ] ? btns[ index ].responsiveSize[ 1 ] : '' ) }
								onChangeMobile={ ( value ) => {
									this.saveArrayUpdate( { responsiveSize: [ ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 0 ] ? btns[ index ].responsiveSize[ 0 ] : '' ), value ] }, index );
								} }
								min={ 0 }
								max={ ( ( btns[ index ].sizeType ? btns[ index ].sizeType : 'px' ) !== 'px' ? 12 : 200 ) }
								step={ ( ( btns[ index ].sizeType ? btns[ index ].sizeType : 'px' ) !== 'px' ? 0.1 : 1 ) }
								unit={ btns[ index ].sizeType ? btns[ index ].sizeType : 'px' }
								onUnit={ ( value ) => {
									this.saveArrayUpdate( { sizeType: value }, index );
								} }
								units={ [ 'px', 'em', 'rem' ] }
							/>
							<h2 className="kt-heading-size-title">{ __( 'Text Size', 'kadence-blocks' ) }</h2>
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
													<KadenceRange
														className="btn-text-size-range"
														beforeIcon="editor-textcolor"
														afterIcon="editor-textcolor"
														value={ ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 1 ] ? btns[ index ].responsiveSize[ 1 ] : '' ) }
														onChange={ value => {
															this.saveArrayUpdate( { responsiveSize: [ ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 0 ] ? btns[ index ].responsiveSize[ 0 ] : '' ), value ] }, index );
														} }
														min={ 4 }
														max={ 100 }
													/>
												);
											} else if ( 'tablet' === tab.name ) {
												tabout = (
													<KadenceRange
														className="btn-text-size-range"
														beforeIcon="editor-textcolor"
														afterIcon="editor-textcolor"
														value={ ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 0 ] ? btns[ index ].responsiveSize[ 0 ] : '' ) }
														onChange={ value => {
															this.saveArrayUpdate( { responsiveSize: [ value, ( undefined !== btns[ index ].responsiveSize && undefined !== btns[ index ].responsiveSize[ 1 ] ? btns[ index ].responsiveSize[ 1 ] : '' ) ] }, index );
														} }
														min={ 4 }
														max={ 100 }
													/>
												);
											} else {
												tabout = (
													<KadenceRange
														className="btn-text-size-range"
														beforeIcon="editor-textcolor"
														afterIcon="editor-textcolor"
														value={ btns[ index ].size }
														onChange={ value => {
															this.saveArrayUpdate( { size: value }, index );
														} }
														min={ 4 }
														max={ 100 }
													/>
												);
											}
										}
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
							<div className="kt-btn-size-settings-container">
								<h2 className="kt-beside-btn-group">{ __( 'Button Size' ) }</h2>
								<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Button Size', 'kadence-blocks' ) }>
									{ map( btnSizes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-btn-size-btn"
											isSmall
											isPrimary={ btns[ index ].btnSize === key }
											aria-pressed={ btns[ index ].btnSize === key }
											onClick={ () => this.saveArrayUpdate( { btnSize: key }, index ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							{ 'custom' === btns[ index ].btnSize && (
								<div className="kt-inner-sub-section">
									<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Padding', 'kadence-blocks' ) }</h2>
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
															<Fragment>
																<RangeControl
																	label={ __( 'Top and Bottom Padding', 'kadence-blocks' ) }
																	value={ ( undefined !== btns[ index ].responsivePaddingBT && undefined !== btns[ index ].responsivePaddingBT[ 1 ] ? btns[ index ].responsivePaddingBT[ 1 ] : '' ) }
																	onChange={ value => {
																		this.saveArrayUpdate( { responsivePaddingBT: [ ( undefined !== btns[ index ].responsivePaddingBT && undefined !== btns[ index ].responsivePaddingBT[ 0 ] ? btns[ index ].responsivePaddingBT[ 0 ] : '' ), value ] }, index );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<RangeControl
																	label={ __( 'Left and Right Padding', 'kadence-blocks' ) }
																	value={ ( undefined !== btns[ index ].responsivePaddingLR && undefined !== btns[ index ].responsivePaddingLR[ 1 ] ? btns[ index ].responsivePaddingLR[ 1 ] : '' ) }
																	onChange={ value => {
																		this.saveArrayUpdate( { responsivePaddingLR: [ ( undefined !== btns[ index ].responsivePaddingLR && undefined !== btns[ index ].responsivePaddingLR[ 0 ] ? btns[ index ].responsivePaddingLR[ 0 ] : '' ), value ] }, index );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
															</Fragment>
														);
													} else if ( 'tablet' === tab.name ) {
														tabout = (
															<Fragment>
																<RangeControl
																	label={ __( 'Top and Bottom Padding', 'kadence-blocks' ) }
																	value={ ( undefined !== btns[ index ].responsivePaddingBT && undefined !== btns[ index ].responsivePaddingBT[ 0 ] ? btns[ index ].responsivePaddingBT[ 0 ] : '' ) }
																	onChange={ value => {
																		this.saveArrayUpdate( { responsivePaddingBT: [ value, ( undefined !== btns[ index ].responsivePaddingBT && undefined !== btns[ index ].responsivePaddingBT[ 1 ] ? btns[ index ].responsivePaddingBT[ 1 ] : '' ) ] }, index );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<RangeControl
																	label={ __( 'Left and Right Padding', 'kadence-blocks' ) }
																	value={ ( undefined !== btns[ index ].responsivePaddingLR && undefined !== btns[ index ].responsivePaddingLR[ 0 ] ? btns[ index ].responsivePaddingLR[ 0 ] : '' ) }
																	onChange={ value => {
																		this.saveArrayUpdate( { responsivePaddingLR: [ value, ( undefined !== btns[ index ].responsivePaddingLR && undefined !== btns[ index ].responsivePaddingLR[ 1 ] ? btns[ index ].responsivePaddingLR[ 1 ] : '' ) ] }, index );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																<RangeControl
																	label={ __( 'Top and Bottom Padding', 'kadence-blocks' ) }
																	value={ btns[ index ].paddingBT }
																	onChange={ value => {
																		this.saveArrayUpdate( { paddingBT: value }, index );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<RangeControl
																	label={ __( 'Left and Right Padding', 'kadence-blocks' ) }
																	value={ btns[ index ].paddingLR }
																	onChange={ value => {
																		this.saveArrayUpdate( { paddingLR: value }, index );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
															</Fragment>
														);
													}
												}
												return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
											}
										}
									</TabPanel>
								</div>
							) }
							<div className="kt-btn-size-settings-container">
								<h2 className="kt-beside-btn-group">{ __( 'Button Width', 'kadence-blocks' ) }</h2>
								<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Button Width', 'kadence-blocks' ) }>
									{ map( btnWidths, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-btn-size-btn"
											isSmall
											isPrimary={ widthType === key }
											aria-pressed={ widthType === key }
											onClick={ () => defineWidthType( key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							{ 'full' === widthType && (
								<ToggleControl
									label={ __( 'Collapse on mobile', 'kadence-blocks' ) }
									checked={ ( undefined !== collapseFullwidth ? collapseFullwidth : false ) }
									onChange={ ( value ) => setAttributes( { collapseFullwidth: value } ) }
								/>
							) }
							{ 'fixed' === widthType && (
								<div className="kt-inner-sub-section">
									<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Fixed Width', 'kadence-blocks' ) }</h2>
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
															<Fragment>
																<RangeControl
																	value={ ( btns[ index ].width && undefined !== btns[ index ].width[ 2 ] ? btns[ index ].width[ 2 ] : undefined ) }
																	onChange={ value => {
																		this.saveArrayUpdate( { width: [ ( undefined !== btns[ index ].width && undefined !== btns[ index ].width[ 0 ] ? btns[ index ].width[ 0 ] : '' ), ( undefined !== btns[ index ].width && undefined !== btns[ index ].width[ 1 ] ? btns[ index ].width[ 1 ] : '' ), value ] }, index );
																	} }
																	min={ 10 }
																	max={ 500 }
																/>
															</Fragment>
														);
													} else if ( 'tablet' === tab.name ) {
														tabout = (
															<Fragment>
																<RangeControl
																	value={ ( btns[ index ].width && undefined !== btns[ index ].width[ 1 ] ? btns[ index ].width[ 1 ] : undefined ) }
																	onChange={ value => {
																		this.saveArrayUpdate( { width: [ ( undefined !== btns[ index ].width && undefined !== btns[ index ].width[ 0 ] ? btns[ index ].width[ 0 ] : '' ), value, ( undefined !== btns[ index ].width && undefined !== btns[ index ].width[ 2 ] ? btns[ index ].width[ 2 ] : '' ) ] }, index );
																	} }
																	min={ 10 }
																	max={ 500 }
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																<RangeControl
																	value={ ( btns[ index ].width && undefined !== btns[ index ].width[ 0 ] ? btns[ index ].width[ 0 ] : undefined ) }
																	onChange={ value => {
																		this.saveArrayUpdate( { width: [ value, ( undefined !== btns[ index ].width && undefined !== btns[ index ].width[ 1 ] ? btns[ index ].width[ 1 ] : '' ), ( undefined !== btns[ index ].width && undefined !== btns[ index ].width[ 2 ] ? btns[ index ].width[ 2 ] : '' ) ] }, index );
																	} }
																	min={ 10 }
																	max={ 500 }
																/>
															</Fragment>
														);
													}
												}
												return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
											}
										}
									</TabPanel>
								</div>
							) }
						</Fragment>
					) }
					{ this.showSettings( 'colorSettings' ) && (
						<Fragment>
							<h2 className="kt-tab-wrap-title kt-color-settings-title">{ __( 'Color Settings', 'kadence-blocks' ) }</h2>
							<TabPanel className="kt-inspect-tabs kt-hover-tabs"
								activeClass="active-tab"
								tabs={ [
									{
										name: 'normal' + index,
										title: __( 'Normal' ),
										className: 'kt-normal-tab',
									},
									{
										name: 'hover' + index,
										title: __( 'Hover' ),
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
												tabout = buttonSettings( index );
											}
										}
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
							<h2>{ __( 'Border Settings', 'kadence-blocks' ) }</h2>
							<RangeControl
								label={ __( 'Border Width' ) }
								value={ btns[ index ].borderWidth }
								onChange={ value => {
									this.saveArrayUpdate( { borderWidth: value }, index );
								} }
								min={ 0 }
								max={ 20 }
							/>
							<RangeControl
								label={ __( 'Border Radius', 'kadence-blocks' ) }
								value={ btns[ index ].borderRadius }
								onChange={ value => {
									this.saveArrayUpdate( { borderRadius: value }, index );
								} }
								min={ 0 }
								max={ 50 }
							/>
						</Fragment>
					) }
					{ this.showSettings( 'iconSettings' ) && (
						<Fragment>
							<h2 className="kt-tool">{ __( 'Icon Settings', 'kadence-blocks' ) }</h2>
							<div className="kt-select-icon-container">
								<IconControl
									value={ btns[ index ].icon }
									onChange={ value => {
										this.saveArrayUpdate( { icon: value }, index );
									} }
								/>
							</div>
							<SmallResponsiveControl
								label={ __( 'Show Only Icon', 'kadence-blocks' ) }
								desktopChildren={ <ToggleControl
									label={ __( 'Show only Icon', 'kadence-blocks' ) }
									checked={ ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[0] ? btns[ index ].onlyIcon[0] : false ) }
									onChange={ ( value ) => this.saveArrayUpdate( { onlyIcon: [ value, ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[1] ? btns[ index ].onlyIcon[1] : '' ), ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[2] ? btns[ index ].onlyIcon[2] : '' ) ] }, index ) }
								/> }
								tabletChildren={ <ToggleControl
									label={  __( 'Show only Icon', 'kadence-blocks' ) }
									disabled={ ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[0] ? btns[ index ].onlyIcon[0] : false ) }
									checked={ ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[1] ? btns[ index ].onlyIcon[1] : ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[0] ? btns[ index ].onlyIcon[0] : false ) ) }
									onChange={ ( value ) => this.saveArrayUpdate( { onlyIcon: [ ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[0] ? btns[ index ].onlyIcon[0] : false ), value, ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[2] ? btns[ index ].onlyIcon[2] : '' ) ] }, index ) }
								/> }
								mobileChildren={ <ToggleControl
									label={  __( 'Show only Icon', 'kadence-blocks' ) }
									disabled={ ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[1] && '' !== btns[ index ].onlyIcon[1] ? btns[ index ].onlyIcon[1] : ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[0] ? btns[ index ].onlyIcon[0] : false ) ) }
									checked={ ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[2] && '' !== btns[ index ].onlyIcon[2] ? btns[ index ].onlyIcon[2] : ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[1] ? btns[ index ].onlyIcon[1] : ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[0] ? btns[ index ].onlyIcon[0] : false ) ) ) }
									onChange={ ( value ) => this.saveArrayUpdate( { onlyIcon: [ ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[0] ? btns[ index ].onlyIcon[0] : false ), ( undefined !== btns[ index ].onlyIcon && undefined !== btns[ index ].onlyIcon[1] ? btns[ index ].onlyIcon[1] : '' ), value ] }, index ) }
								/> }
							/>
							<ResponsiveMeasuremenuControls
								label={ __( 'Icon Padding', 'kadence-blocks' ) }
								value={ undefined !== btns[ index ].iconPadding ? btns[ index ].iconPadding : [ '', '', '', '' ] }
								control={ this.state.iconPaddingControl }
								tabletValue={ undefined !== btns[ index ].iconTabletPadding ? btns[ index ].iconTabletPadding : [ '', '', '', '' ] }
								mobileValue={ undefined !== btns[ index ].iconMobilePadding ? btns[ index ].iconMobilePadding : [ '', '', '', '' ] }
								onChange={ ( value ) => this.saveArrayUpdate( { iconPadding: value }, index ) }
								onChangeTablet={ ( value ) => this.saveArrayUpdate( { iconTabletPadding: value }, index ) }
								onChangeMobile={ ( value ) => this.saveArrayUpdate( { iconMobilePadding: value }, index ) }
								onChangeControl={ ( value ) => this.setState( { iconPaddingControl: value } ) }
								min={ 0 }
								max={ 200 }
								step={ 1 }
								unit={ 'px' }
								units={ [ 'px' ] }
							/>
							<SelectControl
								label={ __( 'Icon Location', 'kadence-blocks' ) }
								value={ btns[ index ].iconSide }
								options={ [
									{ value: 'right', label: __( 'Right' ) },
									{ value: 'left', label: __( 'Left' ) },
								] }
								onChange={ value => {
									this.saveArrayUpdate( { iconSide: value }, index );
								} }
							/>
						</Fragment>
					) }
					<TextControl
						label={ __( 'Add Custom CSS Class', 'kadence-blocks' ) }
						value={ ( btns[ index ].cssClass ? btns[ index ].cssClass : '' ) }
						onChange={ ( value ) => this.saveArrayUpdate( { cssClass: value }, index ) }
					/>
					<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Gap Between Next', 'kadence-blocks' ) }</h2>
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
											<Fragment>
												<RangeControl
													value={ btns[ index ].mobileGap }
													onChange={ value => {
														this.saveArrayUpdate( { mobileGap: value }, index );
													} }
													min={ 0 }
													max={ 50 }
												/>
											</Fragment>
										);
									} else if ( 'tablet' === tab.name ) {
										tabout = (
											<Fragment>
												<RangeControl
													value={ btns[ index ].tabletGap }
													onChange={ value => {
														this.saveArrayUpdate( { tabletGap: value }, index );
													} }
													min={ 0 }
													max={ 50 }
												/>
											</Fragment>
										);
									} else {
										tabout = (
											<Fragment>
												<RangeControl
													value={ btns[ index ].gap }
													onChange={ value => {
														this.saveArrayUpdate( { gap: value }, index );
													} }
													min={ 0 }
													max={ 50 }
												/>
											</Fragment>
										);
									}
								}
								return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
							}
						}
					</TabPanel>
				</PanelBody>
			);
		};
		const hoverSettings = ( index ) => {
			return (
				<div>
					<AdvancedPopColorControl
						label={ __( 'Hover Text Color', 'kadence-blocks' ) }
						colorValue={ ( btns[ index ].colorHover ? btns[ index ].colorHover : '#ffffff' ) }
						colorDefault={ '#ffffff' }
						onColorChange={ value => {
							this.saveArrayUpdate( { colorHover: value }, index );
						} }
					/>
					<div className="kt-btn-size-settings-container">
						<h2 className="kt-beside-btn-group">{ __( 'Background Type', 'kadence-blocks' ) }</h2>
						<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Background Type', 'kadence-blocks' ) }>
							{ map( bgType, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-btn-size-btn"
									isSmall
									isPrimary={ ( undefined !== btns[ index ].backgroundHoverType ? btns[ index ].backgroundHoverType : 'solid' ) === key }
									aria-pressed={ ( undefined !== btns[ index ].backgroundHoverType ? btns[ index ].backgroundHoverType : 'solid' ) === key }
									onClick={ () => this.saveArrayUpdate( { backgroundHoverType: key }, index ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
					</div>
					{ 'gradient' !== btns[ index ].backgroundHoverType && (
						<div className="kt-inner-sub-section">
							<AdvancedPopColorControl
								label={ __( 'Background Color', 'kadence-blocks' ) }
								colorValue={ ( btns[ index ].backgroundHover ? btns[ index ].backgroundHover : '' ) }
								colorDefault={ '' }
								opacityValue={ btns[ index ].backgroundHoverOpacity }
								onColorChange={ value => {
									this.saveArrayUpdate( { backgroundHover: value }, index );
								} }
								onOpacityChange={ value => {
									this.saveArrayUpdate( { backgroundHoverOpacity: value }, index );
								} }
								onArrayChange={ ( color, opacity ) => this.saveArrayUpdate( { backgroundHover: color, backgroundHoverOpacity: opacity }, index ) }
							/>
						</div>
					) }
					{ 'gradient' === btns[ index ].backgroundHoverType && (
						<div className="kt-inner-sub-section">
							<AdvancedPopColorControl
								label={ __( 'Gradient Color 1', 'kadence-blocks' ) }
								colorValue={ ( btns[ index ].backgroundHover ? btns[ index ].backgroundHover : '' ) }
								colorDefault={ '' }
								opacityValue={ btns[ index ].backgroundHoverOpacity }
								onColorChange={ value => {
									this.saveArrayUpdate( { backgroundHover: value }, index );
								} }
								onOpacityChange={ value => {
									this.saveArrayUpdate( { backgroundHoverOpacity: value }, index );
								} }
								onArrayChange={ ( color, opacity ) => this.saveArrayUpdate( { backgroundHover: color, backgroundHoverOpacity: opacity }, index ) }
							/>
							<RangeControl
								label={ __( 'Location', 'kadence-blocks' ) }
								value={ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 2 ] ? btns[ index ].gradientHover[ 2 ] : 0 ) }
								onChange={ ( value ) => {
									this.saveArrayUpdate( { gradientHover: [ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 0 ] ? btns[ index ].gradientHover[ 0 ] : '#777777' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 1 ] ? btns[ index ].gradientHover[ 1 ] : 1 ), value, ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 3 ] ? btns[ index ].gradientHover[ 3 ] : 100 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 5 ] ? btns[ index ].gradientHover[ 5 ] : 180 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 6 ] ? btns[ index ].gradientHover[ 6 ] : 'center center' ) ] }, index );
								} }
								min={ 0 }
								max={ 100 }
							/>
							<AdvancedPopColorControl
								label={ __( 'Gradient Color 2', 'kadence-blocks' ) }
								colorValue={ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 0 ] ? btns[ index ].gradientHover[ 0 ] : '#777777' ) }
								colorDefault={ '#777777' }
								opacityValue={ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 1 ] ? btns[ index ].gradientHover[ 1 ] : 1 ) }
								onColorChange={ value => {
									this.saveArrayUpdate( { gradientHover: [ value, ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 1 ] ? btns[ index ].gradientHover[ 1 ] : 1 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 2 ] ? btns[ index ].gradientHover[ 2 ] : 0 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 3 ] ? btns[ index ].gradientHover[ 3 ] : 100 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 5 ] ? btns[ index ].gradientHover[ 5 ] : 180 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 6 ] ? btns[ index ].gradientHover[ 6 ] : 'center center' ) ] }, index );
								} }
								onOpacityChange={ value => {
									this.saveArrayUpdate( { gradientHover: [ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 0 ] ? btns[ index ].gradientHover[ 0 ] : '#777777' ), value, ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 2 ] ? btns[ index ].gradientHover[ 2 ] : 0 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 3 ] ? btns[ index ].gradientHover[ 3 ] : 100 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 5 ] ? btns[ index ].gradientHover[ 5 ] : 180 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 6 ] ? btns[ index ].gradientHover[ 6 ] : 'center center' ) ] }, index );
								} }
							/>
							<RangeControl
								label={ __( 'Location', 'kadence-blocks' ) }
								value={ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 3 ] ? btns[ index ].gradientHover[ 3 ] : 100 ) }
								onChange={ ( value ) => {
									this.saveArrayUpdate( { gradientHover: [ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 0 ] ? btns[ index ].gradientHover[ 0 ] : '#777777' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 1 ] ? btns[ index ].gradientHover[ 1 ] : 1 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 2 ] ? btns[ index ].gradientHover[ 2 ] : 0 ), value, ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 5 ] ? btns[ index ].gradientHover[ 5 ] : 180 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 6 ] ? btns[ index ].gradientHover[ 6 ] : 'center center' ) ] }, index );
								} }
								min={ 0 }
								max={ 100 }
							/>
							<div className="kt-btn-size-settings-container">
								<h2 className="kt-beside-btn-group">{ __( 'Gradient Type', 'kadence-blocks' ) }</h2>
								<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Gradient Type', 'kadence-blocks' ) }>
									{ map( gradTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-btn-size-btn"
											isSmall
											isPrimary={ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ) === key }
											aria-pressed={ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ) === key }
											onClick={ () => {
												this.saveArrayUpdate( { gradientHover: [ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 0 ] ? btns[ index ].gradientHover[ 0 ] : '#777777' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 1 ] ? btns[ index ].gradientHover[ 1 ] : 1 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 2 ] ? btns[ index ].gradientHover[ 2 ] : 0 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 3 ] ? btns[ index ].gradientHover[ 3 ] : 100 ), key, ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 5 ] ? btns[ index ].gradientHover[ 5 ] : 180 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 6 ] ? btns[ index ].gradientHover[ 6 ] : 'center center' ) ] }, index );
											} }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							{ 'radial' !== ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ) && (
								<RangeControl
									label={ __( 'Gradient Angle', 'kadence-blocks' ) }
									value={ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 5 ] ? btns[ index ].gradientHover[ 5 ] : 180 ) }
									onChange={ ( value ) => {
										this.saveArrayUpdate( { gradientHover: [ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 0 ] ? btns[ index ].gradientHover[ 0 ] : '#777777' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 1 ] ? btns[ index ].gradientHover[ 1 ] : 1 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 2 ] ? btns[ index ].gradientHover[ 2 ] : 0 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 3 ] ? btns[ index ].gradientHover[ 3 ] : 100 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ), value, ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 6 ] ? btns[ index ].gradientHover[ 6 ] : 'center center' ) ] }, index );
									} }
									min={ 0 }
									max={ 360 }
								/>
							) }
							{ 'radial' === ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ) && (
								<SelectControl
									label={ __( 'Gradient Position', 'kadence-blocks' ) }
									value={ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 6 ] ? btns[ index ].gradientHover[ 6 ] : 'center center' ) }
									options={ [
										{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
										{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
										{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
										{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
										{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
										{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
										{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
										{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
										{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
									] }
									onChange={ value => {
										this.saveArrayUpdate( { gradientHover: [ ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 0 ] ? btns[ index ].gradientHover[ 0 ] : '#777777' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 1 ] ? btns[ index ].gradientHover[ 1 ] : 1 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 2 ] ? btns[ index ].gradientHover[ 2 ] : 0 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 3 ] ? btns[ index ].gradientHover[ 3 ] : 100 ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 4 ] ? btns[ index ].gradientHover[ 4 ] : 'linear' ), ( btns[ index ].gradientHover && undefined !== btns[ index ].gradientHover[ 5 ] ? btns[ index ].gradientHover[ 5 ] : 180 ), value ] }, index );
									} }
								/>
							) }
						</div>
					) }
					<AdvancedPopColorControl
						label={ __( 'Hover Border Color', 'kadence-blocks' ) }
						colorValue={ ( btns[ index ].borderHover ? btns[ index ].borderHover : '' ) }
						colorDefault={ '' }
						opacityValue={ btns[ index ].borderHoverOpacity }
						onColorChange={ value => {
							this.saveArrayUpdate( { borderHover: value }, index );
						} }
						onOpacityChange={ value => {
							this.saveArrayUpdate( { borderHoverOpacity: value }, index );
						} }
						onArrayChange={ ( color, opacity ) => this.saveArrayUpdate( { borderHover: color, borderHoverOpacity: opacity }, index ) }
					/>
					<BoxShadowControl
						label={ __( 'Hover Box Shadow', 'kadence-blocks' ) }
						enable={ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ) }
						color={ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ) }
						colorDefault={ '#000000' }
						opacity={ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 0.4 ) }
						hOffset={ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ) }
						vOffset={ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ) }
						blur={ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ) }
						spread={ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ) }
						inset={ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) }
						onEnableChange={ value => {
							this.saveArrayUpdate( { boxShadowHover: [ value, ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) ] }, index );
						} }
						onColorChange={ value => {
							this.saveArrayUpdate( { boxShadowHover: [ ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ), value, ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) ] }, index );
						} }
						onOpacityChange={ value => {
							this.saveArrayUpdate( { boxShadowHover: [ ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), value, ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) ] }, index );
						} }
						onHOffsetChange={ value => {
							this.saveArrayUpdate( { boxShadowHover: [ ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 0.4 ), value, ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) ] }, index );
						} }
						onVOffsetChange={ value => {
							this.saveArrayUpdate( { boxShadowHover: [ ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ), value, ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) ] }, index );
						} }
						onBlurChange={ value => {
							this.saveArrayUpdate( { boxShadowHover: [ ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ), value, ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) ] }, index );
						} }
						onSpreadChange={ value => {
							this.saveArrayUpdate( { boxShadowHover: [ ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ), value, ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) ] }, index );
						} }
						onInsetChange={ value => {
							this.saveArrayUpdate( { boxShadowHover: [ ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ), value ] }, index );
						} }
					/>
				</div>
			);
		};
		const buttonSettings = ( index ) => {
			return (
				<div>
					<AdvancedPopColorControl
						label={ __( 'Text Color', 'kadence-blocks' ) }
						colorValue={ btns[ index ].color }
						colorDefault={ '' }
						onColorChange={ value => {
							this.saveArrayUpdate( { color: value }, index );
						} }
					/>
					<div className="kt-btn-size-settings-container">
						<h2 className="kt-beside-btn-group">{ __( 'Background Type', 'kadence-blocks' ) }</h2>
						<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Background Type', 'kadence-blocks' ) }>
							{ map( bgType, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-btn-size-btn"
									isSmall
									isPrimary={ ( undefined !== btns[ index ].backgroundType ? btns[ index ].backgroundType : 'solid' ) === key }
									aria-pressed={ ( undefined !== btns[ index ].backgroundType ? btns[ index ].backgroundType : 'solid' ) === key }
									onClick={ () => this.saveArrayUpdate( { backgroundType: key }, index ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
					</div>
					{ 'gradient' !== btns[ index ].backgroundType && (
						<div className="kt-inner-sub-section">
							<AdvancedPopColorControl
								label={ __( 'Background Color', 'kadence-blocks' ) }
								colorValue={ btns[ index ].background }
								colorDefault={ '' }
								opacityValue={ btns[ index ].backgroundOpacity }
								onColorChange={ value => {
									this.saveArrayUpdate( { background: value }, index );
								} }
								onOpacityChange={ value => {
									this.saveArrayUpdate( { backgroundOpacity: value }, index );
								} }
								onArrayChange={ ( color, opacity ) => this.saveArrayUpdate( { background: color, backgroundOpacity: opacity }, index ) }
							/>
						</div>
					) }
					{ 'gradient' === btns[ index ].backgroundType && (
						<div className="kt-inner-sub-section">
							<AdvancedPopColorControl
								label={ __( 'Gradient Color 1', 'kadence-blocks' ) }
								colorValue={ btns[ index ].background }
								colorDefault={ '' }
								opacityValue={ btns[ index ].backgroundOpacity }
								onColorChange={ value => {
									this.saveArrayUpdate( { background: value }, index );
								} }
								onOpacityChange={ value => {
									this.saveArrayUpdate( { backgroundOpacity: value }, index );
								} }
								onArrayChange={ ( color, opacity ) => this.saveArrayUpdate( { background: color, backgroundOpacity: opacity }, index ) }
							/>
							<RangeControl
								label={ __( 'Location', 'kadence-blocks' ) }
								value={ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 2 ] ? btns[ index ].gradient[ 2 ] : 0 ) }
								onChange={ ( value ) => {
									this.saveArrayUpdate( { gradient: [ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 0 ] ? btns[ index ].gradient[ 0 ] : '#999999' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 1 ] ? btns[ index ].gradient[ 1 ] : 1 ), value, ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 3 ] ? btns[ index ].gradient[ 3 ] : 100 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 5 ] ? btns[ index ].gradient[ 5 ] : 180 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 6 ] ? btns[ index ].gradient[ 6 ] : 'center center' ) ] }, index );
								} }
								min={ 0 }
								max={ 100 }
							/>
							<AdvancedPopColorControl
								label={ __( 'Gradient Color 2', 'kadence-blocks' ) }
								colorValue={ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 0 ] ? btns[ index ].gradient[ 0 ] : '#999999' ) }
								colorDefault={ '#999999' }
								opacityValue={ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 1 ] ? btns[ index ].gradient[ 1 ] : 1 ) }
								onColorChange={ value => {
									this.saveArrayUpdate( { gradient: [ value, ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 1 ] ? btns[ index ].gradient[ 1 ] : 1 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 2 ] ? btns[ index ].gradient[ 2 ] : 0 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 3 ] ? btns[ index ].gradient[ 3 ] : 100 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 5 ] ? btns[ index ].gradient[ 5 ] : 180 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 6 ] ? btns[ index ].gradient[ 6 ] : 'center center' ) ] }, index );
								} }
								onOpacityChange={ value => {
									this.saveArrayUpdate( { gradient: [ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 0 ] ? btns[ index ].gradient[ 0 ] : '#999999' ), value, ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 2 ] ? btns[ index ].gradient[ 2 ] : 0 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 3 ] ? btns[ index ].gradient[ 3 ] : 100 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 5 ] ? btns[ index ].gradient[ 5 ] : 180 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 6 ] ? btns[ index ].gradient[ 6 ] : 'center center' ) ] }, index );
								} }
							/>
							<RangeControl
								label={ __( 'Location', 'kadence-blocks' ) }
								value={ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 3 ] ? btns[ index ].gradient[ 3 ] : 100 ) }
								onChange={ ( value ) => {
									this.saveArrayUpdate( { gradient: [ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 0 ] ? btns[ index ].gradient[ 0 ] : '#999999' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 1 ] ? btns[ index ].gradient[ 1 ] : 1 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 2 ] ? btns[ index ].gradient[ 2 ] : 0 ), value, ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 5 ] ? btns[ index ].gradient[ 5 ] : 180 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 6 ] ? btns[ index ].gradient[ 6 ] : 'center center' ) ] }, index );
								} }
								min={ 0 }
								max={ 100 }
							/>
							<div className="kt-btn-size-settings-container">
								<h2 className="kt-beside-btn-group">{ __( 'Gradient Type', 'kadence-blocks' ) }</h2>
								<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Gradient Type', 'kadence-blocks' ) }>
									{ map( gradTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-btn-size-btn"
											isSmall
											isPrimary={ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ) === key }
											aria-pressed={ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ) === key }
											onClick={ () => {
												this.saveArrayUpdate( { gradient: [ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 0 ] ? btns[ index ].gradient[ 0 ] : '#999999' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 1 ] ? btns[ index ].gradient[ 1 ] : 1 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 2 ] ? btns[ index ].gradient[ 2 ] : 0 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 3 ] ? btns[ index ].gradient[ 3 ] : 100 ), key, ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 5 ] ? btns[ index ].gradient[ 5 ] : 180 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 6 ] ? btns[ index ].gradient[ 6 ] : 'center center' ) ] }, index );
											} }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							{ 'radial' !== ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ) && (
								<RangeControl
									label={ __( 'Gradient Angle', 'kadence-blocks' ) }
									value={ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 5 ] ? btns[ index ].gradient[ 5 ] : 180 ) }
									onChange={ ( value ) => {
										this.saveArrayUpdate( { gradient: [ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 0 ] ? btns[ index ].gradient[ 0 ] : '#999999' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 1 ] ? btns[ index ].gradient[ 1 ] : 1 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 2 ] ? btns[ index ].gradient[ 2 ] : 0 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 3 ] ? btns[ index ].gradient[ 3 ] : 100 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ), value, ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 6 ] ? btns[ index ].gradient[ 6 ] : 'center center' ) ] }, index );
									} }
									min={ 0 }
									max={ 360 }
								/>
							) }
							{ 'radial' === ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ) && (
								<SelectControl
									label={ __( 'Gradient Position', 'kadence-blocks' ) }
									value={ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 6 ] ? btns[ index ].gradient[ 6 ] : 'center center' ) }
									options={ [
										{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
										{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
										{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
										{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
										{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
										{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
										{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
										{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
										{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
									] }
									onChange={ value => {
										this.saveArrayUpdate( { gradient: [ ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 0 ] ? btns[ index ].gradient[ 0 ] : '#999999' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 1 ] ? btns[ index ].gradient[ 1 ] : 1 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 2 ] ? btns[ index ].gradient[ 2 ] : 0 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 3 ] ? btns[ index ].gradient[ 3 ] : 100 ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 4 ] ? btns[ index ].gradient[ 4 ] : 'linear' ), ( btns[ index ].gradient && undefined !== btns[ index ].gradient[ 5 ] ? btns[ index ].gradient[ 5 ] : 180 ), value ] }, index );
									} }
								/>
							) }
						</div>
					) }
					<AdvancedPopColorControl
						label={ __( 'Border Color', 'kadence-blocks' ) }
						colorValue={ ( btns[ index ].border ? btns[ index ].border : '#555555' ) }
						colorDefault={ '' }
						opacityValue={ btns[ index ].borderOpacity }
						onColorChange={ value => {
							this.saveArrayUpdate( { border: value }, index );
						} }
						onOpacityChange={ value => {
							this.saveArrayUpdate( { borderOpacity: value }, index );
						} }
						onArrayChange={ ( color, opacity ) => this.saveArrayUpdate( { border: color, borderOpacity: opacity }, index ) }
					/>
					<BoxShadowControl
						label={ __( 'Box Shadow', 'kadence-blocks' ) }
						enable={ ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ) }
						color={ ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ) }
						colorDefault={ '#000000' }
						opacity={ ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 0.2 ) }
						hOffset={ ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ) }
						vOffset={ ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ) }
						blur={ ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ) }
						spread={ ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ) }
						inset={ ( undefined !== btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) }
						onEnableChange={ value => {
							this.saveArrayUpdate( { boxShadow: [ value, ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 0.2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) ] }, index );
						} }
						onColorChange={ value => {
							this.saveArrayUpdate( { boxShadow: [ ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ), value, ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 0.2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) ] }, index );
						} }
						onOpacityChange={ value => {
							this.saveArrayUpdate( { boxShadow: [ ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ), value, ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) ] }, index );
						} }
						onHOffsetChange={ value => {
							this.saveArrayUpdate( { boxShadow: [ ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 0.2 ), value, ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) ] }, index );
						} }
						onVOffsetChange={ value => {
							this.saveArrayUpdate( { boxShadow: [ ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 0.2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ), value, ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) ] }, index );
						} }
						onBlurChange={ value => {
							this.saveArrayUpdate( { boxShadow: [ ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 0.2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ), value, ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) ] }, index );
						} }
						onSpreadChange={ value => {
							this.saveArrayUpdate( { boxShadow: [ ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 0.2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ), value, ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) ] }, index );
						} }
						onInsetChange={ value => {
							this.saveArrayUpdate( { boxShadow: [ ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 1 ] ? btns[ index ].boxShadow[ 1 ] : '#000000' ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 2 ] ? btns[ index ].boxShadow[ 2 ] : 0.2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ), value ] }, index );
						} }
					/>
				</div>
			);
		};
		const renderArray = (
			<Fragment>
				{ times( btnCount, n => tabControls( n ) ) }
			</Fragment>
		);
		const renderPreviewArray = (
			<div>
				{ times( btnCount, n => renderBtns( n ) ) }
			</div>
		);
		const renderBtnCSS = ( index ) => {
			let btnbg;
			let btnGrad;
			let btnGrad2;
			let btnRad = '0';
			let btnBox = '';
			let btnBox2 = '';
			if ( undefined !== btns[ index ].backgroundHoverType && 'gradient' === btns[ index ].backgroundHoverType && undefined !== btns[ index ].gradientHover ) {
				btnGrad = ( undefined === btns[ index ].backgroundHover ? KadenceColorOutput( '#444444', ( btns[ index ].backgroundHoverOpacity !== undefined ? btns[ index ].backgroundHoverOpacity : 1 ) ) : KadenceColorOutput( btns[ index ].backgroundHover, ( btns[ index ].backgroundHoverOpacity !== undefined ? btns[ index ].backgroundHoverOpacity : 1 ) ) );
				btnGrad2 = ( undefined === btns[ index ].gradientHover[ 0 ] ? hexToRGBA( '#777777', ( btns[ index ].gradientHover[ 1 ] !== undefined ? btns[ index ].gradientHover[ 1 ] : 1 ) ) : KadenceColorOutput( btns[ index ].gradientHover[ 0 ], ( btns[ index ].gradientHover[ 1 ] !== undefined ? btns[ index ].gradientHover[ 1 ] : 1 ) ) );
				if ( undefined !== btns[ index ].gradientHover && 'radial' === btns[ index ].gradientHover[ 4 ] ) {
					btnbg = `radial-gradient(at ${ ( undefined === btns[ index ].gradientHover[ 6 ] ? 'center center' : btns[ index ].gradientHover[ 6 ] ) }, ${ btnGrad } ${ ( undefined === btns[ index ].gradientHover[ 2 ] ? '0' : btns[ index ].gradientHover[ 2 ] ) }%, ${ btnGrad2 } ${ ( undefined === btns[ index ].gradientHover[ 3 ] ? '100' : btns[ index ].gradientHover[ 3 ] ) }%)`;
				} else if ( undefined !== btns[ index ].backgroundType && 'gradient' === btns[ index ].backgroundType && undefined !== btns[ index ].gradientHover && 'linear' === btns[ index ].gradientHover[ 4 ] ) {
					btnbg = `linear-gradient(${ ( undefined === btns[ index ].gradientHover[ 5 ] ? '180' : btns[ index ].gradientHover[ 5 ] ) }deg, ${ btnGrad } ${ ( undefined === btns[ index ].gradientHover[ 2 ] ? '0' : btns[ index ].gradientHover[ 2 ] ) }%, ${ btnGrad2 } ${ ( undefined === btns[ index ].gradientHover[ 3 ] ? '100' : btns[ index ].gradientHover[ 3 ] ) }%)`;
				}
			} else if ( undefined !== btns[ index ].backgroundHoverType && 'gradient' === btns[ index ].backgroundHoverType && undefined === btns[ index ].gradientHover ) {
				btnGrad = ( undefined === btns[ index ].backgroundHover ? hexToRGBA( '#444444', ( btns[ index ].backgroundHoverOpacity !== undefined ? btns[ index ].backgroundHoverOpacity : 1 ) ) : KadenceColorOutput( btns[ index ].backgroundHover, ( btns[ index ].backgroundHoverOpacity !== undefined ? btns[ index ].backgroundHoverOpacity : 1 ) ) );
				btnbg = `linear-gradient(180deg, ${ btnGrad } 0%, #777777 100%)`;
			} else {
				btnbg = KadenceColorOutput( ( undefined === btns[ index ].backgroundHover ? '#444444' : btns[ index ].backgroundHover ), ( btns[ index ].backgroundHoverOpacity !== undefined ? btns[ index ].backgroundHoverOpacity : 1 ) );
			}
			if ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] && btns[ index ].boxShadowHover[ 0 ] && false === btns[ index ].boxShadowHover[ 7 ] ) {
				btnBox = `${ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] && btns[ index ].boxShadowHover[ 0 ] ? ( undefined !== btns[ index ].boxShadowHover[ 7 ] && btns[ index ].boxShadowHover[ 7 ] ? 'inset ' : '' ) + ( undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 1 ) + 'px ' + ( undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 1 ) + 'px ' + ( undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 2 ) + 'px ' + ( undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), ( undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 1 ) ) : undefined ) }`;
				btnBox2 = 'none';
				btnRad = '0';
			}
			if ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] && btns[ index ].boxShadowHover[ 0 ] && true === btns[ index ].boxShadowHover[ 7 ] ) {
				btnBox2 = `${ ( undefined !== btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] && btns[ index ].boxShadowHover[ 0 ] ? ( undefined !== btns[ index ].boxShadowHover[ 7 ] && btns[ index ].boxShadowHover[ 7 ] ? 'inset ' : '' ) + ( undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 1 ) + 'px ' + ( undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 1 ) + 'px ' + ( undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 2 ) + 'px ' + ( undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== btns[ index ].boxShadowHover[ 1 ] ? btns[ index ].boxShadowHover[ 1 ] : '#000000' ), ( undefined !== btns[ index ].boxShadowHover[ 2 ] ? btns[ index ].boxShadowHover[ 2 ] : 1 ) ) : undefined ) }`;
				btnRad = ( undefined !== btns[ index ].borderRadius ? btns[ index ].borderRadius : '3' );
				btnBox = 'none';
			}
			return (
				`#kt-btns_${ uniqueID } .kt-button-${ index }:hover {
					${ ( btns[ index ].colorHover ? 'color:' + KadenceColorOutput( btns[ index ].colorHover ) + '!important;' : '' ) }
					${ ( btns[ index ].borderHover || ( btns[ index ].borderHoverOpacity && 1 !== btns[ index ].borderHoverOpacity ) ? 'border-color:' + KadenceColorOutput( ( undefined === btns[ index ].borderHover ? '#444444' : btns[ index ].borderHover ), ( btns[ index ].borderHoverOpacity !== undefined ? btns[ index ].borderHoverOpacity : 1 ) ) + '!important;' : '' ) }
					${ ( btnBox ? 'box-shadow:' + btnBox + '!important;' : '' ) }
				}
				#kt-btns_${ uniqueID } .kt-button-${ index }::before {
					${ ( btnbg ? 'background:' + btnbg + ';' : '' ) }
					${ ( btnBox2 ? 'box-shadow:' + btnBox2 + ';' : '' ) }
					${ ( btnRad ? 'border-radius:' + btnRad + 'px;' : '' ) }
				}`
			);
		};
		const renderCSS = (
			<style>
				{ times( btnCount, n => renderBtnCSS( n ) ) }
			</style>
		);
		return (
			<Fragment>
				{ renderCSS }
				<div id={ `kt-btns_${ uniqueID }` } className={ `${ className } kt-btn-align-${ hAlign }${ ( forceFullwidth ? ' kt-force-btn-fullwidth' : '' ) }` }>
					<BlockControls>
						<AlignmentToolbar
							value={ hAlign }
							onChange={ ( value ) => setAttributes( { hAlign: value } ) }
						/>
					</BlockControls>
					{ this.showSettings( 'allSettings' ) && (
						<Fragment>
							<InspectorControls>
								{ this.showSettings( 'countSettings' ) && (
									<PanelBody
										title={ __( 'Button Count', 'kadence-blocks' ) }
										initialOpen={ true }
									>
										{/* <StepControl
											label={ __( 'Number of Buttons', 'kadence-blocks' ) }
											value={ btnCount }
											onChange={ ( newcount ) => {
												const newbtns = btns;
												if ( newbtns.length < newcount ) {
													const amount = Math.abs( newcount - newbtns.length );
													{ times( amount, n => {
														newbtns.push( {
															text: newbtns[ 0 ].text,
															link: newbtns[ 0 ].link,
															target: newbtns[ 0 ].target,
															size: newbtns[ 0 ].size,
															paddingBT: newbtns[ 0 ].paddingBT,
															paddingLR: newbtns[ 0 ].paddingLR,
															color: newbtns[ 0 ].color,
															background: newbtns[ 0 ].background,
															border: newbtns[ 0 ].border,
															backgroundOpacity: newbtns[ 0 ].backgroundOpacity,
															borderOpacity: newbtns[ 0 ].borderOpacity,
															borderRadius: newbtns[ 0 ].borderRadius,
															borderWidth: newbtns[ 0 ].borderWidth,
															colorHover: newbtns[ 0 ].colorHover,
															backgroundHover: newbtns[ 0 ].backgroundHover,
															borderHover: newbtns[ 0 ].borderHover,
															backgroundHoverOpacity: newbtns[ 0 ].backgroundHoverOpacity,
															borderHoverOpacity: newbtns[ 0 ].borderHoverOpacity,
															icon: newbtns[ 0 ].icon,
															iconSide: newbtns[ 0 ].iconSide,
															iconHover: newbtns[ 0 ].iconHover,
															cssClass: ( newbtns[ 0 ].cssClass ? newbtns[ 0 ].cssClass : '' ),
															noFollow: ( newbtns[ 0 ].noFollow ? newbtns[ 0 ].noFollow : false ),
															gap: ( newbtns[ 0 ].gap ? newbtns[ 0 ].gap : 5 ),
															responsiveSize: ( newbtns[ 0 ].responsiveSize ? newbtns[ 0 ].responsiveSize : [ '', '' ] ),
															gradient: ( newbtns[ 0 ].gradient ? newbtns[ 0 ].gradient : [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ] ),
															gradientHover: ( newbtns[ 0 ].gradientHover ? newbtns[ 0 ].gradientHover : [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ] ),
															btnStyle: ( newbtns[ 0 ].btnStyle ? newbtns[ 0 ].btnStyle : 'basic' ),
															btnSize: ( newbtns[ 0 ].btnSize ? newbtns[ 0 ].btnSize : 'standard' ),
															backgroundType: ( newbtns[ 0 ].backgroundType ? newbtns[ 0 ].backgroundType : 'solid' ),
															backgroundHoverType: ( newbtns[ 0 ].backgroundHoverType ? newbtns[ 0 ].backgroundHoverType : 'solid' ),
															width: ( newbtns[ 0 ].width ? newbtns[ 0 ].width : [ '', '', '' ] ),
															responsivePaddingBT: ( newbtns[ 0 ].responsivePaddingBT ? newbtns[ 0 ].responsivePaddingBT : [ '', '' ] ),
															responsivePaddingLR: ( newbtns[ 0 ].responsivePaddingLR ? newbtns[ 0 ].responsivePaddingLR : [ '', '' ] ),
															boxShadow: ( newbtns[ 0 ].boxShadow ? newbtns[ 0 ].boxShadow : [ false, '#000000', 0.2, 1, 1, 2, 0, false ] ),
															boxShadowHover: ( newbtns[ 0 ].boxShadowHover ? newbtns[ 0 ].boxShadowHover : [ false, '#000000', 0.4, 2, 2, 3, 0, false ] ),
															sponsored: ( newbtns[ 0 ].sponsored ? newbtns[ 0 ].sponsored : false ),
															download: false,
															tabletGap: ( newbtns[ 0 ].tabletGap ? newbtns[ 0 ].tabletGap : '' ),
															mobileGap: ( newbtns[ 0 ].mobileGap ? newbtns[ 0 ].mobileGap : '' ),
														} );
													} ); }
													setAttributes( { btns: newbtns } );
													this.saveArrayUpdate( { iconSide: btns[ 0 ].iconSide }, 0 );
												}
												setAttributes( { btnCount: newcount } );
											} }
											min={ 1 }
											max={ 5 }
											step={ 1 }
										/> */}
										<PanelRow>
											<Button
												className="kb-add-field"
												isPrimary={ true }
												onClick={ () => {
													const newbtns = btns;
													const newcount = Math.abs( btnCount + 1 );
													newbtns.push( {
														text: newbtns[ 0 ].text,
														link: newbtns[ 0 ].link,
														target: newbtns[ 0 ].target,
														size: newbtns[ 0 ].size,
														paddingBT: newbtns[ 0 ].paddingBT,
														paddingLR: newbtns[ 0 ].paddingLR,
														color: newbtns[ 0 ].color,
														background: newbtns[ 0 ].background,
														border: newbtns[ 0 ].border,
														backgroundOpacity: newbtns[ 0 ].backgroundOpacity,
														borderOpacity: newbtns[ 0 ].borderOpacity,
														borderRadius: newbtns[ 0 ].borderRadius,
														borderWidth: newbtns[ 0 ].borderWidth,
														colorHover: newbtns[ 0 ].colorHover,
														backgroundHover: newbtns[ 0 ].backgroundHover,
														borderHover: newbtns[ 0 ].borderHover,
														backgroundHoverOpacity: newbtns[ 0 ].backgroundHoverOpacity,
														borderHoverOpacity: newbtns[ 0 ].borderHoverOpacity,
														icon: newbtns[ 0 ].icon,
														iconSide: newbtns[ 0 ].iconSide,
														iconHover: newbtns[ 0 ].iconHover,
														cssClass: ( newbtns[ 0 ].cssClass ? newbtns[ 0 ].cssClass : '' ),
														noFollow: ( newbtns[ 0 ].noFollow ? newbtns[ 0 ].noFollow : false ),
														gap: ( newbtns[ 0 ].gap ? newbtns[ 0 ].gap : 5 ),
														responsiveSize: ( newbtns[ 0 ].responsiveSize ? newbtns[ 0 ].responsiveSize : [ '', '' ] ),
														gradient: ( newbtns[ 0 ].gradient ? newbtns[ 0 ].gradient : [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ] ),
														gradientHover: ( newbtns[ 0 ].gradientHover ? newbtns[ 0 ].gradientHover : [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ] ),
														btnStyle: ( newbtns[ 0 ].btnStyle ? newbtns[ 0 ].btnStyle : 'basic' ),
														btnSize: ( newbtns[ 0 ].btnSize ? newbtns[ 0 ].btnSize : 'standard' ),
														backgroundType: ( newbtns[ 0 ].backgroundType ? newbtns[ 0 ].backgroundType : 'solid' ),
														backgroundHoverType: ( newbtns[ 0 ].backgroundHoverType ? newbtns[ 0 ].backgroundHoverType : 'solid' ),
														width: ( newbtns[ 0 ].width ? newbtns[ 0 ].width : [ '', '', '' ] ),
														responsivePaddingBT: ( newbtns[ 0 ].responsivePaddingBT ? newbtns[ 0 ].responsivePaddingBT : [ '', '' ] ),
														responsivePaddingLR: ( newbtns[ 0 ].responsivePaddingLR ? newbtns[ 0 ].responsivePaddingLR : [ '', '' ] ),
														boxShadow: ( newbtns[ 0 ].boxShadow ? newbtns[ 0 ].boxShadow : [ false, '#000000', 0.2, 1, 1, 2, 0, false ] ),
														boxShadowHover: ( newbtns[ 0 ].boxShadowHover ? newbtns[ 0 ].boxShadowHover : [ false, '#000000', 0.4, 2, 2, 3, 0, false ] ),
														sponsored: ( newbtns[ 0 ].sponsored ? newbtns[ 0 ].sponsored : false ),
														download: false,
														tabletGap: ( newbtns[ 0 ].tabletGap ? newbtns[ 0 ].tabletGap : '' ),
														mobileGap: ( newbtns[ 0 ].mobileGap ? newbtns[ 0 ].mobileGap : '' ),
														inheritStyles: ( newbtns[ 0 ].inheritStyles ? newbtns[ 0 ].inheritStyles : '' ),
														iconSize: ( newbtns[ 0 ].iconSize ? newbtns[ 0 ].iconSize : [ '', '', '' ] ),
														iconPadding: ( newbtns[ 0 ].iconPadding ? newbtns[ 0 ].iconPadding : [ '', '', '', '' ] ),
														iconTabletPadding: ( newbtns[ 0 ].iconTabletPadding ? newbtns[ 0 ].iconTabletPadding : [ '', '', '', '' ] ),
														iconMobilePadding: ( newbtns[ 0 ].iconMobilePadding ? newbtns[ 0 ].iconMobilePadding : [ '', '', '', '' ] ),
														onlyIcon: ( newbtns[ 0 ].onlyIcon ? newbtns[ 0 ].onlyIcon : [ false, '', '' ] ),
													} );
													setAttributes( { btns: newbtns } );
													this.saveArrayUpdate( { iconSide: btns[ 0 ].iconSide }, 0 );
													setAttributes( { btnCount: newcount } );
												} }
											>
												<Dashicon icon="plus" />
												{ __( 'Add Button', 'kadence-blocks' ) }
											</Button>
										</PanelRow>
										<h2 className="kt-heading-size-title">{ __( 'Button Alignment', 'kadence-blocks' ) }</h2>
										<TabPanel className="kt-size-tabs kb-sidebar-alignment"
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
																	isCollapsed={ false }
																	value={ mhAlign }
																	onChange={ ( value ) => setAttributes( { mhAlign: value } ) }
																/>
															);
														} else if ( 'tablet' === tab.name ) {
															tabout = (
																<AlignmentToolbar
																	isCollapsed={ false }
																	value={ thAlign }
																	onChange={ ( value ) => setAttributes( { thAlign: value } ) }
																/>
															);
														} else {
															tabout = (
																<AlignmentToolbar
																	isCollapsed={ false }
																	value={ hAlign }
																	onChange={ ( value ) => setAttributes( { hAlign: value } ) }
																/>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
									</PanelBody>
								) }
								{ renderArray }
								{ this.showSettings( 'fontSettings' ) && (
									<PanelBody
										title={ __( 'Font Family', 'kadence-blocks' ) }
										initialOpen={ false }
										className="kt-font-family-area"
									>
										<TypographyControls
											fontGroup={ 'button' }
											letterSpacing={ letterSpacing }
											onLetterSpacing={ ( value ) => setAttributes( { letterSpacing: value } ) }
											textTransform={ textTransform }
											onTextTransform={ ( value ) => setAttributes( { textTransform: value } ) }
											fontFamily={ typography }
											onFontFamily={ ( value ) => setAttributes( { typography: value } ) }
											onFontChange={ ( select ) => {
												setAttributes( {
													typography: select.value,
													googleFont: select.google,
												} );
											} }
											googleFont={ googleFont }
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
									</PanelBody>
								) }
								{ this.showSettings( 'marginSettings' ) && (
									<PanelBody
										title={ __( 'Container Margin', 'kadence-blocks' ) }
										initialOpen={ false }
									>
										<ResponsiveMeasuremenuControls
											label={ __( 'Margin', 'kadence-blocks' ) }
											value={ undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].desk ? margin[ 0 ].desk : [ '', '', '', '' ] }
											control={ this.state.marginControl }
											tabletValue={ undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].tablet ? margin[ 0 ].tablet : [ '', '', '', '' ] }
											mobileValue={ undefined !== margin && undefined !== margin[ 0 ] && undefined !== margin[ 0 ].mobile ? margin[ 0 ].mobile : [ '', '', '', '' ] }
											onChange={ ( value ) => saveMargin( { desk: value } ) }
											onChangeTablet={ ( value ) => saveMargin( { tablet: value } ) }
											onChangeMobile={ ( value ) => saveMargin( { mobile: value } ) }
											onChangeControl={ ( value ) => this.setState( { marginControl: value } ) }
											min={ marginMin }
											max={ marginMax }
											step={ marginStep }
											unit={ marginUnit }
											units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
											onUnit={ ( value ) => setAttributes( { marginUnit: value } ) }
										/>
									</PanelBody>
								) }
							</InspectorControls>
							<InspectorAdvancedControls>
								<ToggleControl
									label={ __( 'Force Button Fullwidth', 'kadence-blocks' ) }
									checked={ ( undefined !== forceFullwidth ? forceFullwidth : false ) }
									onChange={ ( value ) => defineWidthTypeToggle( value ) }
								/>
								{ undefined !== forceFullwidth && forceFullwidth && (
									<ToggleControl
										label={ __( 'Collapse on mobile', 'kadence-blocks' ) }
										checked={ ( undefined !== collapseFullwidth ? collapseFullwidth : false ) }
										onChange={ ( value ) => setAttributes( { collapseFullwidth: value } ) }
									/>
								) }
							</InspectorAdvancedControls>
						</Fragment>
					) }
					<div id={ `animate-id${ uniqueID }` } className={ 'btn-inner-wrap aos-animate kt-animation-wrap' } data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) } data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) } data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) } style={ {
						marginTop: ( undefined !== previewMarginTop ? previewMarginTop + marginUnit : undefined ),
						marginRight: ( undefined !== previewMarginRight ? previewMarginRight + marginUnit : undefined ),
						marginBottom: ( undefined !== previewMarginBottom ? previewMarginBottom + marginUnit : undefined ),
						marginLeft: ( undefined !== previewMarginLeft ? previewMarginLeft + marginUnit : undefined ),
					} } >
						{ renderPreviewArray }
						{ googleFont && (
							<WebfontLoader config={ config }>
							</WebfontLoader>
						) }
					</div>
				</div>
			</Fragment>
		);
	}
}
//export default ( KadenceAdvancedButton );
export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			__experimentalGetPreviewDeviceType,
		} = select( 'core/edit-post' );
		return {
			getPreviewDevice: __experimentalGetPreviewDeviceType ? __experimentalGetPreviewDeviceType() : 'Desktop',
		};
	} ),
] )( KadenceAdvancedButton );
