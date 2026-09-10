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
 * A select speaks LITERALS — its options are keywords like `700` or `uppercase` — while storage may
 * hand back a token id for the same property, because a written literal is stored as the semantic alias
 * that carries it. A select handed `semantic.font-weight.heading` matches no option and renders blank,
 * so a stored id is displayed as the literal it resolves to. Only the display is translated: an edit
 * still writes the keyword, and storage is free to alias it again on the next save.
 *
 * @param {Object}   props           The component props.
 * @param {Object}   props.field     The field definition ({ label, options, readOnly, values }).
 * @param {?Object}  [props.field.values] The library's resolved id => literal map, when the schema has
 *                                        one to give. Absent for a select whose values are never token
 *                                        ids, which then behaves exactly as before.
 * @param {string}   props.value     The current value: a literal, or a token id storage aliased it to.
 * @param {Function} props.onChange  Called with the new value on edit; never called when read-only.
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
				value={field.values?.[value] ?? value}
				options={field.options || []}
				disabled={field.readOnly}
				onChange={(next) => !field.readOnly && onChange(next)}
			/>
		</div>
	);
}
