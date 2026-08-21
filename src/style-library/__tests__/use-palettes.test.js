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
import { createTestRegistry } from '../store/test-utils';

// A factory, not bare automocking: the real module imports `@wordpress/api-fetch`, which is
// externalized to the `wp.apiFetch` global in production and is not installed as an npm
// dependency, so automocking (which loads the real module to introspect its shape) would fail to
// resolve it.
jest.mock('../api/client', () => ({
	createUserPrimitive: jest.fn(),
	deletePalette: jest.fn(),
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
