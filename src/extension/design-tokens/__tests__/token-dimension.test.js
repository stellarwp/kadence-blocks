/* eslint-env jest */
/**
 * The inline-style dimension resolver.
 *
 * A block that paints a dimension into a React `style` object concatenates the stored value with its
 * unit attribute, which is correct for a number and produces invalid CSS for a `{dot.alias}`.
 * `tokenDimension()` is the resolution step those call sites lack, and it has to match the front
 * end's: a backed alias becomes its CSS variable, an unbacked one is left alone rather than emitted
 * as a dead `var()`, and everything else concatenates exactly as before.
 *
 * The resolved-values map is read off `window.kadenceDesignTokensPickable`, so each test sets that
 * global directly rather than mocking the reader.
 */
import { tokenDimension } from '../token-dimension';

const BACKED = '{primitive.dimension.radius.lg}';
const UNBACKED = '{primitive.dimension.radius.gone}';

/**
 * Localize a pickable pool whose active library resolves the backed radius token.
 *
 * @return {void}
 */
function localizeTokens() {
	window.kadenceDesignTokensPickable = {
		active: 'default',
		values: {
			default: {
				'primitive.dimension.radius.lg': '1rem',
			},
		},
	};
}

describe('tokenDimension', () => {
	beforeEach(() => {
		localizeTokens();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
	});

	/**
	 * A backed alias resolves to the CSS variable the front end emits for the same token, with the
	 * unit dropped — the length travels inside the token, so appending one would corrupt it.
	 *
	 * @return {void}
	 */
	it('resolves a backed alias to its token variable', () => {
		expect(tokenDimension(BACKED, 'px')).toBe('var(--kb-token--primitive--dimension--radius--lg)');
	});

	/**
	 * An alias the active library no longer backs is returned untouched, so the browser drops the
	 * declaration and the element falls back to whatever global CSS applies — rather than the editor
	 * emitting a dead variable that resolves to nothing.
	 *
	 * @return {void}
	 */
	it('leaves an unbacked alias alone rather than emitting a dead variable', () => {
		expect(tokenDimension(UNBACKED, 'px')).toBe(UNBACKED);
	});

	/**
	 * With no pool localized at all there is no map to consult, so an alias reads as backed —
	 * matching `isBackedToken`'s documented fail-open and the PHP renderer it mirrors.
	 *
	 * @return {void}
	 */
	it('fails open to the variable when no token pool is localized', () => {
		delete window.kadenceDesignTokensPickable;

		expect(tokenDimension(BACKED, 'px')).toBe('var(--kb-token--primitive--dimension--radius--lg)');
	});

	/**
	 * Every non-alias slot concatenates exactly as the call sites did before, including a zero, which
	 * is a real radius rather than an absent one.
	 *
	 * @param {string} _label   The case name, used only for the test title.
	 * @param {*}      value    The stored slot value.
	 * @param {string} unit     The unit attribute's value.
	 * @param {string} expected The CSS length the slot should produce.
	 *
	 * @return {void}
	 */
	it.each([
		['a number', 10, 'px', '10px'],
		['a numeric string', '24', 'px', '24px'],
		['a zero', 0, 'px', '0px'],
		['a zero string', '0', 'px', '0px'],
		['a relative unit', 1.5, 'rem', '1.5rem'],
		['a percentage', 50, '%', '50%'],
	])('concatenates %s unchanged', (_label, value, unit, expected) => {
		expect(tokenDimension(value, unit)).toBe(expected);
	});
});
