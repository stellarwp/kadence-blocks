/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { PaletteActions } from '../components/organisms/PaletteActions';

// The nested `@wordpress/components` copy resolves its own react/react-dom, a different module
// instance than the top-level renderer — stand-ins sidestep the "Invalid hook call" guard. The
// `Dropdown` stand-in keeps the real one's contract: closed until its toggle is used, content
// rendered only while open, and `onClose` both closing it and notifying the caller.
jest.mock('@wordpress/components', () => {
	const React = require('react');

	return {
		Button: ({ children, icon, label, variant, isDestructive, ...props }) => (
			<button aria-label={label} {...props}>
				{children}
			</button>
		),
		Dropdown: ({ renderToggle, renderContent, onClose }) => {
			const [isOpen, setIsOpen] = React.useState(false);
			const close = () => {
				setIsOpen(false);
				onClose?.();
			};

			return (
				<div>
					{renderToggle({ isOpen, onToggle: () => setIsOpen(!isOpen) })}
					{isOpen && <div data-popover>{renderContent({ onClose: close })}</div>}
				</div>
			);
		},
		Modal: ({ children, title }) => (
			<div role="dialog" aria-label={title}>
				{children}
			</div>
		),
		Notice: ({ children }) => <div role="alert">{children}</div>,
		SelectControl: () => null,
		TextControl: ({ label, value, onChange, help, disabled, ...inputProps }) => (
			<label>
				{label}
				<input
					{...inputProps}
					value={value}
					disabled={disabled}
					onChange={(event) => onChange(event.target.value)}
				/>
				{help && <span data-help>{help}</span>}
			</label>
		),
	};
});

const LISTING = {
	palettes: [
		{ id: 'default', label: 'Default' },
		{ id: 'brand', label: 'Brand' },
	],
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
 * Type into a React-controlled input the way a user would: through the native value setter, so
 * React's own change tracking sees a real change, followed by the `input` event it listens for.
 *
 * @param {HTMLInputElement} input The input to type into.
 * @param {string}           value The text to leave in it.
 *
 * @return {void}
 */
function typeInto(input, value) {
	const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

	act(() => {
		setter.call(input, value);
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

/**
 * Find a button by its visible text or, for an icon button, its accessible label.
 *
 * @param {string} name The text or label to look for.
 *
 * @return {?HTMLButtonElement} The first matching button, or null.
 */
function button(name) {
	return (
		[...container.querySelectorAll('button')].find(
			(candidate) => candidate.textContent === name || candidate.getAttribute('aria-label') === name
		) ?? null
	);
}

/**
 * Click an element inside `act`, so state updates it causes are flushed before the next assertion.
 *
 * @param {HTMLElement} element The element to click.
 *
 * @return {void}
 */
function click(element) {
	act(() => element.click());
}

/**
 * Submit the form inside `act` and let any promise its handler started settle.
 *
 * @return {Promise<void>} Resolves once pending state updates are flushed.
 */
async function submitForm() {
	await act(async () => {
		container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
	});
}

describe('PaletteActions', () => {
	/**
	 * Render the actions over the user-created "Brand" palette while "Default" is the active one.
	 *
	 * @param {Object} overrides Props to override.
	 *
	 * @return {Object} The props in use, mocks included.
	 */
	function renderActions(overrides = {}) {
		const props = {
			editingId: 'brand',
			editingLabel: 'Brand',
			activeLabel: 'Default',
			isEditingActive: false,
			isUserCreated: true,
			listing: LISTING,
			isBusy: false,
			errors: { rename: null, activate: null, delete: null },
			onClearError: { rename: jest.fn(), activate: jest.fn(), delete: jest.fn() },
			onRename: jest.fn(() => Promise.resolve()),
			onActivate: jest.fn(() => Promise.resolve()),
			onDelete: jest.fn(() => Promise.resolve()),
			...overrides,
		};

		act(() => root.render(<PaletteActions {...props} />));

		return props;
	}

	/**
	 * The popover is closed until the pencil is used.
	 *
	 * @return {void}
	 */
	it('opens the form from the pencil', () => {
		renderActions();

		expect(container.querySelector('[data-popover]')).toBeNull();

		click(button('Edit palette'));

		expect(container.querySelector('[data-popover] form')).not.toBeNull();
	});

	/**
	 * A finished rename is sent for the palette being edited and closes the popover.
	 *
	 * @return {Promise<void>}
	 */
	it('renames the palette and closes once the rename lands', async () => {
		const { onRename } = renderActions();

		click(button('Edit palette'));
		typeInto(container.querySelector('input'), 'Brand Two');
		await submitForm();

		expect(onRename).toHaveBeenCalledWith('brand', 'Brand Two');
		expect(container.querySelector('[data-popover]')).toBeNull();
	});

	/**
	 * A failed rename leaves the popover open, so its error stays in front of the user.
	 *
	 * @return {Promise<void>}
	 */
	it('stays open when the rename fails', async () => {
		renderActions({ onRename: jest.fn(() => Promise.reject(new Error('nope'))) });

		click(button('Edit palette'));
		typeInto(container.querySelector('input'), 'Brand Two');
		await submitForm();

		expect(container.querySelector('[data-popover]')).not.toBeNull();
	});

	/**
	 * Closing the popover drops a rename error, so the next opening does not start with it.
	 *
	 * @return {void}
	 */
	it('clears the rename error when the popover closes', () => {
		const { onClearError } = renderActions();

		click(button('Edit palette'));
		click(button('Cancel'));

		expect(onClearError.rename).toHaveBeenCalledTimes(1);
	});

	/**
	 * Set as active closes the popover first and then asks for confirmation; only the
	 * confirmation activates the palette.
	 *
	 * @return {Promise<void>}
	 */
	it('closes the popover and confirms before activating', async () => {
		const { onActivate, onClearError } = renderActions();

		click(button('Edit palette'));
		click(button('Set as active'));

		expect(container.querySelector('[data-popover]')).toBeNull();
		expect(container.querySelector('[role="dialog"]')).not.toBeNull();
		expect(onActivate).not.toHaveBeenCalled();

		const confirm = [...container.querySelectorAll('[role="dialog"] button')].pop();

		await act(async () => confirm.click());

		expect(onActivate).toHaveBeenCalledWith('brand');
		expect(onClearError.activate).toHaveBeenCalledTimes(1);
		expect(container.querySelector('[role="dialog"]')).toBeNull();
	});

	/**
	 * The route can move the screen to another palette while the confirmation is open (browser
	 * Back), so confirming still activates the palette the modal was opened for.
	 *
	 * @return {Promise<void>}
	 */
	it('activates the palette the confirmation was opened for', async () => {
		const onActivate = jest.fn(() => Promise.resolve());

		renderActions({ onActivate });
		click(button('Edit palette'));
		click(button('Set as active'));
		renderActions({ onActivate, editingId: 'other', editingLabel: 'Other' });

		const confirm = [...container.querySelectorAll('[role="dialog"] button')].pop();

		await act(async () => confirm.click());

		expect(onActivate).toHaveBeenCalledWith('brand');
	});

	/**
	 * Delete closes the popover first and then asks for confirmation; only the confirmation
	 * deletes the palette being edited.
	 *
	 * @return {Promise<void>}
	 */
	it('closes the popover and confirms before deleting', async () => {
		const { onDelete } = renderActions();

		click(button('Edit palette'));
		click(button('Delete'));

		expect(container.querySelector('[data-popover]')).toBeNull();
		expect(container.querySelector('[role="dialog"]').getAttribute('aria-label')).toBe('Delete "Brand"?');
		expect(onDelete).not.toHaveBeenCalled();

		const confirm = [...container.querySelectorAll('[role="dialog"] button')].pop();

		await act(async () => confirm.click());

		expect(onDelete).toHaveBeenCalledWith('brand', '');
		expect(container.querySelector('[role="dialog"]')).toBeNull();
	});

	/**
	 * A finished delete moves the screen to another palette before the modal closes, so the modal
	 * keeps describing the palette it was opened for.
	 *
	 * @return {void}
	 */
	it('keeps the delete confirmation on the palette it was opened for', () => {
		renderActions();

		click(button('Edit palette'));
		click(button('Delete'));
		renderActions({ editingId: 'default', editingLabel: 'Default', isUserCreated: false, isEditingActive: true });

		expect(container.querySelector('[role="dialog"]').getAttribute('aria-label')).toBe('Delete "Brand"?');
	});

	/**
	 * The destructive action is named for what it does: a shipped palette is reset, never deleted,
	 * and a user-created palette is deleted.
	 *
	 * @return {void}
	 */
	it('labels the destructive action Reset for a shipped palette and Delete otherwise', () => {
		renderActions();
		click(button('Edit palette'));

		expect(button('Delete')).not.toBeNull();
		expect(button('Reset')).toBeNull();

		click(button('Cancel'));
		renderActions({ editingId: 'default', editingLabel: 'Default', isUserCreated: false, isEditingActive: true });
		click(button('Edit palette'));

		expect(button('Reset')).not.toBeNull();
		expect(button('Delete')).toBeNull();
	});

	/**
	 * The form gets the palette's own words and its duplicate rule: another palette's name is
	 * refused with the palette sentence.
	 *
	 * @return {void}
	 */
	it("refuses another palette's name with the palette message", () => {
		renderActions();
		click(button('Edit palette'));
		typeInto(container.querySelector('input'), 'default');

		expect(container.querySelector('h2').textContent).toBe('Palette');
		expect(container.querySelector('[data-help]').textContent).toBe('A palette named "default" already exists.');
		expect(button('Save').disabled).toBe(true);
	});

	/**
	 * The pencil is disabled while a palette operation is in flight.
	 *
	 * @return {void}
	 */
	it('disables the pencil while busy', () => {
		renderActions({ isBusy: true });

		expect(button('Edit palette').disabled).toBe(true);
	});
});
