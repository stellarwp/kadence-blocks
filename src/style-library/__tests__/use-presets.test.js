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
	});

	// `@wordpress/data`'s resolver dispatch runs off a `setTimeout(fn, 0)` inside the store (see
	// `mapSelectorWithResolver` in `@wordpress/data`'s redux store), a real timer callback that a
	// plain `await act(async () => render())` does not wait for — that promise settles as soon as the
	// synchronous render returns. Flushing one real timer tick after each render/dispatch gives the
	// resolver's callback a turn to run before assertions read the store. See `use-libraries.test.js`
	// for the same pattern.
	function flushResolvers() {
		return act(() => new Promise((resolve) => setTimeout(resolve, 0)));
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
