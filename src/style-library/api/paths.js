import { DEFAULT_LIBRARY_SLUG } from '../constants';

/**
 * Build a REST path for a token set document.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace (e.g. kb-design-tokens/v1).
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function documentPath(namespace, slug = DEFAULT_LIBRARY_SLUG) {
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
export function resolvedPath(namespace, slug = DEFAULT_LIBRARY_SLUG) {
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
export function tokenPath(namespace, tokenId, slug = DEFAULT_LIBRARY_SLUG) {
	return `${documentPath(namespace, slug)}/tokens/${tokenId}`;
}
