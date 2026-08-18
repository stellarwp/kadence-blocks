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
	blockDefaultPreset,
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
 * The mapped control attributes for a block's set, as `[{ attr, kind }]` — the surface reset-all clears.
 * Skips properties with no control attribute. Independent of the selected preset (reset-all clears every
 * mapped override regardless of which preset is active).
 *
 * @param {string} blockName The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Array} The mapped attributes ([{ attr, kind }]).
 */
export function mappedAttrsFor(blockName, library) {
	return blockProperties(blockName, library || activeLibrary())
		.filter((property) => !!property.control_attr)
		.map((property) => ({ attr: property.control_attr, kind: property.kind }));
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
 *                   device, so a caller can still look a control up by its one stable key.
 */
export function usePresetBinding(blockName, attributes, library, previewDevice) {
	const resolvedLibrary = library || activeLibrary();
	const selected = get(attributes, 'kbPreset', '');
	const properties = blockProperties(blockName, resolvedLibrary);
	const values = blockPresetValues(blockName, resolvedLibrary);
	const responsive = blockPresetResponsive(blockName, resolvedLibrary);

	// The preset whose surface drives the indicators: the explicit selection, or the set's authoritative
	// default preset when none is chosen (kbPreset is '' on every freshly inserted block, so this
	// fallback runs constantly and must use the catalog's declared default, not JSON key order). When
	// neither resolves, no control is bound.
	const activePreset = selected || blockDefaultPreset(blockName, resolvedLibrary);
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

		const kind = property.kind;
		const presetValue = presetValues[property.key];
		const propertyBreakpoints = {
			tablet: get(presetBreakpoints, ['tablet', property.key]),
			mobile: get(presetBreakpoints, ['mobile', property.key]),
		};

		// `overridden` compares like against like: a dimension control reads its OWN device's stored
		// attribute (`tabletBorderRadius` on Tablet), against the preset value in effect at that same
		// device (its tablet override where the preset declares one, else the base). Comparing a
		// Tablet-stored value to the desktop preset value — or reporting the desktop attribute's state
		// while Tablet is open — would show the wrong mark for the device actually being edited.
		const deviceAttr = kind === 'dimension' ? deviceAttrFor(attr, previewDevice) : attr;
		const devicePresetValue =
			kind === 'dimension' ? presetValueForDevice(presetValue, propertyBreakpoints, previewDevice) : presetValue;
		const value = get(attributes, deviceAttr, '');
		const unit = unitAttrFor(kind, attr) ? get(attributes, unitAttrFor(kind, attr), '') : '';

		const empty = isEmptyValue(kind, value);
		const overridden = !empty && !matchesPreset(kind, value, unit, devicePresetValue);

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
 * The `setAttributes` patch that clears a mapped control's attribute(s) back to their block.json default
 * shape, so the block falls back to the existing preset-scoped CSS (the `.wp-block-*.kb-preset--<preset>`
 * retarget) or the preset default — no new render path. A `color`/`text` control clears its single
 * attribute to `''`. A `dimension` control (e.g. `borderRadius`) also clears its unit companion and its
 * `tablet*`/`mobile*` companions by convention; the primary and companion array attributes reset to the
 * block's declared default shape — a 4-side `['', '', '', '']` array, per `block.json` (e.g. `borderRadius`,
 * `tabletBorderRadius`, `mobileBorderRadius`) — not a bare `''`, and the unit resets to `'px'`
 * (`borderRadiusUnit`'s declared default), not `''`.
 *
 * Shared by the per-control reset (`resetAttr`) and the picker's reset-all, so their clearing convention
 * cannot drift.
 *
 * @param {string} attr The primary attribute name.
 * @param {string} kind The property kind, so a dimension also clears its companions.
 *
 * @since TBD
 *
 * @return {Object} The attribute patch to pass to `setAttributes`.
 */
export function resetAttrPatch(attr, kind) {
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
