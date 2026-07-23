/**
 * Pickable-token accessor for the editor token picker.
 *
 * The pool is printed by the server-side editor localizer to `window.kadenceDesignTokensPickable`:
 * `{ tokens: [{ id, alias, label, type, layer }], values: { <setSlug>: { <id>: literal } } }`.
 * This module turns it into the per-control PICKABLE list — hard type filter by the control's kind
 * (a radius control never lists color or font tokens), semantic-layer tokens ranked before
 * primitives, and each entry carrying the resolved literal `value` for the preview swatch/number.
 * A pick writes the `alias` (the `{id}` string) — never the `value`; consumers of this module build
 * the picker UI and the attribute write, neither of which lives here.
 *
 * The `value` field reflects page-load resolution; a token override written through the REST API
 * refreshes the projected CSS but not this pool, so a preview swatch can go stale until reload.
 * That is cosmetic (the alias never goes stale) and live refresh is the picker UI's concern.
 */
import { get } from 'lodash';
import { activeSet, blockProperties } from '../variant-picker';

/**
 * Token $types compatible with each control kind. Keys are the variant catalog's coarse control
 * kinds; values are DTCG $type lists. `shadow` is inert until a shadow control kind exists — it is
 * mapped now so a future shadow control lights up with no change here. An unknown kind yields no
 * types, so the filter fails closed.
 */
const KIND_TYPES = {
	color: ['color'],
	dimension: ['dimension'],
	text: ['fontFamily', 'fontWeight', 'lineHeight', 'fontStyle', 'textTransform'],
	shadow: ['shadow'],
};

/**
 * The whole pickable-token pool the editor localizer prints, or an empty pool when the token
 * registry is inactive (nothing pickable).
 *
 * @since TBD
 *
 * @return {Object} The pool ({ tokens, values }).
 */
export function pickableTokenPool() {
	return get(window, 'kadenceDesignTokensPickable', {}) || {};
}

/**
 * The resolved literal values for a token set, falling back to the active set when the requested
 * set is omitted or absent from the pool.
 *
 * @param {string} [set] The token set slug.
 *
 * @since TBD
 *
 * @return {Object} id => literal value.
 */
function valuesFor(set) {
	const values = get(pickableTokenPool(), 'values', {}) || {};
	const slug = set || activeSet();

	return get(values, [slug], null) || get(values, [activeSet()], {}) || {};
}

/**
 * The pickable tokens for a control kind: only type-compatible tokens (the hard filter), semantic-
 * layer tokens ranked before primitives (stable order within each layer, i.e. registry order), each
 * with its resolved literal `value` from the requested set for the preview swatch/number.
 *
 * @param {string} kind  The control kind ('color' | 'dimension' | 'text' | 'shadow').
 * @param {string} [set] The token set slug; defaults to the active set.
 *
 * @since TBD
 *
 * @return {Array} The pickable list ([{ id, alias, label, value, type }]).
 */
export function pickableTokensFor(kind, set) {
	const types = KIND_TYPES[kind] || [];
	const tokens = get(pickableTokenPool(), 'tokens', []) || [];
	const values = valuesFor(set);

	const compatible = tokens.filter((token) => types.includes(token.type));

	// Semantic first, primitives as the fallback pool; filter() preserves registry order per group.
	const ranked = [
		...compatible.filter((token) => token.layer === 'semantic'),
		...compatible.filter((token) => token.layer !== 'semantic'),
	];

	return ranked.map((token) => ({
		id: token.id,
		alias: token.alias,
		label: token.label,
		value: get(values, [token.id], ''),
		type: token.type,
	}));
}

/**
 * The pickable tokens for one block control, keyed by the attribute the control writes: resolves
 * the control's kind from the variant catalog's { key, kind, token, control_attr } surface, then
 * filters and ranks the pool for that kind. Empty when the block maps no such control in the set —
 * an unmapped control offers no tokens, which is the "selectable only where it makes sense"
 * guarantee at the per-control call site.
 *
 * @param {string} blockName   The block name (e.g. 'kadence/singlebtn').
 * @param {string} controlAttr The attribute the control writes (e.g. 'borderRadius').
 * @param {string} [set]       The token set slug; defaults to the active set.
 *
 * @since TBD
 *
 * @return {Array} The pickable list ([{ id, alias, label, value, type }]), empty when unmapped.
 */
export function pickableTokensForControl(blockName, controlAttr, set) {
	const property = blockProperties(blockName, set).find((entry) => entry.control_attr === controlAttr);

	if (!property || !property.kind) {
		return [];
	}

	return pickableTokensFor(property.kind, set);
}
