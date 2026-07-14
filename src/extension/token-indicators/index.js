/**
 * Editor binding/override state for design-token-mapped controls.
 *
 * `useVariantBinding` computes, for the block's currently selected variant, a per-attribute map the
 * indicator layer reads: whether each mapped control is bound to the active variant and whether it has
 * been overridden away from it, plus the variant's resolved value so a reset knows what to restore to.
 *
 * Detection matches how a block is bound. Buttons bind via CSS retarget, so a bound-but-untouched
 * attribute stays EMPTY — there `empty => bound`, `non-empty && value != variantValue => overridden`.
 * (A block that binds by seeding a block attribute — image's borderRadius — is never empty; there the
 * test is a pure value-compare. This module keeps `variantValue` as the primary signal so that path is a
 * one-line change when a seeded block is wired later. See the Phase 3 recipe caveat.)
 */

import { get } from 'lodash';
import { activeSet, blockDefaultVariant, blockProperties, blockVariantValues } from '../variant-picker';
import { isEmptyValue, matchesVariant } from './normalize';
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
 * Skips properties with no control attribute. Independent of the selected variant (reset-all clears every
 * mapped override regardless of which variant is active).
 *
 * @param {string} blockName The block name.
 * @param {string} [set]     The token set slug; defaults to the active set.
 *
 * @since TBD
 *
 * @return {Array} The mapped attributes ([{ attr, kind }]).
 */
export function mappedAttrsFor(blockName, set) {
	return blockProperties(blockName, set || activeSet())
		.filter((property) => !!property.control_attr)
		.map((property) => ({ attr: property.control_attr, kind: property.kind }));
}

/**
 * The design-token binding state for a block's mapped controls, keyed by the control's attribute name.
 *
 * @param {string} blockName  The block name (e.g. 'kadence/singlebtn').
 * @param {Object} attributes The block's current attributes.
 *
 * @since TBD
 *
 * @return {Object} attrName => { property, token, kind, variantValue, bound, overridden }.
 */
export function useVariantBinding(blockName, attributes) {
	const set = get(attributes, 'kbTokenSet', '') || activeSet();
	const selected = get(attributes, 'kbVariant', '');
	const properties = blockProperties(blockName, set);
	const values = blockVariantValues(blockName, set);

	// The variant whose surface drives the indicators: the explicit selection, or the set's authoritative
	// default variant when none is chosen (kbVariant is '' on every freshly inserted block, so this
	// fallback runs constantly and must use the catalog's declared default, not JSON key order). When
	// neither resolves, no control is bound.
	const activeVariant = selected || blockDefaultVariant(blockName, set);
	const variantValues = get(values, activeVariant, {});

	const state = {};

	properties.forEach((property) => {
		const attr = property.control_attr;

		// A property with no mapped control attribute, or one the active variant does not define, is not
		// surfaced — only a property the selected variant sets is "bound" (the variant-set collapse
		// interlock: the per-variant surface, not just the block's full property list, gates binding).
		if (!attr || !(property.key in variantValues)) {
			return;
		}

		const kind = property.kind;
		const variantValue = variantValues[property.key];
		const value = get(attributes, attr, '');
		const unit = unitAttrFor(kind, attr) ? get(attributes, unitAttrFor(kind, attr), '') : '';

		const empty = isEmptyValue(kind, value);
		const overridden = !empty && !matchesVariant(kind, value, unit, variantValue);

		state[attr] = {
			property: property.key,
			token: property.token,
			kind,
			variantValue,
			bound: true,
			overridden,
		};
	});

	return state;
}

/**
 * The `setAttributes` patch that clears a mapped control's attribute(s) back to their block.json default
 * shape, so the block falls back to the existing variant-scoped CSS (the `.wp-block-*.kb-variant--<variant>`
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
