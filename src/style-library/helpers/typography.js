/**
 * The Typography screen's pure helpers: mapping the `Font Family` feed group into the FONT
 * selector's options, and reading a fluid font-size step's authored scalar out of its resolved
 * `clamp(...)` CSS. No React, no JSX, no REST — see `components/pages/TypographyScreen.js` for
 * where these plug into the scale-screen contract.
 */

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
 * @return {Array<{id: string, label: string, stack: string}>} The font options, or `[]` for a
 *         missing schema or an unknown group.
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
