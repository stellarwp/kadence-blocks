/**
 * The site's active palette, shaped as a color control's `groups` prop.
 *
 * Unlike the block editor, which has to resolve a block's own possibly-pinned `kbPalette`, the Style
 * Library has no per-row palette override to consider — it always shows the SITE's active palette,
 * `listing.currentId` in `usePalettes()`'s own vocabulary. Reading that requires only the same store
 * selector `usePalettes()` itself calls, not the full hook, which also wires `route`/`navigate` and
 * every palette WRITE flow a read-only field never needs.
 *
 * A hook rather than a helper because a field cannot call `useSelect` from inside a render prop —
 * `BorderField` needs the groups in its own body to hand down to `BorderControl`'s `renderColor`.
 */

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { mapPaletteToColorControlGroups } from '../../token-controls';
import { getDesignTokensFeed } from '../helpers/tokens';
// `STORE_NAME` comes from `store/constants` directly, not `store` (the index every hook imports
// it from) — the index's module body calls `register(createReduxStore(...))`, pulling in
// `store/resolvers.js` and, through it, `api/client.js`'s `@wordpress/api-fetch` import. That is
// fine inside a hook, which only ever runs after the app root has already registered the store
// once, but `field-types.js` (the registry entry for the fields that call this) is a much wider
// dependency: several existing field/schema tests import it without ever booting the app, and
// registering the store a second time from here would import `@wordpress/api-fetch` into every one
// of them, a package this repo only ships as the `wp.apiFetch` runtime global, not an installed npm
// dependency.
import { EMPTY_LISTING, STORE_NAME } from '../store/constants';

/**
 * Read the site's active palette as color-control groups.
 *
 * @since TBD
 *
 * @return {Array} `[{ id, label, swatches: [{ id, label, value, alias }] }]`, empty when the feed or
 *         the listing is not available.
 */
export function useActivePaletteGroups() {
	const feed = getDesignTokensFeed();
	const namespace = feed?.rest?.namespace;
	const slug = feed?.slug;

	const listing = useSelect(
		(select) => (namespace && slug ? select(STORE_NAME).getPaletteListing(namespace, slug) : EMPTY_LISTING),
		[namespace, slug]
	);

	const activeRow = listing.palettes.find((row) => row.id === listing.currentId) ?? null;

	return mapPaletteToColorControlGroups(activeRow);
}
