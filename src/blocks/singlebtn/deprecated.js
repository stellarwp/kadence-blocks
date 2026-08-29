/**
 * Folds the six legacy `[displayShadow*, shadow*]` attribute pairs into the shadow control's own
 * "None" pick: a toggled-off value becomes the explicit zero/transparent composite, and the toggle
 * attribute is dropped either way.
 *
 * Needs `isEligible`, not just `migrate`: this block is fully dynamic (`save()` returns `null`), so
 * Gutenberg's validation trivially passes against every prior version and never reaches `deprecated`
 * on a mismatch. `isEligible` runs regardless, which is what lets an attribute-only migration fire.
 *
 * It unions `attributes`, `blockNode.attrs` and `block.attrs` when looking for the legacy keys —
 * which of the three carries them for a schema that no longer declares them is not settled, and the
 * union is correct under every reading.
 *
 * Known gap: a button toggled on, customized, then toggled back off kept its value with no toggle
 * key, which is byte-identical to a shadow picked on a new block. That shape cannot be migrated
 * without erasing shadows nobody meant to lose, so those buttons will show a shadow they previously
 * kept hidden — a one-time cosmetic change on old content.
 *
 * The deprecation-local `attributes` and `supports` are load-bearing, not boilerplate: `migrate`'s
 * return value replaces the block's ENTIRE attribute set, so without them it would be handed `{}`
 * and wipe out text, colors, link and sizing. `supports` matters for the same reason — this plugin
 * injects attributes through support-gated `registerBlockType` filters.
 */

import metadata from './block.json';

/**
 * The zero/transparent shadow item written for any pair whose legacy toggle was off (or missing —
 * very old data predating the toggle entirely is treated the same way).
 *
 * @since TBD
 */
const NONE_SHADOW_ITEM = { color: 'transparent', hOffset: 0, vOffset: 0, blur: 0, spread: 0, inset: false, opacity: 1 };

/**
 * The six legacy `[toggleAttr, valueAttr]` pairs, one per shadow state.
 *
 * @since TBD
 */
const SHADOW_ATTRIBUTE_PAIRS = [
	['displayShadow', 'shadow'],
	['displayHoverShadow', 'shadowHover'],
	['displayShadowTransparent', 'shadowTransparent'],
	['displayHoverShadowTransparent', 'shadowTransparentHover'],
	['displayShadowSticky', 'shadowSticky'],
	['displayHoverShadowSticky', 'shadowStickyHover'],
];

/**
 * The six shadow value attributes' defaults as they stood BEFORE the "Enable Box Shadow" toggle was
 * removed, keyed by attribute.
 *
 * Gutenberg omits an attribute equal to its registered default, so a button toggled ON but never
 * adjusted saved `displayShadow` and no `shadow` key. Parsed against the current schema it would
 * resolve to the new zero/transparent default and lose its shadow; registering the historical
 * defaults here makes the parser fill in what the block actually rendered.
 *
 * @since TBD
 */
const LEGACY_SHADOW_DEFAULTS = {
	shadow: [{ color: '#000000', opacity: 0.2, spread: 0, blur: 2, hOffset: 1, vOffset: 1, inset: false }],
	shadowHover: [{ color: '#000000', opacity: 0.4, spread: 0, blur: 3, hOffset: 2, vOffset: 2, inset: false }],
	shadowTransparent: [{ color: '#000000', opacity: 0.2, spread: 0, blur: 2, hOffset: 1, vOffset: 1, inset: false }],
	shadowTransparentHover: [
		{ color: '#000000', opacity: 0.4, spread: 0, blur: 3, hOffset: 2, vOffset: 2, inset: false },
	],
	shadowSticky: [{ color: '#000000', opacity: 0.2, spread: 0, blur: 2, hOffset: 1, vOffset: 1, inset: false }],
	shadowStickyHover: [{ color: '#000000', opacity: 0.4, spread: 0, blur: 3, hOffset: 2, vOffset: 2, inset: false }],
};

/**
 * The deprecated block's own attribute schema: the current schema, with the six shadow attributes'
 * defaults rolled back to their pre-removal values and the six legacy boolean toggles added in their
 * pre-removal shape, so `migrate` receives (and returns) a complete, historically-faithful attribute
 * set.
 *
 * @since TBD
 */
const deprecatedAttributes = {
	...metadata.attributes,
	...Object.fromEntries(
		Object.entries(LEGACY_SHADOW_DEFAULTS).map(([valueAttr, legacyDefault]) => [
			valueAttr,
			{ ...metadata.attributes[valueAttr], default: legacyDefault },
		])
	),
	...Object.fromEntries(
		SHADOW_ATTRIBUTE_PAIRS.map(([toggleAttr]) => [toggleAttr, { type: 'boolean', default: false }])
	),
};

/**
 * Whether a saved block still carries a legacy `display*` toggle key this deprecation has to fold in.
 *
 * Gutenberg omits any attribute equal to its registered default, so a toggle flipped (either way)
 * away from its `false` default leaves a `display*` key present in the saved markup. The paired
 * shadow value may be missing entirely (it matched the old default) — the deprecation's own schema
 * supplies the historical default for it (see above).
 *
 * Looks in every place the legacy keys could plausibly live — the parsed `attributes`, the raw
 * parsed node (`blockNode.attrs`) and the block object (`block.attrs`) — because which one carries
 * unfiltered comment JSON for an attribute the current schema no longer declares is not something
 * this codebase can confirm without a live editor. The union is right whichever it turns out to be.
 *
 * @param {Object}   attributes  The block's parsed attributes.
 * @param {Object[]} innerBlocks The block's inner blocks.
 * @param {Object}   context     Parser context, carrying `blockNode` and `block`.
 *
 * @since TBD
 *
 * @return {boolean} Whether this deprecation should run its migration.
 */
function isEligible(attributes, innerBlocks, context) {
	const rawAttributes = {
		...(attributes ?? {}),
		...(context?.blockNode?.attrs ?? {}),
		...(context?.block?.attrs ?? {}),
	};

	return SHADOW_ATTRIBUTE_PAIRS.some(([toggleAttr]) => toggleAttr in rawAttributes);
}

/**
 * Fold every legacy toggle/value pair into the shadow control's own "None" pick, then drop the toggle.
 *
 * Runs over all six pairs unconditionally, not just the one `isEligible` found a toggle key for: any
 * pair whose toggle is not exactly `true` (including one with no toggle key at all, i.e. already at
 * its implicit `false` default) gets its value rewritten to the explicit None composite. For a block
 * where only one pair carried a toggle key, the other five are already at their equivalent default, so
 * this is a no-op in rendered output — but it does explicitly serialize the None shape for every pair,
 * not just the one that made the block eligible.
 *
 * @param {Object} attributes The block's attributes, parsed against this deprecation's own schema
 *                            (so the six legacy booleans are present here).
 *
 * @since TBD
 *
 * @return {Object} The migrated attributes — the complete attribute set for the block.
 */
function migrate(attributes) {
	const next = { ...attributes };

	SHADOW_ATTRIBUTE_PAIRS.forEach(([toggleAttr, valueAttr]) => {
		if (next[toggleAttr] !== true) {
			next[valueAttr] = [{ ...NONE_SHADOW_ITEM }];
		}

		delete next[toggleAttr];
	});

	return next;
}

export default [
	{
		attributes: deprecatedAttributes,
		supports: metadata.supports,
		isEligible,
		migrate,
		save() {
			return null;
		},
	},
];
