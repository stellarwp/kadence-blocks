import { DEFAULT_TOKEN_SET_SLUG } from '../constants';

/**
 * Build a REST path for a token set document.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace (e.g. kb-design-tokens/v1).
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function documentPath(namespace, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `/${namespace}/documents/${slug}`;
}

/**
 * Build a REST path for the user-primitives collection of a document.
 *
 * @since TBD
 *
 * @param {string} slug Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function userPrimitivesPath(slug) {
	return `/kb-design-tokens/v1/documents/${encodeURIComponent(slug)}/user-primitives`;
}

/**
 * Build a REST path for the references preview of a single user primitive.
 *
 * @since TBD
 *
 * @param {string} slug Token set slug.
 * @param {string} id   Canonical dot-path id of the user primitive.
 * @return {string} REST path relative to wp-json root.
 */
export function userPrimitiveReferencesPath(slug, id) {
	return `${userPrimitivesPath(slug)}/${encodeURIComponent(id)}/references`;
}

/**
 * Build a REST path for a single user primitive resource.
 *
 * @since TBD
 *
 * @param {string} slug Token set slug.
 * @param {string} id   Canonical dot-path id of the user primitive.
 * @return {string} REST path relative to wp-json root.
 */
export function userPrimitivePath(slug, id) {
	return `${userPrimitivesPath(slug)}/${encodeURIComponent(id)}`;
}

/**
 * Build a REST path for the rename action on a single user primitive.
 *
 * @since TBD
 *
 * @param {string} slug Token set slug.
 * @param {string} id   Canonical dot-path id of the user primitive.
 * @return {string} REST path relative to wp-json root.
 */
export function userPrimitiveRenamePath(slug, id) {
	return `${userPrimitivePath(slug, id)}/rename`;
}

/**
 * Build a REST path for the resolved token map.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function resolvedPath(namespace, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `${documentPath(namespace, slug)}/resolved`;
}

/**
 * Build a REST path for a single token leaf write.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} tokenId   Dot-path token id.
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function tokenPath(namespace, tokenId, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `${documentPath(namespace, slug)}/tokens/${tokenId}`;
}

/**
 * Build a REST path for the color-palettes collection of a set.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function palettesPath(namespace, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `/${namespace}/palettes?set=${encodeURIComponent(slug)}`;
}

/**
 * Build a REST path for a single palette resource.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function palettePath(namespace, id, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `/${namespace}/palettes/${encodeURIComponent(id)}?set=${encodeURIComponent(slug)}`;
}

/**
 * Build a REST path for a single palette swatch (the granular per-token write). encodeURIComponent leaves the
 * dots of a token dot-path intact, so the token stays a readable path segment.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {string} token     The swatch token dot-path.
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function paletteSwatchPath(namespace, id, token, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `/${namespace}/palettes/${encodeURIComponent(id)}/swatches/${encodeURIComponent(token)}?set=${encodeURIComponent(slug)}`;
}

/**
 * Build a REST path for the set's current-palette pointer.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function paletteCurrentPath(namespace, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `/${namespace}/palettes/current?set=${encodeURIComponent(slug)}`;
}
