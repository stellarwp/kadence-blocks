/**
 * The Style Library's solid-color picker: a saturation square, hue/alpha sliders with a
 * round current-color swatch, and a hex/RGB/HSL fields row. Visually and interaction-wise modeled
 * on `@kadence/components`' `color-picker` (the editor's own picker) but built fresh on
 * `react-color`'s primitives directly — the Style Library never imports from `@kadence/components`
 * or `src/extension/*`, only looks at them as a reference.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, chevronDown, chevronUp } from '@wordpress/icons';

/**
 * External dependencies
 */
import { CustomPicker } from 'react-color';
import { Alpha, Checkboard, EditableInput, Hue, Saturation } from 'react-color/lib/components/common';
import { ChromePointer } from 'react-color/lib/components/chrome/ChromePointer';
import { ChromePointerCircle } from 'react-color/lib/components/chrome/ChromePointerCircle';

/**
 * Internal dependencies
 */
import { cycleFieldsView, deriveFieldsChange, toCssColor } from '../../../helpers/color-picker';
import './ColorPicker.scss';

/**
 * The hex/RGB/HSL numeric fields row below the sliders, with a chevron-up/chevron-down pair that
 * cycles which numeric format is shown. `react-color`'s `EditableInput` only takes `style` objects
 * for its own internals (no `className`), so its box model is set inline here and everything else —
 * layout, the chevrons — lives in the co-located stylesheet.
 *
 * @param {Object}                                            props         The component props.
 * @param {string}                                             props.hex     The current hex value (no leading "#").
 * @param {{r:number,g:number,b:number,a:number}}              props.rgb     The current RGB state.
 * @param {{h:number,s:number,l:number,a:number}}               props.hsl     The current HSL state.
 * @param {Function}                                            props.onChange Called with a `react-color`-shaped change payload.
 *
 * @since TBD
 *
 * @return {JSX.Element} The fields row.
 */
function ColorPickerFields({ hex, rgb, hsl, onChange }) {
	const [view, setView] = useState('rgb');
	const inputStyle = { input: { width: '100%' } };

	const handleFieldChange = (data) => {
		const change = deriveFieldsChange(view, data, { rgb, hsl });

		if (change) {
			onChange(change);
		}
	};

	return (
		<div className="kadence-blocks-style-library__color-picker-fields">
			<div className="kadence-blocks-style-library__color-picker-field kadence-blocks-style-library__color-picker-field--hex">
				<EditableInput style={inputStyle} label="hex" value={hex} onChange={handleFieldChange} />
			</div>
			{view === 'rgb' ? (
				<>
					<div className="kadence-blocks-style-library__color-picker-field">
						<EditableInput style={inputStyle} label="r" value={rgb.r} onChange={handleFieldChange} />
					</div>
					<div className="kadence-blocks-style-library__color-picker-field">
						<EditableInput style={inputStyle} label="g" value={rgb.g} onChange={handleFieldChange} />
					</div>
					<div className="kadence-blocks-style-library__color-picker-field">
						<EditableInput style={inputStyle} label="b" value={rgb.b} onChange={handleFieldChange} />
					</div>
					<div className="kadence-blocks-style-library__color-picker-field">
						<EditableInput style={inputStyle} label="a" value={rgb.a} onChange={handleFieldChange} />
					</div>
				</>
			) : (
				<>
					<div className="kadence-blocks-style-library__color-picker-field">
						<EditableInput
							style={inputStyle}
							label="h"
							value={Math.round(hsl.h)}
							onChange={handleFieldChange}
						/>
					</div>
					<div className="kadence-blocks-style-library__color-picker-field">
						<EditableInput
							style={inputStyle}
							label="s"
							value={`${Math.round(hsl.s * 100)}%`}
							onChange={handleFieldChange}
						/>
					</div>
					<div className="kadence-blocks-style-library__color-picker-field">
						<EditableInput
							style={inputStyle}
							label="l"
							value={`${Math.round(hsl.l * 100)}%`}
							onChange={handleFieldChange}
						/>
					</div>
					<div className="kadence-blocks-style-library__color-picker-field">
						<EditableInput style={inputStyle} label="a" value={hsl.a} onChange={handleFieldChange} />
					</div>
				</>
			)}
			<div className="kadence-blocks-style-library__color-picker-view-cycle">
				<button
					type="button"
					className="kadence-blocks-style-library__color-picker-view-cycle-button"
					aria-label={__('Previous color format', 'kadence-blocks')}
					onClick={() => setView(cycleFieldsView(view, -1))}
				>
					<Icon icon={chevronUp} size={12} />
				</button>
				<button
					type="button"
					className="kadence-blocks-style-library__color-picker-view-cycle-button"
					aria-label={__('Next color format', 'kadence-blocks')}
					onClick={() => setView(cycleFieldsView(view, 1))}
				>
					<Icon icon={chevronDown} size={12} />
				</button>
			</div>
		</div>
	);
}

/**
 * The picker body, wrapped by `CustomPicker` below: the saturation square, the hue/alpha sliders,
 * the current-color swatch, and the fields row. `onChange` here is `react-color`'s internal
 * `CustomPicker` handler — it accepts a partial color payload (from a slider or a field edit),
 * merges it into the full color state, and re-renders this component with the result.
 *
 * @param {Object}                                 props          The component props.
 * @param {string}                                 props.hex      The current hex value (no leading "#").
 * @param {{r:number,g:number,b:number,a:number}}  props.rgb      The current RGB state.
 * @param {{h:number,s:number,l:number,a:number}}  props.hsl      The current HSL state.
 * @param {Object}                                 props.hsv      The current HSV state (`Saturation` needs this in addition to `hsl`).
 * @param {Function}                               props.onChange The internal `react-color` change handler.
 *
 * @since TBD
 *
 * @return {JSX.Element} The picker body.
 */
function ColorPickerBody({ hex, rgb, hsl, hsv, onChange }) {
	return (
		<div className="kadence-blocks-style-library__color-picker">
			<div className="kadence-blocks-style-library__color-picker-saturation">
				<Saturation hsl={hsl} hsv={hsv} pointer={ChromePointerCircle} onChange={onChange} />
			</div>
			<div className="kadence-blocks-style-library__color-picker-controls">
				<div className="kadence-blocks-style-library__color-picker-sliders">
					<div className="kadence-blocks-style-library__color-picker-hue">
						<Hue hsl={hsl} pointer={ChromePointer} onChange={onChange} />
					</div>
					<div className="kadence-blocks-style-library__color-picker-alpha">
						<Alpha rgb={rgb} hsl={hsl} pointer={ChromePointer} onChange={onChange} />
					</div>
				</div>
				<div className="kadence-blocks-style-library__color-picker-swatch">
					<Checkboard />
					<div
						className="kadence-blocks-style-library__color-picker-swatch-color"
						style={{ background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})` }}
					/>
				</div>
			</div>
			{/* EditableInput's hex field expects no leading "#" — it re-adds one on display. */}
			<ColorPickerFields hex={hex.replace('#', '')} rgb={rgb} hsl={hsl} onChange={onChange} />
		</div>
	);
}

const CustomColorPicker = CustomPicker(ColorPickerBody);

/**
 * Render the Style Library's solid-color picker.
 *
 * @param {Object}   props          The component props.
 * @param {string}   props.color    The current CSS color (any format `react-color`/`tinycolor2` can
 *                                   parse — hex, hex8, rgb(a), hsl(a)).
 * @param {Function} props.onChange Called with the new color as a `#rrggbb`/`#rrggbbaa` string.
 *
 * @since TBD
 *
 * @return {JSX.Element} The picker.
 */
export function ColorPicker({ color, onChange }) {
	return <CustomColorPicker color={color} onChange={(next) => onChange(toCssColor(next.rgb))} />;
}
