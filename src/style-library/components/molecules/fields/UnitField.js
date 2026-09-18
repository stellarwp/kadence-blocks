/**
 * A number-plus-unit-dropdown field (e.g. LETTER SPACING) — an `__experimentalUnitControl`.
 * Responsive-capable via `hooks/use-responsive-field-value.js`.
 */

/**
 * WordPress dependencies
 */
// Experimental API: __experimentalUnitControl's signature can change between WP releases; stable
// fallback is a plain TextControl (the unit becomes part of the typed string).
import { __experimentalUnitControl as UnitControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useResponsiveFieldValue } from '../../../hooks/use-responsive-field-value';
import { FieldLabel } from './FieldLabel';

/**
 * Render a unit field.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.field    The field definition ({ label, units, readOnly, responsive }).
 * @param {string}   props.value    The current value (e.g. '0.02em').
 * @param {Function} props.onChange Called with the new value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function UnitField({ field, value: rawValue, onChange: rawOnChange }) {
	const { value, onChange, switcher } = useResponsiveFieldValue(field, rawValue, rawOnChange);

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--unit">
			<FieldLabel trailing={switcher}>{field.label}</FieldLabel>
			<UnitControl
				__next40pxDefaultSize
				value={value}
				units={field.units}
				disabled={field.readOnly}
				onChange={(next) => !field.readOnly && onChange(next)}
			/>
		</div>
	);
}
