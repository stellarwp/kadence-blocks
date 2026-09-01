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
 * `reshapePaletteRows()` and `mapPaletteToSwatchGroups()` moved to
 * `src/token-controls/helpers/palette-groups.js`, so the new shared `ColorControl` can read the
 * same palette-group shaping this screen already relies on. Re-exported here so every existing
 * caller in this app keeps importing from this file unchanged.
 *
 * `reshapePaletteRows()` is used internally by `store/selectors.js`'s `getPaletteListing` only —
 * reshaping the raw wire-format rows, exactly as the reducer stores them, into the shape the
 * frontend consumes. Nothing else in this app should call it directly, and specifically not code
 * that writes into the store: `helpers/palette-flows.js` dispatches every write's response RAW, via
 * `onReceive`, with no reshaping before dispatch — reshaping a write's response before it reaches
 * the store would double-reshape it on the next read, since `getPaletteListing` is the one
 * canonical place reshaping happens.
 */
export { reshapePaletteRows, mapPaletteToSwatchGroups } from '../../token-controls/helpers/palette-groups';

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
 * Whether the palette being edited shows inheritance affordances on its swatch cards at all. Only
 * a non-default palette does: the default palette is where a swatch's value is defined, so it has
 * no source to name and no delta of its own to drop.
 *
 * Fails closed through `isDefaultPalette` — a listing with no `$default` pointer reports every id
 * as the default, so a malformed listing shows no pills instead of naming a source it cannot
 * verify.
 *
 * @param {Object} listing   The palette listing (`{ defaultId, currentId, palettes }`).
 * @param {string} editingId The id of the palette being edited.
 *
 * @since TBD
 *
 * @return {boolean} True when this palette's cards show the inheritance pill.
 */
export function paletteShowsInheritance(listing, editingId) {
	return Boolean(editingId) && !isDefaultPalette(listing, editingId);
}

/**
 * Which pill a swatch card carries, if any. Every palette states where its colors stand; what
 * differs is what "the value it started from" means.
 *
 * On a non-default palette that is the default palette: a swatch either follows it, or overrides
 * it and offers the way back. On the default palette there is no other palette to follow, so the
 * comparison is against the SHIPPED value instead — which is exactly what its `overridden` flag
 * already measures (`Palettes_Controller::effective_view()`), and what a reset there restores
 * (`delete_swatch()` puts the shipped color back rather than dropping the row).
 *
 * A user-added color is the one case with no pill: nothing shipped it, so it can neither claim to
 * be a default nor be reset to one. Its card offers Delete in the settings panel instead. That
 * only applies on the default palette, which owns the structure the color was added to; seen from
 * any other palette the color is inherited like every other swatch.
 *
 * @param {Object}  args
 * @param {boolean} args.isDefault  Whether the palette being edited is the default one.
 * @param {boolean} args.isCustom   Whether the swatch's token was created by a user rather than shipped.
 * @param {boolean} args.overridden Whether the swatch has anything to undo.
 *
 * @since TBD
 *
 * @return {?string} `'default'`, `'reset'`, `'inherited'`, or null for no pill.
 */
export function swatchPillVariant({ isDefault, isCustom, overridden }) {
	if (isDefault && isCustom) {
		return null;
	}

	if (overridden) {
		return 'reset';
	}

	return isDefault ? 'default' : 'inherited';
}

/**
 * How many swatches in a mapped grid still take their value from the default palette. Groups and
 * swatches that are optimistically deleted are skipped: they are on their way out of the grid, and
 * counting them would state a number the grid is about to contradict.
 *
 * @param {Array<Object>} groups The mapped grid groups from `mapPaletteToSwatchGroups()`.
 *
 * @since TBD
 *
 * @return {number} The number of swatches with no value of their own in this palette.
 */
export function inheritedSwatchCount(groups) {
	return (Array.isArray(groups) ? groups : [])
		.filter((group) => !group.pendingDelete)
		.reduce(
			(total, group) =>
				total + (group.items ?? []).filter((item) => !item.overridden && !item.pendingDelete).length,
			0
		);
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

	// A swatch/group the real listing already carries (the write's `onReceive` landed) must not
	// also be appended from the overlay — the overlay is only cleared in the caller's `.finally()`,
	// well after `onReceive`, so without this de-dupe the row renders twice for that window.
	const realSwatchTokens = new Set(palette.groups.flatMap((group) => group.swatches.map((swatch) => swatch.token)));
	const realGroupIds = new Set(palette.groups.map((group) => group.id));

	const groups = palette.groups.map((group) => {
		const pendingGroupDelete = overlay.deletedGroups.includes(group.id);

		const swatches = group.swatches.map((swatch) => ({
			...swatch,
			...(overlay.patches[swatch.token] ?? {}),
			pendingDelete: pendingGroupDelete || overlay.deletedTokens.includes(swatch.token),
		}));

		const additions = overlay.addedSwatches
			.filter((added) => added.groupId === group.id && !realSwatchTokens.has(added.token))
			.map(({ groupId, ...swatch }) => ({ ...swatch, pendingDelete: false }));

		return { ...group, pendingDelete: pendingGroupDelete, swatches: [...swatches, ...additions] };
	});

	const addedGroups = overlay.addedGroups
		.filter((group) => !realGroupIds.has(group.id))
		.map((group) => ({
			...group,
			pendingDelete: false,
			swatches: group.swatches.map((swatch) => ({ ...swatch, pendingDelete: false })),
		}));

	return { ...palette, groups: [...groups, ...addedGroups] };
}

/**
 * Validate a typed color-group label and resolve its slug: empty after slugifying, or a slug the
 * palette already has a group for, is invalid. Called by `hooks/use-palettes.js`'s `addGroup`, to
 * decide — synchronously and before firing anything — whether the optimistic addition and the
 * modal's immediate close should even happen. `helpers/palette-flows.js`'s `addGroupFlow` re-checks
 * the same two cases on its own, inline, for a caller that reaches it without going through that
 * hook — it can't call this function directly, since by the time it validates it already has a
 * resolved `groupId` and a freshly-fetched `groups` array rather than the raw typed `label` and a
 * (possibly stale) client-cached `palette` this function expects.
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
