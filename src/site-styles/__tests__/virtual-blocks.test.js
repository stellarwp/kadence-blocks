/* eslint-env jest */

afterEach(() => {
	delete window.kadenceSiteStylesVirtualBlocks;
});

describe('virtual blocks', () => {
	it('are shared by separate copies of the module, as separate bundles load it', () => {
		let panel;
		let overlay;

		jest.isolateModules(() => {
			panel = require('../virtual-blocks');
		});
		jest.isolateModules(() => {
			overlay = require('../virtual-blocks');
		});

		panel.addVirtualBlock('abc');
		expect(overlay.isVirtualBlock('abc')).toBe(true);

		panel.removeVirtualBlock('abc');
		expect(overlay.isVirtualBlock('abc')).toBe(false);
	});
});
