/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Read the localized design-token feed from the window global.
 *
 * @return {object|null} Feed payload or null when unavailable.
 */
export function getDesignTokensFeed() {
	return window.kadenceDesignTokens ?? null;
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
