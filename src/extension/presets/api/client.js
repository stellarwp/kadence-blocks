/**
 * REST client for the Design Tokens presets resource.
 *
 * Uses the editor's already-configured `@wordpress/api-fetch` (root + nonce), reading only the REST
 * namespace from the shared design-tokens descriptor. Every call targets a specific token set via the `set`
 * parameter (query for reads/deletes, body for writes); an absent `set` falls back to the active token set.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { designTokensNamespace } from '../../design-tokens/rest';
import { presetsBlockPath, presetItemPath, presetDefaultPath } from './paths';

/**
 * The optional { set } param, omitted when empty so the server applies its default (the active set).
 *
 * @param {string} [set] The token set slug.
 * @return {Object} The params object.
 */
function targetParams(set) {
	return {
		...(set ? { set } : {}),
	};
}

/**
 * Read a block's effective preset set for a token set.
 *
 * @param {string} block The block name.
 * @param {string} [set] The token set slug; omitted targets the active set.
 * @return {Promise<Object>} The preset set payload ({ block, slug, version, default, presets }).
 */
export function getBlockPresets(block, set) {
	return apiFetch({
		path: addQueryArgs(presetsBlockPath(designTokensNamespace(), block), targetParams(set)),
	});
}

/**
 * Create or merge a single preset into a block's set.
 *
 * @param {string} block           The block name.
 * @param {Object} preset          The preset definition.
 * @param {string} preset.preset   The preset slug.
 * @param {string} [preset.label]  The preset label.
 * @param {Object} [preset.tokens] The property => value token map.
 * @param {string} [set]           The token set slug; omitted targets the active set.
 * @return {Promise<Object>} The updated preset set payload.
 */
export function createPreset(block, { preset, label, tokens }, set) {
	return apiFetch({
		path: presetsBlockPath(designTokensNamespace(), block),
		method: 'POST',
		data: { preset, label, tokens, ...targetParams(set) },
	});
}

/**
 * Set a block set's default preset.
 *
 * @param {string} block         The block name.
 * @param {string} defaultPreset The preset slug to make default.
 * @param {string} [set]         The token set slug; omitted targets the active set.
 * @return {Promise<Object>} The updated preset set payload.
 */
export function setPresetDefault(block, defaultPreset, set) {
	return apiFetch({
		path: presetDefaultPath(designTokensNamespace(), block),
		method: 'PUT',
		data: { default: defaultPreset, ...targetParams(set) },
	});
}

/**
 * Delete a single preset from a block's set.
 *
 * @param {string} block  The block name.
 * @param {string} preset The preset slug.
 * @param {string} [set]  The token set slug; omitted targets the active set.
 * @return {Promise<Object>} The updated preset set payload.
 */
export function deletePreset(block, preset, set) {
	return apiFetch({
		path: addQueryArgs(presetItemPath(designTokensNamespace(), block, preset), targetParams(set)),
		method: 'DELETE',
	});
}
