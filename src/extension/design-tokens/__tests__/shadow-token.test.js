/* eslint-env jest */

/**
 * Internal dependencies
 */
import { SHADOW_TOKEN_KEY, boundShadowToken } from '../shadow-token';

describe('boundShadowToken', () => {
	/**
	 * An item carrying a well-formed alias reports it, which is what every reader keys off.
	 *
	 * @return {void}
	 */
	it('reports a well-formed binding', () => {
		expect(boundShadowToken({ [SHADOW_TOKEN_KEY]: '{semantic.shadow.card}' })).toBe('{semantic.shadow.card}');
	});

	/**
	 * A value that is not alias-shaped is not a binding — the fixed "None" sentinel's literal shorthand
	 * is the case this guards, since binding it would point at a token that was never registered.
	 *
	 * @return {void}
	 */
	it('rejects a non-alias value', () => {
		expect(boundShadowToken({ [SHADOW_TOKEN_KEY]: '0px 0px 0px 0px transparent' })).toBeNull();
	});

	/**
	 * An item with no binding key, and no item at all, both report nothing rather than throwing.
	 *
	 * @return {void}
	 */
	it('reports nothing for an unbound or missing item', () => {
		expect(boundShadowToken({ blur: 8 })).toBeNull();
		expect(boundShadowToken(undefined)).toBeNull();
	});
});
