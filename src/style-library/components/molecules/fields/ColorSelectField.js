/**
 * The Style Library's adapter for `src/token-controls`' `ColorControl` (e.g. the Button preset
 * screen's Text / Background rows): the same trigger-plus-popover control the block editor's
 * `singlebtn` inspector uses, bridged to this host's own palette data and stored-value shape.
 *
 * This is the app's only color-picker field type; every preset color row registers `color-select`.
 *
 * Value format bridge: the field stores a BARE token id (e.g.
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
 *
 * Two more bridges hand the control what the block editor gets for free. A `field.defaultValue`
 * (a bare token id, translated like the value) lets the control show a muted fallback swatch when
 * the row stores nothing. And `resolvedTokenValue` stands in as the control's `resolveAlias`: the
 * editor paints an unlisted alias through its `--kb-token--*` custom properties, but this page
 * enqueues none of them, so an alias the palette groups do not list (a preset's
 * `semantic.color.button-*` binding) can only paint from the library's own resolved literal.
 */

/**
 * Internal dependencies
 */
import { ColorControl } from '../../../../token-controls';
import { resolveLiteral, toControlValue, toStoredValue } from '../../../helpers/color-values';
import { resolvedTokenValue } from '../../../helpers/tokens';
import { useActivePaletteGroups } from '../../../hooks/use-active-palette-groups';

/**
 * Render a color-select field.
 *
 * @param {Object}  props            The component props.
 * @param {Object}  field            The field definition.
 * @param {string}  field.label          The control's static attribute label (e.g. "Text").
 * @param {string}  [field.defaultValue] The bare token id (or literal) the row falls back to when
 *                                       unset, shown muted by the control.
 * @param {boolean} [field.readOnly]     Whether the control is non-interactive.
 * @param {string}  props.value          The stored bare token id, or a raw color literal.
 * @param {Function} props.onChange      Called with the new bare token id (or literal) on pick, or
 *                                       '' on Clear.
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
			defaultValue={toControlValue(field.defaultValue)}
			groups={groups}
			onPick={(alias) => onChange(toStoredValue(alias))}
			onCustom={(literal) => onChange(literal)}
			// No binding indicator sits on a preset row, so Clear is the row's only way back to unset —
			// and therefore back to the muted default the trigger shows.
			onClear={() => onChange('')}
			resolveLiteral={resolveLiteral}
			resolveAlias={resolvedTokenValue}
			disabled={field.readOnly}
		/>
	);
}
