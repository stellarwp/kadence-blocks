/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { DormantPresets } from '../components/organisms/DormantPresets';

// The same reason `preset-screen.test.js` gives: the `@wordpress/components` copy Jest resolves nests
// its own React, and mounting its real `Button` under the top-level renderer trips React's hook
// guard. The group only needs a clickable element per action.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isBusy, isDestructive, variant, ...props }) => <button {...props}>{children}</button>,
}));

const DORMANT = {
	'theme-secondary': {
		label: 'Theme Secondary',
		tokens: { 'button-bg': '#ff0000' },
		themeSnapshot: { 'button-bg': '#EDF2F7', 'button-text': '#1A202C' },
	},
};

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
});

/**
 * Render the group with the given props over the shared dormant map.
 *
 * @param {Object} props The props to override.
 *
 * @since TBD
 *
 * @return {void}
 */
function render(props = {}) {
	act(() =>
		root.render(
			createElement(DormantPresets, { dormant: DORMANT, onKeep: jest.fn(), onDiscard: jest.fn(), ...props })
		)
	);
}

describe('DormantPresets', () => {
	/**
	 * The group names itself and lists each dormant preset by its stored label.
	 *
	 * @return {void}
	 */
	it('lists the dormant presets under the group title', () => {
		render();

		expect(container.textContent).toContain('Not available in the current theme');
		expect(container.querySelector('.kadence-blocks-style-library__dormant-label').textContent).toBe(
			'Theme Secondary'
		);
	});

	/**
	 * "Keep as custom preset" hands the screen the snapshot merged under the overrides.
	 *
	 * @return {void}
	 */
	it('keeps a dormant preset as a custom preset from its snapshot plus overrides', () => {
		const onKeep = jest.fn();
		const onDiscard = jest.fn();

		render({ onKeep, onDiscard });
		act(() => container.querySelector('[data-action="keep"]').click());

		expect(onKeep).toHaveBeenCalledWith('theme-secondary', {
			label: 'Theme Secondary',
			tokens: { 'button-bg': '#ff0000', 'button-text': '#1A202C' },
		});
		expect(onDiscard).not.toHaveBeenCalled();
	});

	/**
	 * "Discard changes" asks the screen to drop the stored node.
	 *
	 * @return {void}
	 */
	it('discards a dormant preset', () => {
		const onKeep = jest.fn();
		const onDiscard = jest.fn();

		render({ onKeep, onDiscard });
		act(() => container.querySelector('[data-action="discard"]').click());

		expect(onDiscard).toHaveBeenCalledWith('theme-secondary');
		expect(onKeep).not.toHaveBeenCalled();
	});

	/**
	 * A preset stored without a label falls back to its slug.
	 *
	 * @return {void}
	 */
	it('falls back to the slug when the stored node has no label', () => {
		const onKeep = jest.fn();

		render({ dormant: { 'theme-base': { tokens: {}, themeSnapshot: {} } }, onKeep });
		act(() => container.querySelector('[data-action="keep"]').click());

		expect(onKeep).toHaveBeenCalledWith('theme-base', { label: 'theme-base', tokens: {} });
	});

	/**
	 * Both actions wait while the screen is busy.
	 *
	 * @return {void}
	 */
	it('disables both actions while busy', () => {
		render({ isBusy: true });

		expect(container.querySelector('[data-action="keep"]').disabled).toBe(true);
		expect(container.querySelector('[data-action="discard"]').disabled).toBe(true);
	});

	/**
	 * Nothing renders when there is nothing dormant, so the screen stays as it was.
	 *
	 * @return {void}
	 */
	it('renders nothing without dormant presets', () => {
		render({ dormant: {} });
		expect(container.innerHTML).toBe('');

		render({ dormant: undefined });
		expect(container.innerHTML).toBe('');
	});
});
