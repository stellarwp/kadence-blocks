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
