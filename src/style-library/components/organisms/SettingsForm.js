/**
 * The schema-driven settings-panel renderer: panels become collapsible `PanelBody` sections (an
 * untitled panel renders its fields bare), fields resolve through the field-type registry, and
 * values flow by dot path.
 *
 * Responsive values are not this component's concern — a `responsive: true` field resolves and
 * writes its own breakpoint slot internally via `hooks/use-responsive-field-value.js`; this
 * component always hands it the plain dot-path `value`/`onChange`.
 *
 * A field bound to more than one stored property (`BorderField`'s width/style/color axes are three
 * sibling `tokens.*` keys, not one composite — see its own docblock) cannot be served by the single
 * dot-path `value`/`onChange` pair alone, so every field also receives the full draft `values` and
 * the raw, path-taking `onValueChange(path, next)` this component itself was given — additive, and
 * ignored by every field that only needs its own `field.path`.
 */

/**
 * WordPress dependencies
 */
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
/**
 * What an untitled panel renders instead of a `PanelBody`. Core gives `PanelBody` its own padding,
 * so a titled panel is already inset; an untitled one renders bare and would sit flush against the
 * settings panel's edges. The padding belongs here, on the case that lacks it, rather than on the
 * shared scroll container — a container rule would land on both cases and double up wherever core's
 * padding already applies.
 *
 * @param {Object}      props          The component props.
 * @param {JSX.Element} props.children The panel's fields.
 *
 * @since TBD
 *
 * @return {JSX.Element} The wrapped fields.
 */
function UntitledPanelBody({ children }) {
	return <div className="kadence-blocks-style-library__settings-form-untitled-panel">{children}</div>;
}

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
									values={values}
									onValueChange={onChange}
								/>
							);
						})}
					</div>
				);

				if (!panel.title) {
					return <UntitledPanelBody key={panel.id}>{fields}</UntitledPanelBody>;
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
