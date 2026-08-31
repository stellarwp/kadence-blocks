/* eslint-env jest */

/**
 * The editor canvas's `box-shadow` for `kadence/image`, which has to agree with the front-end
 * renderer in `class-kadence-blocks-image-block.php` on all three counts: the enable flag gates it,
 * a whole-shadow token binding wins over the stored legs, and an unbound item keeps the historic
 * per-leg defaults.
 */

/**
 * Internal dependencies
 */
import { imageBoxShadowCss } from '../box-shadow';
import metadata from '../block.json';

// The `@kadence/helpers` barrel eagerly pulls in a REST-fetch helper with no `@wordpress/api-fetch`
// module to resolve under Jest. Only the color output is reached from here, so a stub is enough.
jest.mock('@kadence/helpers', () => ({
	KadenceColorOutput: jest.fn((color, opacity) =>
		undefined === opacity || 1 === opacity ? color : `rgba(${color}, ${opacity})`
	),
}));

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

describe('imageBoxShadowCss', () => {
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
	 * A fresh image carries the shipped visible default but a lowered flag, so the canvas paints
	 * nothing — the pairing that makes that default safe to register.
	 *
	 * @return {void}
	 */
	it('paints nothing for a fresh image whose flag is lowered', () => {
		expect(
			imageBoxShadowCss(metadata.attributes.displayBoxShadow.default, metadata.attributes.boxShadow.default)
		).toBeUndefined();
	});

	/**
	 * Legacy content saved with the old toggle switched OFF kept whatever values were behind it. The
	 * flag, not the geometry, still decides, so those values stay unpainted.
	 *
	 * @return {void}
	 */
	it('paints nothing for a legacy item left behind a lowered flag', () => {
		expect(imageBoxShadowCss(false, [{ ...BOUND_ITEM, shadowToken: undefined }])).toBeUndefined();
	});

	/**
	 * A bound item resolves to the token's custom property, so editing the token moves the image
	 * without the post being re-saved — the whole point of the binding, and what the front end already
	 * emits from `render_shadow()`.
	 *
	 * @return {void}
	 */
	it('emits the token var for a backed binding', () => {
		expect(imageBoxShadowCss(true, [BOUND_ITEM])).toBe('var(--kb-token--semantic--shadow--card)');
	});

	/**
	 * An unbound item renders its stored legs, inset prefix included, exactly as the hand-rolled
	 * builder did.
	 *
	 * @return {void}
	 */
	it('builds the literal shorthand for an unbound item', () => {
		expect(imageBoxShadowCss(true, [{ ...BOUND_ITEM, shadowToken: undefined, inset: true }])).toBe(
			'inset 0px 2px 8px 0px #00ff00'
		);
	});

	/**
	 * Missing axes fall back to this block's own historic defaults: 14 for blur, 0.2 for opacity, and
	 * 0 everywhere else.
	 *
	 * @return {void}
	 */
	it('applies the historic per-leg defaults for missing axes', () => {
		expect(imageBoxShadowCss(true, [{ color: '#000000', vOffset: 4 }])).toBe('0px 4px 14px 0px rgba(#000000, 0.2)');
	});
});
