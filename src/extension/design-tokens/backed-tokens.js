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
 * The active library's resolved id => literal map, or null when there is no map to read: the pickable
 * pool is not localized at all (the registry is fail-closed, or nothing localized it — e.g. a test
 * harness), or the active library is missing from it (its stored document could not be resolved, so the
 * catalog skipped it). Null means "backing cannot be determined"; an empty object is an answer — the
 * library resolved and backs nothing.
 *
 * @since TBD
 *
 * @return {Object|null} id => literal value, or null when no map is available.
 */
function resolvedValues() {
	const values = get(window, 'kadenceDesignTokensPickable.values', null);

	if (!values || typeof values !== 'object') {
		return null;
	}

	const library = get(values, [activeLibrary()], null);

	return library && typeof library === 'object' ? library : null;
}

/**
 * Whether a design-token id is backed by the active library — i.e. it appears in that library's resolved
 * id map. Used to skip a stale alias (a token deleted after it was saved into a post) so the editor never
 * emits a dead `var(--kb-token--<id>)`.
 *
 * Fails open (returns true) only when there is no map to consult — the pool is not localized, or the
 * active library is absent from it — which mirrors the PHP renderer, whose fail-open covers exactly the
 * cases where the container or resolver cannot answer. A localized library that resolves to an empty map
 * is an answer, not a gap, so every alias reads as unbacked there, in both languages alike.
 *
 * @param {string} id The design-token id (the alias path, e.g. "semantic.color.border").
 *
 * @since TBD
 *
 * @return {boolean} True when the id is backed, or when no resolved map is available (fail-open).
 */
export function isBackedToken(id) {
	const values = resolvedValues();

	if (values === null) {
		return true;
	}

	return Object.prototype.hasOwnProperty.call(values, id);
}
