/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { PresetSidebar } from '../components/pages/PresetSidebar';
import * as notify from '../helpers/notify';

jest.mock('../helpers/notify');

// `PresetSidebar` takes the preset-screen binding as a prop rather than calling a hook itself, so
// both cases below can stub `screen` directly with a plain object — no module mock is needed.
// Both resolve to no initial values, so `PresetSidebar` returns null before mounting its body; the
// write-flow fields (`savePreset`, `isDeletable`, etc.) never need stubbing.
const PRESET = { tabs: null, schemaFor: () => [] };

let container;
let root;

/**
 * Render `PresetSidebar` with the given `screen` binding and route item, returning the `navigate`
 * spy passed to it.
 *
 * @param {Object} screen The preset-screen binding to stub.
 * @param {string} item   The route's `item` (`kb-item`) value.
 *
 * @since TBD
 *
 * @return {Function} The `navigate` jest spy.
 */
function renderPresetSidebar(screen, item) {
	const navigate = jest.fn();

	act(() => {
		root.render(
			createElement(PresetSidebar, {
				route: { screen: 'blocks/kadence/singlebtn', item },
				navigate,
				screen,
				preset: PRESET,
			})
		);
	});

	return navigate;
}

beforeEach(() => {
	jest.clearAllMocks();
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

// React overrides a controlled input's `value` setter on the DOM node itself to track whether a
// change actually happened; assigning `field.value` directly goes through that same overridden
// setter, so React sees no change and never calls `onChange`. Going through the native prototype
// setter first bypasses the override, the same workaround React's own testing utilities use.
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

/**
 * Edit the preset's name field so the draft becomes dirty, clearing the Save button's `!isDirty`
 * guard.
 *
 * @return {void}
 */
function makeDirty() {
	const field = container.querySelector('input[type="text"]');

	act(() => {
		nativeInputValueSetter.call(field, 'Renamed');
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

describe('PresetSidebar write flows notify success', () => {
	/**
	 * A successful save shows the Snackbar success confirmation, alongside the existing error
	 * handling, which stays untouched.
	 *
	 * @return {void}
	 */
	it('notifies success once a save resolves', async () => {
		const savePreset = jest.fn().mockResolvedValue(undefined);

		renderPresetSidebar(
			{
				payload: { presets: { primary: { label: 'Primary' } } },
				isLoading: false,
				loadError: null,
				initialValuesFor: () => ({ label: 'Primary' }),
				savePreset,
				deletePreset: jest.fn(),
				isDeletable: () => true,
				isBusy: false,
				saveError: null,
				deleteError: null,
				clearSaveError: jest.fn(),
				clearDeleteError: jest.fn(),
			},
			'primary'
		);

		makeDirty();

		await act(async () => {
			findButton('Save').click();
		});

		expect(savePreset).toHaveBeenCalledWith('primary', expect.objectContaining({ label: 'Renamed' }), {
			label: 'Primary',
		});
		expect(notify.notifySuccess).toHaveBeenCalledWith('Preset saved.');
		// `TextField`'s `TextControl` renders a pre-existing (unrelated to this change) deprecation
		// warning for its default bottom margin the first time it mounts in this file; only the first
		// test to render it observes the call, since `deprecated()` caches by message afterward.
		expect(console).toHaveWarned();
	});

	/**
	 * A save is not a round trip: the server rewrites a captured literal into the semantic alias that
	 * carries it, so what comes back is equivalent without being equal. Seeding the draft from that
	 * response is the only thing that lets the panel go clean — before it, Save stayed enabled and
	 * navigating away raised the unsaved-changes guard over a preset with nothing left to save.
	 *
	 * @return {void}
	 */
	it('goes clean after a save whose response normalized what was sent', async () => {
		const stored = { label: 'Renamed', tokens: { fontWeight: 'semantic.font-weight.heading' } };
		// The feed refresh is awaited inside the save flow, so by the time `savePreset` resolves, the
		// values the panel compares against are already the stored ones. Modelled here so the draft and
		// `initialValues` meet on the SERVER's shape rather than on what was typed.
		let persisted = { label: 'Primary' };
		const savePreset = jest.fn().mockImplementation(() => {
			persisted = stored;

			return Promise.resolve(stored);
		});

		const screen = {
			payload: { presets: { primary: { label: 'Primary' } } },
			isLoading: false,
			loadError: null,
			initialValuesFor: () => persisted,
			savePreset,
			deletePreset: jest.fn(),
			isDeletable: () => true,
			isBusy: false,
			saveError: null,
			deleteError: null,
			clearSaveError: jest.fn(),
			clearDeleteError: jest.fn(),
		};

		renderPresetSidebar(screen, 'primary');

		makeDirty();

		expect(findButton('Save').disabled).toBe(false);

		await act(async () => {
			findButton('Save').click();
		});

		// Re-rendered rather than remounted, which is what the store update does in the app: the panel
		// keeps its draft and receives the refreshed values as a prop.
		renderPresetSidebar(screen, 'primary');

		// The draft now holds what the server stored, so the panel has nothing left to save.
		expect(findButton('Save').disabled).toBe(true);
	});

	/**
	 * A failed save must not fire the success Snackbar — the existing `saveError` handling still
	 * owns error feedback for this flow.
	 *
	 * @return {void}
	 */
	it('does not notify success when a save fails', async () => {
		const savePreset = jest.fn().mockRejectedValue(new Error('Conflict'));

		renderPresetSidebar(
			{
				payload: { presets: { primary: { label: 'Primary' } } },
				isLoading: false,
				loadError: null,
				initialValuesFor: () => ({ label: 'Primary' }),
				savePreset,
				deletePreset: jest.fn(),
				isDeletable: () => true,
				isBusy: false,
				saveError: null,
				deleteError: null,
				clearSaveError: jest.fn(),
				clearDeleteError: jest.fn(),
			},
			'primary'
		);

		makeDirty();

		await act(async () => {
			findButton('Save').click();
		});

		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	/**
	 * A successful delete shows the Snackbar success confirmation and still navigates away from the
	 * deleted preset.
	 *
	 * @return {void}
	 */
	it('notifies success once a delete resolves, and still navigates away', async () => {
		const deletePreset = jest.fn().mockResolvedValue(undefined);

		const navigate = renderPresetSidebar(
			{
				payload: { presets: { primary: { label: 'Primary' } } },
				isLoading: false,
				loadError: null,
				initialValuesFor: () => ({ label: 'Primary' }),
				savePreset: jest.fn(),
				deletePreset,
				isDeletable: () => true,
				isBusy: false,
				saveError: null,
				deleteError: null,
				clearSaveError: jest.fn(),
				clearDeleteError: jest.fn(),
			},
			'primary'
		);

		await act(async () => {
			findButton('Delete').click();
		});

		expect(deletePreset).toHaveBeenCalledWith('primary');
		expect(notify.notifySuccess).toHaveBeenCalledWith('Preset deleted.');
		expect(navigate).toHaveBeenCalledWith({ item: '' });
	});

	/**
	 * A failed delete must not fire the success Snackbar, and must not navigate away — the existing
	 * `deleteError` handling still owns error feedback for this flow.
	 *
	 * @return {void}
	 */
	it('does not notify success or navigate away when a delete fails', async () => {
		const deletePreset = jest.fn().mockRejectedValue(new Error('Conflict'));

		const navigate = renderPresetSidebar(
			{
				payload: { presets: { primary: { label: 'Primary' } } },
				isLoading: false,
				loadError: null,
				initialValuesFor: () => ({ label: 'Primary' }),
				savePreset: jest.fn(),
				deletePreset,
				isDeletable: () => true,
				isBusy: false,
				saveError: null,
				deleteError: null,
				clearSaveError: jest.fn(),
				clearDeleteError: jest.fn(),
			},
			'primary'
		);

		await act(async () => {
			findButton('Delete').click();
		});

		expect(notify.notifySuccess).not.toHaveBeenCalled();
		expect(navigate).not.toHaveBeenCalled();
	});
});

describe('PresetSidebar self-heal guard', () => {
	/**
	 * A failed preset fetch must not be mistaken for a stale `kb-item`: the route must survive so a
	 * retry can still restore the selected preset.
	 *
	 * @return {void}
	 */
	it('does not clear a valid kb-item when the preset fetch fails', () => {
		const navigate = renderPresetSidebar(
			{
				payload: null,
				isLoading: false,
				loadError: new Error('Request failed'),
				initialValuesFor: () => null,
			},
			'primary'
		);

		expect(navigate).not.toHaveBeenCalled();
	});

	/**
	 * A successful load that resolves to no preset for the given slug is genuinely stale, so the
	 * self-heal must still clear the route.
	 *
	 * @return {void}
	 */
	it('clears an unknown kb-item once a successful load finds no matching preset', () => {
		const navigate = renderPresetSidebar(
			{
				payload: {},
				isLoading: false,
				loadError: null,
				initialValuesFor: () => null,
			},
			'does-not-exist'
		);

		expect(navigate).toHaveBeenCalledWith({ item: '' });
	});
});
