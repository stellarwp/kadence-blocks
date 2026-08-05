/**
 * A color/gradient field (e.g. the Color Palette settings picker) — `ColorGradientPicker` inline,
 * below the field label. The value is a single CSS string (a hex/rgb color, or a
 * `linear-gradient(...)` string).
 */

/**
 * Internal dependencies
 */
import { ColorGradientPicker } from './ColorGradientPicker';
import { FieldLabel } from './FieldLabel';

/**
 * Render a color/gradient field.
 *
 * @param {Object}   props              The component props.
 * @param {Object}   props.field        The field definition ({ label, gradients, readOnly }).
 * @param {string}   props.value        The current CSS color or gradient string.
 * @param {Function} props.onChange     Called with the new value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function ColorField({ field, value, onChange }) {
	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--color">
			<FieldLabel>{field.label}</FieldLabel>
			<ColorGradientPicker
				value={value}
				gradients={field.gradients}
				readOnly={field.readOnly}
				onChange={onChange}
			/>
		</div>
	);
}
