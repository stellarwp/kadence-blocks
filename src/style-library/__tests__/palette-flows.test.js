/* eslint-env jest */
import {
	activatePaletteFlow,
	addColorFlow,
	addGroupFlow,
	createPaletteFlow,
	deletePaletteFlow,
	openPaletteFlow,
	removeGroupFlow,
	removeSwatchFlow,
	renameGroupFlow,
	renamePaletteFlow,
	reorderSwatchesFlow,
	saveSwatchEditsFlow,
	writeDefaultPaletteFlow,
} from '../helpers/palette-flows';
import { stripEffectiveFlags } from '../helpers/palettes';
import * as client from '../api/client';

// A factory, not bare automocking: the real module imports `@wordpress/api-fetch`, which is
// externalized to the `wp.apiFetch` global in production and is not installed as an npm
// dependency, so automocking (which loads the real module to introspect its shape) would fail to
// resolve it.
jest.mock('../api/client', () => ({
	createUserPrimitive: jest.fn(),
	deletePalette: jest.fn(),
	deleteUserPrimitive: jest.fn(),
	fetchPalette: jest.fn(),
	savePalette: jest.fn(),
	saveSwatch: jest.fn(),
	setCurrentPalette: jest.fn(),
}));

const NAMESPACE = 'kb-design-tokens/v1';
const SLUG = 'default';
const DEFAULT_ID = 'default';

const defaultView = () => ({
	id: 'default',
	label: 'Default',
	groups: [
		{
			id: 'accent',
			label: 'Accent',
			swatches: [
				{ token: 'primitive.color.brand.primary', label: 'Main 1', $value: '#111111', overridden: false },
				{ token: 'primitive.color.brand.secondary', label: 'Main 2', $value: '#222222', overridden: false },
			],
		},
	],
});

const selectedView = () => ({
	id: 'sunset',
	label: 'Sunset',
	groups: [
		{
			id: 'accent',
			label: 'Accent',
			swatches: [
				{ token: 'primitive.color.brand.primary', label: 'Main 1', $value: '#999999', overridden: true },
				{ token: 'primitive.color.brand.secondary', label: 'Main 2', $value: '#222222', overridden: false },
			],
		},
	],
});

// The shape every write response now carries: a flat, fully embedded palette listing — the same
// RAW wire shape `store/selectors.js`'s `reshapePaletteRows` reshapes on read. Used both as the
// resolved value for every mocked write call in this file, standing in for what the REST endpoints
// actually return, AND as the exact value `onReceive` is asserted to have been called with — a
// flow no longer reshapes its own response before handing it to `onReceive`, it passes it straight
// through, so the assertion below is byte-for-byte the mocked resolved value.
const listingRows = (overrides = {}) => [
	{
		id: DEFAULT_ID,
		label: 'Default',
		is_default: true,
		is_current: overrides.currentId ? overrides.currentId === DEFAULT_ID : true,
		user_created: false,
		_embedded: { self: [defaultView()] },
	},
	{
		id: 'sunset',
		label: 'Sunset',
		is_default: false,
		is_current: overrides.currentId === 'sunset',
		user_created: false,
		_embedded: { self: [selectedView()] },
	},
];

beforeEach(() => {
	jest.resetAllMocks();
});

describe('writeDefaultPaletteFlow', () => {
	it('reads the DEFAULT view, saves the edited default payload, dispatches the response, refreshes the feed, then clears busy', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
		const onReceive = jest.fn();
		const refreshFeed = jest.fn().mockResolvedValue({ version: 'v2' });
		const onBusy = jest.fn();
		const onError = jest.fn();
		const edit = jest.fn((groups) => groups);

		await writeDefaultPaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			edit,
			onReceive,
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.fetchPalette).toHaveBeenCalledWith(NAMESPACE, DEFAULT_ID, SLUG);
		// The trap-1 regression: the saved payload carries the default view's own values, never the
		// selected palette's.
		expect(client.savePalette).toHaveBeenCalledWith(
			NAMESPACE,
			DEFAULT_ID,
			{ label: 'Default', groups: expect.arrayContaining([expect.objectContaining({ id: 'accent' })]) },
			SLUG
		);
		const [, , payload] = client.savePalette.mock.calls[0];
		expect(payload.groups[0].swatches[0].$value).toBe('#111111');
		expect(onReceive).toHaveBeenCalledWith(listingRows());
		expect(refreshFeed).toHaveBeenCalledWith(SLUG);
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('A palette must define at least one color group.');
		client.fetchPalette.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			writeDefaultPaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				defaultId: DEFAULT_ID,
				edit: (groups) => groups,
				onReceive: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('does not call onReceive or refresh the feed when the write failed', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockRejectedValue(new Error('Save failed.'));
		const onReceive = jest.fn();
		const refreshFeed = jest.fn();

		await expect(
			writeDefaultPaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				defaultId: DEFAULT_ID,
				edit: (groups) => groups,
				onReceive,
				refreshFeed,
				onBusy: jest.fn(),
				onError: jest.fn(),
			})
		).rejects.toThrow();

		expect(onReceive).not.toHaveBeenCalled();
		expect(refreshFeed).not.toHaveBeenCalled();
	});
});

describe('saveSwatchEditsFlow', () => {
	const args = (overrides) => ({
		namespace: NAMESPACE,
		slug: SLUG,
		defaultId: DEFAULT_ID,
		editingId: 'sunset',
		token: 'primitive.color.brand.primary',
		onReceive: jest.fn(),
		refreshFeed: jest.fn().mockResolvedValue(undefined),
		onBusy: jest.fn(),
		onError: jest.fn(),
		...overrides,
	});

	it('resolves without any request when nothing changed', async () => {
		const flowArgs = args({
			draft: { label: 'Main 1', value: '#111111' },
			initial: { label: 'Main 1', value: '#111111' },
		});

		await saveSwatchEditsFlow(flowArgs);

		expect(client.saveSwatch).not.toHaveBeenCalled();
		expect(flowArgs.onBusy).not.toHaveBeenCalled();
		expect(flowArgs.onReceive).not.toHaveBeenCalled();
	});

	it('writes only the granular swatch (edited palette) for a color-only edit', async () => {
		client.saveSwatch.mockResolvedValue(listingRows());
		const flowArgs = args({
			draft: { label: 'Main 1', value: '#abcdef' },
			initial: { label: 'Main 1', value: '#111111' },
		});

		await saveSwatchEditsFlow(flowArgs);

		expect(client.saveSwatch).toHaveBeenCalledWith(
			NAMESPACE,
			'sunset',
			'primitive.color.brand.primary',
			{ value: '#abcdef' },
			SLUG
		);
		expect(flowArgs.onReceive).toHaveBeenCalledWith(listingRows());
		expect(flowArgs.refreshFeed).toHaveBeenCalledTimes(1);
	});

	it('writes the label through the targeted swatch endpoint against the default palette for a label-only edit', async () => {
		client.saveSwatch.mockResolvedValue(listingRows());
		const flowArgs = args({
			draft: { label: 'Renamed', value: '#111111' },
			initial: { label: 'Main 1', value: '#111111' },
		});

		await saveSwatchEditsFlow(flowArgs);

		expect(client.saveSwatch).toHaveBeenCalledWith(
			NAMESPACE,
			DEFAULT_ID,
			'primitive.color.brand.primary',
			{ label: 'Renamed' },
			SLUG
		);
		expect(client.fetchPalette).not.toHaveBeenCalled();
		expect(client.savePalette).not.toHaveBeenCalled();
	});

	it('runs the label write before the value write when both changed, with one onReceive and one feed refresh', async () => {
		const order = [];
		client.saveSwatch.mockImplementation(async (namespace, id) => {
			order.push(id === DEFAULT_ID ? 'label' : 'value');
			return listingRows();
		});
		const flowArgs = args({
			draft: { label: 'Renamed', value: '#abcdef' },
			initial: { label: 'Main 1', value: '#111111' },
		});

		await saveSwatchEditsFlow(flowArgs);

		expect(order).toEqual(['label', 'value']);
		expect(client.saveSwatch).toHaveBeenCalledTimes(2);
		expect(flowArgs.onReceive).toHaveBeenCalledTimes(1);
		expect(flowArgs.refreshFeed).toHaveBeenCalledTimes(1);
	});

	it('surfaces the error, clears busy, and re-throws when a write fails', async () => {
		const failure = new Error('Sorry, that swatch could not be saved.');
		client.saveSwatch.mockRejectedValue(failure);
		const flowArgs = args({
			draft: { label: 'Main 1', value: '#abcdef' },
			initial: { label: 'Main 1', value: '#111111' },
		});

		await expect(saveSwatchEditsFlow(flowArgs)).rejects.toBe(failure);

		expect(flowArgs.onError).toHaveBeenCalledWith({ message: failure.message });
		expect(flowArgs.onBusy).toHaveBeenLastCalledWith(false);
	});
});

describe('openPaletteFlow', () => {
	it('fetches the effective view and calls onOpened — no write of any kind', async () => {
		const view = selectedView();
		client.fetchPalette.mockResolvedValue(view);
		const onOpened = jest.fn();
		const onBusy = jest.fn();

		await openPaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			onOpened,
			onBusy,
			onError: jest.fn(),
		});

		expect(client.fetchPalette).toHaveBeenCalledWith(NAMESPACE, 'sunset', SLUG);
		expect(onOpened).toHaveBeenCalledWith(view);
		expect(client.setCurrentPalette).not.toHaveBeenCalled();
		expect(client.savePalette).not.toHaveBeenCalled();
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('reports through onError and re-throws on failure', async () => {
		const failure = new Error('That palette does not exist.');
		client.fetchPalette.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			openPaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				id: 'ghost',
				onOpened: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});

describe('activatePaletteFlow', () => {
	it('sets $current and dispatches its own response, then refreshes the feed pessimistically', async () => {
		client.setCurrentPalette.mockResolvedValue(listingRows({ currentId: 'sunset' }));
		const onReceive = jest.fn();
		const refreshFeed = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();

		await activatePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			onReceive,
			refreshFeed,
			onBusy,
			onError: jest.fn(),
		});

		expect(client.setCurrentPalette).toHaveBeenCalledWith(NAMESPACE, 'sunset', SLUG);
		expect(onReceive).toHaveBeenCalledWith(listingRows({ currentId: 'sunset' }));
		expect(refreshFeed).toHaveBeenCalledWith(SLUG);
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('reports through onError and re-throws on failure', async () => {
		const failure = new Error('That palette does not exist.');
		client.setCurrentPalette.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			activatePaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				id: 'ghost',
				onReceive: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});

describe('createPaletteFlow', () => {
	it('rejects an empty label with an inline error and no request', async () => {
		const onError = jest.fn();

		await expect(
			createPaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				label: '   ',
				listing: { defaultId: DEFAULT_ID, palettes: [] },
				openPalette: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.fetchPalette).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/enter a palette name/i) });
	});

	it('rejects a duplicate id with an inline error and no request', async () => {
		const onError = jest.fn();
		const listing = { defaultId: DEFAULT_ID, palettes: [{ id: 'sunset', label: 'Sunset' }] };

		await expect(
			createPaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				label: 'Sunset',
				listing,
				openPalette: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.fetchPalette).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/already exists/i) });
	});

	it('settles the busy flag on success so the screen leaves its loading state', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
		const onBusy = jest.fn();

		await createPaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			label: 'Forest',
			listing: { defaultId: DEFAULT_ID, palettes: [] },
			onReceive: jest.fn(),
			refreshFeed: jest.fn().mockResolvedValue(undefined),
			openPalette: jest.fn().mockResolvedValue(undefined),
			onBusy,
			onError: jest.fn(),
		});

		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('seeds the new node from the default view, opens it, and never activates it', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
		const openPalette = jest.fn().mockResolvedValue(undefined);
		const listing = { defaultId: DEFAULT_ID, palettes: [] };

		await createPaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			label: 'Forest',
			listing,
			onReceive: jest.fn(),
			refreshFeed: jest.fn().mockResolvedValue(undefined),
			openPalette,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.fetchPalette).toHaveBeenCalledWith(NAMESPACE, DEFAULT_ID, SLUG);
		expect(client.savePalette).toHaveBeenCalledWith(
			NAMESPACE,
			'forest',
			expect.objectContaining({ label: 'Forest' }),
			SLUG
		);
		expect(openPalette).toHaveBeenCalledWith('forest');
		expect(client.setCurrentPalette).not.toHaveBeenCalled();
	});

	it('dispatches the fresh listing before opening the new palette, so the fresh row exists first', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
		const order = [];
		const onReceive = jest.fn(() => {
			order.push('onReceive');
		});
		const openPalette = jest.fn(async () => {
			order.push('openPalette');
		});
		const listing = { defaultId: DEFAULT_ID, palettes: [] };

		await createPaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			label: 'Forest',
			listing,
			onReceive,
			refreshFeed: jest.fn().mockResolvedValue(undefined),
			openPalette,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		// `onReceive` must land BEFORE `openPalette()`: the fresh listing already carries the new
		// row by the time `editingId` moves onto it — otherwise the dropdown would render the raw id
		// for one tick.
		expect(order).toEqual(['onReceive', 'openPalette']);
	});

	it('refreshes the feed, so the version token a later write is checked against is not left stale', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
		const refreshFeed = jest.fn().mockResolvedValue(undefined);

		await createPaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			label: 'Forest',
			listing: { defaultId: DEFAULT_ID, palettes: [] },
			onReceive: jest.fn(),
			openPalette: jest.fn().mockResolvedValue(undefined),
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		// Without this the page keeps the version it read before the create, and the next write —
		// adding a color, say — is rejected with a 409 conflict.
		expect(refreshFeed).toHaveBeenCalledWith(SLUG);
	});

	it('surfaces the error, clears busy, and rejects when the create request fails', async () => {
		const failure = new Error('Could not create the palette.');
		client.fetchPalette.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();
		const onReceive = jest.fn();
		const listing = { defaultId: DEFAULT_ID, palettes: [] };

		await expect(
			createPaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				label: 'Forest',
				listing,
				onReceive,
				openPalette: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy).toHaveBeenLastCalledWith(false);
		expect(onReceive).not.toHaveBeenCalled();
	});
});

describe('deletePaletteFlow', () => {
	it('deletes a palette that is not the live one without activating a successor', async () => {
		client.deletePalette.mockResolvedValue(listingRows());
		const onReceive = jest.fn();
		const refreshFeed = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();

		await deletePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			currentId: DEFAULT_ID,
			onReceive,
			refreshFeed,
			onBusy,
			onError: jest.fn(),
		});

		expect(client.deletePalette).toHaveBeenCalledWith(NAMESPACE, 'sunset', SLUG);
		expect(onReceive).toHaveBeenCalledWith(listingRows());
		expect(refreshFeed).toHaveBeenCalledWith(SLUG);
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(client.setCurrentPalette).not.toHaveBeenCalled();
	});

	it('refuses to delete the live palette with no successor chosen, and issues no request', async () => {
		const onError = jest.fn();

		await expect(
			deletePaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				id: 'sunset',
				currentId: 'sunset',
				onReceive: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.setCurrentPalette).not.toHaveBeenCalled();
		expect(client.deletePalette).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/choose which palette/i) });
	});

	it('activates the chosen successor before deleting the live palette, and dispatches the DELETE response, not the activation response', async () => {
		const order = [];
		client.setCurrentPalette.mockImplementation(() => {
			order.push('activate');
			return Promise.resolve(listingRows({ currentId: 'forest' }));
		});
		const deleteResponse = [
			{
				id: DEFAULT_ID,
				label: 'Default',
				is_default: true,
				is_current: false,
				user_created: false,
				_embedded: { self: [defaultView()] },
			},
		];
		client.deletePalette.mockImplementation(() => {
			order.push('delete');
			return Promise.resolve(deleteResponse);
		});
		const onReceive = jest.fn();

		await deletePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			currentId: 'sunset',
			successorId: 'forest',
			onReceive,
			refreshFeed: jest.fn().mockResolvedValue(undefined),
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(order).toEqual(['activate', 'delete']);
		expect(client.setCurrentPalette).toHaveBeenCalledWith(NAMESPACE, 'forest', SLUG);
		// The intermediate activation response is discarded — only the FINAL write's (delete's) raw
		// response is dispatched, since it is the truly fresh post-delete state.
		expect(onReceive).toHaveBeenCalledTimes(1);
		expect(onReceive).toHaveBeenCalledWith(deleteResponse);
	});

	it('surfaces the default-palette 400 message', async () => {
		const failure = new Error('The default palette cannot be deleted.');
		client.deletePalette.mockRejectedValue(failure);
		const onError = jest.fn();

		await expect(
			deletePaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				id: DEFAULT_ID,
				onReceive: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
	});
});

describe('renamePaletteFlow', () => {
	it('rejects an empty label with an inline error and no request', async () => {
		const onError = jest.fn();

		await expect(
			renamePaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				id: 'sunset',
				label: '   ',
				listing: { defaultId: DEFAULT_ID, palettes: [{ id: 'sunset', label: 'Sunset' }] },
				onReceive: jest.fn(),
				refreshFeed: jest.fn().mockResolvedValue(undefined),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.fetchPalette).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/enter a palette name/i) });
	});

	it('rejects a label that collides with a DIFFERENT palette, without requesting', async () => {
		const onError = jest.fn();
		const listing = {
			defaultId: DEFAULT_ID,
			palettes: [
				{ id: 'sunset', label: 'Sunset' },
				{ id: 'forest', label: 'Forest' },
			],
		};

		await expect(
			renamePaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				id: 'sunset',
				label: 'Forest',
				listing,
				onReceive: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.fetchPalette).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/already exists/i) });
	});

	it('allows renaming a palette to its own current label', async () => {
		client.fetchPalette.mockResolvedValue(selectedView());
		client.savePalette.mockResolvedValue(listingRows());
		const listing = { defaultId: DEFAULT_ID, palettes: [{ id: 'sunset', label: 'Sunset' }] };

		await renamePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			label: 'Sunset',
			listing,
			onReceive: jest.fn(),
			refreshFeed: jest.fn().mockResolvedValue(undefined),
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.savePalette).toHaveBeenCalledWith(
			NAMESPACE,
			'sunset',
			expect.objectContaining({ label: 'Sunset' }),
			SLUG
		);
	});

	it('refreshes the feed, so a rename does not leave the version token stale', async () => {
		client.fetchPalette.mockResolvedValue(selectedView());
		client.savePalette.mockResolvedValue(listingRows());
		const refreshFeed = jest.fn().mockResolvedValue(undefined);

		await renamePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			label: 'Dusk',
			listing: { defaultId: DEFAULT_ID, palettes: [{ id: 'sunset', label: 'Sunset' }] },
			onReceive: jest.fn(),
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		// A label changes no resolved value, but it does bump the stored document's version.
		expect(refreshFeed).toHaveBeenCalledWith(SLUG);
	});

	it('preserves the id, re-sends the palette’s own groups under the new label, and dispatches the fresh listing', async () => {
		client.fetchPalette.mockResolvedValue(selectedView());
		client.savePalette.mockResolvedValue(listingRows());
		const onReceive = jest.fn();
		const onBusy = jest.fn();
		const listing = { defaultId: DEFAULT_ID, palettes: [{ id: 'sunset', label: 'Sunset' }] };

		await renamePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			label: 'Sunset Dusk',
			listing,
			onReceive,
			refreshFeed: jest.fn().mockResolvedValue(undefined),
			onBusy,
			onError: jest.fn(),
		});

		// Reads and writes the SAME id throughout — never a slug derived from the new label (that
		// derivation is `createPaletteFlow`'s job for a brand-new palette, not this flow's).
		expect(client.fetchPalette).toHaveBeenCalledWith(NAMESPACE, 'sunset', SLUG);
		const [namespaceArg, idArg, payload, slugArg] = client.savePalette.mock.calls[0];

		expect(namespaceArg).toBe(NAMESPACE);
		expect(idArg).toBe('sunset');
		expect(slugArg).toBe(SLUG);
		expect(payload.label).toBe('Sunset Dusk');
		expect(payload.groups).toEqual(stripEffectiveFlags(selectedView().groups));
		expect(onReceive).toHaveBeenCalledWith(listingRows());
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('surfaces the error, clears busy, and rejects when the rename request fails', async () => {
		const failure = new Error('Could not rename the palette.');
		client.fetchPalette.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();
		const listing = { defaultId: DEFAULT_ID, palettes: [{ id: 'sunset', label: 'Sunset' }] };

		await expect(
			renamePaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				id: 'sunset',
				label: 'Sunset Dusk',
				listing,
				onReceive: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy).toHaveBeenLastCalledWith(false);
	});
});

describe('removeSwatchFlow', () => {
	const baseArgs = (overrides) => ({
		namespace: NAMESPACE,
		slug: SLUG,
		defaultId: DEFAULT_ID,
		token: 'primitive.color.custom.custom-1',
		onReceive: jest.fn(),
		refreshFeed: jest.fn().mockResolvedValue({ version: 'v3' }),
		onBusy: jest.fn(),
		onError: jest.fn(),
		...overrides,
	});

	beforeEach(() => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
	});

	it('deletes the user primitive only for a user-created token, after the palette write', async () => {
		client.deleteUserPrimitive.mockResolvedValue({});
		const flowArgs = baseArgs({ isUserCreated: true });

		await removeSwatchFlow(flowArgs);

		expect(client.savePalette).toHaveBeenCalled();
		expect(client.deleteUserPrimitive).toHaveBeenCalledWith(SLUG, 'primitive.color.custom.custom-1', 'v3');
		expect(flowArgs.onReceive).toHaveBeenCalledWith(listingRows());
	});

	it('never calls deleteUserPrimitive for a baseline token', async () => {
		const flowArgs = baseArgs({ token: 'primitive.color.brand.primary', isUserCreated: false });

		await removeSwatchFlow(flowArgs);

		expect(client.savePalette).toHaveBeenCalled();
		expect(client.deleteUserPrimitive).not.toHaveBeenCalled();
	});

	it('never calls deleteUserPrimitive before the row-removal write has settled', async () => {
		const order = [];
		client.savePalette.mockImplementation(async () => {
			order.push('savePalette');
			return listingRows();
		});
		client.deleteUserPrimitive.mockImplementation(async () => {
			order.push('deleteUserPrimitive');
			return {};
		});
		const flowArgs = baseArgs({
			isUserCreated: true,
			onReceive: jest.fn(() => {
				order.push('onReceive');
			}),
			refreshFeed: jest.fn(async () => {
				order.push('refreshFeed');
				return { version: 'v3' };
			}),
		});

		await removeSwatchFlow(flowArgs);

		expect(order).toEqual(['savePalette', 'onReceive', 'refreshFeed', 'deleteUserPrimitive', 'refreshFeed']);
	});

	it('resolves — does not reject — when deleteUserPrimitive fails after the row removal already succeeded, and still calls refreshFeed once more', async () => {
		client.deleteUserPrimitive.mockRejectedValue(new Error('Referenced elsewhere.'));
		const refreshFeed = jest.fn().mockResolvedValue({ version: 'v3' });
		const flowArgs = baseArgs({ isUserCreated: true, refreshFeed });

		await expect(removeSwatchFlow(flowArgs)).resolves.toBeUndefined();

		expect(refreshFeed).toHaveBeenCalledTimes(2);
		expect(flowArgs.onError).not.toHaveBeenCalled();
	});

	it('surfaces the error and rejects when the row-removal write itself fails', async () => {
		const failure = new Error('A palette must define at least one color group.');
		client.savePalette.mockRejectedValue(failure);
		const flowArgs = baseArgs({ isUserCreated: true });

		await expect(removeSwatchFlow(flowArgs)).rejects.toBe(failure);

		expect(flowArgs.onError).toHaveBeenCalledWith({ message: failure.message });
		expect(client.deleteUserPrimitive).not.toHaveBeenCalled();
		expect(flowArgs.onReceive).not.toHaveBeenCalled();
	});
});

describe('addColorFlow', () => {
	it('creates the primitive first, then appends the swatch to the default node, and resolves with the new token id', async () => {
		client.createUserPrimitive.mockResolvedValue({ id: 'primitive.color.custom.custom-1', version: 'v2' });
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
		const onReceive = jest.fn();
		const refreshFeed = jest.fn().mockResolvedValue(undefined);

		const token = await addColorFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			groupId: 'accent',
			tokens: [],
			palette: selectedView(),
			feedVersion: 'v1',
			onReceive,
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.createUserPrimitive).toHaveBeenCalledWith(
			SLUG,
			expect.objectContaining({ id: 'custom-1', $type: 'color', version: 'v1' })
		);
		const [, , payload] = client.savePalette.mock.calls[0];
		expect(payload.groups.find((group) => group.id === 'accent').swatches).toContainEqual(
			expect.objectContaining({ token: 'primitive.color.custom.custom-1' })
		);
		expect(onReceive).toHaveBeenCalledWith(listingRows());
		expect(token).toBe('primitive.color.custom.custom-1');
	});

	it('does not write the palette when the primitive create fails', async () => {
		const failure = new Error('Only color primitives can be created in this version.');
		client.createUserPrimitive.mockRejectedValue(failure);
		const onError = jest.fn();

		await expect(
			addColorFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				defaultId: DEFAULT_ID,
				groupId: 'accent',
				tokens: [],
				palette: selectedView(),
				feedVersion: 'v1',
				onReceive: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toBe(failure);

		expect(client.savePalette).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: failure.message });
	});
});

describe('addGroupFlow', () => {
	it('creates the group with its first swatch in a single default write', async () => {
		client.createUserPrimitive.mockResolvedValue({ id: 'primitive.color.custom.custom-1', version: 'v2' });
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());

		const token = await addGroupFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			label: 'Background',
			palette: selectedView(),
			tokens: [],
			feedVersion: 'v1',
			onReceive: jest.fn(),
			refreshFeed: jest.fn().mockResolvedValue(undefined),
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		const [, , payload] = client.savePalette.mock.calls[0];
		const newGroup = payload.groups.find((group) => group.id === 'background');

		expect(newGroup.swatches).toHaveLength(1);
		expect(token).toBe('primitive.color.custom.custom-1');
	});

	it('rejects an empty or duplicate group label without requests', async () => {
		const onError = jest.fn();

		await expect(
			addGroupFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				defaultId: DEFAULT_ID,
				label: '   ',
				palette: selectedView(),
				tokens: [],
				feedVersion: 'v1',
				onReceive: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		await expect(
			addGroupFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				defaultId: DEFAULT_ID,
				label: 'Accent',
				palette: selectedView(),
				tokens: [],
				feedVersion: 'v1',
				onReceive: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.createUserPrimitive).not.toHaveBeenCalled();
	});
});

describe('reorderSwatchesFlow', () => {
	it('writes the reordered DEFAULT node regardless of the selected palette', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());

		await reorderSwatchesFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			groupId: 'accent',
			orderedTokens: ['primitive.color.brand.secondary', 'primitive.color.brand.primary'],
			onReceive: jest.fn(),
			refreshFeed: jest.fn().mockResolvedValue(undefined),
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.fetchPalette).toHaveBeenCalledWith(NAMESPACE, DEFAULT_ID, SLUG);
		const [, , payload] = client.savePalette.mock.calls[0];
		expect(payload.groups[0].swatches.map((swatch) => swatch.token)).toEqual([
			'primitive.color.brand.secondary',
			'primitive.color.brand.primary',
		]);
	});
});

describe('renameGroupFlow', () => {
	it('fetches and saves the DEFAULT palette with the relabeled group, keeping its id', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
		const onReceive = jest.fn();
		const refreshFeed = jest.fn().mockResolvedValue(undefined);

		await renameGroupFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			groupId: 'accent',
			label: 'Renamed Accent',
			onReceive,
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.fetchPalette).toHaveBeenCalledWith(NAMESPACE, DEFAULT_ID, SLUG);
		const [, id, payload] = client.savePalette.mock.calls[0];
		expect(id).toBe(DEFAULT_ID);
		// The id-stability assertion: the saved group still carries its original id under the new
		// label — the regression test for the `template_slot_for()` misfiling hazard.
		expect(payload.groups.find((group) => group.label === 'Renamed Accent').id).toBe('accent');
		expect(onReceive).toHaveBeenCalledWith(listingRows());
		expect(refreshFeed).toHaveBeenCalledWith(SLUG);
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Could not rename the group.');
		client.fetchPalette.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			renameGroupFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				defaultId: DEFAULT_ID,
				groupId: 'accent',
				label: 'Renamed Accent',
				onReceive: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});

describe('removeGroupFlow', () => {
	const baseArgs = (overrides) => ({
		namespace: NAMESPACE,
		slug: SLUG,
		defaultId: DEFAULT_ID,
		groupId: 'accent',
		userCreatedTokens: [],
		onReceive: jest.fn(),
		refreshFeed: jest.fn().mockResolvedValue({ version: 'v3' }),
		onBusy: jest.fn(),
		onError: jest.fn(),
		...overrides,
	});

	beforeEach(() => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue(listingRows());
	});

	it('writes the group removal to the default node from a fresh read before any cleanup delete', async () => {
		client.deleteUserPrimitive.mockResolvedValue({});
		const order = [];
		client.savePalette.mockImplementation(async () => {
			order.push('savePalette');
			return listingRows();
		});
		client.deleteUserPrimitive.mockImplementation(async () => {
			order.push('deleteUserPrimitive');
			return {};
		});
		const flowArgs = baseArgs({
			userCreatedTokens: ['primitive.color.custom.custom-1'],
			onReceive: jest.fn(() => {
				order.push('onReceive');
			}),
			refreshFeed: jest.fn(async () => {
				order.push('refreshFeed');
				return { version: 'v3' };
			}),
		});

		await removeGroupFlow(flowArgs);

		expect(order).toEqual(['savePalette', 'onReceive', 'refreshFeed', 'deleteUserPrimitive', 'refreshFeed']);
		expect(client.fetchPalette).toHaveBeenCalledWith(NAMESPACE, DEFAULT_ID, SLUG);
	});

	it('calls deleteUserPrimitive once per user-created token, each with the preceding refresh’s version', async () => {
		client.deleteUserPrimitive.mockResolvedValue({});
		let call = 0;
		const refreshFeed = jest.fn(async () => {
			call += 1;
			return { version: `v${call}` };
		});
		const flowArgs = baseArgs({
			userCreatedTokens: ['primitive.color.custom.custom-1', 'primitive.color.custom.custom-2'],
			refreshFeed,
		});

		await removeGroupFlow(flowArgs);

		expect(client.deleteUserPrimitive).toHaveBeenCalledTimes(2);
		expect(client.deleteUserPrimitive).toHaveBeenNthCalledWith(1, SLUG, 'primitive.color.custom.custom-1', 'v1');
		expect(client.deleteUserPrimitive).toHaveBeenNthCalledWith(2, SLUG, 'primitive.color.custom.custom-2', 'v2');
	});

	it('never calls deleteUserPrimitive for an empty userCreatedTokens list', async () => {
		const flowArgs = baseArgs({ userCreatedTokens: [] });

		await removeGroupFlow(flowArgs);

		expect(client.savePalette).toHaveBeenCalled();
		expect(client.deleteUserPrimitive).not.toHaveBeenCalled();
	});

	it('swallows an individual cleanup rejection, still attempts the rest, and resolves', async () => {
		client.deleteUserPrimitive.mockRejectedValueOnce(new Error('Referenced elsewhere.')).mockResolvedValueOnce({});
		const refreshFeed = jest.fn().mockResolvedValue({ version: 'v3' });
		const flowArgs = baseArgs({
			userCreatedTokens: ['primitive.color.custom.custom-1', 'primitive.color.custom.custom-2'],
			refreshFeed,
		});

		await expect(removeGroupFlow(flowArgs)).resolves.toBeUndefined();

		expect(client.deleteUserPrimitive).toHaveBeenCalledTimes(2);
		// Once for the write's own refresh, once per cleanup attempt regardless of outcome.
		expect(refreshFeed).toHaveBeenCalledTimes(3);
		expect(flowArgs.onError).not.toHaveBeenCalled();
	});

	it('rejects (after onError) only when the group-removal write itself fails, with no cleanup attempt', async () => {
		const failure = new Error('A palette must define at least one color group.');
		client.savePalette.mockRejectedValue(failure);
		const flowArgs = baseArgs({ userCreatedTokens: ['primitive.color.custom.custom-1'] });

		await expect(removeGroupFlow(flowArgs)).rejects.toBe(failure);

		expect(flowArgs.onError).toHaveBeenCalledWith({ message: failure.message });
		expect(client.deleteUserPrimitive).not.toHaveBeenCalled();
	});
});
