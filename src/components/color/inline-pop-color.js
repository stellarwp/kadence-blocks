/**
 * Advanced Color Control.
 *
 */

/**
 * Import Icons
 */
import ColorIcons from './color-icons';
import ColorPicker from './color-picker';
import hexToRGBA from './hex-to-rgba';
import get from 'lodash/get';
import map from 'lodash/map';
 
 /**
  * Internal block libraries
  */
 import { __, sprintf } from '@wordpress/i18n';
 const {
	 Component,
	 Fragment,
 } = wp.element;
 const {
	 Button,
	 IconButton,
	 Tooltip,
	 Dashicon,
	 Dropdown,
	 ToolbarGroup,
	 SVG,
	 Path,
 } = wp.components;
 import { withSelect } from '@wordpress/data';
 const { DOWN } = wp.keycodes;
 /* global kadence_blocks_params */
 // eslint-disable-next-line camelcase
 const ColorSelectorSVGIcon = () => (
	 <SVG xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20">
		 <Path d="M7.434 5l3.18 9.16H8.538l-.692-2.184H4.628l-.705 2.184H2L5.18 5h2.254zm-1.13 1.904h-.115l-1.148 3.593H7.44L6.304 6.904zM14.348 7.006c1.853 0 2.9.876 2.9 2.374v4.78h-1.79v-.914h-.114c-.362.64-1.123 1.022-2.031 1.022-1.346 0-2.292-.826-2.292-2.108 0-1.27.972-2.006 2.71-2.107l1.696-.102V9.38c0-.584-.42-.914-1.18-.914-.667 0-1.112.228-1.264.647h-1.701c.12-1.295 1.307-2.107 3.066-2.107zm1.079 4.1l-1.416.09c-.793.056-1.18.342-1.18.844 0 .52.45.837 1.091.837.857 0 1.505-.545 1.505-1.256v-.515z" />
	 </SVG>
 );
 /**
  * Build the Measure controls
  * @returns {object} Measure settings.
  */
 class InlinePopColorControl extends Component {
	 constructor() {
		 super( ...arguments );
		 this.onChangeState = this.onChangeState.bind( this );
		 this.onChangeComplete = this.onChangeComplete.bind( this );
		 this.state = {
			 alpha: false === this.props.alpha ? false : true,
			 isVisible: false,
			 colors: [],
			 classSat: 'first',
			 currentColor: '',
			 inherit: false,
			 currentOpacity: this.props.opacityValue !== undefined ? this.props.opacityValue : 1,
			 isPalette: ( this.props.value && this.props.value.startsWith( 'palette' ) ? true : false ),
		 };
	 }
	 render() {
		if ( this.props.reload ) {
			this.props.reloaded( true );
			this.setState( { currentColor: '', currentOpacity: '', isPalette: ( this.props.value && this.props.value.startsWith( 'palette' ) ? true : false ) } );
		}
		const convertOpacity = ( value ) => {
			let val = 1;
			if ( value ) {
				val = value / 100;
			}
			return val;
		};
		const convertedOpacityValue = ( 100 === this.props.opacityUnit ? convertOpacity( this.state.currentOpacity ) : this.state.currentOpacity );
		const colorVal = ( this.state.currentColor ? this.state.currentColor : this.props.value );
		let currentColorString = ( this.state.isPalette && this.props.colors && this.props.colors[ parseInt( colorVal.slice( -1 ), 10 ) - 1 ] ? this.props.colors[ parseInt( colorVal.slice( -1 ), 10 ) - 1 ].color : colorVal );
		if ( currentColorString && currentColorString.startsWith( 'var(' ) ) {
			currentColorString = window.getComputedStyle( document.documentElement ).getPropertyValue( this.props.value.replace( 'var(', '' ).replace( ')', '' ) );
		}
		if ( '' === currentColorString ) {
			currentColorString = this.props.default;
		}
		if ( this.props.onOpacityChange && ! this.state.isPalette ) {
			if ( Number( convertedOpacityValue !== undefined && convertedOpacityValue !== '' ? convertedOpacityValue : 1 ) !== 1 ) {
				currentColorString = hexToRGBA( ( undefined === currentColorString ? '' : currentColorString ), ( convertedOpacityValue !== undefined && convertedOpacityValue !== '' ? convertedOpacityValue : 1 ) );
			}
		}
		 const renderToggleComponent = () => ( {
			 onToggle,
			 isOpen,
		 } ) => {
			 const openOnArrowDown = ( event ) => {
				 if ( ! isOpen && event.keyCode === DOWN ) {
					 event.preventDefault();
					 event.stopPropagation();
					 onToggle();
				 }
			 };
			 return (
				 <ToolbarGroup>
					 <Button
						 className="components-toolbar__control kb-colors-selector__toggle"
						 label={ this.props.label }
						 onClick={ onToggle }
						 onKeyDown={ openOnArrowDown }
						 icon={
							 <div className="kb-colors-selector__icon-container">
								 <div
									 className={ 'kb-colors-selector__state-selection' }
									 style={ { color: currentColorString } }
								 >
									 <ColorSelectorSVGIcon />
								 </div>
							 </div>
						 }
					 />
				 </ToolbarGroup>
			 );
		 };
		 return (
			 <Dropdown
				 position="top right"
				 className="kb-colors-selector components-dropdown-menu components-toolbar new-kadence-advanced-colors"
				 contentClassName="block-library-colors-selector__popover kt-popover-color kadence-pop-color-popover"
				 //renderToggle={ renderToggleComponent() }
				 renderToggle={ ( { isOpen, onToggle } ) => (
					 <Fragment>
						 <Button
							 className="components-toolbar__control components-dropdown-menu__toggle kb-colors-selector__toggle"
							 label={ this.props.label }
							 tooltip={ this.props.label }
							 icon={
								 <div className="kb-colors-selector__icon-container">
									 <div
										 className={ 'kb-colors-selector__state-selection' }
										 style={ { color: currentColorString } }
									 >
										 <ColorSelectorSVGIcon />
									 </div>
								 </div>
							 }
							 onClick={ onToggle }
							 aria-expanded={ isOpen }>
						 </Button>
					 </Fragment>
				 ) }
				 renderContent={ () => (
					 <div className="inline-color-popup-inner-wrap block-editor-block-toolbar">
						 { this.state.classSat === 'first' && ! this.props.disableCustomColors && (
							<ColorPicker
								color={ currentColorString }
								onChange={ ( color ) => this.onChangeState( color, '' ) }
								onChangeComplete={ ( color ) => {
									this.onChangeComplete( color, '' );
									if ( this.props.onClassChange ) {
									this.props.onClassChange( '' );
									}
								} }
							/>
						 ) }
						 { this.state.classSat !== 'first' && ! this.props.disableCustomColors && (
							<ColorPicker
								color={ currentColorString }
								onChange={ ( color ) => this.onChangeState( color, '' ) }
								onChangeComplete={ ( color ) => {
									this.onChangeComplete( color, '' );
									if ( this.props.onClassChange ) {
									this.props.onClassChange( '' );
									}
								} }
							/>
						 ) }
						 { this.props.colors && (
							<div className="kadence-pop-color-palette-swatches">
								{ map( this.props.colors, ( { color, slug, name } ) => {
									const style = { color };
									const palette = slug.replace( 'theme-', '' );
									const isActive = ( ( palette === this.props.value ) || ( ! slug.startsWith( 'theme-palette' ) && this.props.value === color ) );
									return (
										<div key={ color } className="kadence-color-palette__item-wrapper">
											<Tooltip
												text={ name ||
													// translators: %s: color hex code e.g: "#f00".
													sprintf( __( 'Color code: %s' ), color )
												}>
												<Button
													type="button"
													className={ `kadence-color-palette__item ${ ( isActive ? 'is-active' : '' ) }` }
													style={ style }
													onClick={ () => {
														if ( slug.startsWith( 'theme-palette' ) ) {
															this.onChangeComplete( color, palette );
														} else {
															this.onChangeComplete( color, false );
														}
														if ( this.props.onClassChange ) {
															this.props.onClassChange( slug );
														}
													} }
													aria-label={ name ?
														// translators: %s: The name of the color e.g: "vivid red".
														sprintf( __( 'Color: %s', 'kadence-blocks' ), name ) :
														// translators: %s: color hex code e.g: "#f00".
														sprintf( __( 'Color code: %s', 'kadence-blocks' ), color ) }
													aria-pressed={ isActive }
												/>
											</Tooltip>
											{ palette === this.props.value && <Dashicon icon="admin-site" /> }
											{ ! slug.startsWith( 'theme-palette' ) && this.props.value === color && <Dashicon icon="saved" /> }
										</div>
									);
								} ) }
							</div>
						) }
					 </div>
				 ) }
			 />
		 );
	 }
	 unConvertOpacity( value ) {
		let val = 100;
		if ( value ) {
			val = value * 100;
		}
		return val;
	}
	onChangeState( color, palette ) {
		let newColor;
		let opacity = ( 100 === this.props.opacityUnit ? 100 : 1 );
		if ( palette ) {
			newColor = palette;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			if ( this.props.onOpacityChange ) {
				if ( color.hex === 'transparent' ) {
					newColor = '#000000';
				} else {
					newColor = color.hex;
				}
				opacity = ( 100 === this.props.opacityUnit ? this.unConvertOpacity( color.rgb.a ) : color.rgb.a );
			} else {
				newColor = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
			}
		} else if ( undefined !== color.hex ) {
			newColor = color.hex;
		} else {
			newColor = color;
		}
		this.setState( { currentColor: newColor, currentOpacity: opacity, isPalette: ( palette ? true : false ) } );
	}
	onChangeComplete( color, palette ) {
		let newColor;
		let opacity = ( 100 === this.props.opacityUnit ? 100 : 1 );
		if ( palette ) {
			newColor = palette;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			if ( this.props.onOpacityChange ) {
				if ( color.hex === 'transparent' ) {
					newColor = '#000000';
				} else {
					newColor = color.hex;
				}
				opacity = ( 100 === this.props.opacityUnit ? this.unConvertOpacity( color.rgb.a ) : color.rgb.a );
			} else {
				newColor = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
			}
		} else if ( undefined !== color.hex ) {
			newColor = color.hex;
		} else {
			newColor = color;
		}
		this.setState( { currentColor: newColor, currentOpacity: opacity, isPalette: ( palette ? true : false ) } );
		if ( undefined !== this.props.onArrayChange ) {
			this.props.onArrayChange( newColor, opacity );
		} else {
			this.props.onChange( newColor );
			if ( undefined !== this.props.onOpacityChange ) {
				setTimeout( () => {
					this.props.onOpacityChange( opacity );
				}, 50 );
			}
		}
	}
 }
 export default withSelect( ( select, ownProps ) => {
	 const settings = select( 'core/block-editor' ).getSettings();
	 const colors = get( settings, [ 'colors' ], [] );
	 const disableCustomColors = ownProps.disableCustomColors === undefined ? settings.disableCustomColors : ownProps.disableCustomColors;
	 return {
		 colors,
		 disableCustomColors,
	 };
 } )( InlinePopColorControl );
 