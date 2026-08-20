/**
 * The Style Library app's `@wordpress/data` store name, and the key builders every resolver/
 * selector in this store uses to address a specific resource instance.
 */

/**
 * The registered store name — visible in Redux DevTools and via
 * `wp.data.select('kadence-blocks/style-library')` in the browser console.
 *
 * @since TBD
 */
export const STORE_NAME = 'kadence-blocks/style-library';

/**
 * Build the state key for a block's preset collection.
 *
 * @param {string} namespace REST namespace.
 * @param {string} block     The block name, e.g. `kadence/singlebtn`.
 * @param {string} slug      Token library slug.
 *
 * @since TBD
 *
 * @return {string} The state key.
 */
export function presetsKey(namespace, block, slug) {
	return `${namespace}::${block}::${slug}`;
}
