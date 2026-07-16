/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { configureRestClient } from '../api/client';
import { flattenSchemaTokens, getDesignTokensFeed } from '../helpers/tokens';
import { DEFAULT_TOKEN_SET_SLUG } from '../constants';

/**
 * Read and normalize the localized design-token feed.
 *
 * `slug` is the token set the feed's schema/values/version were actually resolved against — the
 * active set, not necessarily the default one (see `Admin\Feed\Localizer`). Every write this page
 * makes must target that same slug, or an edit lands in a document other than the one being shown.
 *
 * @return {{ feed: object|null, tokens: object[], isReady: boolean, isActive: boolean, isResolved: boolean, values: Record<string, string>, rest: object|null, version: string, slug: string }}
 */
export function useDesignTokensFeed() {
	const feed = useMemo(() => getDesignTokensFeed(), []);
	const tokens = useMemo(() => flattenSchemaTokens(feed?.schema), [feed]);

	useEffect(() => {
		if (feed?.rest) {
			configureRestClient(feed.rest);
		}
	}, [feed]);

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
		slug: feed?.slug ?? DEFAULT_TOKEN_SET_SLUG,
	};
}
