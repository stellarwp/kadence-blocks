/**
 * REST client for the Design Tokens variants resource.
 *
 * Uses the editor's already-configured `@wordpress/api-fetch` (root + nonce), reading only the REST
 * namespace from the localized descriptor `window.kadenceDesignTokensRest`. Every call targets a specific
 * token set via the `set` parameter (query for reads/deletes, body for writes); an absent set lets the
 * server fall back to the active set.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { get } from 'lodash';
import { variantsBlockPath, variantItemPath, variantDefaultPath } from './paths';

/**
 * The localized REST descriptor, or an empty object when the design-token registry is inactive.
 *
 * @return {Object} The descriptor ({ root, namespace, nonce }).
 */
function descriptor() {
	return get(window, 'kadenceDesignTokensRest', {}) || {};
}

/**
 * The REST namespace the variant routes register under.
 *
 * @return {string} The namespace, e.g. "kb-design-tokens/v1".
 */
export function variantsNamespace() {
	return descriptor().namespace || 'kb-design-tokens/v1';
}

/**
 * Whether the editor has the REST descriptor needed to talk to the variants API. When false, the
 * "save as new variant" affordance is hidden.
 *
 * @return {boolean} True when the descriptor is present.
 */
export function hasVariantsRest() {
	return Boolean(descriptor().namespace);
}

/**
 * Read a block's effective variant set for a token set.
 *
 * @param {string} block The block name.
 * @param {string} [set] The token set slug; omitted targets the active set.
 * @return {Promise<Object>} The variant set payload ({ block, slug, version, default, variants }).
 */
export function getBlockVariants(block, set) {
	return apiFetch({
		path: addQueryArgs(variantsBlockPath(variantsNamespace(), block), set ? { set } : {}),
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
 * @return {Promise<Object>} The updated variant set payload.
 */
export function createVariant(block, { variant, label, tokens }, set) {
	return apiFetch({
		path: variantsBlockPath(variantsNamespace(), block),
		method: 'POST',
		data: { variant, label, tokens, ...(set ? { set } : {}) },
	});
}

/**
 * Set a block's default variant.
 *
 * @param {string} block          The block name.
 * @param {string} defaultVariant The variant slug to make default.
 * @param {string} [set]          The token set slug; omitted targets the active set.
 * @return {Promise<Object>} The updated variant set payload.
 */
export function setVariantDefault(block, defaultVariant, set) {
	return apiFetch({
		path: variantDefaultPath(variantsNamespace(), block),
		method: 'PUT',
		data: { default: defaultVariant, ...(set ? { set } : {}) },
	});
}

/**
 * Delete a single variant from a block's set.
 *
 * @param {string} block   The block name.
 * @param {string} variant The variant slug.
 * @param {string} [set]   The token set slug; omitted targets the active set.
 * @return {Promise<Object>} The updated variant set payload.
 */
export function deleteVariant(block, variant, set) {
	return apiFetch({
		path: addQueryArgs(variantItemPath(variantsNamespace(), block, variant), set ? { set } : {}),
		method: 'DELETE',
	});
}
