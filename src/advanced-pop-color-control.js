/**
 * Advanced Color Control.
 *
 */

/**
 * Import Icons
 */
import cIcons from './kadence-color-icons';
import KadenceColorPicker from './kadence-color-picker';
import { hexToRGBA } from '@kadence/helpers';
import get from 'lodash/get';
import map from 'lodash/map';

/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
const {
	Component,
} = wp.element;
const {
	Button,
	Popover,
	ColorIndicator,
	Tooltip,
	Dashicon,
} = wp.components;
import { withSelect } from '@wordpress/data';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class AdvancedPopColorControl extends Component {
	constructor() {
		super( ...arguments );
		this.onChangeState = this.onChangeState.bind( this );
		this.onChangeComplete = this.onChangeComplete.bind( this );
		this.unConvertOpacity = this.unConvertOpacity.bind( this );
		this.state = {
			alpha: false === this.props.alpha ? false : true,
			isVisible: false,
			colors: [],
			classSat: 'first',
			currentColor: '',
			inherit: false,
			currentOpacity: this.props.opacityValue !== undefined ? this.props.opacityValue : 1,
			isPalette: ( ( this.props.colorValue && this.props.colorValue.startsWith( 'palette' ) ) || ( this.props.colorDefault && this.props.colorDefault.startsWith( 'palette' ) ) ? true : false ),
		};
	}
	render() {
		const toggleVisible = () => {
			this.setState( { isVisible: true } );
		};
		const toggleClose = () => {
			if ( this.state.isVisible === true ) {
				this.setState( { isVisible: false } );
			}
		};
		const convertOpacity = ( value ) => {
			let val = 1;
			if ( value ) {
				val = value / 100;
			}
			return val;
		};
		const convertedOpacityValue = ( 100 === this.props.opacityUnit ? convertOpacity( this.props.opacityValue ) : this.props.opacityValue );
		const colorVal = ( this.state.currentColor ? this.state.currentColor : this.props.colorValue );
		let currentColorString = ( this.state.isPalette && this.props.colors && this.props.colors[ parseInt( colorVal.slice( -1 ), 10 ) - 1 ] ? this.props.colors[ parseInt( colorVal.slice( -1 ), 10 ) - 1 ].color : colorVal );
		// if ( 'transparent' === currentColorString ) {
		// 	currentColorString = '#000000';
		// }
		if ( '' === currentColorString ) {
			currentColorString = this.props.colorDefault;
		}
		if ( this.props.onOpacityChange && ! this.state.isPalette ) {
			if ( Number( convertedOpacityValue !== undefined && convertedOpacityValue !== '' ? convertedOpacityValue : 1 ) !== 1 ) {
				currentColorString = hexToRGBA( ( undefined === currentColorString ? '' : currentColorString ), ( convertedOpacityValue !== undefined && convertedOpacityValue !== '' ? convertedOpacityValue : 1 ) );
			}
		}
		return (
			<div className="kt-color-popover-container components-base-control new-kadence-advanced-colors">
				<div className="kt-advanced-color-settings-container">
					{ this.props.label && (
						<h2 className="kt-beside-color-label">{ this.props.label }</h2>
					) }
					{ this.props.colorValue && this.props.colorValue !== this.props.colorDefault && (
						<Tooltip text={ __( 'Clear' ) }>
							<Button
								className="components-color-palette__clear"
								type="button"
								onClick={ () => {
									this.setState( { currentColor: this.props.colorDefault, isPalette: ( this.props.colorDefault && this.props.colorDefault.startsWith( 'palette' ) ? true : false ) } );
									this.props.onColorChange( this.props.colorDefault ? this.props.colorDefault : undefined );
									if ( this.props.onColorClassChange ) {
										this.props.onColorClassChange( '' );
									}
								} }
								isSmall
							>
								<Dashicon icon="redo" />
							</Button>
						</Tooltip>
					) }
					<div className="kt-beside-color-click">
						{ this.state.isVisible && (
							<Popover position="top left" className="kt-popover-color new-kadence-advanced-colors-pop" onClose={ toggleClose }>
								{ this.state.classSat === 'first' && ! this.props.disableCustomColors && (
									<KadenceColorPicker
										color={ currentColorString }
										onChange={ ( color ) => this.onChangeState( color, '' ) }
										onChangeComplete={ ( color ) => {
											this.onChangeComplete( color, '' );
											if ( this.props.onColorClassChange ) {
												this.props.onColorClassChange( '' );
											}
										} }
									/>
								) }
								{ this.state.classSat !== 'first' && ! this.props.disableCustomColors && (
									<KadenceColorPicker
										color={ currentColorString }
										onChange={ ( color ) => this.onChangeState( color, '' ) }
										onChangeComplete={ ( color ) => {
											this.onChangeComplete( color, '' );
											if ( this.props.onColorClassChange ) {
												this.props.onColorClassChange( '' );
											}
										} }
									/>
								) }
								{ this.props.colors && (
									<div className="components-color-palette">
										{ map( this.props.colors, ( { color, slug, name } ) => {
											const style = { color };
											const palette = slug.replace( 'theme-', '' );
											const isActive = ( ( palette === this.props.colorValue ) || ( ! slug.startsWith( 'theme-palette' ) && this.props.colorValue === color ) );
											return (
												<div key={ color } className="components-color-palette__item-wrapper">
													<Tooltip
														text={ name ||
															// translators: %s: color hex code e.g: "#f00".
															sprintf( __( 'Color code: %s' ), color )
														}>
														<Button
															type="button"
															className={ `components-color-palette__item ${ ( isActive ? 'is-active' : '' ) }` }
															style={ style }
															onClick={ () => {
																if ( slug.startsWith( 'theme-palette' ) ) {
																	this.onChangeComplete( color, palette );
																} else {
																	this.onChangeComplete( color, false );
																}
																if ( this.props.onColorClassChange ) {
																	this.props.onColorClassChange( slug );
																}
																// if ( 'first' === this.state.classSat ) {
																// 	this.setState( { classSat: 'second' } );
																// } else {
																// 	this.setState( { classSat: 'first' } );
																// }
															} }
															aria-label={ name ?
																// translators: %s: The name of the color e.g: "vivid red".
																sprintf( __( 'Color: %s' ), name ) :
																// translators: %s: color hex code e.g: "#f00".
																sprintf( __( 'Color code: %s' ), color ) }
															aria-pressed={ isActive }
														/>
													</Tooltip>
													{ palette === this.props.colorValue && <Dashicon icon="admin-site" /> }
													{ ! slug.startsWith( 'theme-palette' ) && this.props.colorValue === color && <Dashicon icon="saved" /> }
												</div>
											);
										} ) }
									</div>
								) }
							</Popover>
						) }
						{ this.state.isVisible && (
							<Tooltip text={ __( 'Select Color' ) }>
								<Button className={ `kt-color-icon-indicate ${ ( this.state.alpha ? 'kt-has-alpha' : 'kt-no-alpha' ) }` } onClick={ toggleClose }>
									<ColorIndicator className="kt-advanced-color-indicate" colorValue={ currentColorString } />
									{ '' === currentColorString && this.state.inherit && (
										<span className="color-indicator-icon">{ cIcons.inherit }</span>
									) }
									{ ( ( this.props.colorValue && this.props.colorValue.startsWith( 'palette' ) ) || ( this.props.colorDefault && this.props.colorDefault.startsWith( 'palette' ) ) ) && (
										<span className="color-indicator-icon">{ <Dashicon icon="admin-site" /> }</span>
									) }
								</Button>
							</Tooltip>
						) }
						{ ! this.state.isVisible && (
							<Tooltip text={ __( 'Select Color' ) }>
								<Button className={ `kt-color-icon-indicate ${ ( this.state.alpha ? 'kt-has-alpha' : 'kt-no-alpha' ) }` } onClick={ toggleVisible }>
									<ColorIndicator className="kt-advanced-color-indicate" colorValue={ currentColorString } />
									{ '' === currentColorString && this.state.inherit && (
										<span className="color-indicator-icon">{ cIcons.inherit }</span>
									) }
									{ ( ( this.props.colorValue && this.props.colorValue.startsWith( 'palette' ) ) || ( this.props.colorDefault && this.props.colorDefault.startsWith( 'palette' ) ) ) && (
										<span className="color-indicator-icon">{ <Dashicon icon="admin-site" /> }</span>
									) }
								</Button>
							</Tooltip>
						) }
					</div>
				</div>
			</div>
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
		let opacity = ( 100 === this.props.opacityUnit ? 100 : 1 );
		let newColor;
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
		if ( undefined !== this.props.onChange ) {
			this.props.onChange( newColor );
		}
	}
	onChangeComplete( color, palette ) {
		let opacity = ( 100 === this.props.opacityUnit ? 100 : 1 );
		let newColor;
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
			this.props.onColorChange( newColor );
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
} )( AdvancedPopColorControl );
