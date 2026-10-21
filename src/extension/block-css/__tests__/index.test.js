/* eslint-env jest */
// cspell:ignore noconflict
/**
 * The Custom CSS panel: shown on a block that supports it, and never in the Kadence panel, which stores no
 * custom CSS.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { applyFilters } from '@wordpress/hooks';

let mockSettings = {};

jest.mock('react-ace', () => () => null);
jest.mock('ace-builds/src-noconflict/mode-css', () => ({}));
jest.mock('ace-builds/src-noconflict/snippets/css', () => ({}));
jest.mock('ace-builds/src-noconflict/theme-textmate', () => ({}));
jest.mock('ace-builds/src-noconflict/ext-language_tools', () => ({}));
jest.mock('@kadence/helpers', () => ({ showSettings: () => true }));
jest.mock('@wordpress/element', () => ({ useState: (value) => [value, () => {}] }), { virtual: true });
jest.mock('@wordpress/compose', () => ({ createHigherOrderComponent: (hoc) => hoc }), { virtual: true });
jest.mock('@wordpress/block-editor', () => ({ InspectorControls: ({ children }) => children }), { virtual: true });
jest.mock(
	'@wordpress/components',
	() => ({
		PanelBody: ({ title, children }) => (
			<section>
				{title}
				{children}
			</section>
		),
		Button: ({ children }) => <button>{children}</button>,
		Modal: () => null,
	}),
	{ virtual: true }
);
jest.mock(
	'@wordpress/blocks',
	() => ({
		store: 'core/blocks',
		hasBlockSupport: () => true,
	}),
	{ virtual: true }
);
// The block's support, its open Advanced tab and the settings of the block editor it renders in.
jest.mock(
	'@wordpress/data',
	() => ({
		useSelect: (mapSelect) =>
			mapSelect((store) => {
				switch (store) {
					case 'core/blocks':
						return { hasBlockSupport: () => true };
					case 'kadenceblocks/data':
						return { getOpenSidebarTabKey: () => 'advanced' };
					case 'core/block-editor':
						return { getSelectedBlockClientId: () => 'abc', getSettings: () => mockSettings };
					default:
						return {};
				}
			}),
	}),
	{ virtual: true }
);

require('../index');

/**
 * Renders a selected block through the Custom CSS filter.
 *
 * @since TBD
 *
 * @return {string} The text the block and its inspector render.
 */
function renderedText() {
	const container = document.createElement('div');
	const root = createRoot(container);

	act(() => {
		const Edit = applyFilters('editor.BlockEdit', () => <p>block</p>);

		root.render(
			<Edit name="kadence/column" isSelected attributes={{ kadenceBlockCSS: '' }} setAttributes={() => {}} />
		);
	});

	const text = container.textContent;

	act(() => {
		root.unmount();
	});

	return text;
}

describe('Custom CSS panel', () => {
	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	/**
	 * A selected block that supports custom CSS shows the panel on its Advanced tab.
	 *
	 * @return {void}
	 */
	it('shows on a block that supports it', () => {
		mockSettings = {};

		expect(renderedText()).toContain('Custom CSS');
	});

	/**
	 * The Kadence panel stores no custom CSS, so the panel isn't shown there, and the block still renders.
	 *
	 * @return {void}
	 */
	it('is hidden in the Kadence panel', () => {
		mockSettings = { kadenceSiteStylesPanel: true };

		const text = renderedText();

		expect(text).not.toContain('Custom CSS');
		expect(text).toContain('block');
	});
});
