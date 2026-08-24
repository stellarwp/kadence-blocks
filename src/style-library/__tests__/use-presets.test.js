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
import { usePresets } from '../hooks/use-presets';
import { BUTTON_PRESET } from '../presets/button-preset';
import { fetchBlockPresets } from '../api/client';
import { createTestRegistry } from '../store/test-utils';
import { STORE_NAME } from '../store';

jest.mock('../api/client', () => ({
	fetchBlockPresets: jest.fn(),
}));

const LIBRARY_A = { rest: { namespace: 'kb-design-tokens/v1' }, slug: 'default', values: {} };
const LIBRARY_B = { rest: { namespace: 'kb-design-tokens/v1' }, slug: 'brand', values: {} };

const PAYLOAD_A = { version: 'a1', default: 'primary', presets: { primary: { label: 'Primary', tokens: {} } } };
const PAYLOAD_B = { version: 'b1', default: 'primary', presets: { primary: { label: 'Brand Primary', tokens: {} } } };

describe('usePresets', () => {
	let container;
	let root;
	let registry;

	beforeEach(() => {
		jest.clearAllMocks();
		// Fakes `setTimeout`/`setInterval`/`clearTimeout`, so `flushResolvers()` below can advance
		// `@wordpress/data`'s resolver dispatch deterministically instead of racing a real OS timer
		// tick against whatever else is contending for the CPU. `Date`/`performance` are excluded:
		// React's own scheduler uses those to make time-slicing decisions, and freezing them (Jest's
		// default) leaves it unable to ever decide enough time has passed to flush a commit, hanging
		// real writes that depend on a state update actually landing. See `use-palettes.test.js` for
		// the same setup and the investigation behind it.
		jest.useFakeTimers({ doNotFake: ['Date', 'performance', 'queueMicrotask', 'nextTick'] });
		registry = createTestRegistry();
		global.IS_REACT_ACT_ENVIRONMENT = true;
		window.kadenceDesignTokens = {
			presets: {
				'kadence/singlebtn': {
					properties: ['button-bg', 'button-text', 'button-bg-hover', 'button-text-hover', 'button-radius'],
				},
			},
		};
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		delete global.IS_REACT_ACT_ENVIRONMENT;
		delete window.kadenceDesignTokens;
		jest.useRealTimers();
	});

	// `@wordpress/data`'s resolver dispatch runs off a `setTimeout(fn, 0)` inside the store (see
	// `mapSelectorWithResolver` in `@wordpress/data`'s redux store), a real timer callback that a
	// plain `await act(async () => render())` does not wait for. `runOnlyPendingTimersAsync` fires
	// whatever resolver dispatch is currently pending and lets the promise chain it kicks off (the
	// mocked fetch resolving, its `.then()`, the store dispatch) drain via the real microtask queue
	// before returning — deterministically, with no dependency on real wall-clock time. This helper
	// is called from contexts that deliberately expect the resolution to still be pending (e.g.
	// "switching to a not-yet-resolved library shows loading with no stale data" below, where the
	// mock is a promise that never resolves) — calling it there is a safe no-op past the one pending
	// timer it does find and fire. See `use-palettes.test.js`'s identical helper for why
	// `advanceTimersByTimeAsync(0)` doesn't work here instead (a resolver's callback can itself
	// schedule a second resolver's timer from deeper inside a promise chain, which that API doesn't
	// reliably pick up within the same call).
	function flushResolvers() {
		return act(() => jest.runOnlyPendingTimersAsync());
	}

	function mountProbe() {
		let latest = null;

		function Probe({ library }) {
			latest = usePresets(library, BUTTON_PRESET);
			return null;
		}

		return {
			render: async (library) => {
				await act(() =>
					root.render(
						<RegistryProvider value={registry}>
							<Probe library={library} />
						</RegistryProvider>
					)
				);
				await flushResolvers();
			},
			latest: () => latest,
		};
	}

	it('resolves a library’s presets and exposes them', async () => {
		fetchBlockPresets.mockResolvedValueOnce(PAYLOAD_A);

		const probe = mountProbe();
		await probe.render(LIBRARY_A);

		expect(probe.latest().payload).toEqual(PAYLOAD_A);
		expect(probe.latest().initialValuesFor('primary')).not.toBeNull();
	});

	it('isLoading is already true on the very first render, before the resolver dispatch has fired', async () => {
		fetchBlockPresets.mockResolvedValueOnce(PAYLOAD_A);

		let latest = null;

		function Probe({ library }) {
			latest = usePresets(library, BUTTON_PRESET);
			return null;
		}

		// `@wordpress/data`'s resolver dispatch is scheduled via `setTimeout(fn, 0)`, so this render
		// happens strictly before that dispatch fires — `isResolving` would still read `false` here,
		// which is exactly the one-frame "not loading" flash `hasFinishedResolution` must avoid.
		await act(() =>
			root.render(
				<RegistryProvider value={registry}>
					<Probe library={LIBRARY_A} />
				</RegistryProvider>
			)
		);

		expect(latest.isLoading).toBe(true);
		expect(latest.payload).toBeNull();

		await act(() => jest.runOnlyPendingTimersAsync());
	});

	it('switching to a not-yet-resolved library shows loading with no stale data', async () => {
		fetchBlockPresets.mockResolvedValueOnce(PAYLOAD_A);

		const probe = mountProbe();
		await probe.render(LIBRARY_A);

		let resolveB;
		fetchBlockPresets.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveB = resolve;
			})
		);

		await probe.render(LIBRARY_B);

		expect(probe.latest().payload).toBeNull();
		expect(probe.latest().isLoading).toBe(true);
		expect(probe.latest().initialValuesFor('primary')).toBeNull();

		await act(async () => resolveB(PAYLOAD_B));

		expect(probe.latest().payload).toEqual(PAYLOAD_B);
		expect(probe.latest().isLoading).toBe(false);
	});

	it('keeps the payload on screen while an invalidation re-resolves the same library', async () => {
		fetchBlockPresets.mockResolvedValueOnce(PAYLOAD_A);

		const probe = mountProbe();
		await probe.render(LIBRARY_A);

		let resolveNext;
		fetchBlockPresets.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveNext = resolve;
			})
		);

		// Simulates what `usePresetScreen`'s wrapped `refreshFeed` now does after a write.
		act(() => {
			registry
				.dispatch(STORE_NAME)
				.invalidateResolution('getBlockPresets', ['kb-design-tokens/v1', 'kadence/singlebtn', 'default']);
			registry.resolveSelect(STORE_NAME).getBlockPresets('kb-design-tokens/v1', 'kadence/singlebtn', 'default');
		});

		expect(probe.latest().payload).toEqual(PAYLOAD_A);
		expect(probe.latest().isLoading).toBe(false);

		// The invalidated selector's re-fetch is itself scheduled on a `setTimeout(fn, 0)` (same
		// mechanism as `flushResolvers()` above), so resolving the mock's promise first and then
		// flushing lets `fetchBlockPresets` actually be called and its already-resolved result land.
		resolveNext({ ...PAYLOAD_A, version: 'a2' });
		await flushResolvers();

		expect(probe.latest().payload.version).toBe('a2');
	});

	it('stays out of loading during a write-triggered background re-resolve once data has loaded', async () => {
		fetchBlockPresets.mockResolvedValueOnce(PAYLOAD_A);

		const probe = mountProbe();
		await probe.render(LIBRARY_A);

		expect(probe.latest().payload).toEqual(PAYLOAD_A);
		expect(probe.latest().isLoading).toBe(false);

		let resolveNext;
		fetchBlockPresets.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveNext = resolve;
			})
		);

		// Simulates what `usePresetScreen`'s wrapped `refreshFeed` does after a create/save/delete/
		// reorder write.
		act(() => {
			registry
				.dispatch(STORE_NAME)
				.invalidateResolution('getBlockPresets', ['kb-design-tokens/v1', 'kadence/singlebtn', 'default']);
			registry.resolveSelect(STORE_NAME).getBlockPresets('kb-design-tokens/v1', 'kadence/singlebtn', 'default');
		});

		// Flushed so the resolver's `setTimeout(fn, 0)` actually fires and `isResolving` genuinely
		// flips `true` for the in-flight re-fetch — the exact window the regression is about. Without
		// this flush the assertions below would trivially pass even against the buggy code, because
		// resolution wouldn't have started yet.
		await flushResolvers();

		expect(fetchBlockPresets).toHaveBeenCalledTimes(2);
		expect(probe.latest().payload).toEqual(PAYLOAD_A);
		expect(probe.latest().isLoading).toBe(false);

		await act(async () => resolveNext({ ...PAYLOAD_A, version: 'a2' }));

		expect(probe.latest().payload.version).toBe('a2');
		expect(probe.latest().isLoading).toBe(false);
	});

	it('two mounted instances (a screen and its settings panel) share one fetch', async () => {
		fetchBlockPresets.mockResolvedValueOnce(PAYLOAD_A);

		function ProbeA() {
			return usePresets(LIBRARY_A, BUTTON_PRESET) && null;
		}
		function ProbeB() {
			return usePresets(LIBRARY_A, BUTTON_PRESET) && null;
		}

		await act(async () =>
			root.render(
				<RegistryProvider value={registry}>
					<ProbeA />
					<ProbeB />
				</RegistryProvider>
			)
		);
		await flushResolvers();

		expect(fetchBlockPresets).toHaveBeenCalledTimes(1);
	});
});
