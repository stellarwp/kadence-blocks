/**
 * Whether a design-token alias is backed by the active library, for the editor's alias filter.
 *
 * The editor localizer prints the resolved id => literal map per library to
 * `window.kadenceDesignTokensPickable.values` (the same set the Css_Var projector emits a
 * `--kb-token--<id>` custom property for), and the active library slug to
 * `window.kadenceDesignTokensPresets.active`. These pure window reads deliberately avoid importing the
 * token-picker / preset-picker modules, whose `@kadence/components` dependency is unresolvable under the
 * jest harness — the alias filter is a low-level output seam and must stay light.
 */
import { get } from 'lodash';

/**
 * The active token library slug, defaulting to "default".
 *
 * @since TBD
 *
 * @return {string} The active library slug.
 */
function activeLibrary() {
	return get(window, 'kadenceDesignTokensPresets.active', 'default') || 'default';
}

/**
 * The active library's resolved id => literal map (empty when the registry is inactive or the data is
 * not localized).
 *
 * @since TBD
 *
 * @return {Object} id => literal value.
 */
function resolvedValues() {
	const values = get(window, 'kadenceDesignTokensPickable.values', {}) || {};

	return get(values, [activeLibrary()], {}) || {};
}

/**
 * Whether a design-token id is backed by the active library — i.e. it appears in that library's resolved
 * id map. Used to skip a stale alias (a token deleted after it was saved into a post) so the editor never
 * emits a dead `var(--kb-token--<id>)`.
 *
 * Fails open when the resolved map is empty (registry inactive, or the data not localized — e.g. a test
 * harness): returns true so nothing is dropped, mirroring the PHP renderer's fail-open behavior.
 *
 * @param {string} id The design-token id (the alias path, e.g. "semantic.color.border").
 *
 * @since TBD
 *
 * @return {boolean} True when the id is backed, or when the resolved map is empty (fail-open).
 */
export function isBackedToken(id) {
	const values = resolvedValues();

	if (Object.keys(values).length === 0) {
		return true;
	}

	return Object.prototype.hasOwnProperty.call(values, id);
}
