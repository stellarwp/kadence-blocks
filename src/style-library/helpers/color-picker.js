/**
 * Pure logic for the Style Library's color picker: turning `react-color`'s internal RGB state
 * into the CSS hex string the picker emits to its consumers, deriving the next `react-color`
 * onChange payload from an edited hex/RGB/HSL field, and toggling which of those two field rows
 * is shown.
 *
 * `react-color`'s own `toState()` (used internally by `CustomPicker`) always returns a 6-digit
 * `hex` with alpha stripped out, even when the color is translucent — alpha only survives on
 * `rgb.a`/`hsl.a`. `toCssColor()` below is what re-attaches it for this picker's output.
 */

/**
 * WordPress dependencies
 */
import { isValidHex } from 'react-color/lib/helpers/color';

/**
 * Clamp a number between a minimum and maximum.
 *
 * @param {number} value The number to clamp.
 * @param {number} min   The minimum.
 * @param {number} max   The maximum.
 *
 * @since TBD
 *
 * @return {number} The clamped number.
 */
function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

/**
 * Convert a 0-255 channel value to a two-digit lowercase hex pair.
 *
 * @param {number} value The channel value.
 *
 * @since TBD
 *
 * @return {string} A two-character hex pair.
 */
function channelToHex(value) {
	return Math.round(clamp(value, 0, 255))
		.toString(16)
		.padStart(2, '0');
}

/**
 * Whether a field value carries no number at all. `react-color`'s `EditableInput` reports a cleared
 * field as `''`, which `Number()` reads as 0 rather than `NaN`, so emptiness has to be tested before
 * any numeric parse rather than after it.
 *
 * @param {*} value The candidate value.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is absent or blank.
 */
function isBlank(value) {
	return value === undefined || value === null || String(value).trim() === '';
}

/**
 * Round an alpha value to two decimal places and clamp it to 0-1.
 *
 * @param {*} value The candidate alpha value.
 *
 * @since TBD
 *
 * @return {number} The clamped, rounded alpha, or 1 when `value` is not a number.
 */
function clampAlpha(value) {
	if (isBlank(value)) {
		return 1;
	}

	const number = Number(value);

	if (Number.isNaN(number)) {
		return 1;
	}

	return Math.round(clamp(number, 0, 1) * 100) / 100;
}

/**
 * Read a numeric field value, falling back when it is missing or not a number.
 *
 * @param {*}      value    The candidate value.
 * @param {number} fallback The value to use when `value` is not a usable number.
 *
 * @since TBD
 *
 * @return {number} The parsed number, or `fallback`.
 */
function numberOr(value, fallback) {
	if (isBlank(value)) {
		return fallback;
	}

	const number = Number(value);

	return Number.isNaN(number) ? fallback : number;
}

/**
 * Read an HSL percentage field value (accepts a trailing "%"), falling back when missing.
 *
 * @param {*}      value    The candidate value.
 * @param {number} fallback The 0-1 fraction to use when `value` is not a usable number.
 *
 * @since TBD
 *
 * @return {number} The parsed 0-1 fraction, or `fallback`.
 */
function percentOr(value, fallback) {
	if (isBlank(value)) {
		return fallback;
	}

	const number = Number(String(value).replace('%', ''));

	return Number.isNaN(number) ? fallback : number / 100;
}

/**
 * Convert a `react-color` RGB state (0-255 channels, 0-1 alpha) to this picker's output format: a
 * 6-digit hex when fully opaque, an 8-digit hex (alpha appended) otherwise.
 *
 * @param {Object} rgb   The RGB state.
 * @param {number} rgb.r The red channel (0-255).
 * @param {number} rgb.g The green channel (0-255).
 * @param {number} rgb.b The blue channel (0-255).
 * @param {number} [rgb.a] The alpha channel (0-1). Treated as fully opaque when omitted.
 *
 * @since TBD
 *
 * @return {string} An uppercase-free `#rrggbb` or `#rrggbbaa` string.
 */
export function toCssColor({ r, g, b, a = 1 }) {
	const hex = `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;

	return a >= 1 ? hex : `${hex}${channelToHex(clampAlpha(a) * 255)}`;
}

/**
 * The color-fields row's numeric formats, in cycling order. A third format (e.g. HSB) only needs
 * adding here — `cycleFieldsView()` and its chevron pair need no other change.
 *
 * @since TBD
 */
const FIELDS_VIEWS = ['rgb', 'hsl'];

/**
 * Step the color-fields row's numeric view forward or backward through `FIELDS_VIEWS`, wrapping at
 * either end. Backs the chevron pair, which is a cycle control (there is no "first" or "last" view
 * to stop at) rather than a bounded stepper.
 *
 * @param {'rgb'|'hsl'} view      The current view.
 * @param {1|-1}        direction 1 to step forward (chevron down), -1 to step backward (chevron up).
 *
 * @since TBD
 *
 * @return {'rgb'|'hsl'} The next view.
 */
export function cycleFieldsView(view, direction) {
	const length = FIELDS_VIEWS.length;
	const index = FIELDS_VIEWS.indexOf(view);
	const nextIndex = (index + direction + length) % length;

	return FIELDS_VIEWS[nextIndex];
}

/**
 * Derive the next `react-color` onChange payload from a single edited color-fields input. Each
 * `EditableInput` fires with only its own key set on `data` (e.g. `{ r: 12 }` or `{ hex: 'fff' }`),
 * so this reads whichever key is present and fills the rest from `current`.
 *
 * @param {'rgb'|'hsl'}                                       view    The field row currently shown.
 * @param {Object}                                            data    The edited input's payload.
 * @param {{rgb: {r:number,g:number,b:number,a:number}, hsl: {h:number,s:number,l:number,a:number}}} current The picker's current color state.
 *
 * @since TBD
 *
 * @return {Object|null} A `react-color`-shaped change payload, or null when `data` matches
 *                        nothing this picker's fields can produce (e.g. an invalid hex).
 */
export function deriveFieldsChange(view, data, current) {
	if (typeof data.hex === 'string') {
		return isValidHex(data.hex) ? { hex: data.hex, source: 'hex' } : null;
	}

	if (view === 'hsl') {
		if (data.h !== undefined || data.s !== undefined || data.l !== undefined) {
			return {
				h: numberOr(data.h, current.hsl.h),
				s: percentOr(data.s, current.hsl.s),
				l: percentOr(data.l, current.hsl.l),
				a: current.hsl.a,
				source: 'hsl',
			};
		}

		if (data.a !== undefined) {
			return {
				h: current.hsl.h,
				s: current.hsl.s,
				l: current.hsl.l,
				a: clampAlpha(numberOr(data.a, current.hsl.a)),
				source: 'hsl',
			};
		}

		return null;
	}

	if (data.r !== undefined || data.g !== undefined || data.b !== undefined) {
		return {
			r: numberOr(data.r, current.rgb.r),
			g: numberOr(data.g, current.rgb.g),
			b: numberOr(data.b, current.rgb.b),
			a: current.rgb.a,
			source: 'rgb',
		};
	}

	if (data.a !== undefined) {
		return {
			r: current.rgb.r,
			g: current.rgb.g,
			b: current.rgb.b,
			a: clampAlpha(numberOr(data.a, current.rgb.a)),
			source: 'rgb',
		};
	}

	return null;
}
