/* eslint-env jest */

/**
 * Pins `kadence/singlebtn`'s six shadow value attributes to the defaults the plugin has always
 * shipped.
 *
 * These defaults look wrong in isolation — a brand-new button registers a VISIBLE shadow. They are
 * load-bearing for saved content: WordPress omits any attribute equal to its registered default, so
 * a button whose shadow was switched on but never customized saved its `display*` flag and NO value
 * key at all. `save()` returns `null`, so the front end renders straight from the stored attributes
 * and no editor-side migration ever runs for a post nobody reopens. Lowering these defaults to a
 * transparent shadow silently erases the shadow on every one of those buttons.
 *
 * What keeps a fresh button clean is the paired `display*` flag, which defaults to `false` and gates
 * both renderers — pinned here too, since the two halves only work together.
 */

/**
 * Internal dependencies
 */
import metadata from '../block.json';

const SHIPPED_BASE = { color: '#000000', opacity: 0.2, spread: 0, blur: 2, hOffset: 1, vOffset: 1, inset: false };
const SHIPPED_HOVER = { color: '#000000', opacity: 0.4, spread: 0, blur: 3, hOffset: 2, vOffset: 2, inset: false };

const SHIPPED_SHADOW_DEFAULTS = {
	shadow: SHIPPED_BASE,
	shadowTransparent: SHIPPED_BASE,
	shadowSticky: SHIPPED_BASE,
	shadowHover: SHIPPED_HOVER,
	shadowTransparentHover: SHIPPED_HOVER,
	shadowStickyHover: SHIPPED_HOVER,
};

const SHADOW_FLAGS = [
	'displayShadow',
	'displayHoverShadow',
	'displayShadowTransparent',
	'displayHoverShadowTransparent',
	'displayShadowSticky',
	'displayHoverShadowSticky',
];

describe('kadence/singlebtn shipped shadow defaults', () => {
	/**
	 * Every shadow value attribute still registers the exact one-item default the plugin shipped, so
	 * a legacy button that stored no value key of its own keeps rendering the shadow it always had.
	 *
	 * @return {void}
	 */
	it('registers the shipped visible shadow as each shadow value default', () => {
		Object.entries(SHIPPED_SHADOW_DEFAULTS).forEach(([attribute, item]) => {
			expect(metadata.attributes[attribute]).toEqual({ type: 'array', default: [item] });
		});
	});

	/**
	 * The visible defaults above are only safe because each one is gated by a flag that starts
	 * lowered — an untouched button therefore paints nothing.
	 *
	 * @return {void}
	 */
	it('pairs every shadow value with an enable flag that starts lowered', () => {
		SHADOW_FLAGS.forEach((flag) => {
			expect(metadata.attributes[flag]).toEqual({ type: 'boolean', default: false });
		});
	});
});
