/**
 * Kind-aware normalization and compare for the `dimension` kind — the numeric value paired with its
 * unit (`{ value, unit }`), tolerant of the 4-side array shape a measurement control writes.
 */

import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { pxFromLength } from '../../../token-controls/helpers/px-from-length';

/**
 * The populated sides of a stored dimension value, each trimmed to a string. A measurement control writes
 * a 4-side array (`[top, right, bottom, left]`) where an untouched side is `''`; a scalar value is a
 * single side. Empty/undefined sides are dropped, so an all-empty value yields `[]` and a per-corner
 * override yields one entry per touched side — the shape a side-aware compare needs.
 *
 * @param {*} value The stored dimension value (number, string, or 4-side array).
 *
 * @since TBD
 *
 * @return {string[]} The populated sides as trimmed strings; empty array when nothing is set.
 */
function dimensionSides(value) {
	const raw = Array.isArray(value) ? value : [value];

	return raw.filter((side) => side !== '' && side !== undefined && side !== null).map((side) => String(side).trim());
}

/**
 * The stored sides of a dimension value with their POSITION preserved: a 4-side array maps one-to-one
 * and an untouched side stays `''`, while a scalar is a single slot. This is the positional counterpart
 * to `dimensionSides`, which drops empties and so cannot say WHICH corner a value belongs to — needed
 * wherever a per-corner value is composed or compared slot by slot.
 *
 * @param {*} value The stored dimension value (number, string, or 4-side array).
 *
 * @since TBD
 *
 * @return {string[]} The slots as trimmed strings, empty slots preserved as ''.
 */
export function dimensionSlots(value) {
	const raw = Array.isArray(value) ? value : [value];

	return raw.map((side) => (side === undefined || side === null ? '' : String(side).trim()));
}

/**
 * The value one corner inherits from the selected preset.
 *
 * A preset value is either a single literal, which every corner inherits, or a PER-CORNER list, in which
 * case the corner takes its matching slot.
 *
 * @param {*}      presetValue The selected preset's value for the property.
 * @param {number} index       The corner index.
 *
 * @since TBD
 *
 * @return {string} The inherited value for that corner, or '' when the preset has none.
 */
export function presetSlotAt(presetValue, index) {
	if (Array.isArray(presetValue)) {
		return String(presetValue[index] ?? '');
	}

	return presetValue === undefined || presetValue === null ? '' : String(presetValue);
}

/**
 * The corner a device's own breakpoint chain resolves to at ONE corner index, walking closest
 * breakpoint first — the per-corner counterpart to the whole-property fallback `presetValueForDevice`
 * runs for a non-corner value.
 *
 * A chain entry can itself be a per-corner list (with `''` gaps left by `resolve_responsive_literal()`
 * for a corner that breakpoint didn't touch) or a scalar (a breakpoint override captured as one
 * uniform value broadcasts to every corner). A gap at one breakpoint is skipped, not treated as
 * "found" — that is exactly what lets the NEXT breakpoint up (and ultimately the base) answer for
 * that corner instead.
 *
 * @param {Array} chain       The device's breakpoint values, closest first (e.g. Mobile's
 *                            `[responsive.mobile, responsive.tablet]`).
 * @param {*}     presetValue The preset's base value for the property, the last fallback.
 * @param {number} index      The corner index.
 *
 * @since TBD
 *
 * @return {string} The corner's resolved value at this device.
 */
function cornerValueForDevice(chain, presetValue, index) {
	for (const value of chain) {
		if (value === undefined || value === null) {
			continue;
		}

		const slot = Array.isArray(value) ? value[index] : value;

		if (slot !== undefined && slot !== null && slot !== '') {
			return String(slot);
		}
	}

	return presetSlotAt(presetValue, index);
}

/**
 * The selected preset's value for a property AT THE ACTIVE DEVICE: its breakpoint override where the
 * preset declares one, otherwise the value it inherits through the cascade.
 *
 * A preset can carry per-breakpoint values, and the button renders them — so a control sitting on
 * Tablet that falls back to the preset's desktop value names a size the block is not rendering at
 * that breakpoint. The fallback order mirrors the projected CSS: Mobile takes the mobile override,
 * then the tablet one, then the base; Tablet takes the tablet override, then the base.
 *
 * A per-corner (dimension) property's breakpoint override can be SPARSE — `resolve_responsive_literal()`
 * keeps a `''` gap at any corner a breakpoint didn't touch, meaning "not overridden here, keep
 * inheriting live" (see that method's own docblock). Each corner has to walk this cascade
 * independently rather than the property being resolved as one all-or-nothing unit, or a gap corner
 * would incorrectly inherit the WHOLE touched breakpoint's override instead of falling through to the
 * next breakpoint/base for just that corner. Whether this property is corner-shaped at all is read
 * from the data, not from a passed-in kind: a per-corner list shows up in the base value or in either
 * breakpoint's override, a plain scalar property never does.
 *
 * @param {*}      presetValue  The preset's base value for the property.
 * @param {Object} [responsive] The preset's breakpoint values ({ tablet, mobile }), each undefined
 *                              when the preset declares no override there.
 * @param {string} [device]     The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 *
 * @since TBD
 *
 * @return {*} The preset's value in effect at that device — a per-corner array when the property is
 *             corner-shaped, otherwise a scalar.
 */
export function presetValueForDevice(presetValue, responsive = {}, device = 'Desktop') {
	if ('Tablet' !== device && 'Mobile' !== device) {
		return presetValue;
	}

	const chain = 'Mobile' === device ? [responsive.mobile, responsive.tablet] : [responsive.tablet];
	const isCornerShaped = Array.isArray(presetValue) || chain.some((value) => Array.isArray(value));

	if (!isCornerShaped) {
		const override = chain.find((value) => value !== undefined && value !== null && value !== '');

		return override === undefined ? presetValue : override;
	}

	return [0, 1, 2, 3].map((index) => cornerValueForDevice(chain, presetValue, index));
}

/**
 * A preset's resolved value, or `fallback` when the preset sets nothing for the property.
 *
 * `0` is a real spacing value — it is what the fixed "None" pick resolves to — so a plain `||` would
 * discard it and show the block's own default instead, silently turning a deliberate "no spacing"
 * into the block's built-in spacing.
 *
 * @param {*} value    The preset's resolved value for the property.
 * @param {*} fallback What to use when the preset sets nothing.
 *
 * @since TBD
 *
 * @return {*} The value to display.
 */
export function presetValueOr(value, fallback) {
	return value === undefined || value === null || value === '' ? fallback : value;
}

/**
 * The attribute a responsive measure control is editing at the given device, and its current value.
 *
 * A responsive measure control keeps ONE linked/individual mode but writes three separate attributes
 * (`borderRadius` / `tabletBorderRadius` / `mobileBorderRadius`). Deriving the mode — or collapsing
 * corners on "link" — against the desktop attribute while the editor is on Tablet reads and writes the
 * wrong breakpoint, so both must resolve the device's own attribute first.
 *
 * @param {Object} attributes  The block's attributes.
 * @param {string} baseAttr    The desktop attribute name.
 * @param {Object} [responsive] Device key ('tablet' | 'mobile') => attribute name.
 * @param {string} [device]    The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 *
 * @since TBD
 *
 * @return {{ attr: string, value: * }} The device's attribute name and its stored value.
 */
export function measureAttrsForDevice(attributes, baseAttr, responsive = {}, device = 'Desktop') {
	const attr = get(responsive, String(device).toLowerCase(), '') || baseAttr;

	return { attr, value: get(attributes, attr, '') };
}

/**
 * What each corner of a measure control inherits at the given device WHEN THE DEVICE STORES NOTHING —
 * the device's own value is deliberately left out, because this is the value the corner falls back to.
 *
 * A responsive measure control renders through a desktop -> tablet -> mobile cascade that runs PER CORNER:
 * an empty tablet corner takes the desktop corner, an empty mobile corner takes the tablet corner and
 * then the desktop one. Only once the whole device chain is empty does the corner reach the selected
 * preset. Resolving straight to the preset skips those steps, so a Tablet sitting on four different
 * desktop corners would report the preset's single value — naming a size the button is not rendering at
 * that breakpoint.
 *
 * Nothing here is written back, and this does NOT feed the linked/individual mode: the corners stay empty
 * so they keep inheriting, and the resolved values only tell the field's popover which size is currently
 * in effect and where it came from.
 *
 * @param {string} device        The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 * @param {Object} [values]      The stored dimension per device: { desktop, tablet }.
 * @param {*}      [presetValue] The selected preset's value for the property, the last fallback.
 *
 * @since TBD
 *
 * @return {{ values: string[], inherited: boolean[] }} The four inherited corners, and per corner whether
 *                                                      it came from another device rather than the preset.
 */
export function inheritedMeasureSlots(device, values = {}, presetValue) {
	const desktop = dimensionSlots(values.desktop);
	const tablet = dimensionSlots(values.tablet);

	// Mobile falls through tablet before desktop; tablet only through desktop; desktop inherits the preset.
	const chain = 'Mobile' === device ? [tablet, desktop] : 'Tablet' === device ? [desktop] : [];

	const slots = [0, 1, 2, 3].map((index) => {
		const from = chain.find((source) => {
			const corner = source[index];

			return corner !== undefined && corner !== null && corner !== '';
		});

		return from
			? { value: String(from[index]), inherited: true }
			: { value: presetSlotAt(presetValue, index), inherited: false };
	});

	return {
		values: slots.map((slot) => slot.value),
		inherited: slots.map((slot) => slot.inherited),
	};
}

/**
 * Whether a measure control's single row-level "Inherited" label should show, given each corner's
 * own inherited flag from `inheritedMeasureSlots()`.
 *
 * The control renders one label for all four corners, so "any corner inherited" is the safer read
 * than "every corner inherited": a mixed row — one corner pulled from another breakpoint, the rest
 * resolved straight to the preset — is no longer a plain preset default, and reporting "Default"
 * would understate that. `inherited` is always a four-element array, so a bare truthiness check on
 * the array itself is always `true`; this reduces it to the actual per-corner flags instead.
 *
 * @param {boolean[]} inherited Per-corner inherited flags, i.e. `inheritedMeasureSlots().inherited`.
 *
 * @since TBD
 *
 * @return {boolean} Whether any corner inherits from another breakpoint rather than the preset.
 */
export function anyCornerInherited(inherited) {
	return Array.isArray(inherited) && inherited.some(Boolean);
}

/**
 * The linked/individual mode a measure control should open in, derived from what THIS device actually
 * stores — nothing else.
 *
 * A device that stores nothing has nothing that differs, so it opens linked: its corners are empty
 * because they inherit, and what they inherit is shown MUTED as a single "Default"/"Inherited"
 * fallback rather than substituted into the four corners. Splitting an all-empty control into four
 * blank rows shows the user a difference none of their own values carry, and disagrees with the Style
 * Library, which renders exactly this case as one linked row.
 *
 * This deliberately does NOT consult the preset value. It used to, back when an unset corner was
 * DISPLAYED as bound to the preset's own per-corner value; with that substitution gone from the
 * control's display, deriving the mode from it would describe a shape the control no longer shows.
 *
 * @param {*} value The stored dimension value (4-side array or scalar).
 *
 * @since TBD
 *
 * @return {string} 'linked' when every stored corner matches, otherwise 'individual'.
 */
export function deriveMeasureMode(value) {
	const corners = dimensionSlots(value);

	return corners.every((corner) => corner === corners[0]) ? 'linked' : 'individual';
}

/**
 * Normalize a dimension attribute to `{ value, unit }`. A measurement control writes a 4-side array
 * (`[top, right, bottom, left]`); the representative value is the first populated side. An empty value
 * yields an empty marker so "no override" is detectable. This is the scalar view used for empty
 * detection and the single-value path; the bound-vs-overridden compare uses the side-aware `matches`
 * so a per-corner override is not masked by a matching first side.
 *
 * @param {*}      value The stored dimension value (number, string, or 4-side array).
 * @param {string} unit  The companion unit attribute (e.g. `borderRadiusUnit`).
 *
 * @since TBD
 *
 * @return {{ value: string, unit: string }} The canonical dimension, `value: ''` when empty.
 */
export function normalizeDimension(value, unit) {
	const sides = dimensionSides(value);

	if (!sides.length) {
		return { value: '', unit: '' };
	}

	return { value: sides[0], unit: String(unit || '').trim() };
}

/**
 * Split a resolved dimension literal (`"1.5rem"`, `"8px"`, `"0"`) into `{ value, unit }` so it compares
 * against the control's separate value/unit attributes.
 *
 * @param {string} literal The resolved dimension literal.
 *
 * @since TBD
 *
 * @return {{ value: string, unit: string }} The parsed value and unit.
 */
export function parseDimensionLiteral(literal) {
	const match = String(literal || '')
		.trim()
		.match(/^(-?[\d.]+)\s*([a-z%]*)$/i);

	if (!match) {
		return { value: String(literal || '').trim(), unit: '' };
	}

	return { value: match[1], unit: match[2] };
}

/**
 * Whether a stored dimension matches a PER-CORNER preset value, compared corner by corner at the SAME
 * index into `presetSlots`.
 *
 * The stored slots keep their position (a gap is `''`, not dropped), so the two lists line up index for
 * index and must be the same length. A gap slot counts as matching: an unset corner inherits the preset's
 * own value for that corner, so there is nothing there to disagree with. Because the compare is
 * positional, a rotated set of the same values (e.g. `4,8,4,8` against `8,4,8,4`) reads as overridden.
 *
 * @param {string[]} slots       The stored slots with position preserved, a gap kept as ''.
 * @param {string}   storedUnit  The stored companion unit.
 * @param {Array}    presetSlots The preset's per-corner literals.
 *
 * @since TBD
 *
 * @return {boolean} True when every populated corner equals its preset slot.
 */
function matchesPresetSlots(slots, storedUnit, presetSlots) {
	if (slots.length !== presetSlots.length) {
		return false;
	}

	return slots.every((slot, index) => slot === '' || lengthMatches(slot, storedUnit, presetSlots[index]));
}

/**
 * Whether one stored length equals one resolved preset literal.
 *
 * Two comparisons, in order:
 *
 * 1. **Same-unit string compare**, the ordinary case: a control stores its number in one attribute and
 *    its unit in a companion (`borderRadius` + `borderRadiusUnit`), so `8` + `px` equals `8px`. A
 *    preset literal carrying no unit of its own (a bare `0`) matches any stored unit.
 * 2. **Pixel compare**, for a control that stores a RAW NUMBER with no companion unit attribute at all
 *    — `kadence/single-icon`'s `size`, written straight into the SVG's geometry attributes. Its
 *    attribute default is seeded from the token by PHP's `Converts_Number_To_Px`, so a never-touched
 *    icon holds `24` while its preset resolves to `1.5rem`. Compared as strings those disagree and an
 *    untouched control reports as overridden. Converting through `pxFromLength` — the JS mirror of that
 *    same PHP trait, pinned to it by a shared conformance fixture — makes the two agree exactly when
 *    the seeding says they should.
 *
 * The pixel path is reached only when the stored value has NO unit and the preset literal HAS one, so a
 * control that does carry a unit attribute is unaffected: an `em` value against a `px` preset still
 * reads as overridden rather than being silently converted into agreement.
 *
 * @param {string} side          The stored length, without its unit.
 * @param {string} storedUnit    The stored companion unit, '' when the control has none.
 * @param {*}      presetLiteral The preset's resolved literal for this slot.
 *
 * @since TBD
 *
 * @return {boolean} True when the two describe the same length.
 */
function lengthMatches(side, storedUnit, presetLiteral) {
	const preset = parseDimensionLiteral(presetLiteral);

	if (preset.unit === '' || storedUnit === preset.unit) {
		return side === preset.value;
	}

	if (storedUnit !== '') {
		return false;
	}

	const presetPx = pxFromLength(presetLiteral);

	return presetPx !== null && side !== '' && Number(side) === presetPx;
}

/**
 * Whether a stored attribute value is "empty" (untouched) for the `dimension` kind — the signal a
 * retarget-bound control uses for `empty => bound`.
 *
 * @param {*} value The stored primary attribute value.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is unset/empty.
 */
export function isEmpty(value) {
	return normalizeDimension(value, '').value === '';
}

/**
 * Whether a stored dimension value equals the selected preset's resolved value.
 *
 * A PER-CORNER preset is compared positionally against the stored slots, with a gap slot always counted
 * as matching because that corner inherits the preset's own value for that corner. So a partial override
 * — e.g. only the top corner set at Tablet — still reads as bound when the corner(s) the user did touch
 * agree with the preset. A scalar preset keeps the side-aware compare below: every POPULATED side must
 * equal the one preset value.
 *
 * @param {*}      value       The stored primary attribute value.
 * @param {string} unit        The companion unit.
 * @param {string} presetValue The preset's resolved literal for this property.
 *
 * @since TBD
 *
 * @return {boolean} True when the stored value matches the preset value.
 */
export function matches(value, unit, presetValue) {
	// `parseDimensionLiteral` reads one length, so a slot list handed to it whole would never match and
	// the control would read as overridden even when it exactly matches its preset.
	if (Array.isArray(presetValue)) {
		const slots = dimensionSlots(value);

		// A fully untouched value has nothing to agree with the preset about; keep it reading as unmatched.
		if (!slots.some((slot) => slot !== '')) {
			return false;
		}

		return matchesPresetSlots(slots, String(unit || '').trim(), presetValue);
	}

	const sides = dimensionSides(value);

	if (!sides.length) {
		return false;
	}

	const storedUnit = String(unit || '').trim();

	// Side-aware: a stored dimension matches only when EVERY populated side equals the preset value.
	// A per-corner override (e.g. `['8','8','8','4']` vs `8px`) leaves one side differing and so reads
	// as overridden, not still-bound.
	return sides.every((side) => lengthMatches(side, storedUnit, presetValue));
}
