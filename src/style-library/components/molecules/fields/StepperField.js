/**
 * A compact +/- stepper (e.g. LINE HEIGHT) — a `NumberControl` in its custom spin-control mode.
 * Responsive-capable via `hooks/use-responsive-field-value.js`.
 */

/**
 * WordPress dependencies
 */
// Experimental API: __experimentalNumberControl's `spinControls="custom"` mode can change between
// WP releases; stable fallback is two Buttons plus a readout wired to the same onChange.
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useResponsiveFieldValue } from '../../../hooks/use-responsive-field-value';
import { FieldLabel } from './FieldLabel';

/**
 * Render a stepper field.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.field    The field definition ({ label, step, min, max, readOnly, responsive }).
 * @param {number}   props.value    The current numeric value.
 * @param {Function} props.onChange Called with the new numeric value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function StepperField({ field, value: rawValue, onChange: rawOnChange }) {
	const { value, onChange, switcher } = useResponsiveFieldValue(field, rawValue, rawOnChange);
	const numeric = value === '' || value === undefined || value === null ? '' : Number(value);

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--stepper">
			<FieldLabel trailing={switcher}>{field.label}</FieldLabel>
			<NumberControl
				__next40pxDefaultSize
				spinControls="custom"
				value={numeric}
				step={field.step || 1}
				min={field.min}
				max={field.max}
				disabled={field.readOnly}
				onChange={(next) => !field.readOnly && onChange(next === '' ? '' : Number(next))}
			/>
		</div>
	);
}
