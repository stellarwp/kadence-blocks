/**
 * The Icon Sizes screen's own pure formatting helper. The token stores one square dimension, but
 * the board's row list shows two — the `N x N` display is presentation-only, kept out of
 * `helpers/scale.js` because that file is shared contract surface owned by the base branch, while
 * this formatter is Icon Sizes vocabulary.
 */

/**
 * Format a stored icon-size dimension as the two-dimension string the row list shows, e.g.
 * `'1rem'` becomes `'1rem x 1rem'`. The value is a single square dimension, so both sides of the
 * `x` are the same stored string, verbatim — no unit conversion.
 *
 * @param {string} value The stored dimension value.
 *
 * @since TBD
 *
 * @return {string} The formatted `N x N` string, or an empty string for an empty/nullish value.
 */
export function iconSizeRowValue(value) {
	if (!value) {
		return '';
	}

	return `${value} x ${value}`;
}
