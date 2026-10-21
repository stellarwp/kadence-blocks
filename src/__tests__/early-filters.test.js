/* eslint-env jest */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

const NOTICE = 'kadence-blocks/with-template-part-notice';
const PRESET_PICKER = 'kadence/kb-preset-picker';

let mockSupports = [];
let mockSettings = {};

// Stand-ins for the editor packages early-filters needs to load.
jest.mock(
	'@wordpress/blocks',
	() => ({
		hasBlockSupport: (name, feature) => mockSupports.includes(feature),
		getBlockSupport: () => undefined,
		createBlock: () => ({}),
		getBlockType: () => undefined,
		getBlockFromExample: () => ({}),
	}),
	{ virtual: true }
);
jest.mock('@wordpress/block-editor', () => ({ InspectorControls: ({ children }) => children }), { virtual: true });
jest.mock('@wordpress/api-fetch', () => () => Promise.resolve(), { virtual: true });
jest.mock('@wordpress/components', () => ({}), { virtual: true });
jest.mock('@wordpress/compose', () => ({ createHigherOrderComponent: (hoc) => hoc }), { virtual: true });
jest.mock(
	'@wordpress/data',
	() => ({
		useDispatch: () => ({}),
		select: () => ({}),
		// The settings of the block editor a component renders in.
		useSelect: (mapSelect) =>
			mapSelect((store) => (store === 'core/block-editor' ? { getSettings: () => mockSettings } : {})),
		subscribe: () => () => {},
		createReduxStore: (name) => ({ name }),
		register: () => {},
	}),
	{ virtual: true }
);
jest.mock('@kadence/helpers', () => ({ blockExists: () => false }));
// A block with two presets and three palettes, so the preset row is the control the filter picks.
jest.mock('../extension/preset-picker', () => ({
	blockPresets: () => [{ slug: 'one' }, { slug: 'two' }],
	activeLibrary: () => 'library',
	activePresetFor: () => '',
	blockDefaultPreset: () => '',
}));
jest.mock('../extension/preset-picker/PresetButton', () => ({ PresetButton: () => 'preset row, ' }));
jest.mock('../extension/palette-picker', () => ({
	PalettePicker: () => 'palette dropdown',
	selectablePalettes: () => [1, 2, 3],
}));

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

/**
 * Renders a selected block through the early filters' preset picker.
 *
 * @since TBD
 *
 * @return {string} The text the block and its inspector render.
 */
function presetPickerText() {
	let Edit;

	jest.isolateModules(() => {
		require('../early-filters');
		const handler = require('@wordpress/hooks').filters['editor.BlockEdit'].handlers.find(
			({ namespace }) => namespace === PRESET_PICKER
		);
		Edit = handler.callback(() => 'block');
	});

	const container = document.createElement('div');
	const root = createRoot(container);

	act(() => {
		root.render(<Edit name="kadence/column" isSelected attributes={{}} setAttributes={() => {}} />);
	});

	const text = container.textContent;

	act(() => {
		root.unmount();
	});

	return text;
}

describe('preset picker', () => {
	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	beforeEach(() => {
		mockSupports = ['kbPreset', 'kbPalette'];
	});

	afterEach(() => {
		mockSupports = [];
		mockSettings = {};
	});

	/**
	 * A selected block with presets gets the preset row above its own inspector.
	 *
	 * @return {void}
	 */
	it('renders the preset row for a block with presets', () => {
		expect(presetPickerText()).toBe('preset row, block');
	});

	/**
	 * The Kadence panel stores no preset or palette pick, so the filter renders only the block there.
	 *
	 * @return {void}
	 */
	it('renders only the block in the Kadence panel', () => {
		mockSettings = { kadenceSiteStylesPanel: true };

		expect(presetPickerText()).toBe('block');
	});
});
