/**
 * A number-with-unit field (e.g. a `56 px` font size), optionally paired with a range slider that
 * follows the number input (not the other way around) and shares its value. Responsive-capable via
 * `hooks/use-responsive-field-value.js`.
 */

/**
 * WordPress dependencies
 */
// Experimental API: __experimentalNumberControl's signature can change between WP releases;
// stable fallback is `TextControl type="number"` plus a unit suffix rendered alongside it.
import { __experimentalNumberControl as NumberControl, RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useResponsiveFieldValue } from '../../../hooks/use-responsive-field-value';
import { FieldLabel } from './FieldLabel';
import './NumberUnitField.scss';

/**
 * Render a number-with-unit field.
 *
 * @param {Object}   props             The component props.
 * @param {Object}   props.field       The field definition ({ label, unit, withRange, min, max, readOnly, responsive }).
 * @param {number}   props.value       The current numeric value.
 * @param {Function} props.onChange    Called with the new numeric value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function NumberUnitField({ field, value: rawValue, onChange: rawOnChange }) {
	const { value, onChange, switcher } = useResponsiveFieldValue(field, rawValue, rawOnChange);
	const numeric = value === '' || value === undefined || value === null ? '' : Number(value);
	const handleChange = (next) => {
		if (field.readOnly) {
			return;
		}

		onChange(next === '' ? '' : Number(next));
	};

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--number-unit">
			<FieldLabel trailing={switcher}>{field.label}</FieldLabel>
			<div className="kadence-blocks-style-library__field-number-unit-row">
				<NumberControl
					__next40pxDefaultSize
					value={numeric}
					min={field.min}
					max={field.max}
					suffix={field.unit}
					disabled={field.readOnly}
					onChange={handleChange}
				/>
				{field.withRange && (
					<RangeControl
						__next40pxDefaultSize
						value={numeric || 0}
						min={field.min ?? 0}
						max={field.max ?? 100}
						disabled={field.readOnly}
						withInputField={false}
						onChange={handleChange}
					/>
				)}
			</div>
		</div>
	);
}
