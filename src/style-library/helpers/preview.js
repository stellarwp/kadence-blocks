/**
 * Preview-only presentation helpers shared by the preset screens' row previews. Pure functions:
 * no React, no feed access — resolution stays in `helpers/presets.js`, this is only about keeping
 * a resolved value displayable inside a list row.
 */

/**
 * Cap each side of a resolved box value (a padding or margin), so one extreme preset cannot make a
 * list row enormous.
 *
 * Each side is wrapped separately because a per-side preset stores four, and CSS `min()` takes a
 * single length rather than a shorthand. Only a component that is a NUMBER WITH A UNIT is wrapped,
 * and that restriction is load-bearing rather than defensive: `min()` requires its arguments to be
 * of one type, so `min(0, 2rem)` — mixing a number with a length — is invalid and the browser drops
 * the whole declaration. A unitless `0` needs no capping anyway.
 *
 * @param {string} value The resolved value: one length, or a space-separated shorthand.
 * @param {string} cap   The most any one side may show — a LENGTH, not a percentage, because the
 *                       preview grows to fit the value rather than insetting into a fixed frame.
 *
 * @since TBD
 *
 * @return {?string} The capped value, or undefined when there is nothing to apply.
 */
export function capBoxSides(value, cap) {
	if (!value) {
		return undefined;
	}

	// Trimmed before the second emptiness check rather than only before splitting: a whitespace-only
	// value has nothing to cap, and falling through would hand the caller an empty string instead of
	// the "no value to apply" that a JSX style prop needs to drop the property.
	const sides = String(value).trim();

	if (!sides) {
		return undefined;
	}

	return sides
		.split(/\s+/)
		.map((side) => (/^[+-]?\d*\.?\d+[a-z%]+$/i.test(side) ? `min(${side}, ${cap})` : side))
		.join(' ');
}
