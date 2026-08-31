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
import { hasVisibleShadow, shadowAxisPx, shadowCss } from '../index';

// `backend-styles/index.js` imports the `@kadence/helpers` barrel, which eagerly pulls in a
// REST-fetch helper that has no `@wordpress/api-fetch` module to resolve under Jest (the same
// constraint documented in `preset-border-shadow-properties.test.js`). `hasVisibleShadow` does not
// call into the helper library, so a bare stub is enough to let the module load without pulling
// that dependency in.
jest.mock('@kadence/helpers', () => ({
	KadenceBlocksCSS: jest.fn(),
	getPreviewSize: jest.fn(),
	KadenceColorOutput: jest.fn((color, opacity) =>
		undefined === opacity || 1 === opacity ? color : `rgba(${color}, ${opacity})`
	),
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

/**
 * A shadow item bound to a backed token, plus the localized pool that backs it.
 *
 * @since TBD
 *
 * @type {Object}
 */
const BOUND_ITEM = {
	color: '#00ff00',
	opacity: 1,
	hOffset: 0,
	vOffset: 2,
	blur: 8,
	spread: 0,
	inset: false,
	shadowToken: '{semantic.shadow.card}',
};

describe('shadowCss', () => {
	beforeEach(() => {
		window.kadenceDesignTokensPresets = { active: 'default' };
		window.kadenceDesignTokensPickable = {
			values: { default: { 'semantic.shadow.card': '0px 2px 8px 0px rgba(23, 23, 23, 0.12)' } },
		};
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
		delete window.kadenceDesignTokensPickable;
	});

	/**
	 * A backed binding resolves to the token's custom property, so editing the token moves the button
	 * without the post being re-saved.
	 *
	 * @return {void}
	 */
	it('emits the token var for a backed binding', () => {
		expect(shadowCss(BOUND_ITEM, 14)).toBe('var(--kb-token--semantic--shadow--card)');
	});

	/**
	 * A binding the active library no longer backs renders nothing, so the block falls back to its
	 * default CSS the same way every other block does when a token is deleted — the stored legs hold
	 * the value the token had when it was picked, but that value is stale and the renderer no longer
	 * reads it.
	 *
	 * @return {void}
	 */
	it('returns an empty string for an unbacked binding', () => {
		window.kadenceDesignTokensPickable = { values: { default: {} } };

		expect(shadowCss(BOUND_ITEM, 14)).toBe('');
	});

	/**
	 * An unbound item renders its legs exactly as the hand-rolled builders did, inset prefix included.
	 *
	 * @return {void}
	 */
	it('builds the literal shorthand for an unbound item', () => {
		expect(shadowCss({ ...BOUND_ITEM, shadowToken: undefined, inset: true }, 14)).toBe(
			'inset 0px 2px 8px 0px #00ff00'
		);
	});

	/**
	 * A missing axis falls back to the caller's own default, which is 14 for blur and 0 elsewhere —
	 * the historic per-leg defaults this block has always applied.
	 *
	 * @return {void}
	 */
	it('applies the historic per-leg defaults for missing axes', () => {
		expect(shadowCss({ color: '#000000', opacity: 1 }, 14)).toBe('0px 0px 14px 0px #000000');
	});

	/**
	 * An absent item produces no declaration rather than a shorthand of defaults.
	 *
	 * @return {void}
	 */
	it('returns an empty string for a missing item', () => {
		expect(shadowCss(undefined, 14)).toBe('');
	});
});

describe('hasVisibleShadow with a binding', () => {
	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
		delete window.kadenceDesignTokensPickable;
	});

	/**
	 * A backed bound item counts as visible whatever its legs say — the token's own value is unknown to
	 * this gate, and reading it as invisible would let the base rule's `box-shadow: none` erase it.
	 *
	 * @return {void}
	 */
	it('counts a bound item with zero legs as visible', () => {
		expect(
			hasVisibleShadow({
				color: 'transparent',
				opacity: 1,
				hOffset: 0,
				vOffset: 0,
				blur: 0,
				spread: 0,
				inset: false,
				shadowToken: '{semantic.shadow.card}',
			})
		).toBe(true);
	});

	/**
	 * An unbacked binding is not visible — it takes exactly the path an item with no shadow already
	 * takes, so the caller's `box-shadow: none` reset fires instead of holding the stale frozen legs.
	 *
	 * @return {void}
	 */
	it('is false for an unbacked binding', () => {
		window.kadenceDesignTokensPresets = { active: 'default' };
		window.kadenceDesignTokensPickable = { values: { default: {} } };

		expect(
			hasVisibleShadow({
				color: '#00ff00',
				opacity: 1,
				hOffset: 0,
				vOffset: 2,
				blur: 8,
				spread: 0,
				inset: false,
				shadowToken: '{semantic.shadow.card}',
			})
		).toBe(false);
	});
});
