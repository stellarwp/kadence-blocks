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
	 * Render `useButtonScreen` and hand back its latest return value.
	 *
	 * @since TBD
	 *
	 * @return {Function} Returns the hook's most recent return value when called.
	 */
	function renderScreen() {
		let latest = null;

		function Probe() {
			latest = useButtonScreen(LIBRARY);

			return null;
		}

		act(() => root.render(<Probe />));

		return () => latest;
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
			screen().reorderPresets(['secondary', 'primary']);
			await screen().reorderPresets(['primary', 'secondary']);
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
			await screen().reorderPresets(['secondary', 'primary']);
		});

		// The re-read lands, carrying the same version the write reported.
		useButtonPresets.mockReturnValue({
			payload: { version: 'v2' },
			isLoading: false,
			loadError: null,
			rows: [],
			initialValuesFor: () => null,
		});
		renderScreen();

		await act(async () => {
			await screen().reorderPresets(['primary', 'secondary']);
		});

		expect(sentVersions).toEqual(['v1', 'v2']);
	});
});
