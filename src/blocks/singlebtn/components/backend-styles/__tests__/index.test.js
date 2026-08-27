/* eslint-env jest */

/**
 * `hasVisibleShadow()` decides whether the editor-canvas live preview emits a `box-shadow`
 * declaration from a shadow value's own axes — the JS sibling of the front end's
 * `has_visible_shadow()` (`class-kadence-blocks-singlebtn-block.php`), now that the "Enable Box
 * Shadow" toggle and its sibling boolean attributes are gone.
 */

/**
 * Internal dependencies
 */
import { hasVisibleShadow } from '../index';

// `backend-styles/index.js` imports the `@kadence/helpers` barrel, which eagerly pulls in a
// REST-fetch helper that has no `@wordpress/api-fetch` module to resolve under Jest (the same
// constraint documented in `preset-border-shadow-properties.test.js`). `hasVisibleShadow` does not
// call into the helper library, so a bare stub is enough to let the module load without pulling
// that dependency in.
jest.mock('@kadence/helpers', () => ({
	KadenceBlocksCSS: jest.fn(),
	getPreviewSize: jest.fn(),
	KadenceColorOutput: jest.fn(),
	typographyStyle: jest.fn(),
	getBorderStyle: jest.fn(),
	getBorderColor: jest.fn(),
	getSpacingOptionOutput: jest.fn(),
}));

jest.mock('../../../../../extension/preset-picker', () => ({
	activePresetFor: jest.fn(),
	blockPresetValues: jest.fn(),
}));

describe('hasVisibleShadow', () => {
	/**
	 * An all-zero shadow item — the shape the fixed "None" pick writes — paints nothing.
	 *
	 * @return {void}
	 */
	it('is false for an all-zero shadow item', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0, blur: 0, spread: 0 })).toBe(false);
	});

	/**
	 * A missing/undefined item (an attribute that has never been set) is treated as invisible
	 * rather than throwing on a property read.
	 *
	 * @return {void}
	 */
	it('is false for a missing/undefined item', () => {
		expect(hasVisibleShadow(undefined)).toBe(false);
	});

	/**
	 * An item missing some axis keys entirely (older data written before every axis was stored) reads
	 * as invisible, matching PHP's `has_visible_shadow()` — `Number(undefined)` is `NaN`, which a bare
	 * `!== 0` comparison would have counted as visible.
	 *
	 * @return {void}
	 */
	it('is false when an axis key is missing entirely', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0 })).toBe(false);
		expect(hasVisibleShadow({ color: '#000000' })).toBe(false);
	});

	/**
	 * A non-numeric axis value is not a visible one either, for the same reason as a missing key.
	 *
	 * @return {void}
	 */
	it('is false for a non-numeric axis value', () => {
		expect(hasVisibleShadow({ hOffset: '', vOffset: null, blur: 'none', spread: undefined })).toBe(false);
	});

	/**
	 * Any single non-zero axis is enough to count the item as visible.
	 *
	 * @return {void}
	 */
	it('is true when any one axis is non-zero', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0, blur: 2, spread: 0 })).toBe(true);
	});
});
