/* eslint-env jest */
// cspell:ignore lpignore bwignore -- two password managers' own opt-out attribute names.
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ActionsForm } from '../components/organisms/ActionsForm';
import { ActionsPopover } from '../components/organisms/ActionsPopover';
import { ActivationRow } from '../components/molecules/ActivationRow';
import { checkRename } from '../helpers/rename';

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

// Deliberately not library words: the row and the form are generic, and these prove that every
// text they show is the caller's.
const ACTIVATION_LABELS = {
	active: 'Active thing',
	activeHint: 'Your site uses this thing.',
	inactive: 'Not the active thing',
	inactiveHint: 'Activating makes your site use this thing.',
	action: 'Activate thing',
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

describe('ActivationRow', () => {
	/**
	 * Something that is not active gets the action, with the caller's sentence saying what it does.
	 *
	 * @return {void}
	 */
	it('offers the action, with its explanation, while not active', () => {
		const onActivate = jest.fn();

		act(() =>
			root.render(
				<ActivationRow isActive={false} isBusy={false} onActivate={onActivate} labels={ACTIVATION_LABELS} />
			)
		);

		expect(container.textContent).toContain('Not the active thing');
		expect(container.textContent).toContain('Activating makes your site use this thing.');

		click(button('Activate thing'));

		expect(onActivate).toHaveBeenCalledTimes(1);
	});

	/**
	 * The active one has nothing to activate, so the row states the fact and offers no button.
	 *
	 * @return {void}
	 */
	it('states the fact and offers no action while active', () => {
		act(() =>
			root.render(<ActivationRow isActive isBusy={false} onActivate={jest.fn()} labels={ACTIVATION_LABELS} />)
		);

		expect(container.textContent).toContain('Active thing');
		expect(container.textContent).toContain('Your site uses this thing.');
		expect(container.querySelector('button')).toBeNull();
	});
});

describe('ActionsForm', () => {
	/**
	 * Render the form over something named "Brand", where "default" is the one name already
	 * taken, with every callback a mock.
	 *
	 * @param {Object} overrides Props to override.
	 *
	 * @return {Object} The props in use, mocks included.
	 */
	function renderForm(overrides = {}) {
		const props = {
			title: 'Thing',
			nameLabel: 'Thing name',
			currentName: 'Brand',
			checkName: (typed) => checkRename(typed, 'Brand', (name) => name.toLowerCase() === 'default'),
			duplicateMessage: (name) => `"${name}" is taken.`,
			destructiveLabel: 'Remove thing',
			activationLabels: ACTIVATION_LABELS,
			isActive: false,
			isBusy: false,
			error: null,
			onSave: jest.fn(),
			onCancel: jest.fn(),
			onActivate: jest.fn(),
			onDelete: jest.fn(),
			...overrides,
		};

		act(() => root.render(<ActionsForm {...props} />));

		return props;
	}

	/**
	 * The field starts on the current name, and an unchanged name cannot be saved.
	 *
	 * @return {void}
	 */
	it('starts from the current name with Save disabled', () => {
		renderForm();

		expect(container.querySelector('input').value).toBe('Brand');
		expect(button('Save').disabled).toBe(true);
	});

	/**
	 * A changed name enables Save, and submitting hands over the name trimmed.
	 *
	 * @return {Promise<void>}
	 */
	it('saves a changed name, trimmed', async () => {
		const { onSave } = renderForm();

		typeInto(container.querySelector('input'), '  Brand Two ');

		expect(button('Save').disabled).toBe(false);

		await submitForm();

		expect(onSave).toHaveBeenCalledWith('Brand Two');
	});

	/**
	 * A name another library uses is refused with a message, and submitting does nothing.
	 *
	 * @return {Promise<void>}
	 */
	it('refuses a name another library already uses', async () => {
		const { onSave } = renderForm();

		typeInto(container.querySelector('input'), 'default');

		expect(button('Save').disabled).toBe(true);
		expect(container.querySelector('[data-help]').textContent).toBe('"default" is taken.');

		await submitForm();

		expect(onSave).not.toHaveBeenCalled();
	});

	/**
	 * An empty name cannot be saved.
	 *
	 * @return {void}
	 */
	it('refuses an empty name', () => {
		renderForm();

		typeInto(container.querySelector('input'), '   ');

		expect(button('Save').disabled).toBe(true);
	});

	/**
	 * A rename error from the server is shown inside the form.
	 *
	 * @return {void}
	 */
	it('shows a rename error', () => {
		renderForm({ error: { message: 'Could not rename.' } });

		expect(container.querySelector('[role="alert"]').textContent).toBe('Could not rename.');
	});

	/**
	 * While an operation is in flight nothing in the form can start another one.
	 *
	 * @return {void}
	 */
	it('disables every control while busy', () => {
		renderForm({ isBusy: true });

		expect(container.querySelector('input').disabled).toBe(true);
		[...container.querySelectorAll('button')].forEach((candidate) => expect(candidate.disabled).toBe(true));
		expect(button('Saving…')).not.toBeNull();
	});

	/**
	 * The name field opts out of browser autofill and of password managers, which otherwise take
	 * a form with a "Name" field for a sign-up form and offer a saved login over it.
	 *
	 * @return {void}
	 */
	it('keeps autofill and password managers off the name field', () => {
		renderForm();

		const input = container.querySelector('input');

		expect(input.getAttribute('autocomplete')).toBe('off');
		expect(input.hasAttribute('data-1p-ignore')).toBe(true);
		expect(input.getAttribute('data-lpignore')).toBe('true');
		expect(input.hasAttribute('data-bwignore')).toBe(true);
	});

	/**
	 * The heading, the field label and the destructive action's text are all the caller's words.
	 *
	 * @return {void}
	 */
	it('shows the texts it is given', () => {
		renderForm();

		expect(container.querySelector('h2').textContent).toBe('Thing');
		expect(container.querySelector('label').textContent).toContain('Thing name');
		expect(button('Remove thing')).not.toBeNull();
	});

	/**
	 * Cancel, the activation action and the destructive action each reach their own callback.
	 *
	 * @return {void}
	 */
	it('reports Cancel, the activation and the destructive action to the caller', () => {
		const { onCancel, onActivate, onDelete } = renderForm();

		click(button('Cancel'));
		click(button('Activate thing'));
		click(button('Remove thing'));

		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onActivate).toHaveBeenCalledTimes(1);
		expect(onDelete).toHaveBeenCalledTimes(1);
	});
});

describe('ActionsPopover', () => {
	/**
	 * The popover is closed until the pencil is used, and the pencil carries the caller's label.
	 *
	 * @return {void}
	 */
	it('opens its content from the labeled pencil', () => {
		act(() =>
			root.render(
				<ActionsPopover label="Edit thing" isBusy={false}>
					{() => <p data-content>content</p>}
				</ActionsPopover>
			)
		);

		expect(container.querySelector('[data-content]')).toBeNull();

		click(button('Edit thing'));

		expect(container.querySelector('[data-content]')).not.toBeNull();
	});

	/**
	 * The content gets a `close` that shuts the popover and tells the caller it closed.
	 *
	 * @return {void}
	 */
	it('hands the content a close that also notifies the caller', () => {
		const onClose = jest.fn();

		act(() =>
			root.render(
				<ActionsPopover label="Edit thing" isBusy={false} onClose={onClose}>
					{({ close }) => <button onClick={close}>Done</button>}
				</ActionsPopover>
			)
		);

		click(button('Edit thing'));
		click(button('Done'));

		expect(button('Done')).toBeNull();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	/**
	 * The pencil is disabled while an operation is in flight.
	 *
	 * @return {void}
	 */
	it('disables the pencil while busy', () => {
		act(() =>
			root.render(
				<ActionsPopover label="Edit thing" isBusy>
					{() => null}
				</ActionsPopover>
			)
		);

		expect(button('Edit thing').disabled).toBe(true);
	});
});
