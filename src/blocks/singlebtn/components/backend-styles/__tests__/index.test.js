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
import { hasVisibleShadow, shadowAxisPx } from '../index';

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

jest.mock('../../../../../extension/design-tokens/token-px', () => ({
	tokenPx: jest.fn((value) => (value === '{primitive.shadow.md}' ? 8 : null)),
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
	 * An empty or nullish axis value is not a visible one, for the same reason as a missing key.
	 *
	 * @return {void}
	 */
	it('is false for an empty or nullish axis value', () => {
		expect(hasVisibleShadow({ hOffset: '', vOffset: null, blur: '   ', spread: undefined })).toBe(false);
	});

	/**
	 * Any single non-zero axis is enough to count the item as visible.
	 *
	 * @return {void}
	 */
	it('is true when any one axis is non-zero', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0, blur: 2, spread: 0 })).toBe(true);
	});
	/**
	 * A {dot.alias} token reference on any leg resolves to a var() whose value is unknown here, so it
	 * counts as visible. Read as zero, the caller's `box-shadow: none` would erase a shadow the token
	 * does paint. Mirrors the PHP renderer's own gate.
	 *
	 * @return {void}
	 */
	it('is true for a token alias reference on any leg', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0, blur: '{primitive.shadow.md}', spread: 0 })).toBe(true);
	});
});

describe('shadowAxisPx', () => {
	/**
	 * A {dot.alias} leg resolves through the token pool. Concatenated raw it would emit `{alias}px`,
	 * which is not valid CSS — and `hasVisibleShadow()` counts such a leg as visible, so it does reach
	 * the serializer.
	 *
	 * @return {void}
	 */
	it('resolves a token alias leg to its pixel value', () => {
		expect(shadowAxisPx('{primitive.shadow.md}', 0)).toBe(8);
	});

	/**
	 * An alias the pool cannot resolve falls back to the axis default rather than emitting the raw
	 * alias, which would serialize as invalid CSS.
	 *
	 * @return {void}
	 */
	it('falls back to the axis default when the alias does not resolve', () => {
		expect(shadowAxisPx('{primitive.shadow.unknown}', 14)).toBe(14);
	});

	/**
	 * A plain numeric axis passes through untouched, and an unset one takes its default.
	 *
	 * @return {void}
	 */
	it('passes a numeric axis through and defaults an unset one', () => {
		expect(shadowAxisPx(4, 0)).toBe(4);
		expect(shadowAxisPx(0, 14)).toBe(0);
		expect(shadowAxisPx(undefined, 14)).toBe(14);
		expect(shadowAxisPx(null, 14)).toBe(14);
	});
});
