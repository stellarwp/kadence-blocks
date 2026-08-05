/**
 * The schema-driven settings-panel renderer: panels become collapsible `PanelBody` sections (an
 * untitled panel renders its fields bare), fields resolve through the field-type registry, and
 * values flow by dot path.
 *
 * Responsive values are not this component's concern — a `responsive: true` field resolves and
 * writes its own breakpoint slot internally via `hooks/use-responsive-field-value.js`; this
 * component always hands it the plain dot-path `value`/`onChange`.
 */

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { Panel, PanelBody } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { fieldComponentFor, getValueAtPath, normalizeSchema } from '../../helpers/settings-schema';
import './SettingsForm.scss';

/**
 * Render a settings schema.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.schema   The authored schema (normalized internally).
 * @param {Object}   props.values   The current draft values.
 * @param {Function} props.onChange Called with (path, value) on any field edit.
 *
 * @since TBD
 *
 * @return {JSX.Element} The form.
 */
export function SettingsForm({ schema, values, onChange }) {
	const normalized = normalizeSchema(schema);

	return (
		<Panel className="kadence-blocks-style-library__settings-form">
			{normalized.panels.map((panel) => {
				const fields = (
					<div className="kadence-blocks-style-library__settings-form-fields">
						{panel.fields.map((field) => {
							const Field = fieldComponentFor(field.type);

							return (
								<Field
									key={field.path}
									field={field}
									value={getValueAtPath(values, field.path)}
									onChange={(next) => onChange(field.path, next)}
								/>
							);
						})}
					</div>
				);

				if (!panel.title) {
					return <Fragment key={panel.id}>{fields}</Fragment>;
				}

				return (
					<PanelBody key={panel.id} title={panel.title} initialOpen={panel.initialOpen}>
						{fields}
					</PanelBody>
				);
			})}
		</Panel>
	);
}
