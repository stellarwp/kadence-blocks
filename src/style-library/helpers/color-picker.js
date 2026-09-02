/**
 * Pure logic for comparing colors in the Style Library's own fields.
 *
 * The rest of this module's original logic (`cycleFieldsView`, `deriveFieldsChange`, `toCssColor`)
 * moved to `src/token-controls/helpers/color-picker.js` alongside the relocated `ColorPicker`
 * component — `isSameColor()` stays behind because it is used only by `ColorGradientPicker.js`,
 * which is not part of that relocation.
 */

/**
 * Internal dependencies
 */
import { colord } from './colord';

/**
 * Whether two values name the same color despite differing in spelling. This picker emits one
 * canonical lowercase hex, while a stored value can be uppercase (`#3182CE`), short (`#FFF`), a
 * keyword (`transparent`), or a function form — so a trip through the picker that lands back on the
 * starting color would otherwise read as an edit and leave the settings panel dirty.
 *
 * Anything unparsable — a gradient, an empty string — compares equal to nothing, including itself,
 * so an unrecognized value always counts as changed rather than silently swallowing an edit.
 *
 * @param {*} a The first value.
 * @param {*} b The second value.
 *
 * @since TBD
 *
 * @return {boolean} True when both parse to the same color.
 */
export function isSameColor(a, b) {
	const left = colord(a || '');
	const right = colord(b || '');

	return left.isValid() && right.isValid() && left.toHex() === right.toHex();
}
