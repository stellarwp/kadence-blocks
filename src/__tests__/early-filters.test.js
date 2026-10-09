/* eslint-env jest */

const NOTICE = 'kadence-blocks/with-template-part-notice';

// Stand-ins for the editor packages early-filters needs to load.
jest.mock('@wordpress/blocks', () => ({ hasBlockSupport: () => false, getBlockSupport: () => undefined }), {
	virtual: true,
});
jest.mock('@wordpress/components', () => ({}), { virtual: true });
jest.mock('@wordpress/compose', () => ({ createHigherOrderComponent: (hoc) => hoc }), { virtual: true });
jest.mock('@wordpress/data', () => ({ useDispatch: () => ({}), select: () => ({}), useSelect: () => ({}) }), {
	virtual: true,
});
jest.mock('@kadence/helpers', () => ({ blockExists: () => false }));

/**
 * Loads the early filters in a fresh module registry.
 *
 * @return {boolean} Whether they added the header template part notice.
 */
function addsNotice() {
	let added;

	jest.isolateModules(() => {
		require('../early-filters');
		added = require('@wordpress/hooks').hasFilter('editor.BlockEdit', NOTICE);
	});

	return added;
}

describe('header template part notice', () => {
	afterEach(() => {
		delete window.kadenceSiteStyles;
		delete window.wpWidgets;
	});

	it("is offered outside the Kadence theme's FSE mode", () => {
		window.kadenceSiteStyles = { isFseMode: false, blocks: {} };

		expect(addsNotice()).toBe(true);
	});

	it('is offered without the server data', () => {
		expect(addsNotice()).toBe(true);
	});

	it("is left out in the Kadence theme's FSE mode, where the header part is the theme's own", () => {
		window.kadenceSiteStyles = { isFseMode: true, blocks: {} };

		expect(addsNotice()).toBe(false);
	});

	it('is left out of the widgets editor', () => {
		window.kadenceSiteStyles = { isFseMode: false, blocks: {} };
		window.wpWidgets = {};

		expect(addsNotice()).toBe(false);
	});
});
