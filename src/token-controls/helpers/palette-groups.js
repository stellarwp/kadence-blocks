/**
 * Pure shaping functions for a palette's `groups[]`, shared by both hosts.
 *
 * Relocated from `src/style-library/helpers/palettes.js`, which kept these two functions private to
 * the Color Palette Screen. `ColorControl`'s Style Library tab needs the same active-palette group
 * data, so this is the one place both the Style Library and the block editor host adapters read from
 * — see `src/token-controls/README.md`'s "no host imports" rule this satisfies for the editor side.
 */

/**
 * Reshape the flat embedded-array wire response into the shape every consumer already expects. The
 * wire shape is a flat array of rows (WP core's `_embed` only resolves top-level collection items,
 * never something nested inside a wrapper key) with `is_default`/`is_current`/`user_created` flags
 * per row instead of collection-level pointers; this reshapes those flags back into the
 * pointer-based shape both hosts are built around.
 *
 * @param {Array<Object>} rows The flat embedded-array rows.
 *
 * @since TBD
 *
 * @return {{defaultId: string, currentId: string, palettes: Array<Object>, userCreated: Array<string>}}
 */
export function reshapePaletteRows(rows) {
	return {
		defaultId: rows.find((row) => row.is_default)?.id ?? '',
		currentId: rows.find((row) => row.is_current)?.id ?? '',
		palettes: rows.map((row) => ({
			id: row.id,
			label: row.label,
			groups: row._embedded?.self?.[0]?.groups ?? [],
		})),
		userCreated: rows.filter((row) => row.user_created).map((row) => row.id),
	};
}

/**
 * Map a palette effective view to the data half of `SwatchGrid`'s `groups` prop. Pure data only —
 * no JSX: the Color Palette Screen supplies each card's `preview` node and drag flags itself.
 *
 * @param {Object} palette The palette effective view.
 *
 * @since TBD
 *
 * @return {Array<Object>} `[{ id, label, pendingDelete, items: [{ id, name, subLine, value,
 *         overridden, pendingDelete }] }]` — `id` is the swatch token dot-path (stable, unique per
 *         palette, and what `?kb-item=` carries), `subLine` the raw `$value`.
 */
export function mapPaletteToSwatchGroups(palette) {
	if (!palette || !Array.isArray(palette.groups)) {
		return [];
	}

	return palette.groups.map((group) => ({
		id: group.id,
		label: group.label,
		pendingDelete: Boolean(group.pendingDelete),
		items: (Array.isArray(group.swatches) ? group.swatches : []).map((swatch) => ({
			id: swatch.token,
			name: swatch.label,
			subLine: swatch.$value,
			value: swatch.$value,
			overridden: Boolean(swatch.overridden),
			pendingDelete: Boolean(swatch.pendingDelete),
		})),
	}));
}

/**
 * Map a palette effective view to `ColorControl`'s `groups` prop.
 *
 * A different shape than `mapPaletteToSwatchGroups()`, which exists for the Color Palette Screen's
 * `SwatchGrid` (`items`, `name`/`subLine`, no alias) — `ColorControl` compares its bound `value`
 * against each swatch's `alias` and writes that alias back on pick (see the "Value storage
 * contract" in the color-control design), so each swatch needs the bracket-wrapped alias form a
 * `SwatchGrid` item never carries.
 *
 * @param {Object} palette The palette effective view.
 *
 * @since TBD
 *
 * @return {Array<Object>} `[{ id, label, swatches: [{ id, label, value, alias }] }]`.
 */
export function mapPaletteToColorControlGroups(palette) {
	if (!palette || !Array.isArray(palette.groups)) {
		return [];
	}

	return palette.groups.map((group) => ({
		id: group.id,
		label: group.label,
		swatches: (Array.isArray(group.swatches) ? group.swatches : []).map((swatch) => ({
			id: swatch.token,
			label: swatch.label,
			value: swatch.$value,
			alias: `{${swatch.token}}`,
		})),
	}));
}
