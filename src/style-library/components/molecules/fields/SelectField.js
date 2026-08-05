/**
 * A closed-set choice field (e.g. APPEARANCE) — a plain `SelectControl` over `field.options`.
 */

/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FieldLabel } from './FieldLabel';

/**
 * Render a select field.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.field    The field definition ({ label, options, readOnly }).
 * @param {string}   props.value    The current value.
 * @param {Function} props.onChange Called with the new value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function SelectField({ field, value, onChange }) {
	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--select">
			<FieldLabel>{field.label}</FieldLabel>
			<SelectControl
				__next40pxDefaultSize
				value={value}
				options={field.options || []}
				disabled={field.readOnly}
				onChange={(next) => !field.readOnly && onChange(next)}
			/>
		</div>
	);
}
