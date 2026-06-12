/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { configureRestClient } from '../api/client';
import { flattenSchemaTokens, getDesignTokensFeed } from '../helpers/tokens';

/**
 * Read and normalize the localized design-token feed.
 *
 * @return {{ feed: object|null, tokens: object[], isReady: boolean, isActive: boolean }}
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
		rest: feed?.rest ?? null,
		version: feed?.version ?? '',
	};
}
