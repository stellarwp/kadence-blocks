/**
 * The value bridge between a Style Library color field's stored shape and `token-controls`' own
 * `ColorControl`/`ColorSwatchControl` value contract.
 *
 * Shared by `ColorSelectField.js` (a preset's Text/Background rows) and `BorderField.js`'s color
 * axis (see its own docblock) — both fields store a BARE token id (e.g.
 * `semantic.color.accent.main`), never a bracket alias, so both need the same translation at the
 * write boundary: `isTokenId()` (the same `primitive.`/`semantic.` prefix check `token-controls`
 * already exports) tells a bare id apart from a literal on read, and a pick's alias has its brackets
 * stripped back off before it is written. Pulled out here rather than left on `ColorSelectField` —
 * its original home — once `BorderField` needed the same bridge too and importing it from a sibling
 * field component it otherwise has nothing to do with was the wrong shape; this mirrors
 * `use-active-palette-groups.js`, the palette read the same two fields already share.
 */

/**
 * Internal dependencies
 */
import { isTokenId } from '../../token-controls';

/**
 * Resolve a token entry's literal from its own already-shaped `value`.
 *
 * No CSS-variable read is needed here, unlike the block-editor host's `resolveColorLiteral`:
 * `mapPaletteToColorControlGroups()` already carries each swatch's resolved `$value` literal
 * (sourced from the palette's own effective view, not a JS-recomputed one), so the Custom tab seeds
 * directly from the entry already in `groups`.
 *
 * @param {Object} entry The token entry (`{ id, label, value, alias }`) to resolve.
 *
 * @since TBD
 *
 * @return {string} The entry's resolved literal.
 */
export function resolveLiteral(entry) {
	return entry.value;
}

/**
 * Bridge a stored bare token id (or raw literal) into `ColorControl`'s own value contract.
 *
 * @param {string} value The stored value: a bare token id, a raw literal, or empty.
 *
 * @since TBD
 *
 * @return {string} The bracket alias for a token id, the literal unchanged, or ''.
 */
export function toControlValue(value) {
	return isTokenId(value) ? `{${value}}` : value || '';
}

/**
 * Bridge `ColorControl`'s picked alias back into the bare id this field stores.
 *
 * @param {string} alias The bracket alias `onPick` handed back (e.g. `{semantic.color.accent.main}`).
 *
 * @since TBD
 *
 * @return {string} The bare token id.
 */
export function toStoredValue(alias) {
	return alias.slice(1, -1);
}
