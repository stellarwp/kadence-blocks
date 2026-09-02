/**
 * REST path builders for the Design Tokens presets resource, editor side.
 *
 * A block name carries a slash ("kadence/singlebtn") and the route matches it as TWO segments (see
 * `Presets_Controller::BLOCK_ROUTE`), so vendor and name are encoded separately — the "/" between them
 * is a real path separator and must survive, while anything else in either segment must not.
 *
 * The Style Library admin app builds the same routes in `src/style-library/api/paths.js`. The two are
 * deliberately separate files rather than one shared module: `src/style-library/README.md` records that
 * the admin app and the editor share `src/token-controls/*` and nothing else. They must nonetheless agree
 * on the path shape — change one and change the other. The only intended difference is that the admin
 * app's builders append the `?library=<slug>` query the Style Library always scopes its writes by.
 */

/**
 * The shared `/presets/{vendor}/{name}` segment of a block's preset routes.
 *
 * @param {string} namespace The REST namespace, e.g. "kb-design-tokens/v1".
 * @param {string} block     The block name, e.g. "kadence/singlebtn".
 *
 * @since TBD
 *
 * @return {string} The REST path relative to the wp-json root.
 */
function blockBasePath(namespace, block) {
	const [vendor, name] = block.split('/');

	return `/${namespace}/presets/${encodeURIComponent(vendor)}/${encodeURIComponent(name)}`;
}

/**
 * The path for a block's preset collection (GET list / POST create-or-merge / PUT replace / DELETE reset).
 *
 * @param {string} namespace The REST namespace, e.g. "kb-design-tokens/v1".
 * @param {string} block     The block name, e.g. "kadence/singlebtn".
 * @return {string} The REST path relative to the wp-json root.
 */
export function presetsBlockPath(namespace, block) {
	return blockBasePath(namespace, block);
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
	return `${blockBasePath(namespace, block)}/${encodeURIComponent(preset)}`;
}

/**
 * The path for a block's default preset sub-route (GET / PUT the default).
 *
 * @param {string} namespace The REST namespace.
 * @param {string} block     The block name.
 * @return {string} The REST path relative to the wp-json root.
 */
export function presetDefaultPath(namespace, block) {
	return `${blockBasePath(namespace, block)}/default`;
}
