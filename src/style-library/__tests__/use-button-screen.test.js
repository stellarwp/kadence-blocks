/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { useButtonScreen } from '../hooks/use-button-screen';
import { reorderPresetsFlow } from '../helpers/preset-flows';
import { useButtonPresets } from '../hooks/use-button-presets';

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
jest.mock('../hooks/use-button-presets', () => ({
	useButtonPresets: jest.fn(),
}));

const LIBRARY = {
	rest: { namespace: 'kb-design-tokens/v1' },
	slug: 'default',
	version: 1,
	refreshFeed: jest.fn().mockResolvedValue({}),
};

describe('useButtonScreen reorder version handling', () => {
	let container;
	let root;

	beforeEach(() => {
		jest.clearAllMocks();
		global.IS_REACT_ACT_ENVIRONMENT = true;

		useButtonPresets.mockReturnValue({
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
	 * Mount `useButtonScreen` behind a single probe component type, so a re-render updates the
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
			latest = useButtonScreen(LIBRARY);

			return null;
		}

		const rerender = () => act(() => root.render(<Probe />));

		rerender();

		return { rerender, latest: () => latest };
	}

	it('sends the version the previous write returned when a second drop follows the first', async () => {
		const sentVersions = [];

		// The payload's version stays 'v1' throughout: `useButtonPresets` re-reads it in a later
		// effect, and the point of this test is the window before that read lands.
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

	it('keeps using the payload version once the re-read catches up to the written one', async () => {
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

		// The re-read lands on the mounted hook, carrying the version the write reported.
		useButtonPresets.mockReturnValue({
			payload: { version: 'v2' },
			isLoading: false,
			loadError: null,
			rows: [],
			initialValuesFor: () => null,
		});
		screen.rerender();

		await act(async () => {
			await screen.latest().reorderPresets(['primary', 'secondary']);
		});

		expect(sentVersions).toEqual(['v1', 'v2']);
	});

	/**
	 * A rejected write leaves no new version behind, so a drop already queued must fall back to the
	 * payload rather than resend the previous write's override and fail the same way.
	 *
	 * @return {void}
	 */
	it('falls back to the payload version for the next drop after a failed write', async () => {
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

		// v1 from the payload, v2 from the first write's response, then back to the payload's v1
		// because the failed write retired the override.
		expect(sentVersions).toEqual(['v1', 'v2', 'v1']);
		expect(LIBRARY.refreshFeed).toHaveBeenCalled();
	});

	/**
	 * A re-read carrying a version this screen never wrote — another client's write — supersedes the
	 * override, which must not keep being sent afterwards.
	 *
	 * @return {void}
	 */
	it('retires the write override when a later read supersedes it', async () => {
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

		// Not 'v2': someone else wrote in between, so the payload moved somewhere the override
		// cannot describe.
		useButtonPresets.mockReturnValue({
			payload: { version: 'v9' },
			isLoading: false,
			loadError: null,
			rows: [],
			initialValuesFor: () => null,
		});
		screen.rerender();

		await act(async () => {
			await screen.latest().reorderPresets(['primary', 'secondary']);
		});

		expect(sentVersions).toEqual(['v1', 'v9']);
	});
});
