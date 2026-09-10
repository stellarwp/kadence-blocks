/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
	documentPath,
	documentsPath,
	libraryTitlePath,
	activeLibraryPath,
	activateLibraryPath,
	resolvedPath,
	tokenPath,
	tokenLabelPath,
	groupOrderPath,
	favoriteFontPath,
	userPrimitiveReferencesPath,
	userPrimitivesPath,
	userPrimitivePath,
	userPrimitiveRenamePath,
	palettesPath,
	palettePath,
	paletteSwatchPath,
	paletteCurrentPath,
	feedPath,
	blockPresetsPath,
	blockPresetPath,
	blockPresetOrderPath,
} from './paths';
import { DEFAULT_LIBRARY_SLUG } from '../constants';

/**
 * The fixed REST namespace this module's endpoints live under. The library-management calls
 * address the module's own routes only, unlike the token/palette calls above which take a
 * namespace parameter for reuse from other consumers.
 *
 * @since TBD
 */
const NAMESPACE = 'kb-design-tokens/v1';

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
 * Set or clear a token's display-label override.
 *
 * @since TBD
 *
 * @param {string}                             slug    Token library slug.
 * @param {string}                             id      The token id (baseline dot-path, or a user
 *                                                       primitive's canonical id).
 * @param {{ label: string, version: string }} payload Request body.
 * @return {Promise<object>} Updated document item.
 */
export function setTokenLabel(slug, id, payload) {
	return apiFetch({
		path: tokenLabelPath(slug, id),
		method: 'PUT',
		data: payload,
	});
}

/**
 * Persist a UI-schema group's full sort order.
 *
 * @since TBD
 *
 * @param {string}                                       slug    Token library slug.
 * @param {string}                                        group   The UI-schema group label.
 * @param {{ order: string[], version: string }}          payload Request body.
 * @return {Promise<object>} Updated document item.
 */
export function setGroupOrder(slug, group, payload) {
	return apiFetch({
		path: groupOrderPath(slug, group),
		method: 'PUT',
		data: payload,
	});
}

/**
 * Add a font family to the library's favorites.
 *
 * @param {string}                  slug    Token library slug.
 * @param {string}                  family  The font family name.
 * @param {{ version: string }}     payload Request body.
 *
 * @since TBD
 *
 * @return {Promise<object>} Updated document item.
 */
export function addFavoriteFont(slug, family, payload) {
	return apiFetch({
		path: favoriteFontPath(slug, family),
		method: 'PUT',
		data: payload,
	});
}

/**
 * Remove a font family from the library's favorites.
 *
 * @param {string}              slug    Token library slug.
 * @param {string}              family  The font family name.
 * @param {{ version: string }} payload Request body.
 *
 * @since TBD
 *
 * @return {Promise<object>} Updated document item.
 */
export function removeFavoriteFont(slug, family, payload) {
	return apiFetch({
		path: favoriteFontPath(slug, family),
		method: 'DELETE',
		data: payload,
	});
}

/**
 * Fetch the library's palettes: a flat row per palette carrying its id, label, and `is_default` /
 * `is_current` / `user_created` flags, each embedded (via `_embed`) with its full group/swatch data.
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token set slug.
 *
 * @since TBD
 *
 * @return {Promise<object[]>} Flat, fully embedded palette listing.
 */
export function fetchPalettes(namespace, slug) {
	return apiFetch({ path: addQueryArgs(palettesPath(namespace, slug), { _embed: true }) });
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
 * @return {Promise<Array<{ id: string, label: string, is_default: boolean, is_current: boolean, user_created: boolean, _embedded: object }>>} The fresh, fully embedded palette listing.
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
 * Set one or both fields of a single palette swatch (the granular per-token write): only the sent
 * fields are changed, the palette's other swatches are untouched. `label` is only valid when `id`
 * is the library's default palette — the server rejects it otherwise.
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {string} token     The swatch token dot-path.
 * @param {{value?: string, label?: string}} fields At least one of `value`/`label`.
 * @param {string} slug      Token set slug.
 *
 * @since TBD
 *
 * @return {Promise<object>} The fresh, fully embedded palette listing.
 */
export function saveSwatch(namespace, id, token, fields, slug) {
	const data = {};

	if (fields.value !== undefined) {
		data.$value = fields.value;
	}

	if (fields.label !== undefined) {
		data.label = fields.label;
	}

	return apiFetch({
		path: paletteSwatchPath(namespace, id, token, slug),
		method: 'PUT',
		data,
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
 * Delete a palette. A palette the shipped baseline defines — the library's default among them — is
 * not removed: the request drops its overrides and it stays in the listing under its baseline
 * colors, which is what the UI offers as a Reset. The response is the fresh palette listing either
 * way.
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {string} slug      Token set slug.
 *
 * @since TBD
 *
 * @return {Promise<object>} The updated palette listing.
 */
export function deletePalette(namespace, id, slug) {
	return apiFetch({ path: palettePath(namespace, id, slug), method: 'DELETE' });
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

/**
 * List every stored token library. The default library is always present even before it has a
 * row (it renders from baseline). `title` is the empty string for a library that was never given
 * one — never the slug or another synthesized value — so a caller that wants a display label
 * falls back to the slug itself.
 *
 * @since TBD
 *
 * @return {Promise<Array<{slug: string, title: string, version: string, document: object}>>} The library rows.
 */
export function fetchLibraries() {
	return apiFetch({ path: documentsPath() });
}

/**
 * Read the active-library pointer.
 *
 * @since TBD
 *
 * @return {Promise<{slug: string}>} The resolved active slug.
 */
export function getActiveLibrary() {
	return apiFetch({ path: activeLibraryPath() });
}

/**
 * Point the active-library pointer at a named library.
 *
 * @param {string} slug Token library slug to make active.
 *
 * @since TBD
 *
 * @return {Promise<{slug: string}>} The resolved active slug.
 */
export function setActiveLibrary(slug) {
	return apiFetch({ path: activateLibraryPath(slug), method: 'PUT' });
}

/**
 * Create a token library, or merge into it if one already exists at that slug. Sends an empty
 * document so the library starts from baseline with only the given title stored.
 *
 * @param {string} slug  Token library slug.
 * @param {string} title Human-readable label for the library.
 *
 * @since TBD
 *
 * @return {Promise<{slug: string, version: string, document: object}>} The created document item.
 */
export function createLibrary(slug, title) {
	return apiFetch({
		path: documentPath(NAMESPACE, slug || DEFAULT_LIBRARY_SLUG),
		method: 'POST',
		data: { document: {}, title },
	});
}

/**
 * Rename a token library. Only its human-readable title changes; the slug is the library's
 * identity (the active-library pointer stores it, every document/palette/token route addresses by
 * it) and is never rewritten.
 *
 * Addresses the dedicated title endpoint rather than sending a title alongside an empty document
 * to a document route. Those routes merge and then re-validate the whole stored document, so a
 * rename through one fails for any library whose document does not currently validate — for
 * reasons that have nothing to do with the new name. This route touches the label alone, so it
 * cannot fail on the document's contents and does not bump the library's version.
 *
 * The server rejects an empty title rather than reading it as "leave the stored one alone", so a
 * blank rename reports a real error instead of silently doing nothing.
 *
 * @param {string} slug  Token library slug.
 * @param {string} title The new human-readable label.
 *
 * @since TBD
 *
 * @return {Promise<{slug: string, title: string, version: string, document: object}>} The updated document item.
 */
export function renameLibrary(slug, title) {
	return apiFetch({
		path: libraryTitlePath(NAMESPACE, slug),
		method: 'PUT',
		data: { title },
	});
}

/**
 * Delete a token library. Deleting the default library resets it to baseline instead of removing
 * it — the same endpoint serves both, the server decides which behavior applies.
 *
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {Promise<{deleted: boolean, previous: object}>} The delete result.
 */
export function deleteLibrary(slug) {
	return apiFetch({ path: documentPath(NAMESPACE, slug), method: 'DELETE' });
}

/**
 * Fetch a block's effective (baseline-merged) preset collection.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} block     The block name, e.g. `kadence/singlebtn`.
 * @param {string} slug      Token library slug.
 * @return {Promise<{block: string, slug: string, version: string, default: string, userCreated: string[], presets: Record<string, {label?: string, tokens: Record<string, string>}>}>} The block's preset collection.
 */
export function fetchBlockPresets(namespace, block, slug) {
	return apiFetch({ path: blockPresetsPath(namespace, block, slug) });
}

/**
 * Create a preset, or merge onto an existing one. The write is a deep merge into the stored preset:
 * sibling presets and `$default` are left intact, and omitting `tokens` preserves the stored token
 * map (a rename). There is deliberately no PUT wrapper — the PUT route replaces the block's whole
 * preset collection and silently drops any preset the body omits, which would be a data-loss trap
 * for a single-preset save.
 *
 * @since TBD
 *
 * @param {string}                                          namespace REST namespace.
 * @param {string}                                          block     The block name, e.g. `kadence/singlebtn`.
 * @param {{preset: string, label?: string, tokens?: Record<string, string>}} payload The preset slug, optional label, and optional token map.
 * @param {string}                                          slug      Token library slug.
 * @return {Promise<object>} The updated preset collection.
 */
export function saveBlockPreset(namespace, block, payload, slug) {
	return apiFetch({
		path: blockPresetsPath(namespace, block, slug),
		method: 'POST',
		data: payload,
	});
}

/**
 * Delete a preset. A preset that also exists in the baseline reverts to its baseline definition
 * rather than disappearing.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} block     The block name, e.g. `kadence/singlebtn`.
 * @param {string} preset    The preset slug.
 * @param {string} slug      Token library slug.
 * @return {Promise<object>} The updated preset collection.
 */
export function deleteBlockPreset(namespace, block, preset, slug) {
	return apiFetch({
		path: blockPresetPath(namespace, block, preset, slug),
		method: 'DELETE',
	});
}

/**
 * Persist a block's full preset display order.
 *
 * @since TBD
 *
 * @param {string}                                 namespace REST namespace.
 * @param {string}                                 block     The block name, e.g. `kadence/singlebtn`.
 * @param {{ order: string[], version: string }}    payload   Request body.
 * @param {string}                                 slug      Token library slug.
 * @return {Promise<object>} The updated preset collection.
 */
export function setBlockPresetOrder(namespace, block, payload, slug) {
	return apiFetch({
		path: blockPresetOrderPath(namespace, block, slug),
		method: 'PUT',
		data: payload,
	});
}

/**
 * Fetch the admin UI schema feed for a single library — the same payload shape the page-load
 * Localizer prints as `window.kadenceDesignTokens`. Used to refresh the app in place after the
 * active library changes, instead of reloading the page.
 *
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {Promise<object>} The feed payload.
 */
export function fetchDesignTokensFeed(slug) {
	return apiFetch({ path: feedPath(slug) });
}
