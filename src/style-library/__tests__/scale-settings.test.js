/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ScaleSettings } from '../components/pages/ScaleSettings';
import { useScaleScreen } from '../hooks/use-scale-screen';
import { useDraftChannel } from '../hooks/use-draft-channel';

// A factory, not bare automocking — `use-scale-screen.js` pulls in `../api/client`, which imports
// `@wordpress/api-fetch` (externalized to the `wp.apiFetch` global in production, not an installed
// npm dependency), so automocking would fail to resolve it. This panel only reads the hook's
// return value, so a bare `jest.fn()` stand-in is enough.
jest.mock('../hooks/use-scale-screen', () => ({
	useScaleScreen: jest.fn(),
}));

// Stubbed so `channel` stays falsy and the publish effect / guarded close never engage — this test
// only exercises the Save/Delete busy wiring, not the draft-channel guard.
jest.mock('../hooks/use-draft-channel', () => ({
	useDraftChannel: jest.fn(),
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

const TOKEN = { id: 'primitive.dimension.radius.sm', label: 'SM', userCreated: true };
const INITIAL_VALUES = { label: 'SM', value: '0.25rem' };

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
 * Build a `useScaleScreen` stub whose `isBusy` flips to true the moment `saveToken`/`deleteToken`
 * is called and back to false once `write` settles — mirroring what the real hook's `onBusy`
 * callback does synchronously around each flow. The flip happens before `handleSave`/`handleDelete`
 * calls `setPendingAction`, so the re-render that state update triggers already reads the busy
 * value in the same `act()`.
 *
 * @param {Object} write The deferred promise the pending write resolves/rejects through.
 *
 * @since TBD
 *
 * @return {Object} The `useScaleScreen` stub.
 */
function makeScale(write) {
	const state = { isBusy: false };
	const track = (promise) => promise.finally(() => (state.isBusy = false));

	return {
		tokenById: () => TOKEN,
		initialValuesFor: () => INITIAL_VALUES,
		saveError: null,
		deleteError: null,
		clearSaveError: jest.fn(),
		clearDeleteError: jest.fn(),
		saveToken: jest.fn(() => {
			state.isBusy = true;
			return track(write.promise);
		}),
		deleteToken: jest.fn(() => {
			state.isBusy = true;
			return track(write.promise);
		}),
		get isBusy() {
			return state.isBusy;
		},
	};
}

/**
 * Render `ScaleSettings` with the given `useScaleScreen` stub.
 *
 * @param {Object} scale The `useScaleScreen` stub to render with.
 *
 * @since TBD
 *
 * @return {Function} The `navigate` jest spy.
 */
function renderScaleSettings(scale) {
	useScaleScreen.mockReturnValue(scale);
	const navigate = jest.fn();

	act(() => {
		root.render(
			createElement(ScaleSettings, {
				config: { valueField: { type: 'text' } },
				route: { screen: 'border-radius', item: TOKEN.id },
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
		nativeInputValueSetter.call(field, 'Cozy SM');
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
	useScaleScreen.mockReset();
	useDraftChannel.mockReset();
	useDraftChannel.mockReturnValue(null);
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('ScaleSettings busy state', () => {
	/**
	 * Clicking Save shows the "Saving…" label and disables Delete for the duration of the write.
	 *
	 * @return {void}
	 */
	it('shows Saving… and disables Delete while a save is in flight', async () => {
		const write = deferred();
		renderScaleSettings(makeScale(write));
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
		renderScaleSettings(makeScale(write));
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
		renderScaleSettings(makeScale(write));
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
		renderScaleSettings(makeScale(write));

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
