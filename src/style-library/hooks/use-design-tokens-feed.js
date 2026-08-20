/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { useSelect, useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { configureRestClient } from '../api/client';
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

		// Deliberate dispatch-during-render: seeds the store synchronously so the very first render
		// already has `isReady: true` for the localized slug, rather than waiting one render for an
		// async resolver to run. This is only safe here because nothing is subscribed to the store yet
		// on this first render (the `useSelect` below hasn't mounted its subscription) — dispatching
		// during render in any later render, once subscribers exist, would be the usual React pitfall.
		// That invariant holds today because `StyleLibraryApp.js` is this hook's only call site and
		// calls it before any other store-reading hook (`useLibraries`, etc.) mounts; a second call
		// site, or moving this hook below another one that already subscribes, would break it silently.
		if (initialFeed) {
			registry.dispatch(STORE_NAME).receiveDesignTokensFeed(initialSlug, initialFeed);
			registry.dispatch(STORE_NAME).finishResolution('getDesignTokensFeed', [initialSlug]);
		}
	}

	const [slug, setSlug] = useState(initialSlug);

	// Identifies the most recently STARTED `refreshFeed` call, so an earlier call's slower read can't
	// win a race against a later one and leave `slug` on stale data — see `refreshFeed` below.
	const latestRequestRef = useRef(0);

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
	 * `slug` (and therefore `feed`/`isReady`) only advances once this read actually succeeds — not
	 * synchronously on call. Advancing it eagerly would make `getDesignTokensFeed(state, targetSlug)`
	 * return `null` (so `isReady` goes false) the instant this runs, for every consumer, for the
	 * whole duration of the fetch; a failure would then leave `slug` pointing at a library whose feed
	 * never resolved, with `isReady` false and no way back short of a page reload. Staying on the OLD
	 * slug until the new read lands means a failure just leaves the previous feed on screen, where its
	 * caller's own error state (already tracked per flow, e.g. `openError`) can still be shown.
	 *
	 * Two overlapping calls (a second library switch fired before the first one's read has settled)
	 * resolve in whichever order their network requests happen to land, not necessarily the order
	 * they were called in — without a guard, a slower first call resolving after a faster second call
	 * would win and leave `slug` pointing at the wrong (earlier-requested) library. `latestRequestRef`
	 * tags each call with an ever-increasing id at the moment it starts, and only the call still
	 * holding the latest id when its read resolves is allowed to advance `slug`.
	 *
	 * @param {string} targetSlug The token library slug to read the feed for.
	 *
	 * @since TBD
	 *
	 * @return {Promise<object>} The fresh feed payload.
	 */
	const refreshFeed = useCallback(
		(targetSlug) => {
			const requestId = ++latestRequestRef.current;

			registry.dispatch(STORE_NAME).invalidateResolution('getDesignTokensFeed', [targetSlug]);

			return registry
				.resolveSelect(STORE_NAME)
				.getDesignTokensFeed(targetSlug)
				.then((nextFeed) => {
					if (requestId === latestRequestRef.current) {
						setSlug(targetSlug);
					}
					return nextFeed;
				});
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
