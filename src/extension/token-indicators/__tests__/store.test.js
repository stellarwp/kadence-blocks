/* eslint-env jest */
/**
 * `store.js` registers `kadence/token-indicators` as an unconditional module-load side effect.
 * Two separate webpack bundles (`early-filters.js` and `blocks-singlebtn.js`) both import it, so
 * its top-level code runs once per bundle on the same page — `@wordpress/data`'s registry is a
 * page-wide singleton, so the second bundle's copy must not re-register. These tests exercise the
 * guard in isolation, mocking `@wordpress/data` so the module's own load-time logic is what's
 * under test, not the real registry.
 */

/**
 * Loads `store.js` fresh, with `@wordpress/data`'s `select`/`register`/`createReduxStore` mocked.
 *
 * @param {*} selectReturnValue What the mocked `select( 'kadence/token-indicators' )` returns.
 *
 * @since TBD
 *
 * @return {Object} `{ register }` — the mocked `register` spy, for assertions.
 */
function loadStoreModule(selectReturnValue) {
	jest.resetModules();

	const register = jest.fn();
	const select = jest.fn(() => selectReturnValue);
	const createReduxStore = jest.fn((name, config) => ({ name, config }));

	jest.doMock('@wordpress/data', () => ({ register, select, createReduxStore }));

	require('../store');

	return { register, select };
}

describe('token-indicators store registration guard', () => {
	it('registers the store when @wordpress/data reports it as not yet registered', () => {
		const { register, select } = loadStoreModule(undefined);

		expect(select).toHaveBeenCalledWith('kadence/token-indicators');
		expect(register).toHaveBeenCalledTimes(1);
	});

	it('does not re-register when @wordpress/data already reports the store as registered', () => {
		const { register, select } = loadStoreModule({ isHighlightingEdits: () => false });

		expect(select).toHaveBeenCalledWith('kadence/token-indicators');
		expect(register).not.toHaveBeenCalled();
	});
});
