import { DEFAULT_LIBRARY_SLUG } from '../constants';

/**
 * Build a REST path for a token library document.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace (e.g. kb-design-tokens/v1).
 * @param {string} slug      Token library slug.
 * @return {string} REST path relative to wp-json root.
 */
export function documentPath(namespace, slug = DEFAULT_LIBRARY_SLUG) {
	return `/${namespace}/documents/${slug}`;
}

/**
 * Build a REST path for a token library's human-readable label.
 *
 * Its own endpoint, separate from the document routes: a rename writes the label alone and never
 * validates, resolves or rewrites the stored document.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace (e.g. kb-design-tokens/v1).
 * @param {string} slug      Token library slug.
 * @return {string} REST path relative to wp-json root.
 */
export function libraryTitlePath(namespace, slug = DEFAULT_LIBRARY_SLUG) {
	return `${documentPath(namespace, slug)}/title`;
}

/**
 * Build a REST path for the user-primitives collection of a document.
 *
 * @since TBD
 *
 * @param {string} slug Token library slug.
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
 * @param {string} slug Token library slug.
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
 * @param {string} slug Token library slug.
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
 * @param {string} slug Token library slug.
 * @param {string} id   Canonical dot-path id of the user primitive.
 * @return {string} REST path relative to wp-json root.
 */
export function userPrimitiveRenamePath(slug, id) {
	return `${userPrimitivePath(slug, id)}/rename`;
}

/**
 * Build a REST path for a token's display-label override.
 *
 * @since TBD
 *
 * @param {string} slug Token library slug.
 * @param {string} id   The token id (baseline dot-path, or a user primitive's canonical id).
 * @return {string} REST path relative to wp-json root.
 */
export function tokenLabelPath(slug, id) {
	return `/kb-design-tokens/v1/documents/${encodeURIComponent(slug)}/labels/${encodeURIComponent(id)}`;
}

/**
 * Build a REST path for a UI-schema group's stored sort order. `group` is the translated feed
 * group label (e.g. "Border Radius") — encoded because it contains a space.
 *
 * @since TBD
 *
 * @param {string} slug  Token library slug.
 * @param {string} group The UI-schema group label.
 * @return {string} REST path relative to wp-json root.
 */
export function groupOrderPath(slug, group) {
	return `/kb-design-tokens/v1/documents/${encodeURIComponent(slug)}/order/${encodeURIComponent(group)}`;
}

/**
 * Build a REST path for the resolved token map.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
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
 * @param {string} slug      Token library slug.
 * @return {string} REST path relative to wp-json root.
 */
export function tokenPath(namespace, tokenId, slug = DEFAULT_LIBRARY_SLUG) {
	return `${documentPath(namespace, slug)}/tokens/${tokenId}`;
}

/**
 * Build a REST path for the token-library documents collection (list, or create-by-merge at the
 * default library).
 *
 * @since TBD
 *
 * @return {string} REST path relative to wp-json root.
 */
export function documentsPath() {
	return '/kb-design-tokens/v1/documents';
}

/**
 * Build a REST path for the active-library pointer.
 *
 * @since TBD
 *
 * @return {string} REST path relative to wp-json root.
 */
export function activeLibraryPath() {
	return '/kb-design-tokens/v1/active-library';
}

/**
 * Build a REST path for the admin UI schema feed of a single library — the same payload shape
 * the page-load Localizer prints as `window.kadenceDesignTokens`, addressable per slug so the
 * app can refresh it in place after switching the active library.
 *
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {string} REST path relative to wp-json root.
 */
export function feedPath(slug) {
	return `/kb-design-tokens/v1/feed/${encodeURIComponent(slug)}`;
}

/**
 * Build a REST path for the action that activates a library.
 *
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {string} REST path relative to wp-json root.
 */
export function activateLibraryPath(slug) {
	return `/kb-design-tokens/v1/active-library/${encodeURIComponent(slug)}`;
}

/**
 * Build a REST path for the color-palettes collection of a library.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
 * @return {string} REST path relative to wp-json root.
 */
export function palettesPath(namespace, slug = DEFAULT_LIBRARY_SLUG) {
	return `/${namespace}/palettes?library=${encodeURIComponent(slug)}`;
}

/**
 * Build a REST path for a single palette resource.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} id        The palette id.
 * @param {string} slug      Token library slug.
 * @return {string} REST path relative to wp-json root.
 */
export function palettePath(namespace, id, slug = DEFAULT_LIBRARY_SLUG) {
	return `/${namespace}/palettes/${encodeURIComponent(id)}?library=${encodeURIComponent(slug)}`;
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
 * @param {string} slug      Token library slug.
 * @return {string} REST path relative to wp-json root.
 */
export function paletteSwatchPath(namespace, id, token, slug = DEFAULT_LIBRARY_SLUG) {
	return `/${namespace}/palettes/${encodeURIComponent(id)}/swatches/${encodeURIComponent(token)}?library=${encodeURIComponent(slug)}`;
}

/**
 * Build a REST path for the library's current-palette pointer.
 *
 * @since TBD
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
 * @return {string} REST path relative to wp-json root.
 */
export function paletteCurrentPath(namespace, slug = DEFAULT_LIBRARY_SLUG) {
	return `/${namespace}/palettes/current?library=${encodeURIComponent(slug)}`;
}
