/**
 * The Style Library's adapter for `src/token-controls`' `ColorControl` (e.g. the Button preset
 * screen's Text / Background rows): the same trigger-plus-popover control the block editor's
 * `singlebtn` inspector uses, bridged to this host's own palette data and stored-value shape.
 *
 * `TokenColorSelectField.js` stays in place unchanged — it is still `BorderField`/`BoxShadowField`'s
 * own color sub-field, out of this control's scope (see the color-control design's border/shadow
 * exclusion). This is a second, additive field type, not a replacement.
 *
 * Value format bridge: a `token-color-select`-style field stores a BARE token id (e.g.
 * `semantic.color.accent.main`), never a bracket alias — the stored attribute shape does not
 * change here. `ColorControl` itself only understands a bracket alias (`{semantic.color.accent.main}`)
 * or a raw literal, so `resolveLiteral`/`toControlValue`/`toStoredValue` (in
 * `helpers/color-values.js`, shared with `BorderField`'s color axis) translate at the write
 * boundary — see that file's own docblock for the full reasoning.
 *
 * Palette source: the read lives in `useActivePaletteGroups`, shared with `BorderField` — both hosts
 * of a color control need the SITE's active palette and neither has a per-row override to resolve,
 * so the shared hook reads only the store selector `usePalettes()` itself calls (`getPaletteListing`),
 * not the full hook, which also wires `route`/`navigate` and every palette WRITE flow a read-only
 * field never needs.
 */

/**
 * Internal dependencies
 */
import { ColorControl } from '../../../../token-controls';
import { resolveLiteral, toControlValue, toStoredValue } from '../../../helpers/color-values';
import { useActivePaletteGroups } from '../../../hooks/use-active-palette-groups';

/**
 * Render a color-select field.
 *
 * @param {Object}  props            The component props.
 * @param {Object}  field            The field definition.
 * @param {string}  field.label      The control's static attribute label (e.g. "Text").
 * @param {boolean} [field.readOnly] Whether the control is non-interactive.
 * @param {string}  props.value      The stored bare token id, or a raw color literal.
 * @param {Function} props.onChange  Called with the new bare token id (or literal) on pick.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function ColorSelectField({ field, value, onChange }) {
	const groups = useActivePaletteGroups();

	return (
		<ColorControl
			label={field.label}
			value={toControlValue(value)}
			groups={groups}
			onPick={(alias) => onChange(toStoredValue(alias))}
			onCustom={(literal) => onChange(literal)}
			resolveLiteral={resolveLiteral}
			disabled={field.readOnly}
		/>
	);
}
