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
 * the whole declaration. A unitless `0` needs no capping anyway: the spacing scale's `None` step
 * resolves to a unitless `0`, and wrapping it once produced exactly that invalid declaration, which
 * the browser silently dropped — leaving the previous padding on screen with nothing assigned.
 *
 * The cap is either one length for every side, or a per-axis pair. With a pair, each component is
 * capped by the axis it lands on under the CSS box shorthand: even positions are vertical (top,
 * and bottom in the 3-value form), odd positions horizontal — which maps `v h`, `v h v`, and
 * `v h v h` correctly, and caps a single all-sides value by the vertical axis (any realistic
 * spacing sits far below either viewport cap, so the distinction never shows there).
 *
 * @param {string}                                   value The resolved value: one length, or a
 *                                                         space-separated shorthand.
 * @param {string|{vertical: string, horizontal: string}} cap The most any one side may show — a
 *                       LENGTH (not a percentage, because the preview grows to fit the value rather
 *                       than insetting into a fixed frame), or a per-axis `{vertical, horizontal}`
 *                       pair of lengths.
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

	const capFor = (index) => (typeof cap === 'string' ? cap : index % 2 === 0 ? cap.vertical : cap.horizontal);
	const parts = sides.split(/\s+/);

	// A one-value shorthand stands for all four sides, so a per-axis cap has to expand it to the
	// vertical/horizontal pair first — capping it in place would hold the left and right sides to the
	// vertical bound. The two-, three- and four-value forms already alternate vertical, horizontal by
	// index, so they need no expansion.
	const expanded = parts.length === 1 && typeof cap !== 'string' ? [parts[0], parts[0]] : parts;

	return expanded
		.map((side, index) => (/^[+-]?\d*\.?\d+[a-z%]+$/i.test(side) ? `min(${side}, ${capFor(index)})` : side))
		.join(' ');
}
