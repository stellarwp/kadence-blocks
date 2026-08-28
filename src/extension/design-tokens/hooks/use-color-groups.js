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
 * already-resolved request for the same palette id.
 *
 * @param {string} paletteId The palette id to fetch.
 *
 * @since TBD
 *
 * @return {Promise<Array>} The mapped groups, or an empty array when the registry is inactive or the
 *         fetch fails.
 */
function fetchColorGroups(paletteId) {
	if (!hasDesignTokensRest() || !paletteId) {
		return Promise.resolve([]);
	}

	if (groupsCache.has(paletteId)) {
		return groupsCache.get(paletteId);
	}

	const path = `/${designTokensNamespace()}/palettes/${encodeURIComponent(paletteId)}?library=${encodeURIComponent(
		librarySlug()
	)}`;

	const request = apiFetch({ path })
		.then((palette) => mapPaletteToColorControlGroups(palette))
		.catch(() => {
			// Do not cache a failure — a transient error (e.g. a slow first-load auth race) should not
			// permanently strand every future ColorControl instance on an empty list.
			groupsCache.delete(paletteId);

			return [];
		});

	groupsCache.set(paletteId, request);

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
 *                           re-resolves the palette.
 *
 * @since TBD
 *
 * @return {Array} `[{ id, label, swatches: [{ id, label, value, alias }] }]`, or `[]` while loading.
 */
export function useColorGroups(clientId) {
	const [groups, setGroups] = useState([]);

	useEffect(() => {
		let cancelled = false;

		fetchColorGroups(resolveEffectivePaletteId()).then((resolved) => {
			if (!cancelled) {
				setGroups(resolved);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [clientId]);

	return groups;
}
