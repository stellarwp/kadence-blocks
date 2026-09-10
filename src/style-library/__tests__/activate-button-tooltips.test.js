/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ActivateLibraryButton } from '../components/organisms/ActivateLibraryButton';
import { ActivatePaletteButton } from '../components/organisms/ActivatePaletteButton';

// The nested `@wordpress/components` copy resolves its own react/react-dom, a different module
// instance than the top-level renderer — stand-ins sidestep the "Invalid hook call" guard. The
// `Tooltip` stand-in exposes its `text` as an attribute so a test can assert on the sentence;
// `Modal` is never rendered here because both buttons start closed.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, ...props }) => <button {...props}>{children}</button>,
	Tooltip: ({ children, text }) => <span data-tooltip={text}>{children}</span>,
}));

describe('the Set Active actions', () => {
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
	 * The library action says what activating a library does before it is clicked, without
	 * changing the button's own visible label.
	 *
	 * @return {void}
	 */
	it('explains what setting a library active does', () => {
		act(() =>
			root.render(
				<ActivateLibraryButton
					editingSlug="brand"
					editingTitle="Brand"
					activeTitle="Default"
					isEditingActive={false}
					isBusy={false}
					error={null}
					onClearError={jest.fn()}
					onActivate={jest.fn()}
				/>
			)
		);

		const wrapper = container.querySelector('[data-tooltip]');

		expect(wrapper.getAttribute('data-tooltip')).toBe(
			'Makes this library the one your site uses. Your site switches to its colors, sizes and styles.'
		);
		expect(wrapper.querySelector('button').textContent).toBe('Set as active');
	});

	/**
	 * The palette action carries the documented sentence, minus the documentation link a tooltip
	 * cannot hold.
	 *
	 * @return {void}
	 */
	it('explains what setting a palette active does', () => {
		act(() =>
			root.render(
				<ActivatePaletteButton
					editingId="warm"
					editingLabel="Warm"
					activeLabel="Default"
					isEditingActive={false}
					isBusy={false}
					error={null}
					onClearError={jest.fn()}
					onActivate={jest.fn()}
				/>
			)
		);

		expect(container.querySelector('[data-tooltip]').getAttribute('data-tooltip')).toBe(
			'Makes this palette the one your site uses. Individual blocks can still be switched to another palette.'
		);
	});

	/**
	 * Neither action renders at all — tooltip included — while the thing being edited is already
	 * the active one, which is the behavior both components already had.
	 *
	 * @return {void}
	 */
	it('renders nothing at all while the edited library is already active', () => {
		act(() =>
			root.render(
				<ActivateLibraryButton
					editingSlug="brand"
					editingTitle="Brand"
					activeTitle="Brand"
					isEditingActive
					isBusy={false}
					error={null}
					onClearError={jest.fn()}
					onActivate={jest.fn()}
				/>
			)
		);

		expect(container.innerHTML).toBe('');
	});
});
