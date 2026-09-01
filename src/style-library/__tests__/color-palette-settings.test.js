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
	// `isBusy`/`isDestructive`/`variant` are `Button` props, not DOM attributes — drop them so React
	// does not warn about unrecognized attributes.
	Button: ({ children, isBusy, isDestructive, variant, ...props }) => <button {...props}>{children}</button>,
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
	 * A custom, user-created swatch always shows Delete, never Reset — regardless of which palette
	 * is open — and clicking it calls `removeSwatch`, not `resetSwatch`.
	 *
	 * @return {void}
	 */
	it('shows Delete, not Reset, for a custom swatch', () => {
		const write = deferred();
		const palettes = makePalettes(write, {
			isSwatchCustom: jest.fn(() => true),
			editingId: 'secondary',
			listing: { defaultId: 'default' },
			palette: OVERRIDDEN_PALETTE,
		});
		renderColorPaletteSettings(palettes);

		expect(findButton('Delete')).not.toBeNull();
		expect(findButton('Reset')).toBeNull();

		act(() => {
			findButton('Delete').click();
		});

		expect(palettes.removeSwatch).toHaveBeenCalledWith(TOKEN_PATH);
		expect(palettes.resetSwatch).not.toHaveBeenCalled();
	});

	/**
	 * A built-in swatch showing this (non-default) palette's own override shows Reset, not Delete,
	 * and clicking it calls `resetSwatch` — never `removeSwatch` — showing "Resetting…" while the
	 * write is in flight.
	 *
	 * @return {void}
	 */
	it('shows Reset, not Delete, for a built-in swatch overridden on a non-default palette', async () => {
		const write = deferred();
		const palettes = makePalettes(write, {
			isSwatchCustom: jest.fn(() => false),
			editingId: 'secondary',
			listing: { defaultId: 'default' },
			palette: OVERRIDDEN_PALETTE,
		});
		renderColorPaletteSettings(palettes);

		expect(findButton('Reset')).not.toBeNull();
		expect(findButton('Delete')).toBeNull();

		act(() => {
			findButton('Reset').click();
		});

		expect(palettes.resetSwatch).toHaveBeenCalledWith(TOKEN_PATH);
		expect(palettes.removeSwatch).not.toHaveBeenCalled();
		expect(findButton('Resetting…')).not.toBeNull();

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
	 * A failed reset leaves the panel open, so the value the write did not change is still in front
	 * of the user along with the error.
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
			write.reject(new Error('Conflict'));
			await write.promise.catch(() => {});
		});

		expect(navigate).not.toHaveBeenCalled();
	});

	/**
	 * A built-in swatch changed away from its shipped value offers Reset on the DEFAULT palette
	 * too — the server restores the shipped color there rather than dropping the row. It is not a
	 * custom swatch, so it still offers no Delete. This matches the pill the card itself shows,
	 * so the panel and the card never disagree about the same swatch.
	 *
	 * @return {void}
	 */
	it('offers Reset but not Delete for a changed built-in swatch on the default palette', () => {
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
		expect(findButton('Reset')).not.toBeNull();
	});

	/**
	 * A built-in swatch shows neither button on a non-default palette when it is not currently
	 * overridden there — nothing to reset (it already shows the inherited value) and nothing to
	 * delete (it is not a custom swatch).
	 *
	 * @return {void}
	 */
	it('shows neither destructive button for a built-in, non-overridden swatch on a non-default palette', () => {
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
		expect(findButton('Reset')).toBeNull();
	});
});
