/* eslint-env jest */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import KadenceColorDefault from '../color-palette-defaults';

const mockUpdateSettings = jest.fn();
const mockApiFetch = jest.fn(() => Promise.resolve({}));
let mockFeatures;

/**
 * Reads a setting the way core does: color.palette resolves to the user, theme or default origin.
 *
 * @param {string} path The setting's path.
 * @return {*} The setting.
 */
function mockGetSetting(path) {
	const palette = mockFeatures.color.palette;

	if ('color.palette' === path) {
		return palette.custom ?? palette.theme ?? palette.default;
	}

	return path.split('.').reduce((value, key) => value?.[key], mockFeatures);
}

// Stand-ins for the editor packages the panel uses.
jest.mock(
	'@wordpress/block-editor',
	() => ({
		useSetting: () => true,
		useSettings: (...paths) => paths.map(mockGetSetting),
		store: 'core/block-editor',
	}),
	{ virtual: true }
);
jest.mock(
	'@wordpress/data',
	() => ({
		useDispatch: (store) =>
			'core/notices' === store ? { createErrorNotice: () => {} } : { updateSettings: mockUpdateSettings },
		useSelect: (selector) =>
			selector((store) =>
				'core/block-editor' === store ? { getSettings: () => ({ __experimentalFeatures: mockFeatures }) } : {}
			),
	}),
	{ virtual: true }
);
jest.mock('@wordpress/notices', () => ({ store: 'core/notices' }), { virtual: true });
jest.mock('@wordpress/api-fetch', () => (options) => mockApiFetch(options), { virtual: true });
jest.mock('@wordpress/compose', () => ({ compose: () => {} }), { virtual: true });
jest.mock(
	'@wordpress/components',
	() => {
		const { createElement: h, Fragment } = require('react');

		return {
			Button: ({ children, onClick, disabled, 'aria-label': label }) =>
				h('button', { onClick, disabled, 'aria-label': label }, children),
			Dashicon: () => null,
			ToggleControl: () => null,
			Tooltip: ({ children }) => h(Fragment, null, children),
		};
	},
	{ virtual: true }
);
jest.mock('@kadence/components', () => ({ AdvancedColorControlPalette: () => null }));

global.IS_REACT_ACT_ENVIRONMENT = true;

const BLACK = { slug: 'black', color: '#000000', name: 'Black' };
const WHITE = { slug: 'white', color: '#ffffff', name: 'White' };
const KADENCE_COLOR = expect.objectContaining({ slug: expect.stringMatching(/^kb-palette-/) });

let container;
let root;

/**
 * Renders the panel with the given palette origins.
 *
 * @param {Object} palette The theme, user and default origins.
 */
function renderPanel(palette) {
	mockFeatures = { color: { palette } };

	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
	act(() => root.render(createElement(KadenceColorDefault)));
}

/**
 * Clicks Add Color and lets the save finish.
 */
async function addColor() {
	await act(async () => container.querySelector('[aria-label="Add Color"]').click());
}

/**
 * The theme palette the panel last wrote to the editor settings.
 *
 * @return {Array} The palette.
 */
function writtenThemePalette() {
	expect(mockUpdateSettings).toHaveBeenCalled();

	return mockUpdateSettings.mock.lastCall[0].__experimentalFeatures.color.palette.theme;
}

describe('Kadence Blocks color palette panel', () => {
	beforeEach(() => {
		global.kadence_blocks_params = {};
		mockUpdateSettings.mockClear();
		mockApiFetch.mockClear();
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
	});

	it('adds a color after the resolved palette on a theme without one', async () => {
		renderPanel({ default: [{ ...BLACK }, { ...WHITE }] });
		await addColor();

		expect(mockApiFetch).toHaveBeenCalledWith(
			expect.objectContaining({
				data: { kadence_blocks_colors: expect.stringContaining('"slug":"kb-palette-') },
			})
		);
		expect(writtenThemePalette()).toEqual([BLACK, WHITE, KADENCE_COLOR]);
	});

	it("writes back the theme's palette, not the user's colors", async () => {
		const theme = [{ slug: 'accent', color: '#123456', name: 'Accent' }];

		renderPanel({ default: [{ ...BLACK }], theme, custom: [{ slug: 'mine', color: '#654321', name: 'Mine' }] });

		expect(writtenThemePalette()).toBe(theme);
	});
});
