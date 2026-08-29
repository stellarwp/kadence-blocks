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
 * or a raw literal, so this adapter translates at the write boundary: `isTokenId()` (the same
 * `primitive.`/`semantic.` prefix check `token-controls` already exports) tells a bare id apart from
 * a literal on read, and a pick's alias has its brackets stripped back off before it is written.
 *
 * Palette source: unlike the block editor, which has to resolve a block's own possibly-pinned
 * `kbPalette`, the Button preset page has no per-row palette override to consider — it always shows
 * the SITE's active palette, `listing.currentId` in `usePalettes()`'s own vocabulary. Reading that
 * requires only the same store selector `usePalettes()` itself calls (`getPaletteListing`, via
 * `useSelect`) — not the full hook, which also wires `route`/`navigate` and every palette WRITE flow
 * this read-only field never needs, and which `SettingsForm`'s field contract has no slot to pass in
 * regardless (a field only ever receives `field`/`value`/`onChange`/`values`/`onValueChange`, matching
 * `TokenColorSelectField`'s own self-sourcing of the pickable pool via `getDesignTokensFeed()`).
 *
 * `resolveLiteral` needs no CSS-variable read the way the block editor's `resolveColorLiteral` does:
 * `mapPaletteToColorControlGroups()` already carries each swatch's resolved `$value` literal
 * (sourced from the palette's own effective view, not a JS-recomputed one), so the Custom tab seeds
 * directly from the entry already in `groups`.
 */

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { ColorControl, isTokenId, mapPaletteToColorControlGroups } from '../../../../token-controls';
import { getDesignTokensFeed } from '../../../helpers/tokens';
// `STORE_NAME` comes from `store/constants` directly, not `store` (the index every hook imports
// it from) — the index's module body calls `register(createReduxStore(...))`, pulling in
// `store/resolvers.js` and, through it, `api/client.js`'s `@wordpress/api-fetch` import. That is
// fine inside a hook, which only ever runs after the app root has already registered the store
// once, but `field-types.js` (this field's registry entry) is a much wider dependency: several
// existing field/schema tests import it without ever booting the app, and registering the store a
// second time from here would import `@wordpress/api-fetch` into every one of them, a package this
// repo only ships as the `wp.apiFetch` runtime global, not an installed npm dependency.
import { EMPTY_LISTING, STORE_NAME } from '../../../store/constants';

/**
 * Resolve a token entry's literal from its own already-shaped `value` — see this file's docblock
 * for why no CSS-variable read is needed here, unlike the block-editor host's adapter.
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
	const feed = getDesignTokensFeed();
	const namespace = feed?.rest?.namespace;
	const slug = feed?.slug;

	const listing = useSelect(
		(select) => (namespace && slug ? select(STORE_NAME).getPaletteListing(namespace, slug) : EMPTY_LISTING),
		[namespace, slug]
	);

	const activeRow = listing.palettes.find((row) => row.id === listing.currentId) ?? null;
	const groups = mapPaletteToColorControlGroups(activeRow);

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
