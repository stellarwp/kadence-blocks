/* eslint-env jest */
import { SITE_STYLES_PANEL_SETTING, useIsSiteStylesPanel } from '../use-is-site-styles-panel';

let mockSettings = {};

// The block editor store of whichever block editor the hook renders in.
jest.mock(
	'@wordpress/data',
	() => ({
		useSelect: (mapSelect) =>
			mapSelect((store) => (store === 'core/block-editor' ? { getSettings: () => mockSettings } : {})),
	}),
	{ virtual: true }
);

describe('useIsSiteStylesPanel', () => {
	it('is true in a block editor the Kadence panel marks', () => {
		mockSettings = { [SITE_STYLES_PANEL_SETTING]: true };

		expect(useIsSiteStylesPanel()).toBe(true);
	});

	it.each([
		['without the setting', {}],
		['with another value', { [SITE_STYLES_PANEL_SETTING]: 'yes' }],
	])('is false in a block editor %s', (name, settings) => {
		mockSettings = settings;

		expect(useIsSiteStylesPanel()).toBe(false);
	});
});
