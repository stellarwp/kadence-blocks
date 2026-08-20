/* eslint-env jest */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { RegistryProvider } from '@wordpress/data';
import { useLibraries } from '../hooks/use-libraries';
import { fetchLibraries } from '../api/client';
import { createTestRegistry } from '../store/test-utils';

jest.mock('../api/client', () => ({
	fetchLibraries: jest.fn(),
	createLibrary: jest.fn(),
	renameLibrary: jest.fn(),
	deleteLibrary: jest.fn(),
	setActiveLibrary: jest.fn(),
}));

const ROW_A = { slug: 'default', title: '', version: 'v1', document: {} };
const ROW_B = { slug: 'brand', title: 'Brand', version: 'v1', document: {} };

describe('useLibraries', () => {
	let container;
	let root;
	let registry;

	beforeEach(() => {
		jest.clearAllMocks();
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
	});

	// `@wordpress/data`'s resolver dispatch runs off a `setTimeout(fn, 0)` inside the store
	// (see `mapSelectorWithResolver` in `@wordpress/data`'s redux store), a real timer callback that
	// a plain `await act(async () => render())` does not wait for — that promise settles as soon as
	// the synchronous render returns. Flushing one real timer tick after each render/dispatch gives
	// the resolver's callback a turn to run before assertions read the store.
	function flushResolvers() {
		return act(() => new Promise((resolve) => setTimeout(resolve, 0)));
	}

	// A single fixed `flushResolvers()` call assumes the resolution lands within one real timer
	// tick — true under `--runInBand`, but under parallel jest workers, CPU contention from the
	// other worker processes can delay a `setTimeout(0)` callback by an amount a fixed count can't
	// bound. Polling against a wall-clock deadline survives that contention; a genuine regression
	// still fails, just after the deadline instead of after one tick.
	//
	// Flushes at least once before ever checking `predicate` — `isLoading` (the usual predicate
	// here) is `isResolving && !rows.length`, which reads `false` both once resolution has genuinely
	// finished AND before it has even started (nothing is resolving yet at the very first render,
	// since the resolver's own dispatch is itself scheduled via a real timer). Checking first would
	// exit on that pre-start `false` without ever giving the resolver a turn to run.
	async function flushUntil(predicate, timeoutMs = 3000) {
		const deadline = Date.now() + timeoutMs;
		do {
			await flushResolvers();
			if (predicate()) {
				return;
			}
		} while (Date.now() < deadline);
		throw new Error('flushUntil: condition never became true');
	}

	function mountProbe() {
		let latest = null;

		function Probe({ feed, refreshFeed }) {
			latest = useLibraries(feed, refreshFeed);
			return null;
		}

		return {
			render: async (feed, refreshFeed) => {
				await act(() =>
					root.render(
						<RegistryProvider value={registry}>
							<Probe feed={feed} refreshFeed={refreshFeed} />
						</RegistryProvider>
					)
				);
				await flushUntil(() => !latest.isLoading);
			},
			latest: () => latest,
		};
	}

	it('resolves the libraries list on first read, with no fetch-on-mount effect required', async () => {
		fetchLibraries.mockResolvedValueOnce([ROW_A, ROW_B]);

		const probe = mountProbe();
		await probe.render({ slug: 'default' }, jest.fn());

		expect(probe.latest().isLoading).toBe(false);
		expect(probe.latest().libraries.map((row) => row.slug)).toEqual(expect.arrayContaining(['default', 'brand']));
	});

	it('surfaces a getLibraries resolution failure through openError, same as the old mount-effect .catch() did', async () => {
		fetchLibraries.mockRejectedValueOnce(new Error('Something broke'));

		const probe = mountProbe();
		await probe.render({ slug: 'default' }, jest.fn());

		expect(probe.latest().openError).toEqual({ message: 'Something broke' });
	});

	it('two mounted instances share one fetch — the resolver runs once per argument tuple', async () => {
		fetchLibraries.mockResolvedValueOnce([ROW_A]);

		function ProbeA() {
			return useLibraries({ slug: 'default' }, jest.fn()) && null;
		}
		function ProbeB() {
			return useLibraries({ slug: 'default' }, jest.fn()) && null;
		}

		await act(async () =>
			root.render(
				<RegistryProvider value={registry}>
					<ProbeA />
					<ProbeB />
				</RegistryProvider>
			)
		);
		await flushUntil(() => fetchLibraries.mock.calls.length >= 1);

		expect(fetchLibraries).toHaveBeenCalledTimes(1);
	});

	it('keeps isLoading false during a write-triggered background reload once the list has loaded once', async () => {
		fetchLibraries.mockResolvedValueOnce([ROW_A]);

		const probe = mountProbe();
		await probe.render({ slug: 'default' }, jest.fn());

		expect(probe.latest().libraries).toHaveLength(1);
		expect(probe.latest().isLoading).toBe(false);

		let resolveReload;
		fetchLibraries.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					resolveReload = resolve;
				})
		);

		const registryDispatch = registry.dispatch('kadence-blocks/style-library');
		let reloadPromise;
		await act(async () => {
			registryDispatch.invalidateResolution('getLibraries', []);
			reloadPromise = registry.resolveSelect('kadence-blocks/style-library').getLibraries();
		});
		// `resolveSelect()` re-runs the same instrumented selector `select()` uses, which schedules its
		// resolver fulfillment on a real `setTimeout(fn, 0)` (see the `flushResolvers()` comment above) —
		// polling gets `fetchLibraries` actually called and `isResolving` flipped true before the fetch
		// itself settles, regardless of how many real ticks that takes under load.
		await flushUntil(() => fetchLibraries.mock.calls.length >= 2);

		// The reload is genuinely in flight here (`isResolving` is true), but the list already has the
		// one row from the first load, so the dropdown must keep rendering it, not a skeleton.
		expect(fetchLibraries).toHaveBeenCalledTimes(2);
		expect(probe.latest().libraries).toHaveLength(1);
		expect(probe.latest().isLoading).toBe(false);

		await act(async () => {
			resolveReload([ROW_A, ROW_B]);
			await reloadPromise;
		});

		expect(probe.latest().libraries).toHaveLength(2);
		expect(probe.latest().isLoading).toBe(false);
	});

	it('a create flow that calls loadLibraries() sees the refreshed list', async () => {
		fetchLibraries.mockResolvedValueOnce([ROW_A]).mockResolvedValueOnce([ROW_A, ROW_B]);

		const probe = mountProbe();
		await probe.render({ slug: 'default' }, jest.fn());

		expect(probe.latest().libraries).toHaveLength(1);

		const registryDispatch = registry.dispatch('kadence-blocks/style-library');
		registryDispatch.invalidateResolution('getLibraries', []);
		await act(async () => registry.resolveSelect('kadence-blocks/style-library').getLibraries());

		expect(probe.latest().libraries).toHaveLength(2);
	});
});
