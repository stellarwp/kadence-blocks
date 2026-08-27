/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PICKABLE_TOKENS_GLOBAL } from '../constants';

/**
 * Read the localized design-token feed from the window global.
 *
 * @return {object|null} Feed payload or null when unavailable.
 */
export function getDesignTokensFeed() {
	return window.kadenceDesignTokens ?? null;
}

/**
 * Read the localized pickable-token pool from the window global. Yields an empty pool rather than
 * null when absent, so a caller never has to null-check before filtering.
 *
 * @since TBD
 *
 * @return {{tokens: Array<{id: string, label: string, type: string}>, values: Record<string, Record<string, string>>}}
 *         The pickable pool.
 */
export function getPickableTokensPool() {
	return window[PICKABLE_TOKENS_GLOBAL] ?? { tokens: [], values: {} };
}

/**
 * Narrow a role-scoped token list to its primitive-layer entries, when it has any. A role's
 * primitives are its scale steps (e.g. the radius sizes); its semantic tokens merely alias them, so
 * a picker that already knows the role offers only the steps rather than duplicating them with the
 * component-specific aliases. A role with no primitives (only semantics) falls back to the full list
 * unchanged.
 *
 * The narrowing can never drop a currently-bound token from the list, though: a stored preset value
 * is often a semantic alias by design (e.g. `{semantic.radius.control}`), and a semantic id the
 * primitive narrowing would otherwise remove is kept — the field would otherwise find no matching
 * entry and mistake a valid token for a literal, rendering the raw dot-path as if it were text.
 *
 * Every bound id is exempt, not just one. A box control's four corners can each hold a different
 * token, so exempting only the first would drop the others the moment one corner is pointed at a
 * primitive — and the corners still holding the semantic would render as raw ids.
 *
 * @param {Array<{id: string}>}   tokens   The role-narrowed token list.
 * @param {?(string|Array)}       selected The currently-bound token id, or ids, exempt from the
 *                                         narrowing.
 *
 * @since TBD
 *
 * @return {Array<{id: string}>} The primitive-only list plus any exempted selections, in the pool's
 * own order, or `tokens` unchanged when it has no primitives.
 */
export function preferPrimitiveTokens(tokens, selected) {
	const primitives = tokens.filter((token) => token.id.startsWith('primitive.'));

	if (!primitives.length) {
		return tokens;
	}

	const exempt = new Set(
		(Array.isArray(selected) ? selected : [selected]).filter(
			(id) => id && !primitives.some((token) => token.id === id)
		)
	);

	if (!exempt.size) {
		return primitives;
	}

	// Filtered from the full list rather than appended to the primitives, so an exempted semantic keeps
	// its place in the pool's order instead of being pushed to the end.
	return tokens.filter((token) => token.id.startsWith('primitive.') || exempt.has(token.id));
}

/**
 * The roles that offer a fixed "None" entry — mirrors the editor's own `FIXED_NONE_ROLES` in
 * `extension/token-picker/index.js`. Both hosts read the same pool and must offer the same choices.
 *
 * @since TBD
 *
 * @type {string[]}
 */
const FIXED_NONE_ROLES = ['spacing', 'radius'];

/**
 * The fixed "None" entry for one of `FIXED_NONE_ROLES` — the Style Library's copy of the editor's
 * `fixedNoneEntry()` (`extension/token-picker/index.js`), same reasoning: "None" carries no DTCG
 * registration, so it is spliced into the pickable list here instead of surviving the primitive
 * narrowing as a registered token would. `alias` is the JS number `0`, matching what
 * `BoxTokenField.js`'s `toControlValue()` already produces for a stored literal `'0'`.
 *
 * @param {string} role The role to build the entry for ('spacing' | 'radius').
 *
 * @since TBD
 *
 * @return {{id: string, alias: number, label: string, value: string, role: string, fixed: boolean}} The fixed entry.
 */
function fixedNoneEntry(role) {
	return {
		id: `ss-none-${role}`,
		alias: 0,
		label: __('None', 'kadence-blocks'),
		value: '0',
		role,
		fixed: true,
	};
}

/**
 * The pickable tokens of one DTCG `$type` (e.g. `dimension`, `color`), each with its resolved
 * literal value from the active library. An optional `role` narrows the pool further (e.g. the
 * Radius picker wants only `role: 'radius'` dimensions, not every dimension token) — omitted, this
 * behaves exactly as before. When a `role` is given, the pool also prefers that role's primitive
 * scale (see `preferPrimitiveTokens`, exempting `selectedId` from the narrowing).
 *
 * The order is the pool's own, which is the order its scale screen lists — a picker that reshuffled
 * by what happens to be bound would read differently every time the value changed.
 *
 * @param {string}            type       The DTCG token `$type` to filter to.
 * @param {?string}           [role]     When given, also require `token.role === role` and prefer
 *                                       that role's primitives.
 * @param {?(string|Array)}   [selected] The currently-bound token id, or ids, exempt from the
 *                                       primitive narrowing so a bound semantic alias is never
 *                                       filtered out of its own picker.
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string, value: string, role: ?string}>} The pickable tokens for the type.
 */
export function pickableTokensForType(type, role, selected) {
	const pool = getPickableTokensPool();
	const feed = getDesignTokensFeed();
	const libraryValues = pool.values?.[feed?.slug] ?? {};

	const matched = (pool.tokens || [])
		.filter((token) => token.type === type && (role === undefined || token.role === role))
		.map((token) => ({
			id: token.id,
			label: token.label,
			value: libraryValues[token.id] ?? '',
			role: token.role ?? null,
		}));

	if (role === undefined) {
		return matched;
	}

	const narrowed = preferPrimitiveTokens(matched, selected);

	// Spliced in after the primitive narrowing, not before — its id carries no `primitive.` prefix, so
	// the narrowing above would otherwise strip it exactly as it strips any other non-primitive entry.
	return FIXED_NONE_ROLES.includes(role) ? [fixedNoneEntry(role), ...narrowed] : narrowed;
}

/**
 * Flatten schema groups into a single token list.
 *
 * User-created primitives have no server-assigned group (empty string); they
 * are reassigned to the "Custom Colors" display group here so the navigation
 * and group-by-schema views can surface them in a dedicated section.
 *
 * @param {{ groups?: Record<string, object[]> }} schema UI schema from the feed.
 * @return {object[]} Token definitions with their group name attached.
 */
export function flattenSchemaTokens(schema) {
	if (!schema?.groups) {
		return [];
	}

	const customColorsLabel = __('Custom Colors', 'kadence-blocks');

	return Object.entries(schema.groups).flatMap(([groupName, tokens]) =>
		tokens.map((token) => ({
			...token,
			group: !groupName && token.userCreated ? customColorsLabel : groupName,
		}))
	);
}

// Re-exported, not redeclared: the envelope contract owns the spelling, and this module both
// uses it and keeps the name available to existing importers.
import { KADENCE_TOKEN_NAMESPACE } from '../../token-controls/helpers/preset-envelope';

export { KADENCE_TOKEN_NAMESPACE };

/**
 * The stepped responsive breakpoint keys, in cascade order (mirrors Schema\Vocabulary\Responsive).
 *
 * @since TBD
 *
 * @type {string[]}
 */
export const RESPONSIVE_BREAKPOINTS = ['tablet', 'mobile'];

/**
 * The registered-id segment for each `$type` whose DTCG spelling is not itself a valid kebab-case
 * id segment (mirrors PHP's `Schema\Vocabulary\Token_Type::ID_SEGMENTS`). A `$type` absent from
 * this map uses its own spelling verbatim. The full six-entry map ships, not just `fontFamily`, so
 * the two sides cannot drift entry by entry.
 *
 * @since TBD
 *
 * @type {Record<string, string>}
 */
export const TOKEN_TYPE_ID_SEGMENTS = {
	fontFamily: 'font-family',
	fontWeight: 'font-weight',
	lineHeight: 'line-height',
	fontStyle: 'font-style',
	textTransform: 'text-transform',
	borderStyle: 'border-style',
};

/**
 * The registered-id segment for a `$type`: the mapped kebab spelling when one is registered in
 * `TOKEN_TYPE_ID_SEGMENTS`, or the `$type` verbatim otherwise. Mirrors PHP's
 * `Token_Type::get_id_segment()`.
 *
 * @param {string} type The DTCG `$type` (spec spelling).
 *
 * @since TBD
 *
 * @return {string} The registered-id segment for `type`.
 */
export function tokenTypeIdSegment(type) {
	return TOKEN_TYPE_ID_SEGMENTS[type] ?? type;
}

/**
 * Build a DTCG leaf payload for a token value update.
 *
 * Accepts either a plain string (a flat token) or a structured value carrying a base plus a per-breakpoint
 * `responsive` map or a `clamp` map. The responsive / clamp shape is serialized under the leaf's
 * `$extensions`, and is omitted entirely when it holds no non-empty values, so a desktop-only edit
 * round-trips as a clean flat leaf (never a degenerate `responsive: {}`).
 *
 * @param {string} type  Token type from the schema (color, dimension, etc.).
 * @param {string|{ base?: string, responsive?: Record<string, string>, clamp?: Record<string, string> }} value
 *                       Raw value string, or a structured responsive / clamp value.
 * @return {{ $type: string, $value: string, $extensions?: object }} DTCG leaf.
 */
export function buildTokenLeaf(type, value) {
	if (typeof value === 'string') {
		return {
			$type: type,
			$value: value.trim(),
		};
	}

	const leaf = {
		$type: type,
		$value: String(value?.base ?? '').trim(),
	};

	const extension = buildResponsiveExtension(value);

	if (extension) {
		leaf.$extensions = { [KADENCE_TOKEN_NAMESPACE]: extension };
	}

	return leaf;
}

/**
 * Build the `com.kadence.designTokens` extension body for a structured value, or null when it carries no
 * non-empty responsive / clamp values.
 *
 * @since TBD
 *
 * @param {{ responsive?: Record<string, string>, clamp?: Record<string, string> }} value Structured value.
 * @return {{ responsive: object }|{ clamp: object }|null} Extension body, or null.
 */
function buildResponsiveExtension(value) {
	if (value?.clamp) {
		const min = String(value.clamp.min ?? '').trim();
		const preferred = String(value.clamp.preferred ?? '').trim();
		const max = String(value.clamp.max ?? '').trim();

		if (min !== '' && preferred !== '' && max !== '') {
			return { clamp: { min, preferred, max } };
		}

		return null;
	}

	if (value?.responsive) {
		const responsive = {};

		RESPONSIVE_BREAKPOINTS.forEach((breakpoint) => {
			const step = String(value.responsive[breakpoint] ?? '').trim();

			if (step !== '') {
				responsive[breakpoint] = step;
			}
		});

		if (Object.keys(responsive).length > 0) {
			return { responsive };
		}
	}

	return null;
}

/**
 * Whether a token type supports a color swatch preview.
 *
 * @param {string} type Token type from the schema.
 * @return {boolean}
 */
export function isColorType(type) {
	return type === 'color';
}

/**
 * Whether a token type is responsive-capable (mirrors Schema\Vocabulary\Responsive::is_responsive_capable):
 * only dimension and lineHeight may carry a per-breakpoint / clamp shape.
 *
 * @since TBD
 *
 * @param {string} type Token type from the schema.
 * @return {boolean}
 */
export function isResponsiveType(type) {
	return type === 'dimension' || type === 'lineHeight';
}

/**
 * Normalize a user-entered color to a hex string when possible.
 *
 * @param {string} value Raw input value.
 * @return {string|null} Hex color or null when not a simple hex value.
 */
export function normalizeHexColor(value) {
	const trimmed = value.trim();

	if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
		const [, r, g, b] = trimmed.match(/^#(.)(.)(.)$/);
		return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
	}

	if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
		return trimmed.toUpperCase();
	}

	return null;
}
