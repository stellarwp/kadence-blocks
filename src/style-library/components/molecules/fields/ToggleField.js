/**
 * A boolean switch field (e.g. the shadow editor's Inset toggle) — a plain `ToggleControl`.
 */

/**
 * WordPress dependencies
 */
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FieldLabel } from './FieldLabel';

/**
 * Render a toggle field.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.field    The field definition ({ label, readOnly }).
 * @param {boolean}  props.value    The current value.
 * @param {Function} props.onChange Called with the new value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function ToggleField({ field, value, onChange }) {
	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--toggle">
			<FieldLabel>{field.label}</FieldLabel>
			<ToggleControl
				checked={Boolean(value)}
				disabled={field.readOnly}
				onChange={(next) => !field.readOnly && onChange(next)}
			/>
		</div>
	);
}
