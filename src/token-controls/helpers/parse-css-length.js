/**
 * A small pure helper that splits a resolved CSS length literal (a design token's `value`, e.g.
 * `'0.5rem'`) into its numeric size and unit, so a control's unlink action can write the number
 * back into its bare-number attribute slot and reconcile the shared unit attribute.
 *
 * This is the JS cousin of the PHP plan-level rule that raw-number attributes need explicit unit
 * conversion — the conversion lives with the consumer (the block's unlink handler), never inside
 * the shared control.
 */

/**
 * Matches an optionally-signed decimal number followed by an optional CSS length unit. A bare
 * number (no unit, e.g. `'12'`) and `'0'` both match with an empty unit — CSS treats a unitless
 * zero as valid, and the caller decides whether to keep the current shared unit in that case.
 */
const CSS_LENGTH_PATTERN = /^(-?\d*\.?\d+)(px|em|rem|%)?$/;

/**
 * Parse a CSS length literal into its numeric size and unit.
 *
 * @param {*} value The literal to parse (e.g. `'0.5rem'`, `'6px'`, `'50%'`, `'0'`, `12`).
 *
 * @since TBD
 *
 * @return {?{size: number, unit: string}} `{ size, unit }` when the value is a well-formed CSS
 * length (`unit` is `''` for a unitless number or `'0'`); `null` when the value cannot be parsed
 * (e.g. a dangling alias's missing entry, or a non-length string like `'auto'`).
 */
export function parseCssLength(value) {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return { size: value, unit: '' };
	}

	if (typeof value !== 'string') {
		return null;
	}

	const match = CSS_LENGTH_PATTERN.exec(value.trim());

	if (!match) {
		return null;
	}

	return { size: parseFloat(match[1]), unit: match[2] || '' };
}
