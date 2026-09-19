/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ActivatePaletteButton } from '../components/organisms/ActivatePaletteButton';

// The nested `@wordpress/components` copy resolves its own react/react-dom, a different module
// instance than the top-level renderer — stand-ins sidestep the "Invalid hook call" guard. The
// `Tooltip` stand-in exposes its `text` as an attribute so a test can assert on the sentence;
// `Modal` is never rendered here because the button starts closed.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, ...props }) => <button {...props}>{children}</button>,
	Tooltip: ({ children, text }) => <span data-tooltip={text}>{children}</span>,
}));

describe('the palette Set Active action', () => {
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
	 * The palette action does not render at all — tooltip included — while the palette being
	 * edited is already the active one.
	 *
	 * @return {void}
	 */
	it('renders nothing at all while the edited palette is already active', () => {
		act(() =>
			root.render(
				<ActivatePaletteButton
					editingId="warm"
					editingLabel="Warm"
					activeLabel="Warm"
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
