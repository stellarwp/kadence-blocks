/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ColorPaletteSettings } from '../components/pages/ColorPaletteSettings';
import { usePalettes } from '../hooks/use-palettes';
import { DraftChannelContext } from '../hooks/use-draft-channel';

// A factory, not bare automocking — `use-palettes.js` pulls in `../api/client`, which imports
// `@wordpress/api-fetch` (externalized to the `wp.apiFetch` global in production, not an installed
// npm dependency), so automocking would fail to resolve it. This panel only reads the hook's
// return value, so a bare `jest.fn()` stand-in is enough.
jest.mock('../hooks/use-palettes', () => ({
	usePalettes: jest.fn(),
}));

// Same cross-module-copy rationale as `preset-screen.test.js`: `@wordpress/components`' own nested
// `react`/`react-dom` copy trips React's "Invalid hook call" guard when mounted under the top-level
// renderer this test uses. Simple stand-ins are enough — this test only needs to read each footer
// button's label and disabled state, not exercise the real controls.
jest.mock('@wordpress/components', () => ({
	// `isBusy`/`isDestructive`/`variant`/`accessibleWhenDisabled` are `Button` props, not DOM
	// attributes — drop them so React does not warn about unrecognized attributes.
	Button: ({ children, isBusy, isDestructive, variant, accessibleWhenDisabled, ...props }) => (
		<button {...props}>{children}</button>
	),
	Notice: ({ children, isDismissible, ...props }) => <div {...props}>{children}</div>,
}));

// The real field renderer is not this test's concern (see `preset-screen.test.js`'s identical note
// about `SettingsForm`) — a bare text input bound to `label` is enough to make the draft dirty so
// the Save button's `!isDirty` guard does not block the click these tests exercise.
jest.mock('../components/organisms/SettingsForm', () => ({
	SettingsForm: ({ values, onChange }) => (
		<input
			data-testid="label-field"
			value={values.label || ''}
			onChange={(event) => onChange('label', event.target.value)}
		/>
	),
}));

const TOKEN_PATH = 'swatch.primary';
const PALETTE = {
	groups: [
		{
			swatches: [{ token: TOKEN_PATH, label: 'Primary', $value: '#123456', overridden: false }],
		},
	],
};

let container;
let root;

/**
 * A deferred promise, so a test can assert the busy state while a write is still in flight and
 * only then settle it (success or failure).
 *
 * @since TBD
 *
 * @return {{promise: Promise, resolve: Function, reject: Function}} The deferred promise and its
 *         resolvers.
 */
function deferred() {
	let resolve;
	let reject;
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

/**
 * Build a `usePalettes` stub whose `isBusy` flips to true the moment `saveSwatchEdits`/
 * `removeSwatch`/`resetSwatch` is called and back to false once `write` settles — mirroring what
 * the real hook's `onBusy` callback does synchronously around each flow. The flip happens before
 * `onSave`/`onDelete` calls `setPendingAction`, so the re-render that state update triggers already
 * reads the busy value in the same `act()`.
 *
 * Defaults to the Delete path (a custom swatch, `isSwatchCustom` returns `true`) so every
 * pre-existing test in this file keeps exercising exactly the scenario it always has.
 * `editingId`/`listing` default to the SAME id (as if editing the default palette), which combined
 * with `isSwatchCustom` defaulting `true` means `canReset` in the component is always `false` here
 * unless a test overrides `isSwatchCustom`/`editingId`/`listing` explicitly.
 *
 * @param {Object}  write     The deferred promise the pending write resolves/rejects through.
 * @param {Object}  [overrides] Fields to merge over the defaults — e.g. `{ isSwatchCustom: () =>
 *                              false, editingId: 'secondary' }` for a Reset-path test.
 *
 * @since TBD
 *
 * @return {Object} The `usePalettes` stub.
 */
function makePalettes(write, overrides = {}) {
	const state = { isBusy: false };
	const track = (promise) => promise.finally(() => (state.isBusy = false));

	return {
		palette: PALETTE,
		listing: { defaultId: 'default' },
		editingId: 'default',
		isLoading: false,
		saveError: null,
		clearSaveError: jest.fn(),
		isSwatchCustom: jest.fn(() => true),
		saveSwatchEdits: jest.fn(() => {
			state.isBusy = true;
			return track(write.promise);
		}),
		removeSwatch: jest.fn(() => {
			state.isBusy = true;
			return track(write.promise);
		}),
		resetSwatch: jest.fn(() => {
			state.isBusy = true;
			return track(write.promise);
		}),
		get isBusy() {
			return state.isBusy;
		},
		...overrides,
	};
}

/**
 * Render `ColorPaletteSettings` with the given `usePalettes` stub.
 *
 * @param {Object} palettes The `usePalettes` stub to render with.
 *
 * @since TBD
 *
 * @return {Function} The `navigate` jest spy.
 */
function renderColorPaletteSettings(palettes) {
	usePalettes.mockReturnValue(palettes);
	const navigate = jest.fn();

	act(() => {
		root.render(
			createElement(ColorPaletteSettings, {
				route: { screen: 'color-palette', item: TOKEN_PATH },
				navigate,
				library: {},
			})
		);
	});

	return navigate;
}

// React overrides a controlled input's `value` setter on the DOM node itself to track whether a
// change actually happened; assigning `field.value` directly goes through that same overridden
// setter, so React sees no change and never calls `onChange`. Going through the native prototype
// setter first bypasses the override, the same workaround React's own testing utilities use.
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

/**
 * Edit the mocked label field so the draft becomes dirty, clearing the Save button's `!isDirty`
 * guard.
 *
 * @return {void}
 */
function makeDirty() {
	const field = container.querySelector('[data-testid="label-field"]');

	act(() => {
		nativeInputValueSetter.call(field, 'New Name');
		field.dispatchEvent(new Event('input', { bubbles: true }));
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

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
	usePalettes.mockReset();
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('ColorPaletteSettings busy state', () => {
	/**
	 * Clicking Save shows the "Saving…" label and disables Delete for the duration of the write.
	 *
	 * @return {void}
	 */
	it('shows Saving… and disables Delete while a save is in flight', async () => {
		const write = deferred();
		renderColorPaletteSettings(makePalettes(write));
		makeDirty();

		act(() => {
			findButton('Save').click();
		});

		expect(findButton('Saving…')).not.toBeNull();
		expect(findButton('Delete').disabled).toBe(true);

		// Settled inside `act()` so its `.finally()` state update is not left dangling past the test.
		await act(async () => {
			write.resolve();
			await write.promise;
		});
	});

	/**
	 * Clicking Delete shows the "Deleting…" label and disables Save for the duration of the write.
	 * The draft is made dirty first so Save's `disabled` here is provably driven by the shared busy
	 * flag, not merely by `!isDirty`.
	 *
	 * @return {void}
	 */
	it('shows Deleting… and disables Save while a delete is in flight', async () => {
		const write = deferred();
		renderColorPaletteSettings(makePalettes(write));
		makeDirty();

		act(() => {
			findButton('Delete').click();
		});

		expect(findButton('Deleting…')).not.toBeNull();
		expect(findButton('Save').disabled).toBe(true);

		// Settled inside `act()` so its `.finally()` state update is not left dangling past the test.
		await act(async () => {
			write.resolve();
			await write.promise;
		});
	});

	/**
	 * A successful save settles the busy state back to normal: the "Saving…" label disappears and
	 * Delete, which is disabled purely by the shared busy flag, re-enables itself.
	 *
	 * @return {void}
	 */
	it('clears the busy state once a save succeeds', async () => {
		const write = deferred();
		renderColorPaletteSettings(makePalettes(write));
		makeDirty();

		act(() => {
			findButton('Save').click();
		});

		await act(async () => {
			write.resolve();
			await write.promise;
		});

		expect(findButton('Saving…')).toBeNull();
		expect(findButton('Delete').disabled).toBe(false);
	});

	/**
	 * A failed delete settles the busy state back to normal even though the write itself failed —
	 * the handler swallows the rejection, and Save (disabled purely by the shared busy flag while
	 * the delete was in flight) re-enables itself.
	 *
	 * @return {void}
	 */
	it('clears the busy state once a delete fails', async () => {
		const write = deferred();
		renderColorPaletteSettings(makePalettes(write));

		act(() => {
			findButton('Delete').click();
		});

		await act(async () => {
			write.reject(new Error('Boom'));
			await write.promise.catch(() => {});
		});

		expect(findButton('Deleting…')).toBeNull();
		expect(findButton('Delete').disabled).toBe(false);
	});
});

const OVERRIDDEN_PALETTE = {
	groups: [
		{
			swatches: [{ token: TOKEN_PATH, label: 'Primary', $value: '#654321', overridden: true }],
		},
	],
};

describe('ColorPaletteSettings destructive action', () => {
	/**
	 * A custom, user-created swatch gets Delete and no Reset (nothing shipped it, so there is no
	 * baseline value to go back to): Delete is enabled, and clicking it calls `removeSwatch`, never
	 * `resetSwatch`.
	 *
	 * @return {void}
	 */
	it('shows an enabled Delete and no Reset for a custom swatch', () => {
		const write = deferred();
		const palettes = makePalettes(write, {
			isSwatchCustom: jest.fn(() => true),
			editingId: 'secondary',
			listing: { defaultId: 'default' },
			palette: OVERRIDDEN_PALETTE,
		});
		renderColorPaletteSettings(palettes);

		expect(findButton('Delete').disabled).toBe(false);
		expect(findButton('Reset')).toBeNull();

		act(() => {
			findButton('Delete').click();
		});

		expect(palettes.removeSwatch).toHaveBeenCalledWith(TOKEN_PATH);
		expect(palettes.resetSwatch).not.toHaveBeenCalled();
	});

	/**
	 * A built-in swatch showing this (non-default) palette's own override gets Reset and no Delete:
	 * Reset is enabled, and clicking it calls `resetSwatch` (never `removeSwatch`), showing
	 * "Resetting…" and disabling Save while the write is in flight.
	 *
	 * @return {void}
	 */
	it('shows an enabled Reset and no Delete for a built-in swatch overridden on a non-default palette', async () => {
		const write = deferred();
		const palettes = makePalettes(write, {
			isSwatchCustom: jest.fn(() => false),
			editingId: 'secondary',
			listing: { defaultId: 'default' },
			palette: OVERRIDDEN_PALETTE,
		});
		renderColorPaletteSettings(palettes);

		expect(findButton('Reset').disabled).toBe(false);
		expect(findButton('Delete')).toBeNull();

		act(() => {
			findButton('Reset').click();
		});

		expect(palettes.resetSwatch).toHaveBeenCalledWith(TOKEN_PATH);
		expect(palettes.removeSwatch).not.toHaveBeenCalled();
		expect(findButton('Resetting…')).not.toBeNull();
		expect(findButton('Save').disabled).toBe(true);

		await act(async () => {
			write.resolve();
			await write.promise;
		});

		expect(findButton('Resetting…')).toBeNull();
	});

	/**
	 * A settled reset closes the panel. The panel's draft still holds the value the reset just
	 * undid — `useSettingsPanel` seeds once per item and deliberately ignores later external
	 * writes — so leaving it open would offer a Save that writes that value straight back.
	 *
	 * @return {void}
	 */
	it('closes the panel once a reset settles', async () => {
		const write = deferred();
		const palettes = makePalettes(write, {
			isSwatchCustom: jest.fn(() => false),
			editingId: 'secondary',
			listing: { defaultId: 'default' },
			palette: OVERRIDDEN_PALETTE,
		});
		const navigate = renderColorPaletteSettings(palettes);

		act(() => {
			findButton('Reset').click();
		});

		expect(navigate).not.toHaveBeenCalled();

		await act(async () => {
			write.resolve();
			await write.promise;
		});

		expect(navigate).toHaveBeenCalledWith({ item: '' });
	});

	/**
	 * A failed reset leaves the panel open (the override is unchanged, so there is nothing stale
	 * in the draft) and settles the busy state, with Reset enabled again.
	 *
	 * @return {void}
	 */
	it('leaves the panel open when a reset fails', async () => {
		const write = deferred();
		const palettes = makePalettes(write, {
			isSwatchCustom: jest.fn(() => false),
			editingId: 'secondary',
			listing: { defaultId: 'default' },
			palette: OVERRIDDEN_PALETTE,
		});
		const navigate = renderColorPaletteSettings(palettes);

		act(() => {
			findButton('Reset').click();
		});

		await act(async () => {
			write.reject(new Error('nope'));
			await write.promise.catch(() => {});
		});

		expect(navigate).not.toHaveBeenCalled();
		expect(findButton('Resetting…')).toBeNull();
		expect(findButton('Reset').disabled).toBe(false);
	});

	/**
	 * On the default palette a built-in swatch whose color differs from the shipped one offers Reset
	 * (restoring the shipped color) and never Delete, matching the card's own pill so the panel and
	 * the card never disagree about the same swatch.
	 *
	 * @return {void}
	 */
	it('shows an enabled Reset and no Delete for a changed built-in swatch on the default palette', () => {
		const write = deferred();
		renderColorPaletteSettings(
			makePalettes(write, {
				isSwatchCustom: jest.fn(() => false),
				editingId: 'default',
				listing: { defaultId: 'default' },
				palette: OVERRIDDEN_PALETTE,
			})
		);

		expect(findButton('Delete')).toBeNull();
		expect(findButton('Reset').disabled).toBe(false);
	});

	/**
	 * A built-in, non-overridden swatch on a non-default palette has nothing to reset yet: Reset
	 * stays in the footer, disabled, and there is no Delete since the row is shipped.
	 *
	 * @return {void}
	 */
	it('shows a disabled Reset and no Delete for a built-in, non-overridden swatch', () => {
		const write = deferred();
		renderColorPaletteSettings(
			makePalettes(write, {
				isSwatchCustom: jest.fn(() => false),
				editingId: 'secondary',
				listing: { defaultId: 'default' },
				palette: PALETTE,
			})
		);

		expect(findButton('Delete')).toBeNull();
		expect(findButton('Reset')).not.toBeNull();
		expect(findButton('Reset').disabled).toBe(true);
	});

	/**
	 * Editing a field enables Save only. Reset is about the SAVED value, so a not-yet-saved change
	 * leaves it disabled; the unsaved-changes handling, not the footer, is where a draft is discarded.
	 *
	 * @return {void}
	 */
	it('keeps Reset disabled while an unsaved edit is pending on a non-overridden swatch', () => {
		const write = deferred();
		renderColorPaletteSettings(
			makePalettes(write, {
				isSwatchCustom: jest.fn(() => false),
				editingId: 'secondary',
				listing: { defaultId: 'default' },
				palette: PALETTE,
			})
		);

		makeDirty();

		expect(findButton('Save').disabled).toBe(false);
		expect(findButton('Reset').disabled).toBe(true);
	});
});

describe('ColorPaletteSettings draft channel', () => {
	/**
	 * Render the panel under a fake draft channel that records what it is given.
	 *
	 * @param {Object} palettes The `usePalettes` stub.
	 *
	 * @since TBD
	 *
	 * @return {{navigate: Function, channel: Object}} The navigate spy and the fake channel.
	 */
	function renderWithChannel(palettes) {
		usePalettes.mockReturnValue(palettes);
		const navigate = jest.fn();
		const channel = {
			publish: jest.fn(),
			clearPublication: jest.fn(),
			actionsRef: { current: null },
			guard: jest.fn(),
		};

		act(() => {
			root.render(
				createElement(
					DraftChannelContext.Provider,
					{ value: channel },
					createElement(ColorPaletteSettings, {
						route: { screen: 'color-palette', item: TOKEN_PATH },
						navigate,
						library: {},
					})
				)
			);
		});

		return { navigate, channel };
	}

	/**
	 * The panel publishes its item, label and dirty bit, and re-publishes as the draft changes.
	 *
	 * @return {void}
	 */
	it('publishes the draft and its dirty bit', () => {
		const { channel } = renderWithChannel(makePalettes(deferred()));

		expect(channel.publish).toHaveBeenLastCalledWith(
			expect.objectContaining({ itemId: TOKEN_PATH, label: 'Primary', isDirty: false })
		);

		makeDirty();

		expect(channel.publish).toHaveBeenLastCalledWith(expect.objectContaining({ isDirty: true }));
	});

	/**
	 * Cancel and the header close both hand the close to the guard instead of navigating directly.
	 *
	 * @return {void}
	 */
	it('routes Cancel and the close control through the guard', () => {
		const { navigate, channel } = renderWithChannel(makePalettes(deferred()));

		act(() => findButton('Cancel').click());
		act(() => container.querySelector('button[label="Close"]')?.click());

		expect(channel.guard).toHaveBeenCalledTimes(2);
		expect(navigate).not.toHaveBeenCalled();

		channel.guard.mock.calls[0][0]();

		expect(navigate).toHaveBeenCalledWith({ item: '' });
	});

	/**
	 * The registered save action writes the current draft, and discard is registered too.
	 *
	 * @return {void}
	 */
	it('registers save and discard for the guard modal', () => {
		const palettes = makePalettes(deferred());
		const { channel } = renderWithChannel(palettes);

		makeDirty();
		channel.actionsRef.current.save();

		expect(palettes.saveSwatchEdits).toHaveBeenCalledWith(
			TOKEN_PATH,
			expect.objectContaining({ label: 'New Name' }),
			expect.any(Object)
		);
		expect(typeof channel.actionsRef.current.discard).toBe('function');
	});

	/**
	 * Unmounting clears the publication so no stale draft is left behind.
	 *
	 * @return {void}
	 */
	it('clears the publication on unmount', () => {
		const { channel } = renderWithChannel(makePalettes(deferred()));

		act(() => root.render(null));

		expect(channel.clearPublication).toHaveBeenCalled();
	});
});
