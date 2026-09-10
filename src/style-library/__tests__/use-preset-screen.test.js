/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { usePresetScreen } from '../hooks/use-preset-screen';
import { reorderPresetsFlow } from '../helpers/preset-flows';
import { usePresets } from '../hooks/use-presets';

// A factory, not automock: `helpers/preset-flows.js` reaches `../api/client`, which imports
// `@wordpress/api-fetch` — externalized to the `wp.apiFetch` global in production and therefore
// absent from `node_modules`, so automocking would fail to resolve it.
jest.mock('../helpers/preset-flows', () => ({
	createPresetFlow: jest.fn(),
	deletePresetFlow: jest.fn(),
	reorderPresetsFlow: jest.fn(),
	savePresetFlow: jest.fn(),
}));

// Stubbed for the same reason, and so the fetched payload can be pinned to a version that never
// advances — the state this regression is about.
jest.mock('../hooks/use-presets', () => ({
	usePresets: jest.fn(),
}));

// `usePresetScreen`'s wrapped `refreshFeed` reaches the store, whose resolvers import `../api/client`
// directly — same `@wordpress/api-fetch` reason as above. `usePresets` above already stubs out the
// hook's own read of the store, so this mock only needs to keep the store module loadable; the
// wrapped `refreshFeed`'s own store round trip through this stub resolves to `undefined` and is
// otherwise inert for these tests.
jest.mock('../api/client', () => ({
	fetchBlockPresets: jest.fn(),
	fetchLibraries: jest.fn(),
}));

// Inline rather than the real `BUTTON_PRESET`, which reads its properties from the localized feed.
// `usePresets` is mocked here, so the hook only needs the three keys it reads itself.
const PRESET = { block: 'kadence/singlebtn', properties: ['color'], slugBase: 'preset' };

const LIBRARY = {
	rest: { namespace: 'kb-design-tokens/v1' },
	slug: 'default',
	version: 'v1',
	refreshFeed: jest.fn().mockResolvedValue({}),
};

describe('usePresetScreen reorder version handling', () => {
	let container;
	let root;

	beforeEach(() => {
		jest.clearAllMocks();
		global.IS_REACT_ACT_ENVIRONMENT = true;

		// Reset the shared fixture: several tests below mutate `LIBRARY.version` in place to
		// simulate the feed advancing (see `renderScreen()`'s docblock for why the object stays
		// the same reference across a test's re-renders).
		LIBRARY.version = 'v1';

		usePresets.mockReturnValue({
			payload: { version: 'v1' },
			isLoading: false,
			loadError: null,
			rows: [],
			initialValuesFor: () => null,
		});

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		delete global.IS_REACT_ACT_ENVIRONMENT;
	});

	/**
	 * Mount `usePresetScreen` behind a single probe component type, so a re-render updates the
	 * mounted hook rather than replacing it. A fresh component type per render would remount and
	 * reset the version refs these tests are about.
	 *
	 * @since TBD
	 *
	 * @return {{rerender: Function, latest: Function}} Re-renders the mounted probe, and reads the
	 *                                                    hook's most recent return value.
	 */
	function renderScreen() {
		let latest = null;

		function Probe() {
			latest = usePresetScreen(LIBRARY, PRESET);

			return null;
		}

		const rerender = () => act(() => root.render(<Probe />));

		rerender();

		return { rerender, latest: () => latest };
	}

	it('sends the version the previous write returned when a second drop follows the first', async () => {
		const sentVersions = [];

		// `LIBRARY.version` stays 'v1' throughout — both drops are queued within the same `act`,
		// with no re-render between them — and the point of this test is the window before a
		// refresh lands.
		reorderPresetsFlow.mockImplementation(({ feedVersion, onVersion }) => {
			sentVersions.push(feedVersion);
			onVersion('v2');

			return Promise.resolve();
		});

		const screen = renderScreen();

		await act(async () => {
			screen.latest().reorderPresets(['secondary', 'primary']);
			await screen.latest().reorderPresets(['primary', 'secondary']);
		});

		expect(sentVersions).toEqual(['v1', 'v2']);
	});

	it('keeps using the feed version once it catches up to the written one', async () => {
		const sentVersions = [];

		reorderPresetsFlow.mockImplementation(({ feedVersion, onVersion }) => {
			sentVersions.push(feedVersion);
			onVersion('v2');

			return Promise.resolve();
		});

		const screen = renderScreen();

		await act(async () => {
			await screen.latest().reorderPresets(['secondary', 'primary']);
		});

		// The write's own wrapped `refreshFeed` lands on the mounted hook, carrying the version
		// the write reported — same as any OTHER screen's write would too.
		LIBRARY.version = 'v2';
		screen.rerender();

		await act(async () => {
			await screen.latest().reorderPresets(['primary', 'secondary']);
		});

		expect(sentVersions).toEqual(['v1', 'v2']);
	});

	/**
	 * A rejected write leaves no new version behind, so a drop already queued must fall back to the
	 * feed's own version rather than resend the previous write's override and fail the same way.
	 *
	 * @return {void}
	 */
	it('falls back to the feed version for the next drop after a failed write', async () => {
		const sentVersions = [];
		let call = 0;

		reorderPresetsFlow.mockImplementation(({ feedVersion, onVersion }) => {
			sentVersions.push(feedVersion);
			call += 1;

			if (call === 1) {
				onVersion('v2');

				return Promise.resolve();
			}

			// The second write conflicts: no version is reported.
			return Promise.reject(new Error('Conflict'));
		});

		const screen = renderScreen();

		await act(async () => {
			await screen.latest().reorderPresets(['secondary', 'primary']);
			await screen.latest().reorderPresets(['primary', 'secondary']);
			await screen.latest().reorderPresets(['secondary', 'primary']);
		});

		// v1 from the feed's initial version, v2 from the first write's response, then back to
		// the feed's still-unmoved v1 because the failed write retired the override.
		expect(sentVersions).toEqual(['v1', 'v2', 'v1']);
		expect(LIBRARY.refreshFeed).toHaveBeenCalled();
	});

	/**
	 * A refresh carrying a version this screen never wrote — another screen's write, on any
	 * resource in the same library — supersedes the override, which must not keep being sent
	 * afterwards.
	 *
	 * @return {void}
	 */
	it('retires the write override when a later refresh supersedes it', async () => {
		const sentVersions = [];

		reorderPresetsFlow.mockImplementation(({ feedVersion, onVersion }) => {
			sentVersions.push(feedVersion);
			onVersion('v2');

			return Promise.resolve();
		});

		const screen = renderScreen();

		await act(async () => {
			await screen.latest().reorderPresets(['secondary', 'primary']);
		});

		// Not 'v2': a write on another screen (scale, typography, palettes) landed in between and
		// moved the shared feed version somewhere the override cannot describe.
		LIBRARY.version = 'v9';
		screen.rerender();

		await act(async () => {
			await screen.latest().reorderPresets(['primary', 'secondary']);
		});

		expect(sentVersions).toEqual(['v1', 'v9']);
	});

	/**
	 * A write on a completely different screen (scale, typography, palettes) bumps the shared
	 * feed version via its own `library.refreshFeed`, without ever touching this screen's cached
	 * preset payload — this hook was never mounted, so it had no `refreshFeed` wrapper in the
	 * loop to invalidate `getBlockPresets`. The first reorder here, after mounting, must still
	 * send the CURRENT server version (`library.version`), not the stale one still sitting in the
	 * payload from whenever it was last fetched.
	 *
	 * @return {void}
	 */
	it('sends the current feed version, not a stale cached payload version, on first mount', async () => {
		const sentVersions = [];

		// The payload was fetched before another screen's write bumped the library — its own
		// version never moved, exactly as `getBlockPresets` would look if nothing here ever
		// invalidated it.
		usePresets.mockReturnValue({
			payload: { version: 'v1' },
			isLoading: false,
			loadError: null,
			rows: [],
			initialValuesFor: () => null,
		});
		LIBRARY.version = 'v5';

		reorderPresetsFlow.mockImplementation(({ feedVersion, onVersion }) => {
			sentVersions.push(feedVersion);
			onVersion('v6');

			return Promise.resolve();
		});

		const screen = renderScreen();

		await act(async () => {
			await screen.latest().reorderPresets(['secondary', 'primary']);
		});

		expect(sentVersions).toEqual(['v5']);
	});
});
