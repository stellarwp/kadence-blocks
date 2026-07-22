/**
 * Wire design-token alias resolution into the `@kadence/helpers` output-filter seam.
 *
 * The shared helper library is token-agnostic: `KadenceColorOutput`, the border/dimension helpers and
 * `KadenceBlocksCSS` run their value through `kadence.helpers.colorValue` / `kadence.helpers.dimensionValue`
 * filters. Here Kadence Blocks registers a listener on both that resolves a `{dot.alias}` to its
 * `var(--kb-token--<id>)` reference and passes every other value through untouched — so the token
 * knowledge lives only in this plugin, and the change is strictly additive.
 */
import { addFilter, removeFilter } from '@wordpress/hooks';
import { isTokenAlias, resolveTokenAlias } from './alias';

const NAMESPACE = 'kadence-blocks/token-alias';
const HOOKS = ['kadence.helpers.colorValue', 'kadence.helpers.dimensionValue'];

/**
 * Resolve a helper value: a design-token alias becomes its CSS var, anything else is unchanged.
 *
 * @param {*} value The raw value the helper received.
 * @return {*} The resolved value.
 */
function resolveAlias(value) {
	return isTokenAlias(value) ? resolveTokenAlias(value) : value;
}

/**
 * Register the alias-resolution listeners on the helper output filters.
 *
 * Idempotent: it removes any prior listener under this namespace before adding, so it is safe to call
 * more than once (e.g. editor init plus a test's setup).
 *
 * @return {void}
 */
export function registerTokenAliasFilters() {
	HOOKS.forEach((hook) => {
		removeFilter(hook, NAMESPACE);
		addFilter(hook, NAMESPACE, resolveAlias);
	});
}
