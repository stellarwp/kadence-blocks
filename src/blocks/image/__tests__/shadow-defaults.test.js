/* eslint-env jest */

/**
 * Pins `kadence/image`'s box shadow attributes to the pair the plugin has always shipped.
 *
 * The visible value default looks wrong in isolation, and is load-bearing for saved content:
 * WordPress omits any attribute equal to its registered default, so an image whose shadow was
 * switched on but never customized stored its flag and NO value key at all. Lowering the value
 * default to a transparent shadow silently erases the shadow on every one of those images, and
 * `deprecated.js` cannot repair them — it carries no shadow migration and only runs on a markup
 * mismatch.
 *
 * What keeps a fresh image clean is the paired flag, which defaults to `false` and gates both
 * renderers — pinned here too, since the two halves only work together.
 */

/**
 * Internal dependencies
 */
import metadata from '../block.json';

describe('kadence/image shipped shadow defaults', () => {
	/**
	 * The value default still registers the exact one-item visible shadow the plugin shipped.
	 *
	 * @return {void}
	 */
	it('registers the shipped visible shadow as the box shadow default', () => {
		expect(metadata.attributes.boxShadow).toEqual({
			type: 'array',
			default: [{ color: '#000000', opacity: 0.2, spread: 0, blur: 14, hOffset: 0, vOffset: 0, inset: false }],
		});
	});

	/**
	 * The visible default above is only safe because its flag starts lowered.
	 *
	 * @return {void}
	 */
	it('pairs the box shadow value with an enable flag that starts lowered', () => {
		expect(metadata.attributes.displayBoxShadow).toEqual({ type: 'boolean', default: false });
	});
});
