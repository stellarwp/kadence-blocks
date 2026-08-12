/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { configureRestClient, fetchDesignTokensFeed } from '../api/client';
import { flattenSchemaTokens, getDesignTokensFeed, refreshFeedFlow } from '../helpers/tokens';
import { DEFAULT_LIBRARY_SLUG } from '../constants';

/**
 * Read and normalize the localized design-token feed, with a way to refresh it in place.
 *
 * `slug` is the token library the feed's schema/values/version were actually resolved against — the
 * active library, not necessarily the default one (see `Admin\Feed\Localizer`). Every write this page
 * makes must target that same slug, or an edit lands in a document other than the one being shown.
 *
 * The first paint always reads the server-printed `window.kadenceDesignTokens` global rather than
 * fetching — a fetch-on-mount would regress startup and reintroduce a flash of default content
 * before the real feed arrives. `refreshFeed` is the one path that replaces the feed with a fresh
 * REST read, for after the active library changes without a page reload (see `hooks/use-libraries`).
 *
 * @since TBD
 *
 * @return {{ feed: object|null, tokens: object[], isReady: boolean, isActive: boolean, isResolved: boolean, values: Record<string, string>, responsive: Record<string, object>, rest: object|null, version: string, slug: string, title: string, refreshFeed: Function }}
 */
export function useDesignTokensFeed() {
	const [feed, setFeed] = useState(() => getDesignTokensFeed());
	const tokens = useMemo(() => flattenSchemaTokens(feed?.schema), [feed]);

	useEffect(() => {
		if (feed?.rest) {
			configureRestClient(feed.rest);
		}
	}, [feed]);

	/**
	 * Replace the feed with a fresh REST read for the given library, so every consumer re-renders
	 * against the newly active library without a page reload.
	 *
	 * @param {string} slug The token library slug to read the feed for.
	 *
	 * @since TBD
	 *
	 * @return {Promise<object>} The fresh feed payload.
	 */
	const refreshFeed = useCallback((slug) => refreshFeedFlow(slug, setFeed, fetchDesignTokensFeed), []);

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
