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
import { __ } from '@wordpress/i18n';
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
 * The resolved literal for a single token id, or `''` when the pool carries no value for it (e.g. the
 * feed has not loaded yet). For a caller that needs a block's own hardcoded literal to show when even
 * this comes back empty — e.g. a `defaultValue` a control falls back to when nothing binds it — see
 * that caller's own fallback constant; this function only ever reads the pool, never invents one.
 *
 * @param {string} id        The token id (e.g. 'semantic.spacing.button-padding-top').
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {string} The resolved literal, or ''.
 */
export function resolvedTokenValue(id, library) {
	return valuesFor(library)[id] ?? '';
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
 * The alias of the token one block control BINDS, as declared in the preset bindings — the design
 * system's answer for that control when the block stores nothing of its own.
 *
 * A control whose attribute renders as a CSS declaration gets that fallback for free, as the
 * `var()` the block-default-CSS projector emits. A control whose attribute renders as something a
 * `var()` cannot reach (a raw SVG geometry attribute, say) has to resolve the same token itself, and
 * this is where it reads which token that is rather than restating the id the declaration already
 * owns.
 *
 * @param {string} blockName   The block name (e.g. 'kadence/single-icon').
 * @param {string} controlAttr The attribute the control writes (e.g. 'size').
 * @param {string} [library]   The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {string} The `{dot.alias}` of the bound token, or '' when the control binds none.
 */
export function boundTokenAliasForControl(blockName, controlAttr, library) {
	const property = blockProperties(blockName, library).find((entry) => entry.control_attr === controlAttr);

	return property && property.token ? `{${property.token}}` : '';
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
 * A handful of control attributes name their role by a different word than the role itself uses
 * (`padding`/`margin` imply the `spacing` role, but neither string contains "spacing") — those get a
 * fixed alias here rather than a substring guess.
 *
 * @since TBD
 *
 * @type {Object<string, string>}
 */
const ROLE_ALIASES = {
	padding: 'spacing',
	margin: 'spacing',
};

/**
 * The roles that offer a fixed "None" entry — every role whose scale used to register a `.none`
 * primitive worth `0` (see `declarations.php`'s own comment on why it no longer does). Sized this
 * way rather than "every dimension role" because it is a deliberate design choice per role, not a
 * property every scale has — border-width and icon-size, for instance, have never offered one.
 *
 * @since TBD
 *
 * @type {string[]}
 */
const FIXED_NONE_ROLES = ['spacing', 'radius'];

/**
 * The fixed "None" entry for one of `FIXED_NONE_ROLES`, matching Margin's own `ss-auto` sentinel in
 * spirit: a real, working value with no DTCG registration behind it, spliced into the pickable list
 * at read time instead. Unlike `ss-auto` (the CSS keyword `auto`, meaningless as a length), "None" IS
 * a length — the plain literal `0` — so no bare, non-bracketed alias convention is needed to reach a
 * PHP/CSS layer that already special-cases it; `alias` is the JS number `0` itself, exactly what
 * `toControlValue()`/a hand-typed Custom `0` already produce, so `findTokenEntry()` recognizes either
 * one as this same fixed entry (see its own docblock on the `fixed` exception).
 *
 * Kept off the registry (and therefore off the Spacing/Border Radius screens) on purpose: a "None"
 * primitive read exactly like the shipped XS/SM/MD/… steps had nothing distinguishing it from a real,
 * user-owned scale value, so the screen let it be renamed or deleted like any other row.
 *
 * @param {string} role The role to build the entry for ('spacing' | 'radius').
 *
 * @since TBD
 *
 * @return {{id: string, alias: number, label: string, value: string, type: string, role: string, fixed: boolean}} The fixed entry.
 */
function fixedNoneEntry(role) {
	return {
		id: `ss-none-${role}`,
		alias: 0,
		label: __('None', 'kadence-blocks'),
		value: '0',
		type: 'dimension',
		role,
		fixed: true,
	};
}

/**
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

	if (ROLE_ALIASES[attr] && tokens.some((token) => token.role === ROLE_ALIASES[attr])) {
		return ROLE_ALIASES[attr];
	}

	const roles = [...new Set(tokens.map((token) => token.role).filter(Boolean))];
	const matches = roles.filter((role) => attr.includes(role.replace(/-/g, '')));

	return matches.length === 1 ? matches[0] : '';
}

/**
 * The pickable tokens for an already-resolved bound property: filters and ranks the pool for the
 * property's kind, narrows to the bound (or inferred) role's sub-kind with that role's primitive scale
 * steps preferred, and pins the bound token first. Shared by every lookup path
 * (`pickableTokensForControl`'s `control_attr` match, `pickableTokensForKey`'s `key` match) once each
 * has found its own `property` entry, so the narrowing logic exists once.
 *
 * @param {Object} property    The resolved bound property ({ key, kind, token, control_attr }).
 * @param {string} controlAttr The attribute to infer a role from when the property binds no token
 *                              (e.g. 'borderRadius'); pass '' when the caller has no such attribute
 *                              (e.g. a key-based lookup for a property with no `control_attr`).
 * @param {string} [library]   The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Array} The pickable list ([{ id, alias, label, value, type, role }]), empty when unmapped.
 *                  A 'spacing'/'radius' role list also carries a fixed "None" entry (see
 *                  `fixedNoneEntry`).
 */
function pickableTokensForProperty(property, controlAttr, library) {
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

	// "None" is spliced in here, after the primitive-preferring narrow above, rather than into the
	// registered pool it would otherwise have to survive that narrowing as — see `fixedNoneEntry`'s
	// own docblock for why it carries no registration at all.
	const withFixedNone = FIXED_NONE_ROLES.includes(role) ? [fixedNoneEntry(role), ...scoped] : scoped;

	// Pin the exact bound token first when it survived the scoping (order carries through for the rest).
	// An unresolved or scoped-out bound token drops the pin to a no-op.
	return [
		...withFixedNone.filter((token) => token.id === property.token),
		...withFixedNone.filter((token) => token.id !== property.token),
	];
}

/**
 * The pickable tokens for one block control, keyed by the attribute the control writes: resolves
 * the control's kind from the preset catalog's { key, kind, token, control_attr } surface, then
 * defers to the shared narrowing helper. Empty when the block maps no such control in the library —
 * an unmapped control offers no tokens, which is the "selectable only where it makes sense" guarantee
 * at the per-control call site.
 *
 * Only reaches a property whose `control_attr` this lookup can resolve UNAMBIGUOUSLY by a find-the-
 * first-match on `controlAttr` — a property bound to a nested/composite native attribute (shadow) is
 * declared with no `control_attr` at all, and the three border-axis properties share one
 * (`borderStyle`) among themselves, so none of the four are safely reachable here; use
 * `pickableTokensForKey` for those instead.
 *
 * @param {string} blockName   The block name (e.g. 'kadence/singlebtn').
 * @param {string} controlAttr The attribute the control writes (e.g. 'borderRadius').
 * @param {string} [library]   The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Array} The pickable list ([{ id, alias, label, value, type, role }]), empty when unmapped.
 *                  A 'spacing'/'radius' role list also carries a fixed "None" entry (see
 *                  `fixedNoneEntry`).
 */
export function pickableTokensForControl(blockName, controlAttr, library) {
	const property = blockProperties(blockName, library).find((entry) => entry.control_attr === controlAttr);

	return pickableTokensForProperty(property, controlAttr, library);
}

/**
 * The pickable tokens for one bound property, keyed by the property's stable `key` (the PHP bindings
 * array key, e.g. 'button-shadow') rather than its `control_attr`. Exists for a property whose
 * `control_attr` cannot resolve a control-based reverse lookup either because it has none at all (a
 * native attribute that is a nested/composite shape, e.g. border/shadow) or because it shares one
 * `control_attr` with two other properties (the three border axes all share `borderStyle`, so
 * `pickableTokensForControl`'s find-the-first-match lookup would be ambiguous among them). Otherwise
 * identical to `pickableTokensForControl`: defers to the same shared narrowing helper once the
 * property is found, passing its OWN `control_attr` through (when it has one) as the role-inference
 * hint — a property with no `control_attr` passes `''`, same as before.
 *
 * @param {string} blockName The block name (e.g. 'kadence/singlebtn').
 * @param {string} key       The property's bindings key (e.g. 'button-shadow').
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Array} The pickable list ([{ id, alias, label, value, type, role }]), empty when unmapped.
 *                  A 'spacing'/'radius' role list also carries a fixed "None" entry (see
 *                  `fixedNoneEntry`).
 */
export function pickableTokensForKey(blockName, key, library) {
	const property = blockProperties(blockName, library).find((entry) => entry.key === key);

	return pickableTokensForProperty(property, property?.control_attr || '', library);
}
