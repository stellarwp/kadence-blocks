/* eslint-env jest */
/**
 * The notice the preset button shows when the block's stored preset is not the one rendered.
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

// `@wordpress/components` resolves its own nested `react` copy, a different module instance than the
// top-level `react-dom/client` this test renders with, which trips React's "Invalid hook call" guard.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, showTooltip, ...props }) => <button {...props}>{children}</button>,
	Dropdown: ({ renderToggle }) => renderToggle({ isOpen: false, onToggle: () => {} }),
	MenuGroup: ({ children }) => <div>{children}</div>,
	MenuItem: ({ children }) => <div>{children}</div>,
	Notice: ({ children, className }) => <div className={className}>{children}</div>,
}));
jest.mock('@wordpress/data', () => ({
	useSelect: () => false,
	useDispatch: () => ({ setHighlightEdits: () => {} }),
}));
jest.mock('@wordpress/blocks', () => ({ getBlockType: () => ({ attributes: {} }) }), { virtual: true });
jest.mock('@wordpress/icons', () => ({ Icon: () => null, check: null }));
jest.mock('../../palette-picker', () => ({ PalettePicker: () => null }));
jest.mock('../icons', () => ({ presetIcon: null, resetIcon: null }));
jest.mock('../capture', () => ({ capturedTokens: () => ({}) }));
jest.mock('../SavePresetModal', () => ({ SavePresetModal: () => null }));
jest.mock('../../design-tokens/rest', () => ({ hasDesignTokensRest: () => false }));
jest.mock('../../design-tokens/live-css', () => ({ refreshProjectedCss: () => {} }));
jest.mock('../../token-indicators/store', () => ({ TOKEN_INDICATORS_STORE: 'kadence/token-indicators' }));
jest.mock('../../token-indicators', () => ({
	mappedAttrsFor: () => [],
	resetAttrPatch: () => ({}),
	usePresetBinding: () => ({}),
}));
jest.mock('../preset-button.scss', () => ({}), { virtual: true });

import { PresetButton } from '../PresetButton';

const BLOCK = 'kadence/singlebtn';
const SET = 'default';

/**
 * Seed the localized design-token catalog with a button library that offers the default and Theme Base
 * only, so a stored Theme Secondary or deleted preset has to fall back.
 *
 * @return {void}
 */
function seedCatalog() {
	window.kadenceDesignTokensPresets = {
		active: SET,
		libraries: {
			[SET]: {
				[BLOCK]: {
					default: 'default',
					presets: [
						{ slug: 'default', label: 'Default' },
						{ slug: 'theme-base', label: 'Theme Base', themeClass: 'wp-block-button__link button' },
					],
					properties: [],
					values: { default: {}, 'theme-base': {} },
				},
			},
		},
	};
}

/**
 * Render the preset button for a set of attributes and answer the container.
 *
 * @param {Object} attributes The block attributes.
 *
 * @return {HTMLElement} The rendered container.
 */
function renderButton(attributes) {
	const container = document.createElement('div');
	document.body.appendChild(container);

	act(() => {
		createRoot(container).render(
			createElement(PresetButton, { blockName: BLOCK, attributes, setAttributes: () => {}, library: SET })
		);
	});

	return container;
}

describe('PresetButton fallback notice', () => {
	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		seedCatalog();
	});

	afterEach(() => {
		delete global.IS_REACT_ACT_ENVIRONMENT;
		delete window.kadenceDesignTokensPresets;
		document.body.innerHTML = '';
	});

	/**
	 * A theme preset the active theme lacks shows the theme notice, with the theme's base preset as the
	 * rendered label, and the stored value is never written back.
	 *
	 * @return {void}
	 */
	it('shows the theme notice and the Theme Base label for a theme preset the theme lacks', () => {
		const container = renderButton({ kbPreset: 'theme-secondary' });

		expect(container.querySelector('.kb-preset-button__notice').textContent).toBe(
			"This preset isn't available in the current theme."
		);
		expect(container.querySelector('.kb-preset-button__label').textContent).toBe('Theme Base');
	});

	/**
	 * A retired inheritStyles value the theme cannot honor shows the same notice as a stored theme slug.
	 *
	 * @return {void}
	 */
	it('shows the theme notice for a retired secondary style the theme lacks', () => {
		const container = renderButton({ inheritStyles: 'inherit-secondary' });

		expect(container.querySelector('.kb-preset-button__notice').textContent).toBe(
			"This preset isn't available in the current theme."
		);
	});

	/**
	 * A deleted preset shows the "no longer exists" notice with the Default label.
	 *
	 * @return {void}
	 */
	it('shows the missing notice and the Default label for a deleted preset', () => {
		const container = renderButton({ kbPreset: 'gone' });

		expect(container.querySelector('.kb-preset-button__notice').textContent).toBe('This preset no longer exists.');
		expect(container.querySelector('.kb-preset-button__label').textContent).toBe('Default');
	});

	/**
	 * A preset the library defines shows no notice at all.
	 *
	 * @return {void}
	 */
	it('shows no notice when the stored preset renders', () => {
		expect(renderButton({ kbPreset: 'theme-base' }).querySelector('.kb-preset-button__notice')).toBeNull();
		expect(renderButton({}).querySelector('.kb-preset-button__notice')).toBeNull();
	});
});
