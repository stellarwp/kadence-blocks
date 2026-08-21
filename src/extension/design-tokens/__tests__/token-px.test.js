/* eslint-env jest */
/**
 * Alias-to-pixel resolution for the editor render paths that cannot consume a CSS variable, and its
 * parity with the PHP `Converts_Number_To_Px` trait.
 *
 * `kadence/single-icon`'s `size` is written into the SVG's `width`/`height` presentation attributes,
 * which take a number rather than a `var()`. The front end renders the same attribute as a
 * `font-size` declaration and resolves the alias in PHP. If the two conversions disagreed, an icon
 * bound to a token would render one size in the editor and another on the front end — so the numeric
 * half of this module is pinned to the same JSON fixture a PHP test asserts against.
 *
 * The alias-resolution half (reading the localized pool) has no PHP counterpart to match: it is this
 * module reproducing, in the editor, what the resolver already did on the server.
 */

// `../token-px` pulls in `../../preset-picker` for `activeLibrary()`, which imports
// `@kadence/components` (an untransformed ESM module) for its `KadenceRadioButtons` component. This
// module never renders it, so stub it out.
jest.mock('@kadence/components', () => ({}));

import { tokenPx } from '../token-px';
import conformance from './fixtures/length-to-px-conformance.json';

/**
 * The pickable pool the editor localizer prints, trimmed to the icon-size family plus one token whose
 * value is a bare `0` — the unitless case both languages decline.
 */
const POOL = {
	tokens: [],
	values: {
		default: {
			'primitive.dimension.icon-size.sm': '1rem',
			'primitive.dimension.icon-size.md': '1.5rem',
			'primitive.dimension.icon-size.lg': '2.25rem',
			'semantic.icon-size.default': '1.5rem',
			'primitive.dimension.radius.none': '0',
		},
		brand: { 'primitive.dimension.icon-size.lg': '48px' },
	},
};

beforeEach(() => {
	window.kadenceDesignTokensPickable = POOL;
	window.kadenceDesignTokensPresets = { active: 'default', libraries: {} };
});

afterEach(() => {
	delete window.kadenceDesignTokensPickable;
	delete window.kadenceDesignTokensPresets;
});

describe('tokenPx literal conversion', () => {
	it.each(conformance.lengths.map(({ length, px }) => [length, px]))('converts %s to %p', (length, px) => {
		expect(tokenPx(length)).toBe(px);
	});

	it.each(conformance.unconvertible)('declines the unconvertible %p', (value) => {
		expect(tokenPx(value)).toBeNull();
	});

	it.each([null, undefined, true, false, ['1rem'], { size: 1 }])('declines the non-length %p', (value) => {
		expect(tokenPx(value)).toBeNull();
	});

	/**
	 * The number grammar rejects a malformed decimal rather than salvaging a prefix of it. PHP's converter
	 * matches this exactly; a looser `[0-9.]+` there would turn `1.2.3rem` into 19.2px on the front end
	 * while the editor fell back to its default, which is the drift the shared fixture exists to catch.
	 */
	it.each(['1..2px', '..px', '1.2.3rem', '1.rem', '1.px'])('declines the malformed decimal %p', (value) => {
		expect(tokenPx(value)).toBeNull();
	});

	/**
	 * `parseCssLength` accepts a finite number directly, but a bare number has no unit to convert from,
	 * so it is declined exactly as the unitless string `'50'` is — and exactly as PHP declines it. The
	 * caller keeps its own raw pixel value in that case.
	 */
	it('declines a bare number, which carries no unit', () => {
		expect(tokenPx(50)).toBeNull();
	});
});

describe('tokenPx alias resolution', () => {
	it('resolves an alias through the active library, then converts', () => {
		expect(tokenPx('{primitive.dimension.icon-size.lg}')).toBe(36);
		expect(tokenPx('{primitive.dimension.icon-size.sm}')).toBe(16);
		expect(tokenPx('{semantic.icon-size.default}')).toBe(24);
	});

	it('reads the requested library rather than the active one', () => {
		expect(tokenPx('{primitive.dimension.icon-size.lg}', 'brand')).toBe(48);
	});

	it('follows the active library when the catalog names a different one', () => {
		window.kadenceDesignTokensPresets = { active: 'brand', libraries: {} };

		expect(tokenPx('{primitive.dimension.icon-size.lg}')).toBe(48);
	});

	/**
	 * An alias the library does not define resolves to nothing convertible, so the caller falls back to
	 * its own default instead of writing a `var()` — or a raw alias string — into an SVG attribute.
	 */
	it('declines an alias the library does not define', () => {
		expect(tokenPx('{primitive.dimension.icon-size.xl}')).toBeNull();
	});

	/**
	 * A token whose resolved value is a unitless `0` is declined, matching the PHP trait. Pinning the
	 * gap rather than papering over it on one side is what keeps the two conversions identical.
	 */
	it('declines an alias resolving to a unitless value', () => {
		expect(tokenPx('{primitive.dimension.radius.none}')).toBeNull();
	});

	it('fails soft when the pool is missing', () => {
		delete window.kadenceDesignTokensPickable;

		expect(() => tokenPx('{primitive.dimension.icon-size.lg}')).not.toThrow();
		expect(tokenPx('{primitive.dimension.icon-size.lg}')).toBeNull();
	});
});
