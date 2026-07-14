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
import { activeSet, blockProperties, blockVariantValues } from '../variant-picker';
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
 * @return {string} The unit attribute name, or ''.
 */
function unitAttrFor(kind, attr) {
	return kind === 'dimension' ? `${attr}Unit` : '';
}

/**
 * The default variant slug to fall back to when the block has no explicit `kbVariant`: the first variant
 * present in the resolved-values map (the catalog lists them in default-first order). '' when none.
 *
 * @param {Object} values The per-variant value map.
 * @return {string} The fallback variant slug, or ''.
 */
function defaultVariantFor(values) {
	const slugs = Object.keys(values || {});

	return slugs.length ? slugs[0] : '';
}

/**
 * The design-token binding state for a block's mapped controls, keyed by the control's attribute name.
 *
 * @param {string} blockName  The block name (e.g. 'kadence/singlebtn').
 * @param {Object} attributes The block's current attributes.
 * @return {Object} attrName => { property, token, kind, variantValue, bound, overridden }.
 */
export function useVariantBinding(blockName, attributes) {
	const set = get(attributes, 'kbTokenSet', '') || activeSet();
	const selected = get(attributes, 'kbVariant', '');
	const properties = blockProperties(blockName, set);
	const values = blockVariantValues(blockName, set);

	// The variant whose surface drives the indicators: the explicit selection, or the block's default
	// look when none is chosen. When neither resolves, no control is bound.
	const activeVariant = selected || defaultVariantFor(values);
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
 * Clear a mapped control's attribute(s) so the block falls back to the existing variant-scoped CSS (the
 * `.wp-block-*.kb-variant--<variant>` retarget) or the preset default — no new render path. A `color`/
 * `text` control clears its single attribute to `''`. A `dimension` control (e.g. `borderRadius`) also
 * clears its unit companion and its `tablet*`/`mobile*` companions by convention; the primary and
 * companion array attributes reset to the block's declared default shape — a 4-side
 * `['', '', '', '']` array, per `block.json` (e.g. `borderRadius`, `tabletBorderRadius`,
 * `mobileBorderRadius`) — not a bare `''`, and the unit resets to `'px'` (`borderRadiusUnit`'s declared
 * default), not `''`.
 *
 * @param {string}   attr          The primary attribute name.
 * @param {Function} setAttributes The block's setAttributes.
 * @param {string}   kind          The property kind, so a dimension also clears its companions.
 * @return {void}
 */
export function resetAttr(attr, setAttributes, kind) {
	if (kind !== 'dimension') {
		setAttributes({ [attr]: '' });

		return;
	}

	const capitalized = attr.charAt(0).toUpperCase() + attr.slice(1);
	const emptySides = ['', '', '', ''];

	setAttributes({
		[attr]: emptySides,
		[`${attr}Unit`]: 'px',
		[`tablet${capitalized}`]: emptySides,
		[`mobile${capitalized}`]: emptySides,
	});
}
