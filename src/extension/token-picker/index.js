/**
 * Pickable-token accessor for the editor token picker.
 *
 * The pool is printed by the server-side editor localizer to `window.kadenceDesignTokensPickable`:
 * `{ tokens: [{ id, alias, label, type, layer }], values: { <setSlug>: { <id>: literal } } }`.
 * This module turns it into the per-control PICKABLE list — hard type filter by the control's kind
 * (a radius control never lists color or font tokens), narrowed to the control's bound sub-kind when
 * it binds a role token (radius, not the whole `dimension` bucket) with that token pinned first,
 * semantic-layer tokens ranked before primitives, and each entry carrying the resolved literal
 * `value` for the preview swatch/number.
 * A pick writes the `alias` (the `{id}` string) — never the `value`; consumers of this module build
 * the picker UI and the attribute write, neither of which lives here.
 *
 * The `value` field reflects page-load resolution; a token override written through the REST API
 * refreshes the projected CSS but not this pool, so a preview swatch can go stale until reload.
 * That is cosmetic (the alias never goes stale) and live refresh is the picker UI's concern.
 */
import { get } from 'lodash';
import { activeSet, blockProperties } from '../preset-picker';

/**
 * Token $types compatible with each control kind. Keys are the preset catalog's coarse control
 * kinds; values are DTCG $type lists. `shadow` is inert until a shadow control kind exists — it is
 * mapped now so a future shadow control lights up with no change here. An unknown kind yields no
 * types, so the filter fails closed.
 *
 * @since TBD
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
 * @return {Array} The pickable list ([{ id, alias, label, value, type, role }]).
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
		role: token.role || '',
	}));
}

/**
 * The role sub-kind of a token id, read from the pool the catalog already tagged (never parsed here) —
 * the discriminator that narrows one $type to the control's sub-kind (a radius control's `dimension`
 * to only radius tokens). Empty when the id is absent from the pool or carries no role.
 *
 * @param {string} id The token id (e.g. 'semantic.radius.media').
 *
 * @since TBD
 *
 * @return {string} The role, or '' when unknown.
 */
function roleForId(id) {
	const tokens = get(pickableTokenPool(), 'tokens', []) || [];
	const match = tokens.find((token) => token.id === id);

	return match ? match.role || '' : '';
}

/**
 * The pickable tokens for one block control, keyed by the attribute the control writes: resolves
 * the control's kind from the preset catalog's { key, kind, token, control_attr } surface, then
 * filters and ranks the pool for that kind. When the control binds a role token, the list is further
 * narrowed to that token's sub-kind (a radius control's `dimension` to only radius tokens, never
 * spacing) and the bound token is pinned to the top; without a bound token it stays the coarse
 * kind list (type filter + semantic-first). Empty when the block maps no such control in the set —
 * an unmapped control offers no tokens, which is the "selectable only where it makes sense"
 * guarantee at the per-control call site.
 *
 * @param {string} blockName   The block name (e.g. 'kadence/singlebtn').
 * @param {string} controlAttr The attribute the control writes (e.g. 'borderRadius').
 * @param {string} [set]       The token set slug; defaults to the active set.
 *
 * @since TBD
 *
 * @return {Array} The pickable list ([{ id, alias, label, value, type, role }]), empty when unmapped.
 */
export function pickableTokensForControl(blockName, controlAttr, set) {
	const property = blockProperties(blockName, set).find((entry) => entry.control_attr === controlAttr);

	if (!property || !property.kind) {
		return [];
	}

	const tokens = pickableTokensFor(property.kind, set);
	const role = property.token ? roleForId(property.token) : '';

	// No bound role token -> the coarse kind list (type filter + semantic-first), unchanged.
	if (!role) {
		return tokens;
	}

	// Narrow to the control's sub-kind, then pin the exact bound token first (semantic-first order
	// carries through for the rest). An unresolved bound token drops out of the narrowed set, so the
	// pin is a no-op rather than surfacing a token the filter already excluded.
	const narrowed = tokens.filter((token) => token.role === role);

	return [
		...narrowed.filter((token) => token.id === property.token),
		...narrowed.filter((token) => token.id !== property.token),
	];
}
