/**
 * REST client for the Design Tokens variants resource.
 *
 * Uses the editor's already-configured `@wordpress/api-fetch` (root + nonce), reading only the REST
 * namespace from the shared design-tokens descriptor. Every call targets a specific token set via the `set`
 * parameter and a specific variant set (axis) via the `variant_set` parameter (query for reads/deletes,
 * body for writes); an absent `set` falls back to the active token set, and an absent `variant_set` to the
 * block's sole named set.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { designTokensNamespace } from '../../design-tokens/rest';
import { variantsBlockPath, variantItemPath, variantDefaultPath } from './paths';

/**
 * The optional { set, variant_set } params, omitting each when empty so the server applies its defaults.
 *
 * @param {string} [set]        The token set slug.
 * @param {string} [variantSet] The variant set (axis) group slug.
 * @return {Object} The params object.
 */
function targetParams(set, variantSet) {
	return {
		...(set ? { set } : {}),
		...(variantSet ? { variant_set: variantSet } : {}),
	};
}

/**
 * Read a block's effective variant set for a token set.
 *
 * @param {string} block        The block name.
 * @param {string} [set]        The token set slug; omitted targets the active set.
 * @param {string} [variantSet] The variant set (axis) group slug; omitted targets the sole named set.
 * @return {Promise<Object>} The variant set payload ({ block, group, slug, version, default, variants }).
 */
export function getBlockVariants(block, set, variantSet) {
	return apiFetch({
		path: addQueryArgs(variantsBlockPath(designTokensNamespace(), block), targetParams(set, variantSet)),
	});
}

/**
 * Create or merge a single variant into a block's set.
 *
 * @param {string} block               The block name.
 * @param {Object} variant             The variant definition.
 * @param {string} variant.variant     The variant slug.
 * @param {string} [variant.label]     The variant label.
 * @param {Object} [variant.tokens]    The property => value token map.
 * @param {string} [set]               The token set slug; omitted targets the active set.
 * @param {string} [variantSet]        The variant set (axis) group slug; omitted targets the sole named set.
 * @return {Promise<Object>} The updated variant set payload.
 */
export function createVariant(block, { variant, label, tokens }, set, variantSet) {
	return apiFetch({
		path: variantsBlockPath(designTokensNamespace(), block),
		method: 'POST',
		data: { variant, label, tokens, ...targetParams(set, variantSet) },
	});
}

/**
 * Set a block set's default variant.
 *
 * @param {string} block          The block name.
 * @param {string} defaultVariant The variant slug to make default.
 * @param {string} [set]          The token set slug; omitted targets the active set.
 * @param {string} [variantSet]   The variant set (axis) group slug; omitted targets the sole named set.
 * @return {Promise<Object>} The updated variant set payload.
 */
export function setVariantDefault(block, defaultVariant, set, variantSet) {
	return apiFetch({
		path: variantDefaultPath(designTokensNamespace(), block),
		method: 'PUT',
		data: { default: defaultVariant, ...targetParams(set, variantSet) },
	});
}

/**
 * Delete a single variant from a block's set.
 *
 * @param {string} block        The block name.
 * @param {string} variant      The variant slug.
 * @param {string} [set]        The token set slug; omitted targets the active set.
 * @param {string} [variantSet] The variant set (axis) group slug; omitted targets the sole named set.
 * @return {Promise<Object>} The updated variant set payload.
 */
export function deleteVariant(block, variant, set, variantSet) {
	return apiFetch({
		path: addQueryArgs(variantItemPath(designTokensNamespace(), block, variant), targetParams(set, variantSet)),
		method: 'DELETE',
	});
}
