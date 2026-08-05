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

beforeEach(() => {
	jest.resetAllMocks();
});

describe('writeDefaultPaletteFlow', () => {
	it('reads the DEFAULT view, saves the edited default payload, reloads, refreshes the feed, then clears busy', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue({ $default: DEFAULT_ID, $current: DEFAULT_ID, palettes: [] });
		const reload = jest.fn().mockResolvedValue(undefined);
		const refreshFeed = jest.fn().mockResolvedValue({ version: 'v2' });
		const onBusy = jest.fn();
		const onError = jest.fn();
		const edit = jest.fn((groups) => groups);

		await writeDefaultPaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			edit,
			reload,
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
		expect(reload).toHaveBeenCalled();
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
				reload: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});

describe('saveSwatchEditsFlow', () => {
	const args = (overrides) => ({
		namespace: NAMESPACE,
		slug: SLUG,
		defaultId: DEFAULT_ID,
		editingId: 'sunset',
		token: 'primitive.color.brand.primary',
		reload: jest.fn().mockResolvedValue(undefined),
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

		expect(client.fetchPalette).not.toHaveBeenCalled();
		expect(client.saveSwatch).not.toHaveBeenCalled();
		expect(flowArgs.onBusy).not.toHaveBeenCalled();
		expect(flowArgs.reload).not.toHaveBeenCalled();
	});

	it('writes only the granular swatch (edited palette) for a color-only edit', async () => {
		client.saveSwatch.mockResolvedValue({});
		const flowArgs = args({
			draft: { label: 'Main 1', value: '#abcdef' },
			initial: { label: 'Main 1', value: '#111111' },
		});

		await saveSwatchEditsFlow(flowArgs);

		expect(client.saveSwatch).toHaveBeenCalledWith(
			NAMESPACE,
			'sunset',
			'primitive.color.brand.primary',
			'#abcdef',
			SLUG
		);
		expect(client.fetchPalette).not.toHaveBeenCalled();
		expect(client.savePalette).not.toHaveBeenCalled();
		expect(flowArgs.reload).toHaveBeenCalledTimes(1);
		expect(flowArgs.refreshFeed).toHaveBeenCalledTimes(1);
	});

	it('writes only the default node for a label-only edit', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue({});
		const flowArgs = args({
			draft: { label: 'Renamed', value: '#111111' },
			initial: { label: 'Main 1', value: '#111111' },
		});

		await saveSwatchEditsFlow(flowArgs);

		expect(client.fetchPalette).toHaveBeenCalledWith(NAMESPACE, DEFAULT_ID, SLUG);
		expect(client.savePalette).toHaveBeenCalledWith(
			NAMESPACE,
			DEFAULT_ID,
			expect.objectContaining({ label: 'Default' }),
			SLUG
		);
		expect(client.saveSwatch).not.toHaveBeenCalled();
	});

	it('runs rename before the color write when both changed, with one reload and one feed refresh', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue({});
		client.saveSwatch.mockResolvedValue({});
		const order = [];
		client.savePalette.mockImplementation(async () => {
			order.push('savePalette');
			return {};
		});
		client.saveSwatch.mockImplementation(async () => {
			order.push('saveSwatch');
			return {};
		});
		const flowArgs = args({
			draft: { label: 'Renamed', value: '#abcdef' },
			initial: { label: 'Main 1', value: '#111111' },
		});

		await saveSwatchEditsFlow(flowArgs);

		expect(order).toEqual(['savePalette', 'saveSwatch']);
		expect(flowArgs.reload).toHaveBeenCalledTimes(1);
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
	it('sets $current, reloads, refreshes the feed pessimistically', async () => {
		client.setCurrentPalette.mockResolvedValue({ current: 'sunset' });
		const reload = jest.fn().mockResolvedValue(undefined);
		const refreshFeed = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();
		const onActivated = jest.fn();

		await activatePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			reload,
			refreshFeed,
			onBusy,
			onError: jest.fn(),
			onActivated,
		});

		expect(client.setCurrentPalette).toHaveBeenCalledWith(NAMESPACE, 'sunset', SLUG);
		expect(onActivated).toHaveBeenCalledWith('sunset');
		expect(reload).toHaveBeenCalled();
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
				reload: jest.fn(),
				refreshFeed: jest.fn(),
				onBusy,
				onError,
				onActivated: jest.fn(),
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

	it('seeds the new node from the default view, opens it, and never activates it', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue({});
		const openPalette = jest.fn().mockResolvedValue(undefined);
		const reload = jest.fn().mockResolvedValue(undefined);
		const listing = { defaultId: DEFAULT_ID, palettes: [] };

		await createPaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			label: 'Forest',
			listing,
			reload,
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

	it('reloads the listing before opening the new palette, so the fresh row exists first', async () => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue({});
		const order = [];
		const reload = jest.fn(async () => {
			order.push('reload');
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
			reload,
			openPalette,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		// `reload()` must land BEFORE `openPalette()`: `hooks/use-palettes.js`'s `reload()` keeps
		// `editingId` unchanged (it still points at the previously-edited palette, which still
		// exists), so this ordering means the listing already carries the new row by the time
		// `editingId` moves onto it — otherwise the dropdown would render the raw id for one tick.
		expect(order).toEqual(['reload', 'openPalette']);
	});

	it('surfaces the error, clears busy, and rejects when the create request fails', async () => {
		const failure = new Error('Could not create the palette.');
		client.fetchPalette.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();
		const reload = jest.fn().mockResolvedValue(undefined);
		const listing = { defaultId: DEFAULT_ID, palettes: [] };

		await expect(
			createPaletteFlow({
				namespace: NAMESPACE,
				slug: SLUG,
				label: 'Forest',
				listing,
				reload,
				openPalette: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy).toHaveBeenLastCalledWith(false);
		expect(reload).not.toHaveBeenCalled();
	});
});

describe('deletePaletteFlow', () => {
	it('deletes, defers to reload for the server-resolved fallback, and never activates a successor', async () => {
		client.deletePalette.mockResolvedValue({ $default: DEFAULT_ID, $current: DEFAULT_ID, palettes: [] });
		const reload = jest.fn().mockResolvedValue(undefined);
		const refreshFeed = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();

		await deletePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			reload,
			refreshFeed,
			onBusy,
			onError: jest.fn(),
		});

		expect(client.deletePalette).toHaveBeenCalledWith(NAMESPACE, 'sunset', SLUG);
		// The flow never assumes a fallback id itself — it defers to `reload`, which re-reads the
		// listing from the server and so always reflects the server's own fallback decision.
		expect(reload).toHaveBeenCalled();
		expect(refreshFeed).toHaveBeenCalledWith(SLUG);
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		// No successor is ever activated first — unlike deleteLibraryFlow, deleting a palette that
		// is merely being edited has no live-site effect to sequence around.
		expect(client.setCurrentPalette).not.toHaveBeenCalled();
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
				reload: jest.fn(),
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
				reload: jest.fn(),
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
				reload: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.fetchPalette).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/already exists/i) });
	});

	it('allows renaming a palette to its own current label', async () => {
		client.fetchPalette.mockResolvedValue(selectedView());
		client.savePalette.mockResolvedValue({});
		const reload = jest.fn().mockResolvedValue(undefined);
		const listing = { defaultId: DEFAULT_ID, palettes: [{ id: 'sunset', label: 'Sunset' }] };

		await renamePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			label: 'Sunset',
			listing,
			reload,
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

	it('preserves the id, re-sends the palette’s own groups under the new label, and reloads the listing', async () => {
		client.fetchPalette.mockResolvedValue(selectedView());
		client.savePalette.mockResolvedValue({});
		const reload = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();
		const listing = { defaultId: DEFAULT_ID, palettes: [{ id: 'sunset', label: 'Sunset' }] };

		await renamePaletteFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			id: 'sunset',
			label: 'Sunset Dusk',
			listing,
			reload,
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
		expect(reload).toHaveBeenCalled();
		// No feed refresh: a palette's label never reaches a resolved token value (see the flow's
		// own docblock), so there is nothing for a refresh to correct.
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
				reload: jest.fn(),
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
		reload: jest.fn().mockResolvedValue(undefined),
		refreshFeed: jest.fn().mockResolvedValue({ version: 'v3' }),
		onBusy: jest.fn(),
		onError: jest.fn(),
		...overrides,
	});

	beforeEach(() => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue({});
	});

	it('deletes the user primitive only for a user-created token, after the palette write', async () => {
		client.deleteUserPrimitive.mockResolvedValue({});
		const flowArgs = baseArgs({ isUserCreated: true });

		await removeSwatchFlow(flowArgs);

		expect(client.savePalette).toHaveBeenCalled();
		expect(client.deleteUserPrimitive).toHaveBeenCalledWith(SLUG, 'primitive.color.custom.custom-1', 'v3');
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
			return {};
		});
		client.deleteUserPrimitive.mockImplementation(async () => {
			order.push('deleteUserPrimitive');
			return {};
		});
		const flowArgs = baseArgs({
			isUserCreated: true,
			reload: jest.fn(async () => {
				order.push('reload');
			}),
			refreshFeed: jest.fn(async () => {
				order.push('refreshFeed');
				return { version: 'v3' };
			}),
		});

		await removeSwatchFlow(flowArgs);

		expect(order).toEqual(['savePalette', 'reload', 'refreshFeed', 'deleteUserPrimitive', 'refreshFeed']);
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
	});
});

describe('addColorFlow', () => {
	it('creates the primitive first, then appends the swatch to the default node, and resolves with the new token id', async () => {
		client.createUserPrimitive.mockResolvedValue({ id: 'primitive.color.custom.custom-1', version: 'v2' });
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue({});
		const reload = jest.fn().mockResolvedValue(undefined);
		const refreshFeed = jest.fn().mockResolvedValue(undefined);

		const token = await addColorFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			groupId: 'accent',
			tokens: [],
			palette: selectedView(),
			feedVersion: 'v1',
			reload,
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
				reload: jest.fn(),
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
		client.savePalette.mockResolvedValue({});

		const token = await addGroupFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			label: 'Background',
			palette: selectedView(),
			tokens: [],
			feedVersion: 'v1',
			reload: jest.fn().mockResolvedValue(undefined),
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
				reload: jest.fn(),
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
				reload: jest.fn(),
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
		client.savePalette.mockResolvedValue({});

		await reorderSwatchesFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			groupId: 'accent',
			orderedTokens: ['primitive.color.brand.secondary', 'primitive.color.brand.primary'],
			reload: jest.fn().mockResolvedValue(undefined),
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
		client.savePalette.mockResolvedValue({});
		const reload = jest.fn().mockResolvedValue(undefined);
		const refreshFeed = jest.fn().mockResolvedValue(undefined);

		await renameGroupFlow({
			namespace: NAMESPACE,
			slug: SLUG,
			defaultId: DEFAULT_ID,
			groupId: 'accent',
			label: 'Renamed Accent',
			reload,
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
		expect(reload).toHaveBeenCalled();
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
				reload: jest.fn(),
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
		reload: jest.fn().mockResolvedValue(undefined),
		refreshFeed: jest.fn().mockResolvedValue({ version: 'v3' }),
		onBusy: jest.fn(),
		onError: jest.fn(),
		...overrides,
	});

	beforeEach(() => {
		client.fetchPalette.mockResolvedValue(defaultView());
		client.savePalette.mockResolvedValue({});
	});

	it('writes the group removal to the default node from a fresh read before any cleanup delete', async () => {
		client.deleteUserPrimitive.mockResolvedValue({});
		const order = [];
		client.savePalette.mockImplementation(async () => {
			order.push('savePalette');
			return {};
		});
		client.deleteUserPrimitive.mockImplementation(async () => {
			order.push('deleteUserPrimitive');
			return {};
		});
		const flowArgs = baseArgs({
			userCreatedTokens: ['primitive.color.custom.custom-1'],
			reload: jest.fn(async () => {
				order.push('reload');
			}),
			refreshFeed: jest.fn(async () => {
				order.push('refreshFeed');
				return { version: 'v3' };
			}),
		});

		await removeGroupFlow(flowArgs);

		expect(order).toEqual(['savePalette', 'reload', 'refreshFeed', 'deleteUserPrimitive', 'refreshFeed']);
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
