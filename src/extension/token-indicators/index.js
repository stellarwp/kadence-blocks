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
import { activeLibrary, blockDefaultPreset, blockProperties, blockPresetValues } from '../preset-picker';
import { isEmptyValue, matchesPreset } from './normalize';
import './token-indicators.scss';

export { TOKEN_INDICATORS_STORE } from './store';
export { TokenIndicator } from './components/TokenIndicator';
export { TokenLabel } from './components/TokenLabel';
export { TokenControlRow } from './components/TokenControlRow';

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
 * @param {string} [set]     The token set slug; defaults to the active set.
 *
 * @since TBD
 *
 * @return {Array} The mapped attributes ([{ attr, kind }]).
 */
export function mappedAttrsFor(blockName, set) {
	return blockProperties(blockName, set || activeLibrary())
		.filter((property) => !!property.control_attr)
		.map((property) => ({ attr: property.control_attr, kind: property.kind }));
}

/**
 * The design-token binding state for a block's mapped controls, keyed by the control's attribute name.
 *
 * @param {string} blockName  The block name (e.g. 'kadence/singlebtn').
 * @param {Object} attributes The block's current attributes.
 * @param {string} [set]      The token set slug; defaults to kbTokenSet, then the active set — pass the
 *                            caller's resolved set so the binding can't disagree with the rest of its UI.
 *
 * @since TBD
 *
 * @return {Object} attrName => { property, token, kind, presetValue, bound, overridden }.
 */
export function usePresetBinding(blockName, attributes, set) {
	const resolvedSet = set || get(attributes, 'kbTokenSet', '') || activeLibrary();
	const selected = get(attributes, 'kbPreset', '');
	const properties = blockProperties(blockName, resolvedSet);
	const values = blockPresetValues(blockName, resolvedSet);

	// The preset whose surface drives the indicators: the explicit selection, or the set's authoritative
	// default preset when none is chosen (kbPreset is '' on every freshly inserted block, so this
	// fallback runs constantly and must use the catalog's declared default, not JSON key order). When
	// neither resolves, no control is bound.
	const activePreset = selected || blockDefaultPreset(blockName, resolvedSet);
	const presetValues = get(values, activePreset, {});

	const state = {};

	properties.forEach((property) => {
		const attr = property.control_attr;

		// A property with no mapped control attribute, or one the active preset does not define, is not
		// surfaced — only a property the selected preset sets is "bound" (the preset-set collapse
		// interlock: the per-preset surface, not just the block's full property list, gates binding).
		if (!attr || !(property.key in presetValues)) {
			return;
		}

		const kind = property.kind;
		const presetValue = presetValues[property.key];
		const value = get(attributes, attr, '');
		const unit = unitAttrFor(kind, attr) ? get(attributes, unitAttrFor(kind, attr), '') : '';

		const empty = isEmptyValue(kind, value);
		const overridden = !empty && !matchesPreset(kind, value, unit, presetValue);

		state[attr] = {
			property: property.key,
			token: property.token,
			kind,
			presetValue,
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

	const capitalized = attr.charAt(0).toUpperCase() + attr.slice(1);
	const emptySides = ['', '', '', ''];

	return {
		[attr]: emptySides,
		[`${attr}Unit`]: 'px',
		[`tablet${capitalized}`]: emptySides,
		[`mobile${capitalized}`]: emptySides,
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
