/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { useSelect, useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { configureRestClient, fetchDesignTokensFeed } from '../api/client';
import { flattenSchemaTokens, getDesignTokensFeed as readLocalizedFeed } from '../helpers/tokens';
import { DEFAULT_LIBRARY_SLUG } from '../constants';
import { STORE_NAME } from '../store';

/**
 * Read and normalize the design-token feed from the store, with a way to refresh it in place.
 *
 * `slug` is the token library the feed's schema/values/version were actually resolved against — the
 * active library, not necessarily the default one (see `Admin\Feed\Localizer`). Every write this page
 * makes must target that same slug, or an edit lands in a document other than the one being shown.
 *
 * The first paint always reads the server-printed `window.kadenceDesignTokens` global rather than
 * fetching, exactly as before — that value is seeded into the store SYNCHRONOUSLY on first render
 * (not through the store's async resolver, which would otherwise leave `isReady` false for one
 * render) and its resolution is marked finished immediately, so a fetch is never issued for the
 * slug the page already loaded with. `refreshFeed` is the one path that always forces a fresh REST
 * read through the store, for after the active library changes, or after a write on the current
 * library, without a page reload.
 *
 * @since TBD
 *
 * @return {{ feed: object|null, tokens: object[], isReady: boolean, isActive: boolean, isResolved: boolean, values: Record<string, string>, responsive: Record<string, object>, rest: object|null, version: string, slug: string, title: string, refreshFeed: Function }}
 */
export function useDesignTokensFeed() {
	const registry = useRegistry();

	const initialFeedRef = useRef();
	if (initialFeedRef.current === undefined) {
		initialFeedRef.current = readLocalizedFeed();
	}
	const initialFeed = initialFeedRef.current;
	const initialSlug = initialFeed?.slug ?? DEFAULT_LIBRARY_SLUG;

	const hydratedRef = useRef(false);
	if (!hydratedRef.current) {
		hydratedRef.current = true;

		if (initialFeed) {
			registry.dispatch(STORE_NAME).receiveDesignTokensFeed(initialSlug, initialFeed);
			registry.dispatch(STORE_NAME).finishResolution('getDesignTokensFeed', [initialSlug]);
		}
	}

	const [slug, setSlug] = useState(initialSlug);

	const feed = useSelect((select) => select(STORE_NAME).getDesignTokensFeed(slug), [slug]);
	const tokens = useMemo(() => flattenSchemaTokens(feed?.schema), [feed]);

	useEffect(() => {
		if (feed?.rest) {
			configureRestClient(feed.rest);
		}
	}, [feed]);

	/**
	 * Replace the feed with a fresh REST read for the given library, so every consumer re-renders
	 * against the newly active library without a page reload. Always forces a fresh read — every
	 * call site either just switched libraries (must see that library's real current state) or just
	 * wrote to the current one (a cached pre-write value would be stale by definition).
	 *
	 * @param {string} targetSlug The token library slug to read the feed for.
	 *
	 * @since TBD
	 *
	 * @return {Promise<object>} The fresh feed payload.
	 */
	const refreshFeed = useCallback(
		(targetSlug) => {
			setSlug(targetSlug);
			registry.dispatch(STORE_NAME).invalidateResolution('getDesignTokensFeed', [targetSlug]);
			return registry.resolveSelect(STORE_NAME).getDesignTokensFeed(targetSlug);
		},
		[registry]
	);

	return {
		feed,
		tokens,
		isReady: feed !== null,
		isActive: Boolean(feed?.active),
		isResolved: Boolean(feed?.resolved),
		values: feed?.values ?? {},
		responsive: feed?.responsive ?? {},
		rest: feed?.rest ?? null,
		version: feed?.version ?? '',
		slug: feed?.slug ?? DEFAULT_LIBRARY_SLUG,
		title: feed?.title ?? '',
		refreshFeed,
	};
}
