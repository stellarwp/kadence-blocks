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
 * The pickable tokens of one DTCG `$type` (e.g. `dimension`, `color`), each with its resolved
 * literal value from the active library.
 *
 * @param {string} type The DTCG token `$type` to filter to.
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string, value: string}>} The pickable tokens for the type.
 */
export function pickableTokensForType(type) {
	const pool = getPickableTokensPool();
	const feed = getDesignTokensFeed();
	const libraryValues = pool.values?.[feed?.slug] ?? {};

	return (pool.tokens || [])
		.filter((token) => token.type === type)
		.map((token) => ({
			id: token.id,
			label: token.label,
			value: libraryValues[token.id] ?? '',
		}));
}

/**
 * Fetch the feed for a library and apply it. Pulled out of `use-design-tokens-feed` so the
 * refresh behavior can be exercised directly in a test without rendering the hook — the same
 * shape the hook's `refreshFeed` exposes to its callers. `fetchFeed` is injected (the hook passes
 * `fetchDesignTokensFeed` from `api/client`) rather than imported here, so this pure-helpers
 * module carries no REST dependency of its own and a test can pass a plain mock.
 *
 * @param {string}   slug      The token library slug to read the feed for.
 * @param {Function} applyFeed Called with the fetched feed payload once it resolves.
 * @param {Function} fetchFeed Fetches the feed payload for a slug (`fetchDesignTokensFeed`).
 *
 * @since TBD
 *
 * @return {Promise<object>} The fetched feed payload.
 */
export function refreshFeedFlow(slug, applyFeed, fetchFeed) {
	return fetchFeed(slug).then((nextFeed) => {
		applyFeed(nextFeed);
		return nextFeed;
	});
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

/**
 * The vendor-extension namespace the module owns (mirrors Schema\Vocabulary\Extensions::NAMESPACE).
 *
 * @since TBD
 *
 * @type {string}
 */
export const KADENCE_TOKEN_NAMESPACE = 'com.kadence.designTokens';

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
