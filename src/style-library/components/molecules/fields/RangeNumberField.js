/**
 * A slider-first numeric field (e.g. FONT SIZE's slider variant) — a `RangeControl` with its own
 * built-in editable number readout, no separate unit suffix. Responsive-capable via
 * `hooks/use-responsive-field-value.js`.
 */

/**
 * WordPress dependencies
 */
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useResponsiveFieldValue } from '../../../hooks/use-responsive-field-value';
import { FieldLabel } from './FieldLabel';

/**
 * Render a slider-first numeric field.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.field    The field definition ({ label, min, max, readOnly, responsive }).
 * @param {number}   props.value    The current numeric value.
 * @param {Function} props.onChange Called with the new numeric value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function RangeNumberField({ field, value: rawValue, onChange: rawOnChange }) {
	const { value, onChange, switcher } = useResponsiveFieldValue(field, rawValue, rawOnChange);
	const numeric = value === '' || value === undefined || value === null ? 0 : Number(value);

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--range-number">
			<FieldLabel trailing={switcher}>{field.label}</FieldLabel>
			<RangeControl
				__next40pxDefaultSize
				value={numeric}
				min={field.min ?? 0}
				max={field.max ?? 100}
				disabled={field.readOnly}
				onChange={(next) => !field.readOnly && onChange(next)}
			/>
		</div>
	);
}
