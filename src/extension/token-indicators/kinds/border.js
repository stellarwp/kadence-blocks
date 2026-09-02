/**
 * Kind-aware normalization and compare for the `border-width`/`border-style`/`border-color` kinds — read
 * ONE axis (width, style or color) out of `EditorBorderControl`'s nested per-side native shape
 * (`[{ top: [color, style, size], right: [...], ... }]`), compared uniformly across all four sides. The
 * three axes share one native attribute (`borderStyle`), so `usePresetBinding` calls each of these once
 * per axis and combines the results — see its own docblock.
 */

import { isTokenAlias } from '../../../token-controls/helpers/token-summary';
import { normalizeColor } from './color';
import { normalizeText } from './text';
import { parseDimensionLiteral } from './dimension';

/**
 * The order `EditorBorderControl`'s native shape stores per-side tuples in, and the index each axis
 * occupies within a side's `[color, style, size]` tuple.
 *
 * @since TBD
 *
 * @type {string[]}
 */
export const BORDER_SIDES = ['top', 'right', 'bottom', 'left'];

/**
 * The index within a side's `[color, style, size]` tuple for each border axis kind.
 *
 * @since TBD
 *
 * @type {Object<string, number>}
 */
export const BORDER_AXIS_INDEX = {
	'border-color': 0,
	'border-style': 1,
	'border-width': 2,
};

/**
 * `EditorBorderControl`'s native per-side source object (`native[0]`), or `null` for the never-written
 * shape (`undefined`, `[]`, or an array with no first element) — matching `fromNativeBorder`'s own
 * `!source` short-circuit, which is this module's "empty/bound" reading for every border axis.
 *
 * @param {*} value The stored `borderStyle`-shaped attribute value.
 *
 * @since TBD
 *
 * @return {Object|null} The native source object, or null when never written.
 */
function borderSource(value) {
	return (Array.isArray(value) ? value[0] : undefined) || null;
}

/**
 * A side's width slot (`source[side][2]`) as a literal comparable to a resolved dimension token value:
 * a token alias passes through whole, otherwise the numeric size is paired with the border's own
 * shared unit (`source.unit`) — matching `fromNativeBorder`'s own width mapping so this reads the exact
 * literal the control itself would show.
 *
 * @param {*}      size The side's stored width slot.
 * @param {string} unit The border's shared unit (`source.unit`, defaulting to 'px').
 *
 * @since TBD
 *
 * @return {string} The width literal, or '' when the slot is unset.
 */
function borderWidthLiteral(size, unit) {
	if (size === '' || size === undefined || size === null) {
		return '';
	}

	return isTokenAlias(size) ? String(size) : `${size}${unit}`;
}

/**
 * Whether every side of a stored `borderStyle`-shaped value matches the preset's resolved literal for
 * ONE axis (width, style or color) — the per-axis compare `matches` delegates to for a
 * `border-width`/`border-style`/`border-color` kind.
 *
 * @param {string} kind        One of 'border-width' | 'border-style' | 'border-color'.
 * @param {Object} source      The native border source object (`value[0]`), already confirmed non-null.
 * @param {string} presetValue The preset's resolved literal for this axis.
 *
 * @since TBD
 *
 * @return {boolean} True when every side's axis value equals the preset value.
 */
function matchesBorderAxis(kind, source, presetValue) {
	const index = BORDER_AXIS_INDEX[kind];
	const unit = source.unit || 'px';

	if (kind === 'border-width') {
		const preset = parseDimensionLiteral(presetValue);

		return BORDER_SIDES.every((side) => {
			const literal = borderWidthLiteral((source[side] || [])[index], unit);

			if (literal === '') {
				return false;
			}

			if (isTokenAlias(literal)) {
				return literal === presetValue;
			}

			const stored = parseDimensionLiteral(literal);
			const unitMatches = preset.unit === '' || stored.unit === preset.unit;

			return unitMatches && stored.value === preset.value;
		});
	}

	if (kind === 'border-color') {
		return BORDER_SIDES.every(
			(side) => normalizeColor((source[side] || [])[index]) === normalizeColor(presetValue)
		);
	}

	return BORDER_SIDES.every(
		(side) => normalizeText((source[side] || [])[index] || 'none') === normalizeText(presetValue)
	);
}

/**
 * Whether a stored attribute value is "empty" (untouched) for a border axis kind — the signal a
 * retarget-bound control uses for `empty => bound`.
 *
 * All three axes share one native shape, and the moment any side is written `toNativeBorder` always
 * fills in all four — so "empty" is a single source-level check, not per-axis.
 *
 * @param {*} value The stored primary attribute value.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is unset/empty.
 */
export function isEmpty(value) {
	return borderSource(value) === null;
}

/**
 * Whether a stored border axis value equals the selected preset's resolved value.
 *
 * @param {string} kind        One of 'border-width' | 'border-style' | 'border-color'.
 * @param {*}      value       The stored primary attribute value.
 * @param {string} unit        Unused for border kinds (the shared unit lives on the stored value itself).
 * @param {string} presetValue The preset's resolved literal for this axis.
 *
 * @since TBD
 *
 * @return {boolean} True when the stored value matches the preset value.
 */
export function matches(kind, value, unit, presetValue) {
	const source = borderSource(value);

	return source !== null && matchesBorderAxis(kind, source, presetValue);
}
