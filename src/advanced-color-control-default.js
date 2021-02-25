/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';
import hexToRGBA from './hex-to-rgba';
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
	RangeControl,
	ColorIndicator,
	ColorPicker,
	Tooltip,
	Dashicon,
} = wp.components;
const {
	withSelect,
} = wp.data;
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class AdvancedColorControl extends Component {
	constructor( label, colorValue, colorDefault, opacityValue, onColorChange, onOpacityChange ) {
		super( ...arguments );
		this.state = {
			isVisible: false,
			colors: [],
			classSat: 'first',
		};
	}
	render() {
		const toggleVisible = () => {
			this.setState( { isVisible: true } );
		};
		const toggleClose = () => {
			this.setState( { isVisible: false } );
		};
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
								onClick={ () => this.props.onColorChange( undefined ) }
								isSmall
							>
								<Dashicon icon="redo" />
							</Button>
						</Tooltip>
					) }
					<div className="kt-beside-color-click">
						{ this.state.isVisible && (
							<Tooltip text={ __( 'Select Color' ) }>
								<Button className={ `kt-color-icon-indicate ${ ( this.props.onOpacityChange ? 'kt-has-alpha' : 'kt-no-alpha' ) }` } onClick={ toggleClose }>
									<ColorIndicator className="kt-advanced-color-indicate" colorValue={ ( 'transparent' === this.props.colorValue || undefined === this.props.colorValue || '' === this.props.colorValue ? this.props.colorDefault : hexToRGBA( this.props.colorValue, ( this.props.opacityValue !== undefined ? this.props.opacityValue : 1 ) ) ) } />
								</Button>
							</Tooltip>
						) }
						{ ! this.state.isVisible && (
							<Tooltip text={ __( 'Select Color' ) }>
								<Button className={ `kt-color-icon-indicate ${ ( this.props.onOpacityChange ? 'kt-has-alpha' : 'kt-no-alpha' ) }` } onClick={ toggleVisible }>
									<ColorIndicator className="kt-advanced-color-indicate" colorValue={ ( 'transparent' === this.props.colorValue || undefined === this.props.colorValue || '' === this.props.colorValue ? this.props.colorDefault : hexToRGBA( this.props.colorValue, ( this.props.opacityValue !== undefined ? this.props.opacityValue : 1 ) ) ) } />
								</Button>
							</Tooltip>
						) }
					</div>
				</div>
				{ this.state.isVisible && (
					<div className="kt-inner-sub-section">
						{ this.state.classSat === 'first' && ! this.props.disableCustomColors && (
							<ColorPicker
								color={ ( undefined === this.props.colorValue || '' === this.props.colorValue ? this.props.colorDefault : this.props.colorValue ) }
								onChangeComplete={ ( color ) => this.props.onColorChange( color.hex ) }
								disableAlpha
							/>
						) }
						{ this.state.classSat !== 'first' && ! this.props.disableCustomColors && (
							<ColorPicker
								color={ ( undefined === this.props.colorValue || '' === this.props.colorValue ? this.props.colorDefault : this.props.colorValue ) }
								onChangeComplete={ ( color ) => this.props.onColorChange( color.hex ) }
								disableAlpha
							/>
						) }
						{ this.props.colors && (
							<div className="components-color-palette">
								{ map( this.props.colors, ( { color, name } ) => {
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
														this.props.onColorChange( color );
														if ( 'first' === this.state.classSat ) {
															this.setState( { classSat: 'second' } );
														} else {
															this.setState( { classSat: 'first' } );
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
								label={ icons.opacity }
								value={ this.props.opacityValue }
								onChange={ this.props.onOpacityChange }
								min={ 0 }
								max={ 1 }
								step={ 0.01 }
							/>
						) }
					</div>
				) }
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
