/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import {
	resolvedPath,
	tokenPath,
	userPrimitiveReferencesPath,
	userPrimitivesPath,
	userPrimitivePath,
	userPrimitiveRenamePath,
} from './paths';

/**
 * Configure apiFetch middleware from the localized REST descriptor.
 *
 * @since TBD
 *
 * @param {{ root: string, nonce: string }} rest REST descriptor from the feed.
 * @return {void}
 */
export function configureRestClient(rest) {
	if (!rest?.root || !rest?.nonce) {
		return;
	}

	apiFetch.use(apiFetch.createNonceMiddleware(rest.nonce));
	apiFetch.use(apiFetch.createRootURLMiddleware(rest.root));
}

/**
 * Fetch the resolved token value map.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
 * @return {Promise<{ by_id: Record<string, string>, responsive: Record<string, object>, version: string }>} Resolved payload.
 */
export function fetchResolvedTokens(namespace, slug) {
	return apiFetch({ path: resolvedPath(namespace, slug) });
}

/**
 * Persist a single token leaf via the REST API.
 *
 * @since TBD
 *
 * @param {string}               namespace REST namespace.
 * @param {string}               tokenId   Dot-path token id.
 * @param {{ $type?: string, $value: string }} leaf DTCG leaf payload.
 * @param {string}               slug      Token library slug.
 * @return {Promise<object>} Updated document item.
 */
export function saveTokenLeaf(namespace, tokenId, leaf, slug) {
	return apiFetch({
		path: tokenPath(namespace, tokenId, slug),
		method: 'PUT',
		data: leaf,
	});
}

/**
 * Fetch the alias-reference preview for a user primitive.
 *
 * @since TBD
 *
 * @param {string} slug Token library slug.
 * @param {string} id   Canonical dot-path id of the user primitive.
 * @return {Promise<{ id: string, label: string, version: string, deletable: boolean, references: object[] }>} Preview payload.
 */
export function fetchUserPrimitiveReferences(slug, id) {
	return apiFetch({ path: userPrimitiveReferencesPath(slug, id) });
}

/**
 * Create a new user-defined color primitive.
 *
 * @since TBD
 *
 * @param {string} slug    Token library slug.
 * @param {object} payload Request body including id, $type, $value, label, version.
 * @return {Promise<object>} Created document item with version.
 */
export function createUserPrimitive(slug, payload) {
	return apiFetch({
		path: userPrimitivesPath(slug),
		method: 'POST',
		data: payload,
	});
}

/**
 * Delete a user-defined primitive.
 *
 * @since TBD
 *
 * @param {string} slug    Token library slug.
 * @param {string} id      Canonical dot-path id of the user primitive.
 * @param {string} version Version token the client last read.
 * @return {Promise<object>} Delete result with version.
 */
export function deleteUserPrimitive(slug, id, version) {
	return apiFetch({
		path: userPrimitivePath(slug, id),
		method: 'DELETE',
		data: { version },
	});
}

/**
 * Rename a user-defined primitive.
 *
 * @since TBD
 *
 * @param {string} slug    Token library slug.
 * @param {string} id      Current canonical dot-path id.
 * @param {object} payload Request body including new_id, label, version.
 * @return {Promise<object>} Rename result with version and rewrittenPaths.
 */
export function renameUserPrimitive(slug, id, payload) {
	return apiFetch({
		path: userPrimitiveRenamePath(slug, id),
		method: 'POST',
		data: payload,
	});
}
