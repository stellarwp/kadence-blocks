/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { SettingsPanel, SETTINGS_PANEL_TITLE_ID } from '../components/templates/SettingsPanel';

let container;
let root;

/**
 * Render `SettingsPanel` with the given props over an empty field area.
 *
 * @param {Object} props The panel props to render with.
 *
 * @since TBD
 *
 * @return {void}
 */
function renderPanel(props) {
	act(() => {
		root.render(createElement(SettingsPanel, { onClose: () => {}, ...props }, null));
	});
}

/**
 * Find a footer button by its exact visible text.
 *
 * @param {string} text The button's text content.
 *
 * @since TBD
 *
 * @return {?HTMLButtonElement} The matching button, or null when none matches.
 */
function findButton(text) {
	return Array.from(container.querySelectorAll('button')).find((button) => button.textContent === text) ?? null;
}

/**
 * Whether a footer button is disabled. The footer's buttons render `accessibleWhenDisabled` (see
 * `SettingsPanel.js`'s own docblock for why: a native `disabled` attribute would blur a focused
 * button the instant it is applied, and that blur is what the settings popover's own
 * `SettingsPopover.test.js` proves it needs to survive), so a disabled state is `aria-disabled`,
 * never the native attribute — the element stays focusable throughout.
 *
 * @param {HTMLButtonElement} button The button to check.
 *
 * @since TBD
 *
 * @return {boolean} Whether the button is disabled.
 */
function isDisabled(button) {
	return button.getAttribute('aria-disabled') === 'true';
}

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('SettingsPanel footer', () => {
	/**
	 * With no flags set the footer shows Delete (the default destructive action) and Save, both
	 * disabled rather than hidden, and no Reset.
	 *
	 * @return {void}
	 */
	it('renders Delete and Save disabled by default, and no Reset', () => {
		renderPanel({});

		expect(findButton('Delete')).not.toBeNull();
		expect(findButton('Save')).not.toBeNull();
		expect(findButton('Reset')).toBeNull();
		expect(isDisabled(findButton('Delete'))).toBe(true);
		expect(isDisabled(findButton('Save'))).toBe(true);
	});

	/**
	 * `destructiveAction: 'reset'` swaps Delete for Reset, disabled until `canReset`; Delete is
	 * then absent even when `canDelete` is set.
	 *
	 * @return {void}
	 */
	it('renders Reset instead of Delete for the reset action', () => {
		renderPanel({ destructiveAction: 'reset', canDelete: true });

		expect(findButton('Reset')).not.toBeNull();
		expect(findButton('Delete')).toBeNull();
		expect(isDisabled(findButton('Reset'))).toBe(true);

		renderPanel({ destructiveAction: 'reset', canReset: true });

		expect(isDisabled(findButton('Reset'))).toBe(false);
	});

	/**
	 * Each capability flag enables exactly its own button, and a click on an enabled button reaches
	 * its handler.
	 *
	 * @return {void}
	 */
	it('enables each button from its own flag and routes clicks to its handler', () => {
		const onDelete = jest.fn();
		const onReset = jest.fn();
		const onSave = jest.fn();
		renderPanel({ onDelete, canDelete: true, onSave, isDirty: true });

		expect(isDisabled(findButton('Delete'))).toBe(false);
		expect(isDisabled(findButton('Save'))).toBe(false);

		act(() => {
			findButton('Delete').click();
			findButton('Save').click();
		});

		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(onSave).toHaveBeenCalledTimes(1);

		renderPanel({ destructiveAction: 'reset', onReset, canReset: true });

		act(() => {
			findButton('Reset').click();
		});

		expect(onReset).toHaveBeenCalledTimes(1);
	});

	/**
	 * `isDirty` enables Save alone: an unsaved edit is not something Reset or Delete can act on.
	 *
	 * @return {void}
	 */
	it('does not enable the destructive button from isDirty', () => {
		renderPanel({ isDirty: true });

		expect(isDisabled(findButton('Save'))).toBe(false);
		expect(isDisabled(findButton('Delete'))).toBe(true);

		renderPanel({ destructiveAction: 'reset', isDirty: true });

		expect(isDisabled(findButton('Save'))).toBe(false);
		expect(isDisabled(findButton('Reset'))).toBe(true);
	});

	/**
	 * `isBusy` disables both buttons even when every capability flag is set.
	 *
	 * @return {void}
	 */
	it('disables every button while busy', () => {
		renderPanel({ canDelete: true, isDirty: true, isBusy: true });

		expect(isDisabled(findButton('Delete'))).toBe(true);
		expect(isDisabled(findButton('Save'))).toBe(true);

		renderPanel({ destructiveAction: 'reset', canReset: true, isDirty: true, isBusy: true });

		expect(isDisabled(findButton('Reset'))).toBe(true);
		expect(isDisabled(findButton('Save'))).toBe(true);
	});

	/**
	 * A footer button disabled by `isBusy` never gets the native `disabled` attribute — only
	 * `aria-disabled` — so a click already in flight cannot lose focus to nowhere and trip the
	 * settings popover's own focus-outside guard (see `SettingsPanel.js`'s docblock on the Save
	 * button). The element also stays reachable by keyboard and still refuses the click.
	 *
	 * @return {void}
	 */
	it('keeps a busy button natively focusable and refuses its click', () => {
		const onSave = jest.fn();
		renderPanel({ onSave, isDirty: true, isBusy: true, isSaving: true });

		const save = findButton('Saving…');

		expect(save.disabled).toBe(false);
		expect(save.getAttribute('aria-disabled')).toBe('true');

		act(() => {
			save.focus();
		});

		expect(document.activeElement).toBe(save);

		act(() => {
			save.click();
		});

		expect(onSave).not.toHaveBeenCalled();
	});

	/**
	 * Each in-flight flag swaps only its own button's label to the busy wording.
	 *
	 * @return {void}
	 */
	it('shows the busy label on only the button whose write is in flight', () => {
		renderPanel({ destructiveAction: 'reset', isBusy: true, isResetting: true });

		expect(findButton('Resetting…')).not.toBeNull();
		expect(findButton('Save')).not.toBeNull();

		renderPanel({ isBusy: true, isDeleting: true });

		expect(findButton('Deleting…')).not.toBeNull();
		expect(findButton('Save')).not.toBeNull();

		renderPanel({ isBusy: true, isSaving: true });

		expect(findButton('Saving…')).not.toBeNull();
		expect(findButton('Delete')).not.toBeNull();
	});
});
