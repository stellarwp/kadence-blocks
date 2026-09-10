/**
 * A list of named, independently-editable color rows (e.g. Button's Text / Background rows) — a
 * bordered row per color, name left, a circular swatch button right that opens a popover to edit
 * that row's own color directly (not a select-then-edit-elsewhere list). Value is a
 * `{ [rowId]: colorOrGradient }` map; editing a row calls `onChange` with the whole updated map.
 */

/**
 * WordPress dependencies
 */
import { Dropdown } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorGradientPicker } from './ColorGradientPicker';
import { FieldLabel } from './FieldLabel';
import './ColorListField.scss';

/**
 * Render a color-list field.
 *
 * @param {Object}                                   props          The component props.
 * @param {Object}                                   props.field    The field definition
 *                                                                   ({ label, rows: [{id, name, gradients}], readOnly }).
 * @param {Object.<string, string>}                   props.value    The current `{ rowId: colorOrGradient }` map.
 * @param {Function}                                  props.onChange Called with the next whole map on any row edit;
 *                                                                    never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function ColorListField({ field, value, onChange }) {
	const rows = field.rows || [];
	const values = value || {};

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--color-list">
			<FieldLabel>{field.label}</FieldLabel>
			<div className="kadence-blocks-style-library__field-color-list">
				{rows.map((row) => {
					const rowValue = values[row.id] || '';

					return (
						<div key={row.id} className="kadence-blocks-style-library__field-color-list-row">
							<span className="kadence-blocks-style-library__field-color-list-name">{row.name}</span>
							<Dropdown
								className="kadence-blocks-style-library__field-color-list-swatch-dropdown"
								popoverProps={{ placement: 'left-start' }}
								renderToggle={({ isOpen, onToggle }) => (
									<button
										type="button"
										className="kadence-blocks-style-library__field-color-list-swatch"
										style={{ background: rowValue || 'transparent' }}
										// translators: %s: the row's own name (e.g. "Background").
										aria-label={sprintf(__('%s color', 'kadence-blocks'), row.name)}
										aria-expanded={isOpen}
										disabled={field.readOnly}
										onClick={onToggle}
									/>
								)}
								renderContent={() => (
									<ColorGradientPicker
										value={rowValue}
										gradients={row.gradients || field.gradients}
										readOnly={field.readOnly}
										onChange={(next) => onChange({ ...values, [row.id]: next })}
									/>
								)}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
