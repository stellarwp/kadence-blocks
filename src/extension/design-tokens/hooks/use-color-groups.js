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
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { mapPaletteToColorControlGroups } from '../../../token-controls/helpers/palette-groups';
import { designTokensNamespace, hasDesignTokensRest } from '../rest';

/**
 * One in-flight-or-resolved fetch per palette id, shared by every `useColorGroups` instance across the
 * editor. A palette's groups rarely change during a single editing session, and every existing swatch
 * value already resolves live through CSS custom properties (see the color-control design's "Data
 * contract" section), so this module-level cache — not a full data store — is enough to avoid a fetch
 * per block instance.
 *
 * Only a non-empty result stays cached. An empty one is dropped so the next attempt re-requests it:
 * caching "nothing came back" would make a single bad first load permanent for the whole session.
 *
 * @type {Map<string, Promise<?Array>>}
 */
const groupsCache = new Map();

/**
 * How many times to re-attempt a fetch that could not run (or came back with nothing) before settling
 * on an empty list.
 *
 * @type {number}
 */
const MAX_ATTEMPTS = 3;

/**
 * How long to wait between those attempts, in milliseconds.
 *
 * @type {number}
 */
const RETRY_DELAY_MS = 250;

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
 * The effective palette id for one block: its own pinned `kbPalette`, else the nearest pinned
 * ancestor's, else the site's current palette.
 *
 * Resolved against the block's OWN `clientId` rather than whichever block is selected. The hook is
 * called from the block's `edit`, which renders for every instance on the canvas — including at
 * first paint, when nothing is selected yet — so keying off the selection resolves the wrong block's
 * palette. Taking `select` as an argument keeps this usable inside `useSelect`, so the id also
 * re-resolves when the attribute changes instead of being frozen at whatever the first render saw.
 *
 * @param {Function} select   The `useSelect` registry selector.
 * @param {string}   clientId The block's own client id.
 *
 * @since TBD
 *
 * @return {string} The palette id to fetch.
 */
function resolveEffectivePaletteId(select, clientId) {
	const editor = select('core/block-editor');

	if (!editor || !clientId) {
		return sitePaletteId();
	}

	const own = editor.getBlockAttributes(clientId)?.kbPalette;

	if (own) {
		return own;
	}

	// Walk from the nearest ancestor outward, so a child follows the closest pinned ancestor.
	const parents = editor.getBlockParents(clientId) || [];

	for (let i = parents.length - 1; i >= 0; i--) {
		const inherited = editor.getBlockAttributes(parents[i])?.kbPalette;

		if (inherited) {
			return inherited;
		}
	}

	return sitePaletteId();
}

/**
 * Fetch one palette's node and shape it into `ColorControl`'s `groups` prop, reusing an in-flight or
 * already-resolved request for the same palette id AND library — the REST route's response depends on
 * both (the same palette id can exist in more than one library), so caching on the id alone could
 * return one library's groups for another.
 *
 * Resolves to `null` — never to `[]` — for every outcome that means "could not read the palette"
 * rather than "the palette has no colors": an inactive registry, a missing id, a rejected request, or
 * a response that maps to nothing. The caller retries on `null`, so a first load that lands before the
 * REST descriptor is ready no longer presents itself as a palette with an empty list.
 *
 * @param {string} paletteId The palette id to fetch.
 * @param {string} library   The library slug the palette id is resolved against.
 *
 * @since TBD
 *
 * @return {Promise<?Array>} The mapped groups, or `null` when the palette could not be read.
 */
function fetchColorGroups(paletteId, library) {
	if (!hasDesignTokensRest() || !paletteId) {
		return Promise.resolve(null);
	}

	const cacheKey = `${library}:${paletteId}`;

	if (groupsCache.has(cacheKey)) {
		return groupsCache.get(cacheKey);
	}

	const path = `/${designTokensNamespace()}/palettes/${encodeURIComponent(paletteId)}?library=${encodeURIComponent(
		library
	)}`;

	const request = apiFetch({ path })
		.then((palette) => {
			const mapped = mapPaletteToColorControlGroups(palette);

			if (!mapped.length) {
				// Nothing usable came back. Drop the entry so a retry re-requests it instead of every
				// later reader being served this same empty answer from cache.
				groupsCache.delete(cacheKey);

				return null;
			}

			return mapped;
		})
		.catch(() => {
			// Do not cache a failure — a transient error (e.g. a slow first-load auth race) should not
			// permanently strand every future ColorControl instance on an empty list.
			groupsCache.delete(cacheKey);

			return null;
		});

	groupsCache.set(cacheKey, request);

	return request;
}

/**
 * The effective palette's groups for a `ColorControl` instance in the block editor, empty until the
 * fetch resolves.
 *
 * A first attempt that cannot read the palette is retried rather than settled as an empty list. The
 * palette id is the only thing that re-triggers the fetch, and the block's palette picker is hidden
 * when the library has a single palette — so without the retry a bad first load leaves a control that
 * the user has no way to refresh for the rest of the session.
 *
 * @param {string} clientId The block's own client id, resolved reactively through `useSelect` so the
 *                           groups follow this block's `kbPalette` (or its nearest pinned ancestor's)
 *                           as it changes.
 *
 * @since TBD
 *
 * @return {Array} `[{ id, label, swatches: [{ id, label, value, alias }] }]`, or `[]` while loading.
 */
export function useColorGroups(clientId) {
	const [groups, setGroups] = useState([]);
	const paletteId = useSelect((select) => resolveEffectivePaletteId(select, clientId), [clientId]);
	const library = librarySlug();

	useEffect(() => {
		let cancelled = false;
		let timer;
		let attempts = 0;

		// Clear immediately rather than waiting for the new fetch to resolve, so a palette/library
		// change never briefly shows the PREVIOUS identity's groups as if they still applied.
		setGroups([]);

		const run = () => {
			fetchColorGroups(paletteId, library).then((resolved) => {
				if (cancelled) {
					return;
				}

				if (resolved === null && attempts < MAX_ATTEMPTS) {
					attempts += 1;
					timer = setTimeout(run, RETRY_DELAY_MS);

					return;
				}

				setGroups(resolved ?? []);
			});
		};

		run();

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [clientId, paletteId, library]);

	return groups;
}
