/**
 * REST path builders for the Design Tokens variants resource.
 *
 * The block name carries a slash ("kadence/advancedbtn") and is routed as two path segments, so it is
 * interpolated verbatim into the path.
 */

/**
 * The path for a block's variant set (GET list / POST create-or-merge / PUT replace / DELETE reset).
 *
 * @param {string} namespace The REST namespace, e.g. "kb-design-tokens/v1".
 * @param {string} block     The block name, e.g. "kadence/advancedbtn".
 * @return {string} The REST path relative to the wp-json root.
 */
export function variantsBlockPath(namespace, block) {
	return `/${namespace}/variants/${block}`;
}

/**
 * The path for a single variant (DELETE one variant).
 *
 * @param {string} namespace The REST namespace.
 * @param {string} block     The block name.
 * @param {string} variant   The variant slug.
 * @return {string} The REST path relative to the wp-json root.
 */
export function variantItemPath(namespace, block, variant) {
	return `/${namespace}/variants/${block}/${variant}`;
}

/**
 * The path for a block's default variant sub-route (GET / PUT the default).
 *
 * @param {string} namespace The REST namespace.
 * @param {string} block     The block name.
 * @return {string} The REST path relative to the wp-json root.
 */
export function variantDefaultPath(namespace, block) {
	return `/${namespace}/variants/${block}/default`;
}
