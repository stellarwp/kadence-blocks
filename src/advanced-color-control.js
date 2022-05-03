/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import { opacityIcon } from '@kadence/icons';
import { hexToRGBA } from '@kadence/helpers';
import { get, map } from 'lodash';
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
	RangeControl,
	ColorIndicator,
	ColorPicker,
	Tooltip,
	Dashicon,
} = wp.components;
import { withSelect } from '@wordpress/data';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class AdvancedColorControl extends Component {
	constructor( label, colorValue, colorDefault, opacityValue, onColorChange, onOpacityChange, opacityUnit=1 ) {
		super( ...arguments );
		this.state = {
			isVisible: false,
			colors: [],
			classSat: 'first',
			currentColor: '',
			defaultColor: '',
		};
	}
	componentDidMount() {
		if ( 'transparent' === this.props.colorDefault ) {
			this.setState( { currentColor: ( undefined === this.props.colorValue || '' === this.props.colorValue || 'transparent' === this.props.colorValue ? '' : this.props.colorValue ) } );
			this.setState( { defaultColor: '' } );
		} else {
			this.setState( { currentColor: ( undefined === this.props.colorValue || '' === this.props.colorValue ? this.props.colorDefault : this.props.colorValue ) } );
			this.setState( { defaultColor: this.props.colorDefault } );
		}
	}
	render() {
		const toggleVisible = () => {
			if ( 'transparent' === this.props.colorDefault ) {
				this.setState( { currentColor: ( undefined === this.props.colorValue || '' === this.props.colorValue || 'transparent' === this.props.colorValue ? '' : this.props.colorValue ) } );
			} else {
				this.setState( { currentColor: ( undefined === this.props.colorValue || '' === this.props.colorValue ? this.props.colorDefault : this.props.colorValue ) } );
			}
			this.setState( { classSat: 'first' } );
			this.setState( { isVisible: true } );
		};
		const toggleClose = () => {
			if ( this.state.isVisible === true ) {
				this.setState( { isVisible: false } );
			}
		};
		const convertOpactiy = ( value ) => {
			let val = 1;
			if ( value ) {
				val = value / 100;
			}
			return val;
		};
		const opacityMax = ( 100 === this.props.opacityUnit ? 100 : 1 );
		const opacityStep = ( 100 === this.props.opacityUnit ? 1 : 0.01 );
		const convertedOpacityValue = ( 100 === this.props.opacityUnit ? convertOpactiy( this.props.opacityValue ) : this.props.opacityValue );
		return (
			<div className="kt-color-popover-container">
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
									this.setState( { currentColor: this.props.colorDefault } );
									this.props.onColorChange( undefined );
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
							<Popover position="top left" className="kt-popover-color" onClose={ toggleClose }>
								{ this.state.classSat === 'first' && ! this.props.disableCustomColors && (
									<ColorPicker
										color={ ( undefined === this.props.colorValue || '' === this.props.colorValue || 'transparent' === this.props.colorValue ? this.state.defaultColor : this.props.colorValue ) }
										onChangeComplete={ ( color ) => {
											this.setState( { currentColor: color.hex } );
											this.props.onColorChange( color.hex );
											if ( this.props.onColorClassChange ) {
												this.props.onColorClassChange( '' );
											}
										} }
										disableAlpha
									/>
								) }
								{ this.state.classSat === 'second' && ! this.props.disableCustomColors && (
									<ColorPicker
										color={ ( undefined === this.state.currentColor || '' === this.state.currentColor || 'transparent' === this.props.colorValue ? this.state.defaultColor : this.state.currentColor ) }
										onChangeComplete={ ( color ) => {
											this.setState( { currentColor: color.hex } );
											this.props.onColorChange( color.hex );
											if ( this.props.onColorClassChange ) {
												this.props.onColorClassChange( '' );
											}
										} }
										disableAlpha
									/>
								) }
								{ this.state.classSat !== 'second' && ! this.props.disableCustomColors && this.state.classSat !== 'first' && (
									<ColorPicker
										color={ ( undefined === this.state.currentColor || '' === this.state.currentColor ? this.state.defaultColor : this.state.currentColor ) }
										onChangeComplete={ ( color ) => {
											this.setState( { currentColor: color.hex } );
											this.props.onColorChange( color.hex );
											if ( this.props.onColorClassChange ) {
												this.props.onColorClassChange( '' );
											}
										} }
										disableAlpha
									/>
								) }
								{ this.props.colors && (
									<div className="components-color-palette">
										{ map( this.props.colors, ( { color, slug, name } ) => {
											const style = { color };
											return (
												<div key={ color } className="components-color-palette__item-wrapper">
													<Tooltip
														text={ name ||
															// translators: %s: color hex code e.g: "#f00".
															sprintf( __( 'Color code: %s' ), color )
														}>
														<Button
															type="button"
															className={ `components-color-palette__item ${ ( this.props.colorValue === color ? 'is-active' : '' ) }` }
															style={ style }
															onClick={ () => {
																this.setState( { currentColor: color } );
																this.props.onColorChange( color );
																if ( this.props.onColorClassChange ) {
																	this.props.onColorClassChange( slug );
																}
																if ( 'third' === this.state.classSat ) {
																	this.setState( { classSat: 'second' } );
																} else {
																	this.setState( { classSat: 'third' } );
																}
															} }
															aria-label={ name ?
																// translators: %s: The name of the color e.g: "vivid red".
																sprintf( __( 'Color: %s' ), name ) :
																// translators: %s: color hex code e.g: "#f00".
																sprintf( __( 'Color code: %s' ), color ) }
															aria-pressed={ this.props.colorValue === color }
														/>
													</Tooltip>
													{ this.props.colorValue === color && <Dashicon icon="saved" /> }
												</div>
											);
										} ) }
									</div>
								) }
								{ this.props.onOpacityChange && (
									<RangeControl
										className="kt-opacity-value"
										label={ opacityIcon }
										value={ this.props.opacityValue }
										onChange={ this.props.onOpacityChange }
										min={ 0 }
										max={ opacityMax }
										step={ opacityStep }
									/>
								) }
							</Popover>
						) }
						{ this.state.isVisible && (
							<Tooltip text={ __( 'Select Color' ) }>
								<Button className={ `kt-color-icon-indicate ${ ( this.props.onOpacityChange || 'transparent' === this.props.colorDefault ? 'kt-has-alpha' : 'kt-no-alpha' ) }` } onClick={ toggleClose }>
									<ColorIndicator className="kt-advanced-color-indicate" colorValue={ ( 'transparent' === this.props.colorValue || undefined === this.props.colorValue || '' === this.props.colorValue ? this.props.colorDefault : hexToRGBA( this.props.colorValue, ( this.props.opacityValue !== undefined ? convertedOpacityValue : 1 ) ) ) } />
								</Button>
							</Tooltip>
						) }
						{ ! this.state.isVisible && (
							<Tooltip text={ __( 'Select Color' ) }>
								<Button className={ `kt-color-icon-indicate ${ ( this.props.onOpacityChange || 'transparent' === this.props.colorDefault ? 'kt-has-alpha' : 'kt-no-alpha' ) }` } onClick={ toggleVisible }>
									<ColorIndicator className="kt-advanced-color-indicate" colorValue={ ( 'transparent' === this.props.colorValue || undefined === this.props.colorValue || '' === this.props.colorValue ? this.props.colorDefault : hexToRGBA( this.props.colorValue, ( this.props.opacityValue !== undefined ? convertedOpacityValue : 1 ) ) ) } />
								</Button>
							</Tooltip>
						) }
					</div>
				</div>
			</div>
		);
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
} )( AdvancedColorControl );
