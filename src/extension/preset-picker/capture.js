/**
 * Capture a block's current visual token values for its preset surface.
 *
 * "Save as a new preset" should persist exactly what the editor shows: the selected preset's values with
 * the block's edits (its mapped attribute overrides) layered on top. This reads each mapped control — its
 * edited value when it has one, else the selected preset's value — and reduces it to the literal a preset
 * token stores.
 */
import { get } from 'lodash';
import { KADENCE_TOKEN_NAMESPACE } from '../../token-controls/helpers/preset-envelope';
import { activeLibrary, activePresetFor, blockProperties, blockPresetValues } from './index';
import { BORDER_AXIS_KIND } from '../token-indicators';
import {
	normalizeColor,
	normalizeDimension,
	normalizeText,
	isEmptyValue,
	dimensionSlots,
	presetSlotAt,
} from '../token-indicators/normalize';
import { isTokenAlias } from '../design-tokens/alias';
import { tokenLiteral } from '../design-tokens/token-literals';

/**
 * The vendor extension a responsive token leaf carries its per-breakpoint overrides under. Mirrors the
 * PHP `Extensions` vendor key.
 *
 * @since TBD
 */
// The one definition lives with the envelope contract both hosts read and write.
const VENDOR_EXTENSION = KADENCE_TOKEN_NAMESPACE;

/**
 * The breakpoints a responsive property can override, narrowest last — the order the device cascade runs
 * in, so each breakpoint's unset corners fall back to the one above it.
 *
 * @since TBD
 */
const CASCADE = ['tablet', 'mobile'];

/**
 * Compose one dimension slot into the literal a preset stores: a token alias is stored verbatim, any
 * other value gets the control's unit appended.
 *
 * A token alias is a whole-string `{dot.path}` reference. Appending the unit would produce
 * `{dot.path}px`, which the server rejects as `alias_malformed` — `Alias::looks_like_alias()` fires on
 * a brace anywhere in the value, so a suffixed alias is not "an alias with a unit", it is malformed.
 *
 * @param {string} slot The stored slot value.
 * @param {string} unit The companion unit.
 *
 * @since TBD
 *
 * @return {string} The slot literal.
 */
function slotToLiteral(slot, unit) {
	return isTokenAlias(slot) ? slot : `${slot}${unit}`;
}

/**
 * Reduce a block attribute value to the literal a preset token stores, per kind: a color resolves to its
 * literal, a dimension composes its value and unit (`8` + `px` -> `8px`), text passes through trimmed.
 *
 * A dimension keeps its corners: four identical corners collapse to one value (so a uniform preset is
 * stored exactly as before), and corners that differ are stored as a slot list so a per-corner radius
 * survives the round trip instead of narrowing to its first side.
 *
 * @param {string} kind        The property kind ('color' | 'dimension' | 'text').
 * @param {*}      value       The stored attribute value.
 * @param {string} unit        The companion unit (dimension only; '' otherwise).
 * @param {*}      presetValue The selected preset's value, used to fill an unset corner.
 *
 * @since TBD
 *
 * @return {string|string[]} The token literal, or the per-corner slot list.
 */
function attrToLiteral(kind, value, unit, presetValue) {
	if (kind === 'dimension') {
		if (normalizeDimension(value, unit).value === '') {
			return '';
		}

		const slots = dimensionSlots(value).map((slot, index) =>
			slot === '' ? presetSlotAt(presetValue, index) : slotToLiteral(slot, unit)
		);

		// A corner the user left unset whose preset has no value either cannot be expressed in a shorthand,
		// so the whole property is omitted and inherited through the cascade instead.
		if (slots.some((slot) => slot === '')) {
			return '';
		}

		return slots.every((slot) => slot === slots[0]) ? slots[0] : slots;
	}

	if (kind === 'color') {
		return normalizeColor(value);
	}

	return normalizeText(value);
}

/**
 * Wrap a captured base value in the responsive envelope when the block carries per-breakpoint values for
 * the property, otherwise return the base unchanged.
 *
 * The envelope is the same one a responsive token leaf uses — base under `$value`, overrides under the
 * vendor extension — so each override is validated, resolved and projected by exactly the rules the base
 * goes through. A breakpoint whose attribute is unset is omitted rather than frozen, so it keeps
 * inheriting; a property with no breakpoint values stays a bare value, leaving every existing preset
 * byte-identical.
 *
 * A corner the breakpoint leaves unset inherits the way the editor renders it — through the device
 * cascade, not from the preset: Tablet falls back to the captured base, Mobile to the captured Tablet
 * value and then to the base. Filling from the preset instead would freeze the preset's default into the
 * corners the user never touched, pinning them against the Desktop value they are rendering at.
 *
 * @param {*}      base        The captured base (desktop) value.
 * @param {Object} property    The bound property, carrying `responsive_attrs`.
 * @param {Object} attributes  The block's current attributes.
 * @param {string} unit        The property's unit. A responsive measure control carries ONE unit across
 *                             all three devices, so every breakpoint composes against the same one.
 *
 * @since TBD
 *
 * @return {*} The base value, or the responsive envelope wrapping it.
 */
function withResponsive(base, property, attributes, unit) {
	const responsive = {};

	// Cascade order, so a Mobile corner can inherit the Tablet value captured a step earlier.
	CASCADE.forEach((breakpoint, index) => {
		const attr = get(property.responsive_attrs, breakpoint, '');
		const raw = attr ? get(attributes, attr, '') : '';

		if (!attr || isEmptyValue(property.kind, raw)) {
			return;
		}

		const above = CASCADE.slice(0, index)
			.reverse()
			.map((breakpointAbove) => responsive[breakpointAbove])
			.find((captured) => captured !== undefined);

		const value = attrToLiteral(property.kind, raw, unit, above === undefined ? base : above);

		if (value !== '') {
			responsive[breakpoint] = value;
		}
	});

	if (!Object.keys(responsive).length) {
		return base;
	}

	return { $value: base, $extensions: { [VENDOR_EXTENSION]: { responsive } } };
}

/**
 * Resolve a captured value to the literal the catalog's value map stores: an alias resolves through the
 * library's token literals, a per-corner list resolves slot by slot.
 *
 * @param {*}      value   The captured value.
 * @param {string} library The token library slug.
 *
 * @since TBD
 *
 * @return {*} The resolved literal, or the per-corner literal list.
 */
function capturedLiteral(value, library) {
	return Array.isArray(value) ? value.map((slot) => tokenLiteral(slot, library)) : tokenLiteral(value, library);
}

/**
 * The catalog view of a captured token map: the resolved `{ property: literal }` values plus the
 * `{ breakpoint: { property: literal } }` overrides, matching what the server localizes for an existing
 * preset (`values` / `responsive`).
 *
 * A newly saved preset is not in the localized catalog until the next page load, so the picker has to seed
 * it from what was captured. Aliases are resolved here because the catalog stores literals — a control
 * compares its own value against them, and a `{dot.path}` would never match.
 *
 * @param {Object} tokens  The captured token map ({ propertyKey: literal-or-envelope }).
 * @param {string} library The token library the values were captured against.
 *
 * @since TBD
 *
 * @return {{ values: Object, responsive: Object }} The catalog value maps for the preset.
 */
export function capturedCatalogValues(tokens, library) {
	const resolvedLibrary = library || activeLibrary();
	const values = {};
	const responsive = {};

	Object.entries(tokens || {}).forEach(([key, captured]) => {
		const overrides = get(captured, ['$extensions', VENDOR_EXTENSION, 'responsive'], null);
		const base = overrides ? captured.$value : captured;

		values[key] = capturedLiteral(base, resolvedLibrary);

		Object.entries(overrides || {}).forEach(([breakpoint, value]) => {
			responsive[breakpoint] = {
				...(responsive[breakpoint] || {}),
				[key]: capturedLiteral(value, resolvedLibrary),
			};
		});
	});

	return { values, responsive };
}

/**
 * The block's current values across its preset surface, as a `{ propertyKey: literal }` token map: each
 * mapped control's edited value when it has one, else the selected preset's value. Feeds the "save as a
 * new preset" write so the new preset matches what the editor currently shows.
 *
 * @param {string} blockName  The block name.
 * @param {string} library    The token library the block is on.
 * @param {Object} attributes The block's current attributes.
 *
 * @since TBD
 *
 * @return {Object} The captured token map keyed by property.
 */
export function capturedTokens(blockName, library, attributes) {
	const resolvedLibrary = library || activeLibrary();
	const currentSlug = activePresetFor(blockName, attributes, resolvedLibrary);
	const presetValues = get(blockPresetValues(blockName, resolvedLibrary), currentSlug, {});

	return blockProperties(blockName, resolvedLibrary).reduce((tokens, property) => {
		const presetValue = get(presetValues, property.key, '');

		// The three border-axis properties (`BORDER_AXIS_KIND`) share ONE `control_attr` pointing at a
		// nested per-side native shape (`[{ top: [color, style, size], ... }]`) this loop's flat
		// dimension/color model cannot read — `isEmptyValue`/`attrToLiteral` would stringify the object
		// and write "[object Object]"-shaped garbage into the captured preset. Reading one axis out of
		// that shape correctly is real, non-trivial logic (the same axis-aware read
		// `token-indicators/index.js`'s `usePresetBinding` already does) that this capture flow was never
		// asked to support — so these three are skipped and pass the preset's existing value through
		// unchanged, the same "not edited" fallback every other unmapped property already takes.
		if (BORDER_AXIS_KIND[property.key]) {
			tokens[property.key] = presetValue;

			return tokens;
		}

		const attr = property.control_attr;
		const raw = attr ? get(attributes, attr, '') : '';
		const unit = property.kind === 'dimension' && attr ? get(attributes, `${attr}Unit`, '') : '';
		// "Edited" here is simply "the control carries a value" — we snapshot the current visual state, so a
		// value that happens to equal the preset is captured all the same (no differs-from-preset compare).
		const edited = attr && !isEmptyValue(property.kind, raw);
		const base = edited ? attrToLiteral(property.kind, raw, unit, presetValue) : presetValue;

		tokens[property.key] = withResponsive(base, property, attributes, unit);

		return tokens;
	}, {});
}
