/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { resolvedPath, tokenPath } from './paths';

/**
 * Configure apiFetch middleware from the localized REST descriptor.
 *
 * @param {{ root: string, nonce: string }} rest REST descriptor from the feed.
 * @return {void}
 */
export function configureRestClient( rest ) {
	if ( ! rest?.root || ! rest?.nonce ) {
		return;
	}

	apiFetch.use( apiFetch.createNonceMiddleware( rest.nonce ) );
	apiFetch.use( apiFetch.createRootURLMiddleware( rest.root ) );
}

/**
 * Fetch the resolved token value map.
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token set slug.
 * @return {Promise<{ by_id: Record<string, string>, version: string }>} Resolved payload.
 */
export function fetchResolvedTokens( namespace, slug ) {
	return apiFetch( { path: resolvedPath( namespace, slug ) } );
}

/**
 * Persist a single token leaf via the REST API.
 *
 * @param {string}               namespace REST namespace.
 * @param {string}               tokenId   Dot-path token id.
 * @param {{ $type?: string, $value: string }} leaf DTCG leaf payload.
 * @param {string}               slug      Token set slug.
 * @return {Promise<object>} Updated document item.
 */
export function saveTokenLeaf( namespace, tokenId, leaf, slug ) {
	return apiFetch( {
		path: tokenPath( namespace, tokenId, slug ),
		method: 'PUT',
		data: leaf,
	} );
}
