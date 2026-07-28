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
	palettesPath,
	palettePath,
	paletteSwatchPath,
	paletteCurrentPath,
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
 * @param {string} slug      Token set slug.
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
 * @param {string}               slug      Token set slug.
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
 * Fetch the set's color palettes and its `$default` / `$current` pointers.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token set slug.
 * @return {Promise<{ '$default': string, '$current': string, palettes: object[] }>} Palette listing.
 */
export function fetchPalettes(namespace, slug) {
	return apiFetch({ path: palettesPath(namespace, slug) });
}

/**
 * Fetch a single palette node (its label and ordered groups of swatches).
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {string} slug      Token set slug.
 * @return {Promise<{ id: string, label: string, groups: object[] }>} The palette node.
 */
export function fetchPalette(namespace, id, slug) {
	return apiFetch({ path: palettePath(namespace, id, slug) });
}

/**
 * Set the set's current palette.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id to make current.
 * @param {string} slug      Token set slug.
 * @return {Promise<{ current: string }>} The resolved current palette.
 */
export function setCurrentPalette(namespace, id, slug) {
	return apiFetch({
		path: paletteCurrentPath(namespace, slug),
		method: 'PUT',
		data: { current: id },
	});
}

/**
 * Create or replace a palette (label + ordered groups of swatches).
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {{ label: string, groups: object[] }} payload The palette payload.
 * @param {string} slug      Token set slug.
 * @return {Promise<object>} The updated palette listing.
 */
export function savePalette(namespace, id, payload, slug) {
	return apiFetch({
		path: palettePath(namespace, id, slug),
		method: 'PUT',
		data: payload,
	});
}

/**
 * Set a single palette swatch (the granular per-token write): only this token is sent, and the palette's
 * other swatches are untouched. A token the palette does not set falls back to the default palette.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {string} token     The swatch token dot-path.
 * @param {string} value     The color value (a literal color or a {dot.path} alias).
 * @param {string} slug      Token set slug.
 * @return {Promise<object>} The updated palette listing.
 */
export function saveSwatch(namespace, id, token, value, slug) {
	return apiFetch({
		path: paletteSwatchPath(namespace, id, token, slug),
		method: 'PUT',
		data: { $value: value },
	});
}

/**
 * Revert a single palette swatch to inherited (the granular per-token delete): drop the palette's own value
 * for this token so it falls back to the default palette.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {string} token     The swatch token dot-path.
 * @param {string} slug      Token set slug.
 * @return {Promise<object>} The updated palette listing.
 */
export function deleteSwatch(namespace, id, token, slug) {
	return apiFetch({
		path: paletteSwatchPath(namespace, id, token, slug),
		method: 'DELETE',
	});
}

/**
 * Fetch the alias-reference preview for a user primitive.
 *
 * @since TBD
 *
 * @param {string} slug Token set slug.
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
 * @param {string} slug    Token set slug.
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
 * @param {string} slug    Token set slug.
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
 * @param {string} slug    Token set slug.
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
