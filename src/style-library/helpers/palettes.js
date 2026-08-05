/**
 * Pure data helpers for the Color Palette screen: mapping a palette's effective view onto the
 * `SwatchGrid` data shape, the immutable node-edit functions the structure-write flows compose
 * over a fresh default-palette read, and the naming helpers the mint-a-primitive flows use. No
 * REST and no JSX here — see `helpers/palette-flows.js` for the orchestration that calls the API
 * and `components/pages/ColorPaletteScreen.js` for the JSX these mappings feed.
 */

/**
 * Internal dependencies
 */
import { slugifyLibraryTitle } from './libraries';

/**
 * The token prefix a user-created color primitive is minted under (mirrors
 * `Reserved_Namespace::canonical()`).
 *
 * @since TBD
 */
const CUSTOM_COLOR_PREFIX = 'primitive.color.custom.';

/**
 * The starting value for a swatch with no neighboring color to copy.
 *
 * @since TBD
 */
const FALLBACK_SWATCH_VALUE = '#000000';

/**
 * Map a palette effective view to the data half of `SwatchGrid`'s `groups` prop. Pure data only —
 * no JSX: the screen supplies each card's `preview` node and drag flags itself, because a React
 * element in a helper would make this untestable under the pure-function policy.
 *
 * @param {Object} palette The palette effective view.
 *
 * @since TBD
 *
 * @return {Array<Object>} `[{ id, label, items: [{ id, name, subLine, value, overridden }] }]` —
 *         `id` is the swatch token dot-path (stable, unique per palette, and what `?kb-item=`
 *         carries), `subLine` the raw `$value`.
 */
export function mapPaletteToSwatchGroups(palette) {
	if (!palette || !Array.isArray(palette.groups)) {
		return [];
	}

	return palette.groups.map((group) => ({
		id: group.id,
		label: group.label,
		items: (Array.isArray(group.swatches) ? group.swatches : []).map((swatch) => ({
			id: swatch.token,
			name: swatch.label,
			subLine: swatch.$value,
			value: swatch.$value,
			overridden: Boolean(swatch.overridden),
		})),
	}));
}

/**
 * The swatch entry for a token in an effective view, or null.
 *
 * @param {Object} palette The palette effective view.
 * @param {string} token   The swatch token dot-path.
 *
 * @since TBD
 *
 * @return {Object|null} The swatch entry `{ token, label, $value, overridden }`, or null.
 */
export function findSwatch(palette, token) {
	if (!palette || !Array.isArray(palette.groups)) {
		return null;
	}

	for (const group of palette.groups) {
		const swatch = (group.swatches ?? []).find((entry) => entry.token === token);

		if (swatch) {
			return swatch;
		}
	}

	return null;
}

/**
 * The settings-panel initial values for a swatch.
 *
 * @param {Object} palette The palette effective view.
 * @param {string} token   The swatch token dot-path.
 *
 * @since TBD
 *
 * @return {{label: string, value: string}} Empty strings when the swatch is missing, so the panel
 *         can detect a stale item id.
 */
export function swatchInitialValues(palette, token) {
	const swatch = findSwatch(palette, token);

	return {
		label: swatch?.label ?? '',
		value: swatch?.$value ?? '',
	};
}

/**
 * Whether an id is the listing's `$default` palette. Fails closed: an empty or missing
 * `$default` means every id counts as default, so destructive affordances stay hidden on
 * malformed data rather than exposed against a guess.
 *
 * @param {Object} listing The palette listing (`{ defaultId, currentId, palettes }`).
 * @param {string} id      The palette id to check.
 *
 * @since TBD
 *
 * @return {boolean} True when `id` is the default palette, or when the default pointer is unknown.
 */
export function isDefaultPalette(listing, id) {
	const defaultId = listing?.defaultId;

	return !defaultId || defaultId === id;
}

/**
 * The display label for a palette listing row.
 *
 * @param {{id: string, label: string}} row The palette listing row.
 *
 * @since TBD
 *
 * @return {string} The row's label, or its id when the label is ''.
 */
export function paletteDisplayLabel(row) {
	return row?.label || row?.id || '';
}

/**
 * Derive a palette id from a typed label — the same kebab grammar token/library ids use.
 *
 * @param {string} label The typed palette label.
 *
 * @since TBD
 *
 * @return {string} The slug. '' when nothing survives.
 */
export function slugifyPaletteLabel(label) {
	return slugifyLibraryTitle(label);
}

/**
 * Whether a typed palette label collides with an existing palette id once run through
 * `slugifyPaletteLabel`.
 *
 * @param {string}         label   The typed palette label.
 * @param {Object}         listing The palette listing (`{ palettes }`).
 *
 * @since TBD
 *
 * @return {boolean} True when the label's derived slug matches an existing palette id.
 */
export function isDuplicatePaletteLabel(label, listing) {
	const slug = slugifyPaletteLabel(label);
	const rows = Array.isArray(listing?.palettes) ? listing.palettes : [];

	return slug !== '' && rows.some((row) => row.id === slug);
}

/**
 * Strip the view-only `overridden` flag from every swatch, producing write-payload groups. The
 * effective view is read-only data annotated for display; a write payload sends only what the
 * palette node itself stores.
 *
 * @param {Array<Object>} groups The effective view's `groups` array.
 *
 * @since TBD
 *
 * @return {Array<Object>} A new groups array; swatches carry only `token`, `label`, `$value`.
 */
export function stripEffectiveFlags(groups) {
	return (groups ?? []).map((group) => ({
		...group,
		swatches: (group.swatches ?? []).map(({ token, label, $value }) => ({ token, label, $value })),
	}));
}

/**
 * Append a swatch to the group with `groupId`.
 *
 * @param {Array<Object>} groups  The write-payload groups array.
 * @param {string}        groupId The target group's id.
 * @param {Object}        swatch  The swatch to append, `{ token, label, $value }`.
 *
 * @since TBD
 *
 * @return {Array<Object>} A new groups array with the swatch appended; the same reference as
 *         `groups` (a no-op) when `groupId` matches no group, so callers can detect the miss.
 */
export function addSwatchToGroups(groups, groupId, swatch) {
	if (!(groups ?? []).some((group) => group.id === groupId)) {
		return groups;
	}

	return groups.map((group) =>
		group.id === groupId ? { ...group, swatches: [...(group.swatches ?? []), swatch] } : group
	);
}

/**
 * Remove the swatch with `token`, dropping a group left empty afterward — mirroring the server's
 * `prepare_for_storage()`, so what the client sends is what the server would end up storing.
 *
 * @param {Array<Object>} groups The write-payload groups array.
 * @param {string}        token  The swatch token dot-path to remove.
 *
 * @since TBD
 *
 * @return {Array<Object>} A new groups array with the swatch (and, if emptied, its group) removed;
 *         the same reference as `groups` (a no-op) when no group carries `token`.
 */
export function removeSwatchFromGroups(groups, token) {
	const rows = groups ?? [];

	if (!rows.some((group) => (group.swatches ?? []).some((swatch) => swatch.token === token))) {
		return groups;
	}

	return rows
		.map((group) => ({ ...group, swatches: (group.swatches ?? []).filter((swatch) => swatch.token !== token) }))
		.filter((group) => group.swatches.length > 0);
}

/**
 * Set the `label` of the swatch with `token`.
 *
 * @param {Array<Object>} groups The write-payload groups array.
 * @param {string}        token  The swatch token dot-path to rename.
 * @param {string}        label  The new label.
 *
 * @since TBD
 *
 * @return {Array<Object>} A new groups array with the target swatch relabeled.
 */
export function renameSwatchInGroups(groups, token, label) {
	return (groups ?? []).map((group) => ({
		...group,
		swatches: (group.swatches ?? []).map((swatch) => (swatch.token === token ? { ...swatch, label } : swatch)),
	}));
}

/**
 * Reorder one group's swatches to `orderedTokens`.
 *
 * @param {Array<Object>} groups        The write-payload groups array.
 * @param {string}        groupId       The target group's id.
 * @param {Array<string>} orderedTokens The swatch token order `SwatchGrid`'s `onReorder` emits.
 *
 * @since TBD
 *
 * @return {Array<Object>} A new groups array with the target group's swatches reordered; tokens
 *         missing from `orderedTokens` keep their relative position at the end. The same
 *         reference as `groups` (a no-op) when `groupId` matches no group.
 */
export function reorderGroupSwatches(groups, groupId, orderedTokens) {
	if (!(groups ?? []).some((group) => group.id === groupId)) {
		return groups;
	}

	return groups.map((group) => {
		if (group.id !== groupId) {
			return group;
		}

		const swatches = group.swatches ?? [];
		const byToken = new Map(swatches.map((swatch) => [swatch.token, swatch]));
		const ordered = orderedTokens.filter((token) => byToken.has(token)).map((token) => byToken.get(token));
		const remaining = swatches.filter((swatch) => !orderedTokens.includes(swatch.token));

		return { ...group, swatches: [...ordered, ...remaining] };
	});
}

/**
 * Append a new group. The caller must supply at least one swatch — the server drops an empty
 * group even on the default palette, so "Add Color Group" must mint the group's first swatch in
 * the same write.
 *
 * @param {Array<Object>} groups The write-payload groups array.
 * @param {Object}        group  The group to append, `{ id, label, swatches }`.
 *
 * @since TBD
 *
 * @return {Array<Object>} A new groups array with `group` appended.
 */
export function addGroupToGroups(groups, group) {
	return [...(groups ?? []), group];
}

/**
 * The next free custom-color slug.
 *
 * @param {Array<string>} existingIds Every token id a new slug must avoid colliding with — the
 *                                    flattened feed token ids plus the palette's own swatch
 *                                    tokens, so a collision against either source is impossible.
 *
 * @since TBD
 *
 * @return {string} `custom-<n>`, starting at `custom-1` and skipping any suffix already in use.
 */
export function nextCustomColorSlug(existingIds) {
	const taken = new Set(
		(existingIds ?? [])
			.filter((id) => id.startsWith(CUSTOM_COLOR_PREFIX))
			.map((id) => id.slice(CUSTOM_COLOR_PREFIX.length))
	);

	let n = 1;

	while (taken.has(`custom-${n}`)) {
		n += 1;
	}

	return `custom-${n}`;
}

/**
 * The canonical token id the server will mint for a slug.
 *
 * @param {string} slug The custom-color slug (e.g. `custom-1`).
 *
 * @since TBD
 *
 * @return {string} `primitive.color.custom.<slug>`.
 */
export function customColorTokenId(slug) {
	return `${CUSTOM_COLOR_PREFIX}${slug}`;
}

/**
 * The starting value for a new swatch in a group.
 *
 * @param {Array<Object>} groups  The palette's groups array (either shape — effective view or
 *                                write payload; only `$value` is read).
 * @param {string}        groupId The target group's id.
 *
 * @since TBD
 *
 * @return {string} The group's last swatch's `$value` when the group has one — a neighboring
 *         color is a friendlier starting point than black — otherwise `#000000`.
 */
export function newSwatchValue(groups, groupId) {
	const group = (groups ?? []).find((row) => row.id === groupId);
	const swatches = group?.swatches ?? [];

	return swatches.length > 0 ? swatches[swatches.length - 1].$value : FALLBACK_SWATCH_VALUE;
}

/**
 * Whether a swatch token is a user-created custom color. Drives only the token-cleanup step of
 * swatch deletion — the caller additionally checks the feed's `userCreated` flag where the feed
 * entry exists, as defense-in-depth.
 *
 * @param {string} token The swatch token dot-path.
 *
 * @since TBD
 *
 * @return {boolean} True when `token` carries the custom-color prefix.
 */
export function isCustomColorToken(token) {
	return typeof token === 'string' && token.startsWith(CUSTOM_COLOR_PREFIX);
}
