/**
 * REST client for the Design Tokens presets resource.
 *
 * Uses the editor's already-configured `@wordpress/api-fetch` (root + nonce), reading only the REST
 * namespace from the shared design-tokens descriptor. Every call targets a specific token library via the
 * `library` parameter (query for reads/deletes, body for writes); an absent `library` falls back to the
 * active token library.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { designTokensNamespace } from '../../design-tokens/rest';
import { presetsBlockPath, presetItemPath, presetDefaultPath } from './paths';

/**
 * The optional { library } param, omitted when empty so the server applies its default (the active library).
 *
 * @param {string} [library] The token library slug.
 * @return {Object} The params object.
 */
function targetParams(library) {
	return {
		...(library ? { library } : {}),
	};
}

/**
 * Read a block's effective preset collection for a token library.
 *
 * @param {string} block The block name.
 * @param {string} [library] The token library slug; omitted targets the active library.
 * @return {Promise<Object>} The preset collection payload ({ block, slug, version, default, presets }).
 */
export function getBlockPresets(block, library) {
	return apiFetch({
		path: addQueryArgs(presetsBlockPath(designTokensNamespace(), block), targetParams(library)),
	});
}

/**
 * Create or merge a single preset into a block's library.
 *
 * @param {string} block           The block name.
 * @param {Object} preset          The preset definition.
 * @param {string} preset.preset   The preset slug.
 * @param {string} [preset.label]  The preset label.
 * @param {Object} [preset.tokens] The property => value token map.
 * @param {string} [library]       The token library slug; omitted targets the active library.
 * @return {Promise<Object>} The updated preset collection payload.
 */
export function createPreset(block, { preset, label, tokens }, library) {
	return apiFetch({
		path: presetsBlockPath(designTokensNamespace(), block),
		method: 'POST',
		data: { preset, label, tokens, ...targetParams(library) },
	});
}

/**
 * Set a block library's default preset.
 *
 * @param {string} block         The block name.
 * @param {string} defaultPreset The preset slug to make default.
 * @param {string} [library]     The token library slug; omitted targets the active library.
 * @return {Promise<Object>} The updated preset collection payload.
 */
export function setPresetDefault(block, defaultPreset, library) {
	return apiFetch({
		path: presetDefaultPath(designTokensNamespace(), block),
		method: 'PUT',
		data: { default: defaultPreset, ...targetParams(library) },
	});
}

/**
 * Delete a single preset from a block's library.
 *
 * @param {string} block    The block name.
 * @param {string} preset   The preset slug.
 * @param {string} [library] The token library slug; omitted targets the active library.
 * @return {Promise<Object>} The updated preset collection payload.
 */
export function deletePreset(block, preset, library) {
	return apiFetch({
		path: addQueryArgs(presetItemPath(designTokensNamespace(), block, preset), targetParams(library)),
		method: 'DELETE',
	});
}
