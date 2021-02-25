/**
 * BoxShadow Component
 *
 */

/**
 * Import Externals
 */
import AdvancedPopColorControl from './advanced-pop-color-control';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
} = wp.element;
const {
	ToggleControl,
} = wp.components;
/**
 * Build the BoxShadow controls
 * @returns {object} BoxShadow settings.
 */
const TextShadowControl = ( { label, enable = true, color, colorDefault, blur, hOffset, vOffset, onColorChange, onBlurChange, onHOffsetChange, onVOffsetChange, onEnableChange } ) => (
	<div className="kb-text-shadow-container components-base-control">
		{ label && (
			<div className="kt-box-shadow-label">
				<h2 className="kt-beside-color-label">{ label }</h2>
				{ onEnableChange && (
					<ToggleControl
						checked={ enable }
						onChange={ value => onEnableChange( value ) }
					/>
				) }
			</div>
		) }
		{ enable && (
			<div className="kt-inner-sub-section">
				<div className="kt-inner-sub-section-row">
					<div className="kt-box-color-settings kt-box-shadow-subset">
						<p className="kt-box-shadow-title">{ __( 'Color', 'kadence-blocks' ) }</p>
						<AdvancedPopColorControl
							colorValue={ ( color ? color : colorDefault ) }
							colorDefault={ colorDefault }
							onColorChange={ value => onColorChange( value ) }
						/>
					</div>
					<div className="kt-box-x-settings kt-box-shadow-subset">
						<p className="kt-box-shadow-title">{ 'X' }</p>
						<div className="components-base-control kt-boxshadow-number-input">
							<div className="components-base-control__field">
								<input
									value={ ( undefined !== hOffset ? hOffset : '' ) }
									onChange={ event => onHOffsetChange( Number( event.target.value ) ) }
									min={ -200 }
									max={ 200 }
									step={ 1 }
									type="number"
									className="components-text-control__input"
								/>
							</div>
						</div>
					</div>
					<div className="kt-box-y-settings kt-box-shadow-subset">
						<p className="kt-box-shadow-title">{ 'Y' }</p>
						<div className="components-base-control kt-boxshadow-number-input">
							<div className="components-base-control__field">
								<input
									value={ ( undefined !== vOffset ? vOffset : '' ) }
									onChange={ event => onVOffsetChange( Number( event.target.value ) ) }
									min={ -200 }
									max={ 200 }
									step={ 1 }
									type="number"
									className="components-text-control__input"
								/>
							</div>
						</div>
					</div>
					<div className="kt-box-blur-settings kt-box-shadow-subset">
						<p className="kt-box-shadow-title">{ 'Blur' }</p>
						<div className="components-base-control kt-boxshadow-number-input">
							<div className="components-base-control__field">
								<input
									value={ ( undefined !== blur ? blur : '' ) }
									onChange={ event => onBlurChange( Number( event.target.value ) ) }
									min={ 0 }
									max={ 200 }
									step={ 1 }
									type="number"
									className="components-text-control__input"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		) }
	</div>
);
export default TextShadowControl;
