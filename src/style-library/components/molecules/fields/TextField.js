/**
 * A single-line text field: `TextControl` for an editable label, or static text for a read-only
 * value (the settled shape for the token-id field — a rename edits the label only, the id itself
 * is immutable and never editable in this UI).
 */

/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FieldLabel } from './FieldLabel';

/**
 * Render a text field.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.field    The field definition ({ label, readOnly }).
 * @param {string}   props.value    The current value.
 * @param {Function} props.onChange Called with the new value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function TextField({ field, value, onChange }) {
	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--text">
			<FieldLabel>{field.label}</FieldLabel>
			{field.readOnly ? (
				<p className="kadence-blocks-style-library__field-static-value">{value}</p>
			) : (
				<TextControl __next40pxDefaultSize value={value} onChange={onChange} />
			)}
		</div>
	);
}
