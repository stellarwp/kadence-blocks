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
import { activeLibrary, blockProperties } from '../preset-picker';

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
 * The resolved literal values for a token library, falling back to the active library when the requested
 * library is omitted or absent from the pool.
 *
 * @param {string} [library] The token library slug.
 *
 * @since TBD
 *
 * @return {Object} id => literal value.
 */
function valuesFor(library) {
	const values = get(pickableTokenPool(), 'values', {}) || {};
	const slug = library || activeLibrary();

	return get(values, [slug], null) || get(values, [activeLibrary()], {}) || {};
}

/**
 * The pickable tokens for a control kind: only type-compatible tokens (the hard filter), semantic-
 * layer tokens ranked before primitives (stable order within each layer, i.e. registry order), each
 * with its resolved literal `value` from the requested library for the preview swatch/number.
 *
 * @param {string} kind      The control kind ('color' | 'dimension' | 'text' | 'shadow').
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Array} The pickable list ([{ id, alias, label, value, type, role }]).
 */
export function pickableTokensFor(kind, library) {
	const types = KIND_TYPES[kind] || [];
	const tokens = get(pickableTokenPool(), 'tokens', []) || [];
	const values = valuesFor(library);

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
 * The role sub-kind a control attribute implies, inferred by matching the attribute against the roles
 * present in a token list — the fallback narrower for a control that binds no role token (a radius
 * control still shows only radius tokens, not the whole `dimension` bucket). A role matches when its
 * kebab segments, de-hyphenated, appear as a substring of the lowercased attribute (`borderRadius`
 * matches `radius`; `iconSize` matches `icon-size`). Empty unless exactly one role matches, so an
 * ambiguous or unrecognized attribute falls back to the coarse list rather than guessing.
 *
 * @param {string} controlAttr The attribute the control writes (e.g. 'borderRadius').
 * @param {Array}  tokens      The type-filtered token list whose roles are the candidates.
 *
 * @since TBD
 *
 * @return {string} The single matching role, or '' when none or several match.
 */
function inferRoleFromControl(controlAttr, tokens) {
	const attr = String(controlAttr || '').toLowerCase();
	if (!attr) {
		return '';
	}

	const roles = [...new Set(tokens.map((token) => token.role).filter(Boolean))];
	const matches = roles.filter((role) => attr.includes(role.replace(/-/g, '')));

	return matches.length === 1 ? matches[0] : '';
}

/**
 * The pickable tokens for one block control, keyed by the attribute the control writes: resolves
 * the control's kind from the preset catalog's { key, kind, token, control_attr } surface, then
 * filters and ranks the pool for that kind. When the control binds a role token, the list is further
 * narrowed to that token's sub-kind (a radius control's `dimension` to only radius tokens, never
 * spacing) and the bound token is pinned to the top. Without a bound token the sub-kind is inferred
 * from the control attribute (`borderRadius` -> radius), narrowing all the same; only when no single
 * role can be inferred does it stay the coarse kind list (type filter + semantic-first). Empty when the
 * block maps no such control in the library — an unmapped control offers no tokens, which is the
 * "selectable only where it makes sense" guarantee at the per-control call site.
 *
 * @param {string} blockName   The block name (e.g. 'kadence/singlebtn').
 * @param {string} controlAttr The attribute the control writes (e.g. 'borderRadius').
 * @param {string} [library]   The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Array} The pickable list ([{ id, alias, label, value, type, role }]), empty when unmapped.
 */
export function pickableTokensForControl(blockName, controlAttr, library) {
	const property = blockProperties(blockName, library).find((entry) => entry.control_attr === controlAttr);

	if (!property || !property.kind) {
		return [];
	}

	const tokens = pickableTokensFor(property.kind, library);
	const role = property.token ? roleForId(property.token) : inferRoleFromControl(controlAttr, tokens);

	// No bound token and no inferable role -> the coarse kind list (type filter + semantic-first).
	if (!role) {
		return tokens;
	}

	// Narrow to the control's sub-kind. When that sub-kind has primitive scale steps (e.g. the radius
	// sizes), offer only those — the picker surfaces sizes, not the component-specific semantic tokens
	// that merely alias them. Fall back to the full narrowed set for a sub-kind with no primitives.
	const narrowed = tokens.filter((token) => token.role === role);
	const primitives = narrowed.filter((token) => token.id.startsWith('primitive.'));
	const scoped = primitives.length ? primitives : narrowed;

	// Pin the exact bound token first when it survived the scoping (order carries through for the rest).
	// An unresolved or scoped-out bound token drops the pin to a no-op.
	return [
		...scoped.filter((token) => token.id === property.token),
		...scoped.filter((token) => token.id !== property.token),
	];
}
