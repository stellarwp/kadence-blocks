/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { dispatch as defaultDispatch, useSelect, useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { configureRestClient } from '../api/client';
import { flattenSchemaTokens, getDesignTokensFeed as readLocalizedFeed } from '../helpers/tokens';
import { DEFAULT_LIBRARY_SLUG } from '../constants';
import { STORE_NAME } from '../store';

/**
 * Seed the store with the localized design-token feed. Call this BEFORE React starts rendering —
 * from the bootstrap entry point (`style-library.js`), ahead of `createRoot(...).render()` — so the
 * very first render already has `isReady: true` for the active library, without a render-phase
 * mutation of this external store: a component's render body must stay pure (React can replay or
 * discard a render before it commits), and that purity requirement applies to an external store
 * exactly the way it applies to component state — a null-guarded "run once" ref check is only a
 * supported exception for LOCAL ref values, not for mutating shared state outside React entirely.
 *
 * Marks the resolution finished immediately alongside the raw write, so the store's resolver
 * framework doesn't also auto-trigger `getDesignTokensFeed`'s REST fetch for a slug this already
 * has fresh data for.
 *
 * @param {Function} dispatch A `@wordpress/data` registry's `dispatch` (defaults to the default
 *                              registry's, for production; tests pass an isolated test registry's).
 *
 * @since TBD
 *
 * @return {void}
 */
export function seedDesignTokensFeed(dispatch = defaultDispatch) {
	const feed = readLocalizedFeed();

	if (!feed) {
		return;
	}

	const slug = feed.slug ?? DEFAULT_LIBRARY_SLUG;

	dispatch(STORE_NAME).receiveDesignTokensFeed(slug, feed);
	dispatch(STORE_NAME).finishResolution('getDesignTokensFeed', [slug]);
}

/**
 * Read and normalize the design-token feed from the store, with a way to refresh it in place.
 *
 * `slug` is the token library the feed's schema/values/version were actually resolved against — the
 * active library, not necessarily the default one (see `Admin\Feed\Localizer`). Every write this page
 * makes must target that same slug, or an edit lands in a document other than the one being shown.
 *
 * The first paint always reads the server-printed `window.kadenceDesignTokens` global rather than
 * fetching, exactly as before — `seedDesignTokensFeed()` above puts that same value into the store
 * before this hook ever renders, so a fetch is never issued for the slug the page already loaded
 * with. `refreshFeed` is the one path that always forces a fresh REST read through the store, for
 * after the active library changes, or after a write on the current library, without a page reload.
 *
 * @since TBD
 *
 * @return {{ feed: object|null, tokens: object[], isReady: boolean, isActive: boolean, isResolved: boolean, values: Record<string, string>, responsive: Record<string, object>, rest: object|null, version: string, slug: string, title: string, refreshFeed: Function }}
 */
export function useDesignTokensFeed() {
	const registry = useRegistry();

	// The lazy-initializer form of `useState` — called once, on mount, to compute a value — is a
	// supported exception to "no side effects during render" (unlike `seedDesignTokensFeed`'s own
	// dispatch, this reads the same static global rather than mutating anything).
	const [slug, setSlug] = useState(() => readLocalizedFeed()?.slug ?? DEFAULT_LIBRARY_SLUG);

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
