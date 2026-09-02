/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { CreateLibraryModal } from '../components/organisms/CreateLibraryModal';
import { RenameColorGroupModal } from '../components/organisms/RenameColorGroupModal';

// Stand-ins for the nested `@wordpress/components` copy (see any other screen test for why).
// `Modal` renders its children inline and `TextControl` renders a real input, so the form and its
// implicit submission behave the way they do in the browser.
jest.mock('@wordpress/components', () => ({
	Modal: ({ children }) => <div>{children}</div>,
	Notice: ({ children }) => <div>{children}</div>,
	Button: ({ children, ...props }) => <button {...props}>{children}</button>,
	TextControl: ({ label, value, onChange, help, ...props }) => (
		<input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} {...props} />
	),
}));

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
 * Submit the modal's form the way a browser does when Enter is pressed in a text field inside it.
 * jsdom does not implement implicit submission from a key press, so the form's own submit event is
 * dispatched directly — that is the event the modals have to handle.
 *
 * @return {void}
 */
function submitForm() {
	const form = container.querySelector('form');

	act(() => {
		form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
	});
}

/**
 * Type into the modal's only text field.
 *
 * @param {string} value The value to type.
 *
 * @return {void}
 */
function type(value) {
	const input = container.querySelector('input');

	act(() => {
		const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

		setter.call(input, value);
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

describe('CreateLibraryModal submission', () => {
	/**
	 * Pressing Enter in the title field creates the library, the same as clicking Create.
	 *
	 * @return {void}
	 */
	it('creates the library on submit', () => {
		const onCreate = jest.fn();

		act(() =>
			root.render(
				<CreateLibraryModal
					libraries={[]}
					isBusy={false}
					error={null}
					onClose={jest.fn()}
					onCreate={onCreate}
				/>
			)
		);

		type('Brand');
		submitForm();

		expect(onCreate).toHaveBeenCalledWith('Brand');
	});

	/**
	 * An empty title is not submittable — the guard in the submit handler holds even though the
	 * disabled Create button already blocks implicit submission.
	 *
	 * @return {void}
	 */
	it('does not create anything while the title is empty', () => {
		const onCreate = jest.fn();

		act(() =>
			root.render(
				<CreateLibraryModal
					libraries={[]}
					isBusy={false}
					error={null}
					onClose={jest.fn()}
					onCreate={onCreate}
				/>
			)
		);

		submitForm();

		expect(onCreate).not.toHaveBeenCalled();
	});

	/**
	 * Cancel must never submit the form. It is a `type="button"`, so a click dismisses the modal
	 * and leaves the create handler alone.
	 *
	 * @return {void}
	 */
	it('leaves Cancel as a plain button', () => {
		const onClose = jest.fn();
		const onCreate = jest.fn();

		act(() =>
			root.render(
				<CreateLibraryModal libraries={[]} isBusy={false} error={null} onClose={onClose} onCreate={onCreate} />
			)
		);

		const cancel = [...container.querySelectorAll('button')].find((node) => node.textContent === 'Cancel');

		expect(cancel.getAttribute('type')).toBe('button');

		act(() => cancel.click());

		expect(onClose).toHaveBeenCalled();
		expect(onCreate).not.toHaveBeenCalled();
	});
});

describe('RenameColorGroupModal submission', () => {
	/**
	 * The rename modals submit on Enter too, and pass the trimmed value the click path passes.
	 *
	 * @return {void}
	 */
	it('renames the group on submit', () => {
		const onRename = jest.fn();

		act(() =>
			root.render(
				<RenameColorGroupModal
					group={{ id: 'accent', label: 'Accent' }}
					isBusy={false}
					error={null}
					onClose={jest.fn()}
					onRename={onRename}
				/>
			)
		);

		type('  Brand  ');
		submitForm();

		expect(onRename).toHaveBeenCalledWith('Brand');
	});

	/**
	 * A rename to the same label is not submittable — the same guard the Save button uses.
	 *
	 * @return {void}
	 */
	it('does not rename anything while the label is unchanged', () => {
		const onRename = jest.fn();

		act(() =>
			root.render(
				<RenameColorGroupModal
					group={{ id: 'accent', label: 'Accent' }}
					isBusy={false}
					error={null}
					onClose={jest.fn()}
					onRename={onRename}
				/>
			)
		);

		submitForm();

		expect(onRename).not.toHaveBeenCalled();
	});
});
