import { DEFAULT_TOKEN_SET_SLUG } from '../constants';

/**
 * Build a REST path for a token set document.
 *
 * @param {string} namespace REST namespace (e.g. kb-design-tokens/v1).
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function documentPath(namespace, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `/${namespace}/documents/${slug}`;
}

/**
 * Build a REST path for the resolved token map.
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
 * @param {string} namespace REST namespace.
 * @param {string} tokenId   Dot-path token id.
 * @param {string} slug      Token set slug.
 * @return {string} REST path relative to wp-json root.
 */
export function tokenPath(namespace, tokenId, slug = DEFAULT_TOKEN_SET_SLUG) {
	return `${documentPath(namespace, slug)}/tokens/${tokenId}`;
}
