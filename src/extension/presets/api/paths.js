/**
 * REST path builders for the Design Tokens presets resource.
 *
 * The block name carries a slash ("kadence/advancedbtn") and is routed as two path segments, so it is
 * interpolated verbatim into the path.
 */

/**
 * The path for a block's preset set (GET list / POST create-or-merge / PUT replace / DELETE reset).
 *
 * @param {string} namespace The REST namespace, e.g. "kb-design-tokens/v1".
 * @param {string} block     The block name, e.g. "kadence/advancedbtn".
 * @return {string} The REST path relative to the wp-json root.
 */
export function presetsBlockPath(namespace, block) {
	return `/${namespace}/presets/${block}`;
}

/**
 * The path for a single preset (DELETE one preset).
 *
 * @param {string} namespace The REST namespace.
 * @param {string} block     The block name.
 * @param {string} preset    The preset slug.
 * @return {string} The REST path relative to the wp-json root.
 */
export function presetItemPath(namespace, block, preset) {
	return `/${namespace}/presets/${block}/${preset}`;
}

/**
 * The path for a block's default preset sub-route (GET / PUT the default).
 *
 * @param {string} namespace The REST namespace.
 * @param {string} block     The block name.
 * @return {string} The REST path relative to the wp-json root.
 */
export function presetDefaultPath(namespace, block) {
	return `/${namespace}/presets/${block}/default`;
}
