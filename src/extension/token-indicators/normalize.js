/**
 * Kind-aware value normalization for the design-token indicator's bound-vs-overridden compare.
 *
 * A control's stored attribute value and the selected preset's resolved value are compared after being
 * reduced to a canonical form per `kind`:
 *   - `color`      — a Kadence palette slug (`palette3`) is resolved to its literal via the global
 *                    palette map, then lower-cased; a literal (`#3182CE`, `rgb(...)`) is lower-cased.
 *   - `dimension`  — the numeric value is paired with its unit (`{ value, unit }`), tolerant of the
 *                    4-side array shape a measurement control writes.
 *   - `text`       — trimmed string compare.
 */

import { get } from 'lodash';

/**
 * The editor's global color palette map (`paletteN -> literal color`). Kadence localizes the theme
 * palette as `window.kadence_blocks_params.global_colors`, keyed by CSS custom-property name
 * (`--global-palette1`..`--global-palette9`); this reader strips the `--global-` prefix so the map keys
 * line up with the bare `paletteN` slug a color control writes into a block attribute (confirmed against
 * `SinglePopColorControl`, the swatch component behind `PopColorControl`). Empty when the params are
 * absent, so an unresolved slug simply compares as itself — the degrade-safe fallback.
 *
 * @since TBD
 *
 * @return {Object} slug ('paletteN') => color literal.
 */
function paletteMap() {
	const colors = get(window, ['kadence_blocks_params', 'global_colors'], {}) || {};

	return Object.keys(colors).reduce((map, cssVar) => {
		const slug = cssVar.replace(/^--global-/, '');

		map[slug] = colors[cssVar];

		return map;
	}, {});
}

/**
 * Resolve a color attribute value to a comparable literal: a `paletteN` slug becomes its mapped color;
 * anything else passes through. Lower-cased so `#3182CE` and `#3182ce` compare equal. An unresolved slug
 * (palette map missing the key) passes through as the slug itself, which degrades safe — it never
 * produces a false match, at worst a false override.
 *
 * @param {*} value The stored color value (slug or literal), possibly empty.
 *
 * @since TBD
 *
 * @return {string} The comparable literal, or '' when empty.
 */
export function normalizeColor(value) {
	if (value === undefined || value === null || value === '') {
		return '';
	}

	const literal = paletteMap()[value] || value;

	return String(literal).trim().toLowerCase();
}

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
 * The selected preset's value for a property AT THE ACTIVE DEVICE: its breakpoint override where the
 * preset declares one, otherwise the value it inherits through the cascade.
 *
 * A preset can carry per-breakpoint values, and the button renders them — so a control sitting on
 * Tablet that falls back to the preset's desktop value names a size the block is not rendering at
 * that breakpoint. The fallback order mirrors the projected CSS: Mobile takes the mobile override,
 * then the tablet one, then the base; Tablet takes the tablet override, then the base.
 *
 * @param {*}      presetValue  The preset's base value for the property.
 * @param {Object} [responsive] The preset's breakpoint values ({ tablet, mobile }), each undefined
 *                              when the preset declares no override there.
 * @param {string} [device]     The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 *
 * @since TBD
 *
 * @return {*} The preset's value in effect at that device.
 */
export function presetValueForDevice(presetValue, responsive = {}, device = 'Desktop') {
	const chain =
		'Mobile' === device ? [responsive.mobile, responsive.tablet] : 'Tablet' === device ? [responsive.tablet] : [];

	const override = chain.find((value) => value !== undefined && value !== null && value !== '');

	return override === undefined ? presetValue : override;
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
 * The linked/individual mode a measure control should open in, derived from the corners the user would
 * actually see: each stored corner where one is set, otherwise the value that corner inherits from the
 * selected preset.
 *
 * Deriving from the stored attribute alone is not enough. A block on a preset stores NOTHING — every
 * corner is empty, which trivially reads as "all equal" — so a preset carrying four different corners
 * would open the control in linked mode and hide the difference it is displaying.
 *
 * @param {*} value       The stored dimension value (4-side array or scalar).
 * @param {*} presetValue The selected preset's value for the property.
 *
 * @since TBD
 *
 * @return {string} 'linked' when every effective corner matches, otherwise 'individual'.
 */
export function deriveMeasureMode(value, presetValue) {
	const stored = dimensionSlots(value);
	const corners = [0, 1, 2, 3].map((index) =>
		stored[index] !== undefined && stored[index] !== '' ? stored[index] : presetSlotAt(presetValue, index)
	);

	return corners.every((corner) => corner === corners[0]) ? 'linked' : 'individual';
}

/**
 * Normalize a dimension attribute to `{ value, unit }`. A measurement control writes a 4-side array
 * (`[top, right, bottom, left]`); the representative value is the first populated side. An empty value
 * yields an empty marker so "no override" is detectable. This is the scalar view used for empty
 * detection and the single-value path; the bound-vs-overridden compare uses the side-aware `matchesPreset`
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
 * Normalize a text attribute for compare.
 *
 * @param {*} value The stored value.
 *
 * @since TBD
 *
 * @return {string} The trimmed string, or '' when empty.
 */
export function normalizeText(value) {
	if (value === undefined || value === null) {
		return '';
	}

	return String(value).trim();
}

/**
 * Whether a stored attribute value is "empty" (untouched) for its kind — the signal a retarget-bound
 * control uses for `empty => bound`.
 *
 * @param {string} kind  The property kind ('color' | 'dimension' | 'text').
 * @param {*}      value The stored primary attribute value.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is unset/empty.
 */
export function isEmptyValue(kind, value) {
	if (kind === 'dimension') {
		return normalizeDimension(value, '').value === '';
	}

	return normalizeColor(value) === '' && normalizeText(value) === '';
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
function parseDimensionLiteral(literal) {
	const match = String(literal || '')
		.trim()
		.match(/^(-?[\d.]+)\s*([a-z%]*)$/i);

	if (!match) {
		return { value: String(literal || '').trim(), unit: '' };
	}

	return { value: match[1], unit: match[2] };
}

/**
 * Whether a stored dimension matches a PER-CORNER preset value, compared slot by slot.
 *
 * Comparing by position means a rotated set of the same corners (e.g. `4,8,4,8` against `8,4,8,4`) reads
 * as overridden, and a stored value with a different number of populated sides than the preset has slots
 * cannot match at all.
 *
 * @param {string[]} sides       The stored sides, empties already dropped.
 * @param {string}   storedUnit  The stored companion unit.
 * @param {Array}    presetSlots The preset's per-corner literals.
 *
 * @since TBD
 *
 * @return {boolean} True when every corner equals its preset slot.
 */
function matchesPresetSlots(sides, storedUnit, presetSlots) {
	const stored = sides;
	const presets = presetSlots.map(parseDimensionLiteral);

	if (stored.length !== presets.length) {
		return false;
	}

	return stored.every((side, index) => {
		const preset = presets[index];
		const unitMatches = preset.unit === '' || storedUnit === preset.unit;

		return unitMatches && side === preset.value;
	});
}

/**
 * Whether a stored value equals the selected preset's resolved value, normalized per kind.
 *
 * @param {string} kind        The property kind.
 * @param {*}      value       The stored primary attribute value.
 * @param {string} unit        The companion unit (dimension only; '' otherwise).
 * @param {string} presetValue The preset's resolved literal for this property.
 *
 * @since TBD
 *
 * @return {boolean} True when the stored value matches the preset value.
 */
export function matchesPreset(kind, value, unit, presetValue) {
	if (kind === 'dimension') {
		const sides = dimensionSides(value);
		const storedUnit = String(unit || '').trim();

		if (!sides.length) {
			return false;
		}

		// A per-corner preset value is compared corner by corner. `parseDimensionLiteral` reads one length,
		// so a slot list handed to it whole would never match and the control would read as overridden even
		// when it exactly matches its preset.
		if (Array.isArray(presetValue)) {
			return matchesPresetSlots(sides, storedUnit, presetValue);
		}

		const preset = parseDimensionLiteral(presetValue);
		const unitMatches = preset.unit === '' || storedUnit === preset.unit;

		// Side-aware: a stored dimension matches only when EVERY populated side equals the preset value.
		// A per-corner override (e.g. `['8','8','8','4']` vs `8px`) leaves one side differing and so reads
		// as overridden, not still-bound.
		return unitMatches && sides.every((side) => side === preset.value);
	}

	if (kind === 'color') {
		return normalizeColor(value) === normalizeColor(presetValue);
	}

	return normalizeText(value) === normalizeText(presetValue);
}
