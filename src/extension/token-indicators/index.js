/**
 * Editor binding/override state for design-token-mapped controls.
 *
 * `usePresetBinding` computes, for the block's currently selected preset, a per-attribute map the
 * indicator layer reads: whether each mapped control is bound to the active preset and whether it has
 * been overridden away from it, plus the preset's resolved value so a reset knows what to restore to.
 *
 * Detection matches how a block is bound. Buttons bind via CSS retarget, so a bound-but-untouched
 * attribute stays EMPTY — there `empty => bound`, `non-empty && value != presetValue => overridden`.
 * (A block that binds by seeding a block attribute — image's borderRadius — is never empty; there the
 * test is a pure value-compare. This module keeps `presetValue` as the primary signal so that path is a
 * one-line change when a seeded block is wired later. See the Phase 3 recipe caveat.)
 */

import { get } from 'lodash';
import {
	activeLibrary,
	activePresetFor,
	blockProperties,
	blockPresetValues,
	blockPresetResponsive,
} from '../preset-picker';
import { isEmptyValue, matchesPreset, presetValueForDevice } from './normalize';
import './token-indicators.scss';

export { TOKEN_INDICATORS_STORE } from './store';
export { TokenIndicator } from './components/TokenIndicator';
export { TokenLabel } from './components/TokenLabel';
export { TokenControlRow } from './components/TokenControlRow';

/**
 * The device-specific attribute name for a dimension control, by the same `tablet${Capitalized}` /
 * `mobile${Capitalized}` convention `resetAttrPatch` clears — the single spelling, so a reader that
 * only checks the desktop attribute cannot silently disagree with the one that resets all three.
 *
 * @param {string} attr   The desktop attribute name.
 * @param {string} device The active preview device ('Desktop' | 'Tablet' | 'Mobile'); defaults to
 *                          desktop for a caller with no device context.
 *
 * @since TBD
 *
 * @return {string} The attribute the given device stores its value in.
 */
function deviceAttrFor(attr, device) {
	if ('Tablet' !== device && 'Mobile' !== device) {
		return attr;
	}

	const capitalized = attr.charAt(0).toUpperCase() + attr.slice(1);

	return `${device.toLowerCase()}${capitalized}`;
}

/**
 * The companion unit attribute for a dimension control, by convention `${attr}Unit` (e.g. `borderRadius`
 * -> `borderRadiusUnit`). Returns '' for non-dimension kinds.
 *
 * @param {string} kind The property kind.
 * @param {string} attr The primary attribute name.
 *
 * @since TBD
 *
 * @return {string} The unit attribute name, or ''.
 */
function unitAttrFor(kind, attr) {
	return kind === 'dimension' ? `${attr}Unit` : '';
}

/**
 * The `button-border-width`/`button-border-style`/`button-border-color` properties, keyed by their
 * property key, to the axis kind `normalize.js`'s `isEmptyValue`/`matchesPreset` read for them.
 *
 * Declaring these as a single shared `control_attr: 'borderStyle'` (see `declarations.php`) is correct —
 * `EditorBorderControl` edits all three axes as one control with no per-axis reset — but it means PHP's
 * generic `Preset_Bindings::kind()` (name/token-group classification with no notion of this nested
 * per-side shape) cannot tell the three apart: `button-border-width` reads as its generic 'dimension' and
 * both `button-border-style`/`button-border-color` read as generic 'color'. Passed straight through,
 * `isEmptyValue`/`matchesPreset`'s existing 'dimension'/'color' branches would try to read the nested
 * `[{ top: [color, style, size], ... }]` shape as a flat scalar/4-side value and never match. This map
 * overrides the kind used for the compare ONLY, by property key, so each axis reads its own slot.
 *
 * @since TBD
 *
 * @type {Object<string, string>}
 */
const BORDER_AXIS_KIND = {
	'button-border-width': 'border-width',
	'button-border-style': 'border-style',
	'button-border-color': 'border-color',
};

/**
 * The mapped control attributes for a block's set, as `[{ attr, kind }]` — the surface reset-all clears.
 * Skips properties with no control attribute. Independent of the selected preset (reset-all clears every
 * mapped override regardless of which preset is active).
 *
 * The three border-axis properties share one `control_attr` (see `BORDER_AXIS_KIND`), so they would
 * otherwise produce three entries for the same attribute, each with a different (and individually wrong)
 * kind for `resetAttrPatch`. Deduping by attribute and reporting the combined `'border'` kind for any of
 * them keeps reset-all's one patch-per-attribute clearing every axis at once, matching `resetAttrPatch`'s
 * own `'border'` case.
 *
 * @param {string} blockName The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Array} The mapped attributes ([{ attr, kind }]).
 */
export function mappedAttrsFor(blockName, library) {
	const seen = new Set();
	const attrs = [];

	blockProperties(blockName, library || activeLibrary())
		.filter((property) => !!property.control_attr)
		.forEach((property) => {
			const attr = property.control_attr;

			if (seen.has(attr)) {
				return;
			}

			seen.add(attr);
			attrs.push({ attr, kind: BORDER_AXIS_KIND[property.key] ? 'border' : property.kind });
		});

	return attrs;
}

/**
 * The design-token binding state for a block's mapped controls, keyed by the control's attribute name.
 *
 * @param {string} blockName     The block name (e.g. 'kadence/singlebtn').
 * @param {Object} attributes    The block's current attributes.
 * @param {string} [library]     The token library slug; defaults to the active library — pass the
 *                                caller's resolved library so the binding can't disagree with the
 *                                rest of its UI.
 * @param {string} [previewDevice] The active preview device ('Desktop' | 'Tablet' | 'Mobile'); a
 *                                dimension control reads and reports `overridden` for THIS device's
 *                                own attribute (`tabletBorderRadius`, not `borderRadius`, on Tablet) —
 *                                omit it only for a caller with no device context, e.g. a block-wide
 *                                "is anything overridden" summary that doesn't distinguish devices.
 *
 * @since TBD
 *
 * @return {Object} attrName => { property, token, kind, presetValue, responsive, bound, overridden }.
 *                   Keyed by the DESKTOP attribute name even when `overridden` reflects another
 *                   device, so a caller can still look a control up by its one stable key. The
 *                   `borderStyle` entry is the one exception: `kind` is `'border'` and `property`/
 *                   `token`/`presetValue`/`responsive` are each `{ width, style, color }` objects,
 *                   one slot per axis, combining the three properties that share that attribute (see
 *                   `BORDER_AXIS_KIND`); `overridden` is true when any axis diverges from its own
 *                   preset value.
 */
export function usePresetBinding(blockName, attributes, library, previewDevice) {
	const resolvedLibrary = library || activeLibrary();
	const properties = blockProperties(blockName, resolvedLibrary);
	const values = blockPresetValues(blockName, resolvedLibrary);
	const responsive = blockPresetResponsive(blockName, resolvedLibrary);

	// The preset whose surface drives the indicators: the explicit selection, or the set's authoritative
	// default preset when none is chosen or the selection no longer exists (kbPreset is '' on every
	// freshly inserted block, so this fallback runs constantly and must use the catalog's declared
	// default, not JSON key order). When neither resolves, no control is bound.
	const activePreset = activePresetFor(blockName, attributes, resolvedLibrary);
	const presetValues = get(values, activePreset, {});
	const presetBreakpoints = get(responsive, activePreset, {});

	const state = {};

	properties.forEach((property) => {
		const attr = property.control_attr;

		// A property with no mapped control attribute, or one the active preset does not define, is not
		// surfaced — only a property the selected preset sets is "bound" (the binding-set collapse
		// interlock: the per-preset surface, not just the block's full property list, gates binding).
		if (!attr || !(property.key in presetValues)) {
			return;
		}

		// The border width/style/color properties all key their compare off `BORDER_AXIS_KIND` rather
		// than PHP's generic `property.kind` — see that map's own docblock for why.
		const axis = BORDER_AXIS_KIND[property.key];
		const kind = axis || property.kind;
		const presetValue = presetValues[property.key];
		const propertyBreakpoints = {
			tablet: get(presetBreakpoints, ['tablet', property.key]),
			mobile: get(presetBreakpoints, ['mobile', property.key]),
		};

		// `overridden` compares like against like: a responsive control (a dimension, or a border axis —
		// each border axis has its own tabletBorderStyle/mobileBorderStyle-shaped attribute) reads its
		// OWN device's stored attribute (`tabletBorderRadius` on Tablet), against the preset value in
		// effect at that same device (its tablet override where the preset declares one, else the base).
		// Comparing a Tablet-stored value to the desktop preset value — or reporting the desktop
		// attribute's state while Tablet is open — would show the wrong mark for the device actually
		// being edited.
		const isResponsive = kind === 'dimension' || Boolean(axis);
		const deviceAttr = isResponsive ? deviceAttrFor(attr, previewDevice) : attr;
		const devicePresetValue = isResponsive
			? presetValueForDevice(presetValue, propertyBreakpoints, previewDevice)
			: presetValue;
		const value = get(attributes, deviceAttr, '');
		const unit = unitAttrFor(kind, attr) ? get(attributes, unitAttrFor(kind, attr), '') : '';

		const empty = isEmptyValue(kind, value);
		const overridden = !empty && !matchesPreset(kind, value, unit, devicePresetValue);

		// Width, style and color share the `borderStyle` attribute (one `EditorBorderControl`, no
		// per-axis reset), so their three iterations combine into ONE entry rather than overwrite each
		// other: `property`/`token`/`presetValue`/`responsive` become axis-keyed ('width'/'style'/
		// 'color') objects, and `overridden` is true when ANY axis diverges from ITS OWN preset value —
		// a stored border only reads as "matches the preset" once every axis does.
		if (axis) {
			const axisKey = axis.replace('border-', '');
			const combined = state[attr] || {
				property: {},
				token: {},
				kind: 'border',
				presetValue: {},
				responsive: {},
				bound: true,
				overridden: false,
			};

			combined.property[axisKey] = property.key;
			combined.token[axisKey] = property.token;
			combined.presetValue[axisKey] = presetValue;
			combined.responsive[axisKey] = propertyBreakpoints;
			combined.overridden = combined.overridden || overridden;

			state[attr] = combined;

			return;
		}

		state[attr] = {
			property: property.key,
			token: property.token,
			kind,
			presetValue,
			responsive: propertyBreakpoints,
			bound: true,
			overridden,
		};
	});

	return state;
}

/**
 * The active preset's resolved value for one property key, at the given device — for a property with
 * no `control_attr` at all, whose native attribute `usePresetBinding` has nothing to key it by (a
 * `css_var`-only binding). `usePresetBinding` skips these properties entirely, so a caller that only
 * needs "what does the active preset resolve this to" — e.g. a dimension control's `defaultValue`,
 * shown muted once the control's own override is cleared — reads it directly here instead.
 *
 * @param {string} blockName     The block name (e.g. 'kadence/singlebtn').
 * @param {string} propertyKey   The binding's property key (e.g. 'button-radius').
 * @param {Object} attributes    The block's current attributes — read for `kbPreset`, so a
 *                                user-selected preset (not just the block's default) resolves.
 * @param {string} [library]     The token library slug; defaults to the active library.
 * @param {string} [previewDevice] The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 *
 * @since TBD
 *
 * @return {*} The resolved literal value, or `undefined` when the active preset does not set it.
 */
export function presetPropertyValueForDevice(blockName, propertyKey, attributes, library, previewDevice) {
	const resolvedLibrary = library || activeLibrary();
	const activePreset = activePresetFor(blockName, attributes, resolvedLibrary);
	const presetValues = get(blockPresetValues(blockName, resolvedLibrary), activePreset, {});
	const presetBreakpoints = get(blockPresetResponsive(blockName, resolvedLibrary), activePreset, {});

	return presetValueForDevice(
		presetValues[propertyKey],
		{
			tablet: get(presetBreakpoints, ['tablet', propertyKey]),
			mobile: get(presetBreakpoints, ['mobile', propertyKey]),
		},
		previewDevice
	);
}

/**
 * The `setAttributes` patch that clears a mapped control's attribute(s) back to their block.json default
 * shape, so the block falls back to the existing preset-scoped CSS (the `.wp-block-*.kb-preset--<preset>`
 * retarget) or the preset default — no new render path. A `color`/`text` control clears its single
 * attribute to `''`. A `dimension` control (e.g. `borderRadius`) also clears its unit companion and its
 * `tablet*`/`mobile*` companions by convention; the primary and companion array attributes reset to the
 * block's declared default shape — a 4-side `['', '', '', '']` array, per `block.json` (e.g. `borderRadius`,
 * `tabletBorderRadius`, `mobileBorderRadius`) — not a bare `''`, and the unit resets to `'px'`
 * (`borderRadiusUnit`'s declared default), not `''`.
 *
 * A `border` control (the combined `borderStyle` width/style/color entry) clears its `tablet*`/`mobile*`
 * companions the same way, but to an empty ARRAY (`[]`), not `['', '', '', '']` — `EditorBorderControl`'s
 * `fromNativeBorder` reads `[]` (or `undefined`) as "never written" via its `!native?.[0]` short-circuit,
 * which is what makes the control read as bound again. `block.json`'s own declared default is a
 * fully-populated-but-blank per-side object (`[{ top: ['', '', ''], ... }]`); that shape is NOT empty by
 * `fromNativeBorder`'s own test (its `source` is truthy), so resetting to it would leave the control
 * reading as overridden instead of bound.
 *
 * Shared by the per-control reset (`resetAttr`) and the picker's reset-all, so their clearing convention
 * cannot drift.
 *
 * @param {string} attr The primary attribute name.
 * @param {string} kind The property kind, so a dimension/border also clears its companions.
 *
 * @since TBD
 *
 * @return {Object} The attribute patch to pass to `setAttributes`.
 */
export function resetAttrPatch(attr, kind) {
	if (kind === 'border') {
		return {
			[attr]: [],
			[deviceAttrFor(attr, 'Tablet')]: [],
			[deviceAttrFor(attr, 'Mobile')]: [],
		};
	}

	if (kind !== 'dimension') {
		return { [attr]: '' };
	}

	const emptySides = ['', '', '', ''];

	return {
		[attr]: emptySides,
		[`${attr}Unit`]: 'px',
		[deviceAttrFor(attr, 'Tablet')]: emptySides,
		[deviceAttrFor(attr, 'Mobile')]: emptySides,
	};
}

/**
 * Clear a mapped control's attribute(s) back to their block.json default shape (see `resetAttrPatch`).
 *
 * @param {string}   attr          The primary attribute name.
 * @param {Function} setAttributes The block's setAttributes.
 * @param {string}   kind          The property kind, so a dimension also clears its companions.
 *
 * @since TBD
 *
 * @return {void}
 */
export function resetAttr(attr, setAttributes, kind) {
	setAttributes(resetAttrPatch(attr, kind));
}
