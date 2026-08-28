/**
 * Read-only, editor-scoped fetch of one palette's grouped swatch data for `ColorControl`'s `groups`
 * prop.
 *
 * The Style Library gets its grouped palette data from `usePalettes()` (routing, optimistic writes, its
 * own store) — far more than a block-editor color control needs. This hook is the block editor's own,
 * much simpler read: resolve the block's effective palette id (its own `kbPalette`, else the site's
 * current palette), fetch that palette's node once per id (cached at module scope, since the data is
 * read-only and rarely changes), and shape it through `mapPaletteToColorControlGroups` so the return
 * value is exactly `ColorControl`'s `groups` prop shape.
 *
 * Fails open like every other design-token editor mechanism (see `register-color-control-filters.js`'s
 * own tolerance for "not loaded yet"): an inactive token registry, a missing REST descriptor, or a
 * rejected fetch all resolve to an empty `groups` array rather than throwing.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { mapPaletteToColorControlGroups } from '../../../token-controls/helpers/palette-groups';
import { effectivePalette } from '../palette-swatch-preview';
import { designTokensNamespace, hasDesignTokensRest } from '../rest';

/**
 * One in-flight-or-resolved fetch per palette id, shared by every `useColorGroups` instance across the
 * editor. A palette's groups rarely change during a single editing session, and every existing swatch
 * value already resolves live through CSS custom properties (see the color-control design's "Data
 * contract" section), so this module-level cache — not a full data store — is enough to avoid a fetch
 * per block instance.
 *
 * @type {Map<string, Promise<Array>>}
 */
const groupsCache = new Map();

/**
 * The active library slug the palette REST route resolves against, from the localized palette catalog.
 *
 * @since TBD
 *
 * @return {string} The library slug, defaulting to 'default' when the catalog has none.
 */
function librarySlug() {
	const catalog = (typeof window !== 'undefined' && window.kadenceDesignTokensPalettes) || {};

	return catalog.active || 'default';
}

/**
 * The site's current palette id from the localized palette catalog.
 *
 * @since TBD
 *
 * @return {string} The current palette id, defaulting to 'default' when the catalog has none.
 */
function sitePaletteId() {
	const catalog = (typeof window !== 'undefined' && window.kadenceDesignTokensPalettes) || {};

	return catalog.current || 'default';
}

/**
 * The effective palette id to fetch: the block's own pinned override when it has one, else the site's
 * current palette.
 *
 * @since TBD
 *
 * @return {string} The palette id to fetch.
 */
function resolveEffectivePaletteId() {
	return effectivePalette() || sitePaletteId();
}

/**
 * Fetch one palette's node and shape it into `ColorControl`'s `groups` prop, reusing an in-flight or
 * already-resolved request for the same palette id AND library — the REST route's response depends on
 * both (the same palette id can exist in more than one library), so caching on the id alone could
 * return one library's groups for another.
 *
 * @param {string} paletteId The palette id to fetch.
 * @param {string} library   The library slug the palette id is resolved against.
 *
 * @since TBD
 *
 * @return {Promise<Array>} The mapped groups, or an empty array when the registry is inactive or the
 *         fetch fails.
 */
function fetchColorGroups(paletteId, library) {
	if (!hasDesignTokensRest() || !paletteId) {
		return Promise.resolve([]);
	}

	const cacheKey = `${library}:${paletteId}`;

	if (groupsCache.has(cacheKey)) {
		return groupsCache.get(cacheKey);
	}

	const path = `/${designTokensNamespace()}/palettes/${encodeURIComponent(paletteId)}?library=${encodeURIComponent(
		library
	)}`;

	const request = apiFetch({ path })
		.then((palette) => mapPaletteToColorControlGroups(palette))
		.catch(() => {
			// Do not cache a failure — a transient error (e.g. a slow first-load auth race) should not
			// permanently strand every future ColorControl instance on an empty list.
			groupsCache.delete(cacheKey);

			return [];
		});

	groupsCache.set(cacheKey, request);

	return request;
}

/**
 * The effective palette's groups for a `ColorControl` instance in the block editor, empty until the
 * fetch resolves.
 *
 * @param {string} clientId The block's client id — not read directly (`effectivePalette()` resolves
 *                           against the currently selected block, which is always the block this
 *                           control belongs to, since an inspector control only renders while its own
 *                           block is selected), but kept as an effect dependency so a selection change
 *                           re-resolves the palette even when the newly selected block's own palette
 *                           id happens to match the previous one.
 *
 * @since TBD
 *
 * @return {Array} `[{ id, label, swatches: [{ id, label, value, alias }] }]`, or `[]` while loading.
 */
export function useColorGroups(clientId) {
	const [groups, setGroups] = useState([]);
	// Read fresh on every render, not just inside the effect: a `kbPalette` change on the SAME
	// selected block (no `clientId` change) still needs to re-trigger the fetch, which only the
	// effect's own dependency list can do.
	const paletteId = resolveEffectivePaletteId();
	const library = librarySlug();

	useEffect(() => {
		let cancelled = false;

		// Clear immediately rather than waiting for the new fetch to resolve, so a palette/library
		// change never briefly shows the PREVIOUS identity's groups as if they still applied.
		setGroups([]);

		fetchColorGroups(paletteId, library).then((resolved) => {
			if (!cancelled) {
				setGroups(resolved);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [clientId, paletteId, library]);

	return groups;
}
