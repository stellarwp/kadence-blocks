/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * WordPress dependencies
 */
import { RegistryProvider } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { usePalettes } from '../hooks/use-palettes';
import * as client from '../api/client';
import * as notify from '../helpers/notify';
import { STORE_NAME } from '../store';
import { createTestRegistry } from '../store/test-utils';

// A factory, not bare automocking: the real module imports `@wordpress/api-fetch`, which is
// externalized to the `wp.apiFetch` global in production and is not installed as an npm
// dependency, so automocking (which loads the real module to introspect its shape) would fail to
// resolve it.
jest.mock('../api/client', () => ({
	createUserPrimitive: jest.fn(),
	deletePalette: jest.fn(),
	deleteSwatch: jest.fn(),
	deleteUserPrimitive: jest.fn(),
	fetchPalette: jest.fn(),
	fetchPalettes: jest.fn(),
	savePalette: jest.fn(),
	saveSwatch: jest.fn(),
	setCurrentPalette: jest.fn(),
}));

jest.mock('../helpers/notify');

const NAMESPACE = 'kb-design-tokens/v1';
const SLUG = 'default';
const DEFAULT_ID = 'default';
const SUNSET_ID = 'sunset';

const FEED = { slug: SLUG, version: 'v1', rest: { namespace: NAMESPACE }, schema: {} };

const defaultView = () => ({
	id: DEFAULT_ID,
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
	id: SUNSET_ID,
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

// The wire shape `getPaletteListing`'s resolver dispatches and every write's own response carries:
// a flat, fully embedded palette listing. Mirrors `palette-flows.test.js`'s identical fixture.
const listingRows = (overrides = {}) => [
	{
		id: DEFAULT_ID,
		label: 'Default',
		is_default: true,
		is_current: overrides.currentId ? overrides.currentId === DEFAULT_ID : true,
		user_created: false,
		_embedded: { self: [overrides.defaultView ? overrides.defaultView() : defaultView()] },
	},
	{
		id: SUNSET_ID,
		label: 'Sunset',
		is_default: false,
		is_current: overrides.currentId === SUNSET_ID,
		user_created: false,
		_embedded: { self: [selectedView()] },
	},
];

describe('usePalettes', () => {
	let container;
	let root;
	let registry;

	beforeEach(() => {
		jest.clearAllMocks();
		// Fakes `setTimeout`/`setInterval`/`clearTimeout`, so `flushUntil()` below can advance
		// `@wordpress/data`'s resolver dispatch deterministically instead of racing a real OS timer
		// tick against whatever else is contending for the CPU. `Date`/`performance` are excluded:
		// React's own scheduler uses those to make time-slicing decisions, and freezing them (Jest's
		// default) leaves it unable to ever decide enough time has passed to flush a commit, hanging
		// real writes that depend on a state update actually landing.
		jest.useFakeTimers({ doNotFake: ['Date', 'performance', 'queueMicrotask', 'nextTick'] });
		registry = createTestRegistry();
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		delete global.IS_REACT_ACT_ENVIRONMENT;
		jest.useRealTimers();
	});

	// `@wordpress/data`'s resolver dispatch runs off a `setTimeout(fn, 0)` inside the store — a real
	// timer callback a plain `await act(async () => ...)` does not wait for. `runOnlyPendingTimersAsync`
	// fires whatever resolver dispatch is currently pending and lets the promise chain it kicks off
	// drain via the real microtask queue before returning.
	function flushResolvers() {
		return act(() => jest.runOnlyPendingTimersAsync());
	}

	// Bounded by an attempt count, not a wall-clock deadline — fake timers make every hop
	// deterministic, so this is a fixed number of resolver hops to wait out.
	async function flushUntil(predicate, maxAttempts = 10) {
		for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
			await flushResolvers();
			if (predicate()) {
				return;
			}
		}
		throw new Error('flushUntil: condition never became true');
	}

	function mountProbe() {
		let latest = null;

		function Probe({ feed, refreshFeed, route, navigate }) {
			latest = usePalettes(feed, refreshFeed, route, navigate);
			return null;
		}

		return {
			render: async ({
				feed = FEED,
				refreshFeed = jest.fn().mockResolvedValue(undefined),
				route = { scope: '' },
				navigate = jest.fn(),
			} = {}) => {
				await act(() =>
					root.render(
						<RegistryProvider value={registry}>
							<Probe feed={feed} refreshFeed={refreshFeed} route={route} navigate={navigate} />
						</RegistryProvider>
					)
				);
				await flushUntil(() => !latest.isLoading);

				return { refreshFeed, navigate };
			},
			latest: () => latest,
		};
	}

	it('resolves the listing and derives the edited palette for the $current id', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const probe = mountProbe();
		await probe.render();

		expect(probe.latest().activeId).toBe(DEFAULT_ID);
		expect(probe.latest().editingId).toBe(DEFAULT_ID);
		expect(probe.latest().palette).toMatchObject({ id: DEFAULT_ID, label: 'Default' });
		expect(probe.latest().palette.groups[0].swatches[0].$value).toBe('#111111');
	});

	it('isLoading is already true on the very first render, before the resolver dispatch has fired', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		let latest = null;

		function Probe({ feed, route, navigate }) {
			latest = usePalettes(feed, jest.fn().mockResolvedValue(undefined), route, navigate);
			return null;
		}

		// `@wordpress/data`'s resolver dispatch is scheduled via `setTimeout(fn, 0)`, so this render
		// happens strictly before that dispatch fires — `isResolving` would still read `false` here,
		// which is exactly the one-frame "not loading" flash `hasFinishedResolution` must avoid.
		await act(() =>
			root.render(
				<RegistryProvider value={registry}>
					<Probe feed={FEED} route={{ scope: '' }} navigate={jest.fn()} />
				</RegistryProvider>
			)
		);

		expect(latest.isLoading).toBe(true);

		await flushUntil(() => !latest.isLoading);
	});

	it('surfaces a getPaletteListing resolution failure through openError', async () => {
		client.fetchPalettes.mockRejectedValueOnce(new Error('Something broke'));

		const probe = mountProbe();
		await probe.render();

		expect(probe.latest().openError).toEqual({ message: 'Something broke' });
	});

	it('activatePalette dispatches the write response via onReceive, moving activeId and palette together', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.setCurrentPalette.mockResolvedValueOnce(listingRows({ currentId: SUNSET_ID }));

		const probe = mountProbe();
		const { refreshFeed } = await probe.render();

		expect(probe.latest().activeId).toBe(DEFAULT_ID);

		await act(async () => probe.latest().activatePalette(SUNSET_ID));

		expect(client.setCurrentPalette).toHaveBeenCalledWith(NAMESPACE, SUNSET_ID, SLUG);
		expect(refreshFeed).toHaveBeenCalledWith(SLUG);
		expect(probe.latest().activeId).toBe(SUNSET_ID);
		// The route's scope is still '' in this test (navigate is mocked, not wired to a real route),
		// so editingId keeps tracking $current — the same palette activatePalette just moved.
		expect(probe.latest().palette).toMatchObject({ id: SUNSET_ID });
		expect(notify.notifySuccess).toHaveBeenCalledWith('Palette activated.');
	});

	it('activatePalette does not notify success when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.setCurrentPalette.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		await act(async () =>
			probe
				.latest()
				.activatePalette(SUNSET_ID)
				.catch(() => {})
		);

		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('createPalette dispatches the new listing via onReceive before navigating to the new palette', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.fetchPalette.mockResolvedValueOnce(defaultView());

		const createdRows = [
			...listingRows(),
			{
				id: 'brand',
				label: 'Brand',
				is_default: false,
				is_current: false,
				user_created: true,
				_embedded: { self: [{ id: 'brand', label: 'Brand', groups: defaultView().groups }] },
			},
		];
		client.savePalette.mockResolvedValueOnce(createdRows);

		const probe = mountProbe();
		const { navigate } = await probe.render();

		await act(async () => probe.latest().createPalette('Brand'));

		expect(client.savePalette).toHaveBeenCalledWith(
			NAMESPACE,
			'brand',
			expect.objectContaining({ label: 'Brand' }),
			SLUG
		);
		expect(navigate).toHaveBeenCalledWith({ scope: 'brand', item: '' });
		expect(probe.latest().listing.palettes.map((row) => row.id)).toEqual(
			expect.arrayContaining(['default', 'sunset', 'brand'])
		);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Palette created.');
	});

	it('createPalette does not notify success on a duplicate label', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const probe = mountProbe();
		await probe.render();

		await act(async () =>
			probe
				.latest()
				.createPalette('Sunset')
				.catch(() => {})
		);

		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('removePalette dispatches the post-delete listing via onReceive, dropping the removed row', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.deletePalette.mockResolvedValueOnce([listingRows()[0]]);

		const probe = mountProbe();
		await probe.render();

		expect(probe.latest().listing.palettes).toHaveLength(2);

		await act(async () => probe.latest().deletePalette(SUNSET_ID));

		expect(client.deletePalette).toHaveBeenCalledWith(NAMESPACE, SUNSET_ID, SLUG);
		expect(probe.latest().listing.palettes.map((row) => row.id)).toEqual([DEFAULT_ID]);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Palette deleted.');
	});

	it('removePalette does not notify success when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.deletePalette.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		await act(async () =>
			probe
				.latest()
				.deletePalette(SUNSET_ID)
				.catch(() => {})
		);

		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('renamePalette dispatches the renamed listing via onReceive and notifies success', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.fetchPalette.mockResolvedValueOnce(selectedView());

		const renamedRows = listingRows();
		renamedRows[1] = { ...renamedRows[1], label: 'Dusk' };
		client.savePalette.mockResolvedValueOnce(renamedRows);

		const probe = mountProbe();
		await probe.render();

		await act(async () => probe.latest().renamePalette(SUNSET_ID, 'Dusk'));

		expect(client.savePalette).toHaveBeenCalledWith(
			NAMESPACE,
			SUNSET_ID,
			expect.objectContaining({ label: 'Dusk' }),
			SLUG
		);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Palette renamed.');
	});

	it('renamePalette does not notify success on an empty label', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const probe = mountProbe();
		await probe.render();

		await act(async () =>
			probe
				.latest()
				.renamePalette(SUNSET_ID, '')
				.catch(() => {})
		);

		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('renameGroup dispatches the renamed listing via onReceive and notifies success', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.fetchPalette.mockResolvedValueOnce(defaultView());

		const renamedRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [{ ...defaultView().groups[0], label: 'Accents' }],
			}),
		});
		client.savePalette.mockResolvedValueOnce(renamedRows);

		const probe = mountProbe();
		await probe.render();

		await act(async () => probe.latest().renameGroup('accent', 'Accents'));

		expect(client.savePalette).toHaveBeenCalledWith(NAMESPACE, DEFAULT_ID, expect.any(Object), SLUG);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Color group renamed.');
	});

	it('renameGroup does not notify success when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.fetchPalette.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		await act(async () =>
			probe
				.latest()
				.renameGroup('accent', 'Accents')
				.catch(() => {})
		);

		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('saveSwatchEdits dispatches the recolored view via onReceive, updating the edited palette', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const recoloredRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [
					{
						...defaultView().groups[0],
						swatches: [
							{ ...defaultView().groups[0].swatches[0], $value: '#abcabc' },
							defaultView().groups[0].swatches[1],
						],
					},
				],
			}),
		});
		client.saveSwatch.mockResolvedValueOnce(recoloredRows);

		const probe = mountProbe();
		await probe.render();

		await act(async () =>
			probe
				.latest()
				.saveSwatchEdits(
					'primitive.color.brand.primary',
					{ label: 'Main 1', value: '#abcabc' },
					{ label: 'Main 1', value: '#111111' }
				)
		);

		expect(client.saveSwatch).toHaveBeenCalledWith(
			NAMESPACE,
			DEFAULT_ID,
			'primitive.color.brand.primary',
			{ value: '#abcabc' },
			SLUG
		);
		expect(probe.latest().palette.groups[0].swatches[0].$value).toBe('#abcabc');
	});

	it('saveSwatchEdits applies the draft optimistically, then settles on the confirmed response and notifies success', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const recoloredRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [
					{
						...defaultView().groups[0],
						swatches: [
							{ ...defaultView().groups[0].swatches[0], $value: '#abcabc' },
							defaultView().groups[0].swatches[1],
						],
					},
				],
			}),
		});
		client.saveSwatch.mockResolvedValueOnce(recoloredRows);

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.saveSwatchEdits(
					'primitive.color.brand.primary',
					{ label: 'Main 1', value: '#abcabc' },
					{ label: 'Main 1', value: '#111111' }
				);
		});

		// Applied immediately, before the write settles — the draft's value, not the pre-save one.
		expect(probe.latest().palette.groups[0].swatches[0]).toMatchObject({ $value: '#abcabc' });

		await act(async () => writePromise);

		// The real response's row is what onReceive dispatched, and the optimistic patch has cleared.
		expect(probe.latest().palette.groups[0].swatches[0]).toMatchObject({ $value: '#abcabc' });
		expect(notify.notifySuccess).toHaveBeenCalledWith('Swatch saved.');
		expect(notify.notifyError).not.toHaveBeenCalled();
	});

	it('saveSwatchEdits reverts the optimistic draft and notifies an error when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.saveSwatch.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.saveSwatchEdits(
					'primitive.color.brand.primary',
					{ label: 'Main 1', value: '#abcabc' },
					{ label: 'Main 1', value: '#111111' }
				)
				.catch(() => {});
		});

		expect(probe.latest().palette.groups[0].swatches[0]).toMatchObject({ $value: '#abcabc' });

		await act(async () => writePromise);

		// The optimistic patch clears and the palette reverts to its pre-save values once the write rejects.
		expect(probe.latest().palette.groups[0].swatches[0]).toMatchObject({ $value: '#111111' });
		expect(notify.notifyError).toHaveBeenCalledWith('Conflict');
		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('removeSwatch flags the target swatch pendingDelete immediately, before the write resolves', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		let resolveFetchPalette;
		client.fetchPalette.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveFetchPalette = resolve;
			})
		);

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe.latest().removeSwatch('primitive.color.brand.primary');
		});

		// Still present in `palette.groups`, only flagged — never an instant vanish.
		const swatches = probe.latest().palette.groups[0].swatches;
		expect(swatches).toHaveLength(2);
		expect(swatches.find((swatch) => swatch.token === 'primitive.color.brand.primary')).toMatchObject({
			pendingDelete: true,
		});

		const strippedRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [
					{
						...defaultView().groups[0],
						swatches: [defaultView().groups[0].swatches[1]],
					},
				],
			}),
		});
		client.savePalette.mockResolvedValueOnce(strippedRows);
		resolveFetchPalette(defaultView());

		await act(async () => writePromise);

		expect(
			probe.latest().palette.groups[0].swatches.some((swatch) => swatch.token === 'primitive.color.brand.primary')
		).toBe(false);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Swatch deleted.');
		expect(notify.notifyError).not.toHaveBeenCalled();
	});

	it('removeSwatch clears pendingDelete and keeps the swatch when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.fetchPalette.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.removeSwatch('primitive.color.brand.primary')
				.catch(() => {});
		});

		expect(
			probe.latest().palette.groups[0].swatches.find((swatch) => swatch.token === 'primitive.color.brand.primary')
		).toMatchObject({ pendingDelete: true });

		await act(async () => writePromise);

		const swatch = probe
			.latest()
			.palette.groups[0].swatches.find((swatch) => swatch.token === 'primitive.color.brand.primary');
		// The overlay has nothing pending anymore, so `applyOptimisticOverlay` returns the original
		// palette unchanged rather than a copy carrying an explicit `pendingDelete: false` — it never
		// had a `pendingDelete` key to begin with.
		expect(swatch.pendingDelete).toBeFalsy();
		expect(swatch).toMatchObject({ label: 'Main 1', $value: '#111111' });
		expect(notify.notifyError).toHaveBeenCalledWith('Conflict');
		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('isSwatchCustom recognizes a custom-color-prefixed token, and rejects a baseline one', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const probe = mountProbe();
		await probe.render();

		expect(probe.latest().isSwatchCustom('primitive.color.custom.custom-1')).toBe(true);
		expect(probe.latest().isSwatchCustom('primitive.color.brand.primary')).toBe(false);
	});

	it('resetSwatch calls deleteSwatch against the palette being edited, not the default palette, and updates the listing on success', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const probe = mountProbe();
		await probe.render({ route: { scope: SUNSET_ID } });

		expect(probe.latest().editingId).toBe(SUNSET_ID);

		const revertedRows = listingRows({
			currentId: SUNSET_ID,
			defaultView: () => defaultView(),
		});
		revertedRows[1]._embedded.self[0].groups[0].swatches[0] = {
			...selectedView().groups[0].swatches[0],
			$value: '#111111',
			overridden: false,
		};
		client.deleteSwatch.mockResolvedValueOnce(revertedRows);

		await act(async () => probe.latest().resetSwatch('primitive.color.brand.primary'));

		expect(client.deleteSwatch).toHaveBeenCalledWith(NAMESPACE, SUNSET_ID, 'primitive.color.brand.primary', SLUG);
		expect(probe.latest().palette.groups[0].swatches[0]).toMatchObject({ $value: '#111111', overridden: false });
		expect(notify.notifySuccess).toHaveBeenCalledWith('Swatch reset.');
		expect(notify.notifyError).not.toHaveBeenCalled();
	});

	it('resetSwatch surfaces the error and leaves the override in place when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.deleteSwatch.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render({ route: { scope: SUNSET_ID } });

		await act(async () =>
			probe
				.latest()
				.resetSwatch('primitive.color.brand.primary')
				.catch(() => {})
		);

		expect(probe.latest().palette.groups[0].swatches[0]).toMatchObject({ $value: '#999999', overridden: true });
		expect(notify.notifyError).toHaveBeenCalledWith('Conflict');
		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('resetSwatch rejects synchronously, without calling deleteSwatch, when editing the default palette', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const probe = mountProbe();
		await probe.render();

		expect(probe.latest().editingId).toBe(DEFAULT_ID);

		await expect(probe.latest().resetSwatch('primitive.color.brand.primary')).rejects.toThrow();

		expect(client.deleteSwatch).not.toHaveBeenCalled();
	});

	it('removeGroup flags every swatch in that group pendingDelete immediately, before the write resolves', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		let resolveFetchPalette;
		client.fetchPalette.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveFetchPalette = resolve;
			})
		);

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe.latest().removeGroup('accent');
		});

		// Still present in `palette.groups`, only flagged — never an instant vanish.
		const groups = probe.latest().palette.groups;
		expect(groups).toHaveLength(1);
		const accentGroup = groups.find((group) => group.id === 'accent');
		expect(accentGroup).toBeDefined();
		// Every swatch in the group should be flagged pendingDelete.
		expect(accentGroup.swatches).toHaveLength(2);
		expect(accentGroup.swatches[0]).toMatchObject({ pendingDelete: true });
		expect(accentGroup.swatches[1]).toMatchObject({ pendingDelete: true });

		const strippedRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [],
			}),
		});
		client.savePalette.mockResolvedValueOnce(strippedRows);
		resolveFetchPalette(defaultView());

		await act(async () => writePromise);

		// Group is now gone entirely.
		expect(probe.latest().palette.groups).toHaveLength(0);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Color group deleted.');
		expect(notify.notifyError).not.toHaveBeenCalled();
	});

	it('removeGroup clears pendingDelete and keeps all swatches when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.fetchPalette.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.removeGroup('accent')
				.catch(() => {});
		});

		const accentGroup = probe.latest().palette.groups.find((group) => group.id === 'accent');
		expect(accentGroup.swatches[0]).toMatchObject({ pendingDelete: true });
		expect(accentGroup.swatches[1]).toMatchObject({ pendingDelete: true });

		await act(async () => writePromise);

		// Group still exists with swatches restored to normal.
		const restoredGroup = probe.latest().palette.groups.find((group) => group.id === 'accent');
		expect(restoredGroup).toBeDefined();
		expect(restoredGroup.swatches).toHaveLength(2);
		// pendingDelete flags should be cleared.
		expect(restoredGroup.swatches[0].pendingDelete).toBeFalsy();
		expect(restoredGroup.swatches[1].pendingDelete).toBeFalsy();
		expect(restoredGroup.swatches[0]).toMatchObject({ label: 'Main 1', $value: '#111111' });
		expect(restoredGroup.swatches[1]).toMatchObject({ label: 'Main 2', $value: '#222222' });
		expect(notify.notifyError).toHaveBeenCalledWith('Conflict');
		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('addColor shows the new swatch immediately and flags its group as adding, before the write resolves', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		let resolveCreateUserPrimitive;
		client.createUserPrimitive.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveCreateUserPrimitive = resolve;
			})
		);

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe.latest().addColor('accent');
		});

		// The optimistic swatch is present immediately, with the group's last color's value and no
		// duplicate.
		const swatches = probe.latest().palette.groups[0].swatches;
		expect(swatches).toHaveLength(3);
		expect(swatches[2]).toMatchObject({
			token: 'primitive.color.custom.custom-1',
			label: 'New Color',
			$value: '#222222',
		});
		expect(probe.latest().addingGroupIds).toEqual(['accent']);

		client.fetchPalette.mockResolvedValueOnce(defaultView());
		const addedRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [
					{
						...defaultView().groups[0],
						swatches: [
							...defaultView().groups[0].swatches,
							{ token: 'primitive.color.custom.custom-1', label: 'New Color', $value: '#222222' },
						],
					},
				],
			}),
		});
		client.savePalette.mockResolvedValueOnce(addedRows);
		resolveCreateUserPrimitive({ id: 'primitive.color.custom.custom-1', version: 'v2' });

		await act(async () => writePromise);

		// The real (confirmed) listing's swatch is what remains — same token, no duplicate.
		const settledSwatches = probe.latest().palette.groups[0].swatches;
		expect(settledSwatches).toHaveLength(3);
		expect(settledSwatches.filter((swatch) => swatch.token === 'primitive.color.custom.custom-1')).toHaveLength(1);
		expect(probe.latest().addingGroupIds).toEqual([]);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Color added.');
		expect(notify.notifyError).not.toHaveBeenCalled();
	});

	it('addColor removes the optimistic swatch and clears addingGroupIds when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.createUserPrimitive.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.addColor('accent')
				.catch(() => {});
		});

		expect(probe.latest().palette.groups[0].swatches).toHaveLength(3);
		expect(probe.latest().addingGroupIds).toEqual(['accent']);

		await act(async () => writePromise);

		expect(probe.latest().palette.groups[0].swatches).toHaveLength(2);
		expect(probe.latest().addingGroupIds).toEqual([]);
		expect(notify.notifyError).toHaveBeenCalledWith('Conflict');
		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('addColor renders the new swatch exactly once during the window between onReceive and the overlay clearing', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.createUserPrimitive.mockResolvedValueOnce({ id: 'primitive.color.custom.custom-1', version: 'v2' });
		client.fetchPalette.mockResolvedValueOnce(defaultView());

		const addedRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [
					{
						...defaultView().groups[0],
						swatches: [
							...defaultView().groups[0].swatches,
							{ token: 'primitive.color.custom.custom-1', label: 'New Color', $value: '#222222' },
						],
					},
				],
			}),
		});
		client.savePalette.mockResolvedValueOnce(addedRows);

		// `refreshFeed` is held open, mirroring the write chain's real `savePalette → onReceive →
		// refreshFeed` order: `onReceive` (which dispatches the confirmed listing into the store)
		// runs BEFORE this promise resolves, so the window it opens up is observable.
		let resolveRefreshFeed;
		const refreshFeed = jest.fn().mockReturnValueOnce(
			new Promise((resolve) => {
				resolveRefreshFeed = resolve;
			})
		);

		const probe = mountProbe();
		await probe.render({ refreshFeed });

		let writePromise;
		act(() => {
			writePromise = probe.latest().addColor('accent');
		});

		await flushUntil(
			() =>
				probe
					.latest()
					.palette.groups[0].swatches.filter((swatch) => swatch.token === 'primitive.color.custom.custom-1')
					.length > 0
		);

		// The real listing already carries the confirmed row (onReceive has dispatched it), and the
		// optimistic overlay has not been cleared yet (still inside refreshFeed) — the swatch must
		// render exactly once, not twice.
		expect(
			probe
				.latest()
				.palette.groups[0].swatches.filter((swatch) => swatch.token === 'primitive.color.custom.custom-1')
		).toHaveLength(1);

		resolveRefreshFeed(undefined);
		await act(async () => writePromise);

		expect(
			probe
				.latest()
				.palette.groups[0].swatches.filter((swatch) => swatch.token === 'primitive.color.custom.custom-1')
		).toHaveLength(1);
	});

	it('addGroup shows the new group and its placeholder swatch immediately, before the write resolves', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		let resolveCreateUserPrimitive;
		client.createUserPrimitive.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveCreateUserPrimitive = resolve;
			})
		);

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe.latest().addGroup('Muted');
		});

		// The optimistic group is present immediately, with its placeholder swatch.
		const groups = probe.latest().palette.groups;
		expect(groups).toHaveLength(2);
		const mutedGroup = groups.find((group) => group.id === 'muted');
		expect(mutedGroup).toMatchObject({ id: 'muted', label: 'Muted' });
		expect(mutedGroup.swatches).toHaveLength(1);
		expect(mutedGroup.swatches[0]).toMatchObject({
			token: 'primitive.color.custom.custom-1',
			label: 'New Color',
			$value: '#000000',
		});

		client.fetchPalette.mockResolvedValueOnce(defaultView());
		const addedRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [
					...defaultView().groups,
					{
						id: 'muted',
						label: 'Muted',
						swatches: [{ token: 'primitive.color.custom.custom-1', label: 'New Color', $value: '#000000' }],
					},
				],
			}),
		});
		client.savePalette.mockResolvedValueOnce(addedRows);
		resolveCreateUserPrimitive({ id: 'primitive.color.custom.custom-1', version: 'v2' });

		await act(async () => writePromise);

		// The real (confirmed) listing's group is what remains — same id, no duplicate.
		const settledGroups = probe.latest().palette.groups;
		expect(settledGroups).toHaveLength(2);
		expect(settledGroups.filter((group) => group.id === 'muted')).toHaveLength(1);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Color group added.');
		expect(notify.notifyError).not.toHaveBeenCalled();
	});

	it('addGroup removes the optimistic group when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.createUserPrimitive.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.addGroup('Muted')
				.catch(() => {});
		});

		expect(probe.latest().palette.groups.some((group) => group.id === 'muted')).toBe(true);

		await act(async () => writePromise);

		expect(probe.latest().palette.groups.some((group) => group.id === 'muted')).toBe(false);
		expect(notify.notifyError).toHaveBeenCalledWith('Conflict');
		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('addGroup rejects synchronously for a duplicate label, without ever applying an optimistic addition', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const probe = mountProbe();
		await probe.render();

		const dispatchSpy = jest.spyOn(registry.dispatch(STORE_NAME), 'setOptimisticAddition');

		await expect(probe.latest().addGroup('Accent')).rejects.toThrow('A color group with that name already exists.');

		expect(dispatchSpy).not.toHaveBeenCalled();
		expect(client.createUserPrimitive).not.toHaveBeenCalled();
		expect(probe.latest().palette.groups).toHaveLength(1);
	});

	it('addGroup rejects synchronously for an empty label, without ever applying an optimistic addition', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		const probe = mountProbe();
		await probe.render();

		const dispatchSpy = jest.spyOn(registry.dispatch(STORE_NAME), 'setOptimisticAddition');

		await expect(probe.latest().addGroup('')).rejects.toThrow('Enter a color group name.');

		expect(dispatchSpy).not.toHaveBeenCalled();
		expect(client.createUserPrimitive).not.toHaveBeenCalled();
		expect(probe.latest().palette.groups).toHaveLength(1);
	});

	it('reorderSwatches applies the new order optimistically, then keeps it once the write resolves', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.fetchPalette.mockResolvedValueOnce(defaultView());

		const reorderedRows = listingRows({
			defaultView: () => ({
				...defaultView(),
				groups: [
					{
						...defaultView().groups[0],
						swatches: [...defaultView().groups[0].swatches].reverse(),
					},
				],
			}),
		});
		client.savePalette.mockResolvedValueOnce(reorderedRows);

		const probe = mountProbe();
		await probe.render();

		const originalOrder = probe.latest().palette.groups[0].swatches.map((s) => s.token);
		const newOrder = [...originalOrder].reverse();

		let writePromise;
		act(() => {
			writePromise = probe.latest().reorderSwatches('accent', newOrder);
		});

		// Applied immediately, before the write settles.
		expect(probe.latest().palette.groups[0].swatches.map((s) => s.token)).toEqual(newOrder);

		await act(async () => writePromise);

		expect(client.savePalette).toHaveBeenCalled();
		expect(probe.latest().palette.groups[0].swatches.map((s) => s.token)).toEqual(newOrder);
		expect(probe.latest().structureError).toBeNull();
	});

	it('reorderSwatches rolls back the optimistic order when the write fails', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.fetchPalette.mockResolvedValueOnce(defaultView());
		client.savePalette.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		const originalOrder = probe.latest().palette.groups[0].swatches.map((s) => s.token);
		const newOrder = [...originalOrder].reverse();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.reorderSwatches('accent', newOrder)
				.catch(() => {});
		});

		expect(probe.latest().palette.groups[0].swatches.map((s) => s.token)).toEqual(newOrder);

		await act(async () => writePromise);

		expect(probe.latest().palette.groups[0].swatches.map((s) => s.token)).toEqual(originalOrder);
		expect(probe.latest().structureError).toEqual({ message: 'Conflict' });
	});

	it('composes a pending optimistic reorder with a different pending optimistic action without reverting the reorder', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());

		// Neither write's own `fetchPalette`/`savePalette` call ever resolves in this test — the
		// point is to observe the state WHILE both are still in flight, so nothing here needs a
		// settled value.
		client.fetchPalette.mockReturnValue(new Promise(() => {}));

		const probe = mountProbe();
		await probe.render();

		const originalOrder = probe.latest().palette.groups[0].swatches.map((s) => s.token);
		const newOrder = [...originalOrder].reverse();

		act(() => {
			// Fire-and-forget: this promise is never awaited to settle in this test.
			probe.latest().reorderSwatches('accent', newOrder);
		});

		// The reorder's optimistic order is applied immediately.
		expect(probe.latest().palette.groups[0].swatches.map((s) => s.token)).toEqual(newOrder);

		act(() => {
			// A DIFFERENT optimistic action, on a swatch the reorder does not touch, while the
			// reorder's own write is still pending. This must not clear the reorder's local override.
			probe.latest().removeSwatch('primitive.color.brand.secondary');
		});

		// The reorder's order is still visible — the unrelated delete's optimistic overlay must not
		// have reset the pending reorder override.
		expect(probe.latest().palette.groups[0].swatches.map((s) => s.token)).toEqual(newOrder);
	});

	it('two mounted instances (a screen and its settings panel) share one listing fetch and stay in sync', async () => {
		client.fetchPalettes.mockResolvedValueOnce(listingRows());
		client.setCurrentPalette.mockResolvedValueOnce(listingRows({ currentId: SUNSET_ID }));

		let latestA = null;
		let latestB = null;
		const refreshFeed = jest.fn().mockResolvedValue(undefined);

		function ProbeA() {
			latestA = usePalettes(FEED, refreshFeed, { scope: '' }, jest.fn());
			return null;
		}
		function ProbeB() {
			latestB = usePalettes(FEED, refreshFeed, { scope: '' }, jest.fn());
			return null;
		}

		await act(async () =>
			root.render(
				<RegistryProvider value={registry}>
					<ProbeA />
					<ProbeB />
				</RegistryProvider>
			)
		);
		await flushUntil(() => !latestA.isLoading && !latestB.isLoading);

		expect(client.fetchPalettes).toHaveBeenCalledTimes(1);

		await act(async () => latestA.activatePalette(SUNSET_ID));

		expect(latestA.activeId).toBe(SUNSET_ID);
		expect(latestB.activeId).toBe(SUNSET_ID);
	});
});
