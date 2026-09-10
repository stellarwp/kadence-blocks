/**
 * Screen-id resolution for the Style Library: the pure nav builders, the block-preset screen-id
 * codec, and the filter-then-fallback resolution both sidebar sections share. Screens plug into
 * this contract by claiming a `BASE_STYLES_SCREENS` id or, for a block-preset screen, by
 * registering a component on the `PRESET_SCREENS_FILTER`.
 */

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { BASE_STYLES_SCREENS, PRESET_SCREENS_FILTER } from '../constants/screens';

/**
 * The screen-id prefix that namespaces every block-preset screen away from the fixed Base Styles
 * ids, so the two id spaces can never collide.
 *
 * @since TBD
 */
const PRESET_SCREEN_PREFIX = 'blocks/';

/**
 * The screen id for a preset-bound block, e.g. `kadence/singlebtn` -> `blocks/kadence/singlebtn`.
 *
 * @param {string} block The block name.
 *
 * @since TBD
 *
 * @return {string} The screen id.
 */
export function presetScreenId(block) {
	return `${PRESET_SCREEN_PREFIX}${block}`;
}

/**
 * The block name a preset screen id addresses, or '' for a non-preset id.
 *
 * @param {string} screenId The screen id.
 *
 * @since TBD
 *
 * @return {string} The block name, or ''.
 */
export function blockFromScreenId(screenId) {
	return typeof screenId === 'string' && screenId.startsWith(PRESET_SCREEN_PREFIX)
		? screenId.slice(PRESET_SCREEN_PREFIX.length)
		: '';
}

/**
 * Build the BASE STYLES nav entries (fixed order, from the constants).
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string}>} The nav entries.
 */
export function buildBaseStylesNav() {
	return BASE_STYLES_SCREENS.map(({ id, label }) => ({ id, label }));
}

/**
 * Build the BLOCK PRESETS nav entries from the admin feed's `presetNav` section, already ordered
 * and labeled by PHP. Tolerates a missing/empty section (older feed) by returning [].
 *
 * @param {Object} feed The `window.kadenceDesignTokens` feed object.
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string, block: string}>} The nav entries.
 */
export function buildBlockPresetsNav(feed) {
	const entries = feed?.presetNav;

	if (!Array.isArray(entries)) {
		return [];
	}

	return entries.map(({ block, label }) => ({ id: presetScreenId(block), label, block }));
}

/**
 * Resolve a screen id to the component that renders it. Preset ids consult the third-party
 * registry (the preset-screens filter) first and fall back to the generic screen; unknown ids
 * resolve to null so the caller can normalize the route. This is the single `applyFilters` call
 * site for `PRESET_SCREENS_FILTER`.
 *
 * @param {string} screenId The screen id from the route.
 * @param {Object} registry `{ baseStyles: {id: Component}, presetFallback: Component }` — the
 *                           app-owned component map.
 *
 * @since TBD
 *
 * @return {?{Component: Function, block: string}} The resolution, or null for an unknown id.
 */
export function resolveScreen(screenId, registry) {
	const block = blockFromScreenId(screenId);

	if (block) {
		/**
		 * Filters the third-party preset screen components, keyed by block name.
		 *
		 * @param {Object} screens blockName => screen component.
		 */
		const screens = applyFilters(PRESET_SCREENS_FILTER, {});

		return { Component: screens[block] || registry.presetFallback, block };
	}

	const Component = registry.baseStyles[screenId];

	return Component ? { Component, block: '' } : null;
}
