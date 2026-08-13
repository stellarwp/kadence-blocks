/**
 * The Typography screen's pure helpers: mapping the `Font Family` feed group into the FONT
 * selector's options, reading a fluid font-size step's authored scalar out of its resolved
 * `clamp(...)` CSS, and the font-catalog capability (reading the page-load catalog global,
 * matching a catalog pick against a design-system font, deriving a slug that can be minted, and deciding the
 * contextual Add/Delete button's state). No React, no JSX, no REST — see
 * `components/pages/TypographyScreen.js` for where these plug into the scale-screen contract and
 * `helpers/font-flows.js` for the Add Font write flow.
 */

/**
 * Internal dependencies
 */
import { isDeletable } from './token-capabilities';

/**
 * Strip a pair of wrapping quotes (single or double) from a font-family name, the same trimming a
 * browser applies when it renders a quoted family in a `font-family` list.
 *
 * @param {string} family A single family name, already trimmed of surrounding whitespace.
 *
 * @since TBD
 *
 * @return {string} The family name with a matching pair of wrapping quotes removed, or the input
 *         verbatim when it carries none.
 */
function unquoteFamily(family) {
	const match = family.match(/^(["'])(.*)\1$/);

	return match ? match[2] : family;
}

/**
 * Map the feed's `Font Family` UI-schema group to the FONT selector's options, in feed order.
 *
 * @param {{ groups?: Record<string, Array<Object>> }} schema The feed's UI schema.
 * @param {Record<string, string>}                      values The feed's resolved value map.
 * @param {string}                                       group  The UI-schema group label to list
 *                                                                (the translated `Font Family` group).
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string, stack: string, userCreated: boolean}>} The font
 *         options, or `[]` for a missing schema or an unknown group. `userCreated` passes through
 *         the feed entry verbatim so `fontActionFor` can gate on it without re-reading the schema.
 */
export function fontOptions(schema, values, group) {
	const entries = schema?.groups?.[group];

	if (!Array.isArray(entries)) {
		return [];
	}

	return entries.map((entry) => {
		const stack = values?.[entry.id] ?? '';
		const firstFamily = stack.split(',')[0]?.trim() ?? '';

		return {
			id: entry.id,
			label: unquoteFamily(firstFamily),
			stack,
			userCreated: entry.userCreated === true,
		};
	});
}

/**
 * The shipped clamp bodies (`baseline.json`'s `Font Size` primitives) contain no nested
 * parentheses, so splitting `clamp(...)`'s inner argument list on top-level commas is safe without
 * a full CSS parser.
 *
 * @since TBD
 */
const CLAMP_PATTERN = /^clamp\((.*)\)$/;

/**
 * Read the authored scalar out of a fluid font-size step's resolved value. Every shipped `Font
 * Size` baseline entry authors its scalar `$value` as the clamp's own `max` argument, so the max IS
 * the value a size chip or a SIZE field should show — the resolved `clamp(...)` string is correct
 * CSS for the sample text but wrong for either of those.
 *
 * @param {string} value The feed's resolved value for a font-size token, a plain dimension or a
 *                        `clamp(min, preferred, max)` string.
 *
 * @since TBD
 *
 * @return {string} The clamp's `max` argument for a `clamp(...)` string, or the value verbatim for
 *         a plain dimension, an empty string, or a `clamp(...)` string this parses no further than
 *         three top-level arguments (the honest fallback).
 */
export function fontSizeDisplayValue(value) {
	if (typeof value !== 'string') {
		return value;
	}

	const match = value.trim().match(CLAMP_PATTERN);

	if (!match) {
		return value;
	}

	const args = match[1].split(',').map((arg) => arg.trim());

	return args.length === 3 ? args[2] : value;
}

/**
 * Read the page-load font catalog global the Localizer emits (Google font names plus site custom
 * fonts). Fail-safe on a missing/malformed global, mirroring `getDesignTokensFeed()`'s posture —
 * a caller never has to null-check before using either list.
 *
 * @since TBD
 *
 * @return {{google: string[], custom: string[]}} The catalog, or two empty lists when unavailable.
 */
export function getFontCatalog() {
	const catalog = window.kadenceDesignTokensFontCatalog;

	return {
		google: Array.isArray(catalog?.google) ? catalog.google : [],
		custom: Array.isArray(catalog?.custom) ? catalog.custom : [],
	};
}

/**
 * Find the design-system font (a `fontOptions()` entry) whose first family matches a catalog
 * family name, case-insensitively and ignoring wrapping quotes on either side.
 *
 * @param {Array<{id: string, label: string}>} fonts The design-system fonts (`fontOptions()`).
 * @param {string}                              name  The catalog family name to match.
 *
 * @since TBD
 *
 * @return {?{id: string, label: string}} The matching font, or `null` when none matches.
 */
export function findFontByFamily(fonts, name) {
	const needle = unquoteFamily(String(name ?? '').trim()).toLowerCase();

	return fonts.find((font) => unquoteFamily(String(font.label ?? '').trim()).toLowerCase() === needle) ?? null;
}

/**
 * Derive a slug stem — a kebab-case id a new token can be minted with — from a catalog family name: lowercase, diacritics
 * stripped (NFD-normalize, then drop the combining marks), any run outside `[a-z0-9]` collapsed to
 * a single hyphen, edge hyphens trimmed. A name that yields nothing (fully non-Latin) falls back to
 * `'font'` rather than an empty slug. Collision suffixing is `nextScaleSlug`'s job, not this
 * helper's — this only derives the stem.
 *
 * @param {string} name The catalog family name.
 *
 * @since TBD
 *
 * @return {string} The derived slug stem, never empty.
 */
export function fontFamilySlug(name) {
	const stripped = String(name ?? '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');

	const slug = stripped.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

	return slug || 'font';
}

/**
 * Decide the FONT dropdown's contextual button state for a catalog pick: `'add'` (enabled) when
 * the pick matches no design-system font, `'delete'` when it matches a user-created one, or
 * `'add'` (disabled) when it matches a baseline font — a baseline font can never be re-added and
 * must never be offered for deletion (the server independently refuses baseline deletion with 403
 * `rest_design_tokens_locked`; this is defense-in-depth, not the authority).
 *
 * @param {Array<{id: string, label: string, userCreated: boolean}>} fonts The design-system fonts
 *                                                                          (`fontOptions()`).
 * @param {string}                                                    name  The catalog family name
 *                                                                          currently shown in the
 *                                                                          dropdown.
 *
 * @since TBD
 *
 * @return {{type: ('add'|'delete'), disabled: boolean, font: ?Object}} The button state.
 */
export function fontActionFor(fonts, name) {
	const match = findFontByFamily(fonts, name);

	if (!match) {
		return { type: 'add', disabled: false, font: null };
	}

	if (isDeletable(match)) {
		return { type: 'delete', disabled: false, font: match };
	}

	return { type: 'add', disabled: true, font: match };
}
