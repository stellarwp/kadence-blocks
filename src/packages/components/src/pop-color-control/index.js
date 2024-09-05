/**
 * Advanced Color Control.
 *
 */

/**
 * Import Icons
 */
import SinglePopColorControl from '../single-pop-color-control';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default class extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			reload: false,
		}
	}
	render() {
		let showClear = false;
		// Adds backward compatablity.
		const defaultColor = ( this.props.colorDefault ? this.props.colorDefault : this.props.default );
		const defaultColor2 = ( this.props.colorDefault2 ? this.props.colorDefault2 : this.props.default2 );
		const defaultColor3 = ( this.props.colorDefault3 ? this.props.colorDefault3 : this.props.default3 );
		const valueColor = ( this.props.colorValue ? this.props.colorValue : this.props.value );
		const valueColor2 = ( this.props.colorValue2 ? this.props.colorValue2 : this.props.value2 );
		const valueColor3 = ( this.props.colorValue3 ? this.props.colorValue3 : this.props.value3 );
		const onChange = ( this.props.onColorChange ? this.props.onColorChange : this.props.onChange );
		const onChange2 = ( this.props.onColorChange2 ? this.props.onColorChange2 : this.props.onChange2 );
		const onChange3 = ( this.props.onColorChange3 ? this.props.onColorChange3 : this.props.onChange3 );
		if ( valueColor && valueColor !== defaultColor ) {
			showClear = true;
		}
		if ( valueColor2 && valueColor2 !== defaultColor2 ) {
			showClear = true;
		}
		if ( valueColor3 && valueColor3 !== defaultColor3 ) {
			showClear = true;
		}
		return (
			<div className="components-base-control kadence-pop-color-control">
				<div className="kadence-pop-color-container">
					{ this.props.label && (
						<label className="kadence-beside-label kadence-pop-color-label">{ this.props.label }</label>
					) }
					{ showClear && ! this.props.hideClear && (
						<Button
							className="kadence-pop-color-clear"
							type="button"
							onClick={ () => {
								onChange( defaultColor ? defaultColor : '' );
								if ( this.props.onClassChange ) {
									this.props.onClassChange( '' );
								}
								if ( onChange2 ) {
									onChange2( defaultColor2 ? defaultColor2 : '' );
									if ( this.props.onClassChange2 ) {
										this.props.onClassChange2( '' );
									}
								}
								if ( onChange3 ) {
									onChange3( defaultColor3 ? defaultColor3 : '' );
									if ( this.props.onClassChange3 ) {
										this.props.onClassChange3( '' );
									}
								}
								this.setState( { reload: true } );
							} }
							isSmall
						>
							<Dashicon icon="redo" />
						</Button>
					) }
					<div className="kadence-pop-color-popovers">
						<SinglePopColorControl
							label={ this.props.swatchLabel ? this.props.swatchLabel : __( 'Select Color', 'kadence-blocks' ) }
							onChange={ value => onChange( value ) }
							onOpacityChange={ this.props.onOpacityChange ? value => this.props.onOpacityChange( value ) : undefined }
							onArrayChange={ this.props.onArrayChange ? ( value, opacity ) => this.props.onArrayChange( value, opacity ) : undefined }
							onClassChange={ this.props.onClassChange ? value => this.props.onClassChange( value ) : undefined }
							value={ valueColor }
							opacityValue={ undefined !== this.props?.opacityValue && '' !== this.props?.opacityValue ? this.props.opacityValue : undefined }
							opacityUnit={ this.props.opacityUnit ? this.props.opacityUnit : undefined }
							defaultValue={ defaultColor ? defaultColor : '' }
							reload={ this.state.reload }
							reloaded={ value => this.setState( { reload: false } ) }
						/>
						{ onChange2 && (
							<SinglePopColorControl
								label={ this.props.swatchLabel2 ? this.props.swatchLabel2 : __( 'Select Color', 'kadence-blocks' ) }
								onChange={ value => onChange2( value ) }
								onOpacityChange={ this.props.onOpacityChange2 ? value => this.props.onOpacityChange2( value ) : undefined }
								onArrayChange={ this.props.onArrayChange2 ? ( value, opacity ) => this.props.onArrayChange2( value, opacity ) : undefined }
								onClassChange={ this.props.onClassChange2 ? value => this.props.onClassChange2( value ) : undefined }
								value={ valueColor2 }
								opacityValue={ this.props.opacityValue2 ? this.props.opacityValue2 : undefined }
								opacityUnit={ this.props.opacityUnit2 ? this.props.opacityUnit2 : undefined }
								defaultValue={ defaultColor2 ? defaultColor2 : '' }
								reload={ this.state.reload }
								reloaded={ value => this.setState( { reload: false } ) }
							/>
						) }
						{ onChange3 && (
							<SinglePopColorControl
								label={ this.props.swatchLabel3 ? this.props.swatchLabel3 : __( 'Select Color', 'kadence-blocks' ) }
								onChange={ value => onChange3( value ) }
								onOpacityChange={ this.props.onOpacityChange3 ? value => this.props.onOpacityChange3( value ) : undefined }
								onArrayChange={ this.props.onArrayChange3 ? ( value, opacity ) => this.props.onArrayChange3( value, opacity ) : undefined }
								onClassChange={ this.props.onClassChange3 ? value => this.props.onClassChange3( value ) : undefined }
								value={ valueColor3 }
								opacityValue={ this.props.opacityValue3 ? this.props.opacityValue3 : undefined }
								opacityUnit={ this.props.opacityUnit3 ? this.props.opacityUnit3 : undefined }
								defaultValue={ defaultColor3 ? defaultColor3 : '' }
								reload={ this.state.reload }
								reloaded={ value => this.setState( { reload: false } ) }
							/>
						) }
					</div>
				</div>
			</div>
		);
	}
}
