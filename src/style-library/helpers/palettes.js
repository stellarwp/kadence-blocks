/**
 * Pure data helpers for the Color Palette screen: mapping a palette's effective view onto the
 * `SwatchGrid` data shape, the immutable node-edit functions the structure-write flows compose
 * over a fresh default-palette read, and the naming helpers the mint-a-primitive flows use. No
 * REST and no JSX here — see `helpers/palette-flows.js` for the orchestration that calls the API
 * and `components/pages/ColorPaletteScreen.js` for the JSX these mappings feed.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
 * Reshape the flat embedded-array wire response into the shape every consumer already expects. The
 * wire shape is a flat array of rows (WP core's `_embed` only resolves top-level collection items,
 * never something nested inside a wrapper key — see the REST controller's own docblock for why)
 * with `is_default`/`is_current`/`user_created` flags per row instead of collection-level pointers;
 * this reshapes those flags back into the pointer-based shape this app's own code was already built
 * around.
 *
 * Used internally by `store/selectors.js`'s `getPaletteListing` only — reshaping the raw wire-format
 * rows, exactly as the reducer stores them, into the shape the frontend consumes. Nothing else
 * should call this directly, and specifically not code that writes into the store:
 * `helpers/palette-flows.js` dispatches every write's response RAW, via `onReceive`, with no
 * reshaping before dispatch — reshaping a write's response before it reaches the store would
 * double-reshape it on the next read, since `getPaletteListing` is the one canonical place
 * reshaping happens. Deliberately kept out of `store/selectors.js` itself, even though it is only
 * ever called from there: that module is imported wholesale (`import * as selectors`) as the
 * store's registered selector map, so a plain helper living there would also become a callable
 * `select(STORE_NAME).reshapePaletteRows()` — which `@wordpress/data` would invoke with `state` as
 * the first argument instead of `rows`, throwing the moment anything called it that way.
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
 * Resolve which palette is being edited from the route's generic `scope` arg: `scope` itself when
 * it names a palette in the listing, otherwise the listing's `$current` palette. `hooks/use-palettes.js`
 * derives `editingId` from this on every render, straight from the already-loaded listing — there is
 * no separate fetch to re-derive an id for, so this lives here as the one pure rule instead of being
 * duplicated inline.
 *
 * Also the self-heal for a stale or hand-edited `scope`: a palette id that no longer exists (e.g.
 * the one just deleted, or a copied-and-pasted deep link) falls back to `$current` rather than
 * resolving to nothing.
 *
 * @param {string} scope   The route's `scope` value (a palette id, or '').
 * @param {Object} listing The palette listing (`{ currentId, palettes }`).
 *
 * @since TBD
 *
 * @return {string} The palette id to treat as being edited.
 */
export function resolveEditingPaletteId(scope, listing) {
	const rows = Array.isArray(listing?.palettes) ? listing.palettes : [];

	return scope && rows.some((row) => row.id === scope) ? scope : (listing?.currentId ?? '');
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
 * Whether a palette was created by the user rather than shipped in the baseline. Only a
 * user-created palette can be removed; deleting a baseline one drops its overrides and reverts it
 * to baseline, leaving it in the listing. Fails closed — an id the listing does not vouch for
 * counts as baseline, so the destructive label is never shown against a guess.
 *
 * @param {Object} listing The palette listing (`{ userCreated }`).
 * @param {string} id      The palette id to check.
 *
 * @since TBD
 *
 * @return {boolean} True when the palette is user-created.
 */
export function isUserCreatedPalette(listing, id) {
	const ids = Array.isArray(listing?.userCreated) ? listing.userCreated : [];

	return Boolean(id) && ids.includes(id);
}

/**
 * The palettes a deleted palette can hand the active pointer to: every palette but itself, in
 * listing order. Mirrors `successorOptions` for libraries.
 *
 * @param {Object} listing  The palette listing (`{ palettes }`).
 * @param {string} targetId The palette being deleted.
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string}>} The candidate rows.
 */
export function paletteSuccessorOptions(listing, targetId) {
	const rows = Array.isArray(listing?.palettes) ? listing.palettes : [];

	return rows.filter((row) => row?.id && row.id !== targetId);
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
 * @param {string}  label       The typed palette label.
 * @param {Object}  listing     The palette listing (`{ palettes }`).
 * @param {string}  [excludeId] A palette id to exclude from the check — a rename compares the
 *                               typed label against every OTHER palette, so retyping the palette's
 *                               own current label (whose derived slug is its own unchanged id)
 *                               is not reported as a collision with itself.
 *
 * @since TBD
 *
 * @return {boolean} True when the label's derived slug matches an existing palette id other than
 *         `excludeId`.
 */
export function isDuplicatePaletteLabel(label, listing, excludeId) {
	const slug = slugifyPaletteLabel(label);
	const rows = Array.isArray(listing?.palettes) ? listing.palettes : [];

	return slug !== '' && rows.some((row) => row.id === slug && row.id !== excludeId);
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

/**
 * Set the `label` of the group with `groupId`. The group's id is never touched — a group id is
 * load-bearing server state (`Palettes_Controller::template_slot_for()` places swatches by group
 * id), so a rename is a label-only edit by design, mirroring `renameSwatchInGroups`.
 *
 * @param {Array<Object>} groups  The write-payload groups array.
 * @param {string}        groupId The target group's id.
 * @param {string}        label   The new label.
 *
 * @since TBD
 *
 * @return {Array<Object>} A new groups array with the target group relabeled.
 */
export function renameGroupInGroups(groups, groupId, label) {
	return (groups ?? []).map((group) => (group.id === groupId ? { ...group, label } : group));
}

/**
 * Remove the group with `groupId` — and every swatch in it. Deliberately does NOT block removing
 * the last remaining group: `guard_palette_shape()` rejects `groups: []` with "A palette must
 * define at least one color group", and that server rule is the authority; the UI hides the
 * affordance instead (the caller's concern, not this helper's).
 *
 * @param {Array<Object>} groups  The write-payload groups array.
 * @param {string}        groupId The group id to remove.
 *
 * @since TBD
 *
 * @return {Array<Object>} A new groups array without the group; the same reference as `groups`
 *         (a no-op) when `groupId` matches no group, so callers can detect the miss.
 */
export function removeGroupFromGroups(groups, groupId) {
	const rows = groups ?? [];

	if (!rows.some((group) => group.id === groupId)) {
		return groups;
	}

	return rows.filter((group) => group.id !== groupId);
}

/**
 * Overlay pending optimistic edits onto a palette's effective view: a patched swatch label/value
 * merged in, a swatch or group marked for deletion flagged `pendingDelete: true` (never filtered
 * out — the caller renders it dimmed until the real response confirms it is gone), and a
 * not-yet-confirmed swatch/group addition appended. Pure — `hooks/use-palettes.js` calls this to
 * compute the palette actually rendered, layered on top of whatever the store's real listing
 * currently holds.
 *
 * @param {?Object} palette The palette's effective view (`{ id, label, groups }`), or null.
 * @param {Object}  overlay The optimistic overlay for this palette's listing key — see
 *                          `store/constants.js`'s `EMPTY_OPTIMISTIC_SWATCH_EDIT`.
 *
 * @since TBD
 *
 * @return {?Object} The palette with every pending optimistic edit applied, or the original
 *                    `palette` unchanged when nothing is pending.
 */
export function applyOptimisticOverlay(palette, overlay) {
	if (!palette) {
		return palette;
	}

	const hasNothingPending =
		Object.keys(overlay.patches).length === 0 &&
		overlay.deletedTokens.length === 0 &&
		overlay.deletedGroups.length === 0 &&
		overlay.addedSwatches.length === 0 &&
		overlay.addedGroups.length === 0;

	if (hasNothingPending) {
		return palette;
	}

	const groups = palette.groups.map((group) => {
		const pendingGroupDelete = overlay.deletedGroups.includes(group.id);

		const swatches = group.swatches.map((swatch) => ({
			...swatch,
			...(overlay.patches[swatch.token] ?? {}),
			pendingDelete: pendingGroupDelete || overlay.deletedTokens.includes(swatch.token),
		}));

		const additions = overlay.addedSwatches
			.filter((added) => added.groupId === group.id)
			.map(({ groupId, ...swatch }) => ({ ...swatch, pendingDelete: false }));

		return { ...group, pendingDelete: pendingGroupDelete, swatches: [...swatches, ...additions] };
	});

	const addedGroups = overlay.addedGroups.map((group) => ({
		...group,
		pendingDelete: false,
		swatches: group.swatches.map((swatch) => ({ ...swatch, pendingDelete: false })),
	}));

	return { ...palette, groups: [...groups, ...addedGroups] };
}

/**
 * Validate a typed color-group label and resolve its slug: empty after slugifying, or a slug the
 * palette already has a group for, is invalid. Shared by `helpers/palette-flows.js`'s
 * `addGroupFlow` (defensive re-check for any caller that skips the hook) and
 * `hooks/use-palettes.js`'s `addGroup` (to decide, synchronously and before firing anything, whether
 * the optimistic addition and the modal's immediate close should even happen).
 *
 * @param {string}  label   The typed group label.
 * @param {?Object} palette The palette being edited's effective view, for the duplicate check.
 *
 * @since TBD
 *
 * @return {{groupId: string, error: null}|{groupId: null, error: string}} The slugified id on
 *          success, or a user-facing error message on failure.
 */
export function validateNewGroupLabel(label, palette) {
	const groupId = slugifyPaletteLabel(label);

	if (!groupId) {
		return { groupId: null, error: __('Enter a color group name.', 'kadence-blocks') };
	}

	if ((palette?.groups ?? []).some((group) => group.id === groupId)) {
		return { groupId: null, error: __('A color group with that name already exists.', 'kadence-blocks') };
	}

	return { groupId, error: null };
}
