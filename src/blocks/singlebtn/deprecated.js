/**
 * Deprecated versions of `kadence/singlebtn`, migrating legacy attribute data forward.
 *
 * `save()` always returns `null` here (a fully dynamic, server-rendered block) — every version's
 * saved markup is identical, so content validation never fails and never recovers a block through
 * the usual "invalid block" path. `isEligible()` is the mechanism this migration actually runs
 * through instead: Gutenberg checks it against every parsed block, current version included, purely
 * to offer an attribute-only migration with no serialization change to validate against.
 *
 * The migration itself: before the Box Shadow field's "None" pick replaced a separate enable toggle
 * (see `EditorShadowControl`'s own docblock), a button could be toggled off while a real, non-zero
 * shadow composite stayed sitting in the value underneath — invisible at the time (the toggle hid
 * the whole control while off), and still correctly invisible today (PHP's render gate reads the
 * toggle attribute, unchanged by this). `EditorShadowControl`'s own read-time fallback already
 * shows a toggled-off value as "None" regardless of what's stored, so nothing is functionally
 * broken without this migration — this only physically cleans up that stale leftover data, the
 * first time one of these six affected blocks is reopened and saved again.
 */

/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * Each display-toggle attribute paired with the shadow-value attribute it gates. Six independent
 * pairs — normal, hover, transparent variant and its hover, sticky variant and its hover — mirroring
 * `class-kadence-blocks-singlebtn-block.php`'s own six render-gate checks.
 *
 * @since TBD
 */
const SHADOW_TOGGLES = [
	['displayShadow', 'shadow'],
	['displayHoverShadow', 'shadowHover'],
	['displayShadowTransparent', 'shadowTransparent'],
	['displayHoverShadowTransparent', 'shadowTransparentHover'],
	['displayShadowSticky', 'shadowSticky'],
	['displayHoverShadowSticky', 'shadowStickyHover'],
];

/**
 * Whether a native shadow item has any visible footprint — any of its four length axes non-zero.
 * Mirrors `EditorShadowControl`'s own `isVisibleNativeShadow`, kept independent rather than imported:
 * a deprecation is a frozen historical snapshot, and importing a helper the live component could
 * later change out from under it would let this migration's behavior silently drift.
 *
 * @param {?Array} native The native shadow attribute value.
 *
 * @since TBD
 *
 * @return {boolean} Whether the shadow has a visible footprint.
 */
function isVisibleShadowValue(native) {
	const source = native?.[0];

	if (!source) {
		return false;
	}

	return [source.hOffset, source.vOffset, source.blur, source.spread].some((axis) => Number(axis) !== 0);
}

/**
 * Whether one toggle/value pair holds stale data worth cleaning up: toggled off, but the value still
 * carries a real, non-zero shadow.
 *
 * @param {Object} attributes The block's attributes.
 * @param {string} toggleKey  The display-toggle attribute's name.
 * @param {string} valueKey   The paired shadow-value attribute's name.
 *
 * @since TBD
 *
 * @return {boolean} Whether this pair is stale.
 */
function isStalePair(attributes, toggleKey, valueKey) {
	return attributes[toggleKey] === false && isVisibleShadowValue(attributes[valueKey]);
}

export default [
	{
		attributes: metadata.attributes,
		supports: metadata.supports,
		save() {
			return null;
		},
		/**
		 * Whether any of the six toggle/value pairs holds stale data.
		 *
		 * @param {Object} attributes The block's attributes.
		 *
		 * @since TBD
		 *
		 * @return {boolean} Whether this deprecation's `migrate()` should run.
		 */
		isEligible(attributes) {
			return SHADOW_TOGGLES.some(([toggleKey, valueKey]) => isStalePair(attributes, toggleKey, valueKey));
		},
		/**
		 * Nulls out every stale pair's shadow value, leaving every other attribute (including the
		 * toggle itself) untouched.
		 *
		 * @param {Object} attributes The block's attributes.
		 *
		 * @since TBD
		 *
		 * @return {Object} The migrated attributes.
		 */
		migrate(attributes) {
			const next = { ...attributes };

			SHADOW_TOGGLES.forEach(([toggleKey, valueKey]) => {
				if (isStalePair(attributes, toggleKey, valueKey)) {
					next[valueKey] = [];
				}
			});

			return next;
		},
	},
];
