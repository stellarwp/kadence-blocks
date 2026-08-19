/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { usePresets } from '../hooks/use-presets';
import { BUTTON_PRESET } from '../presets/button-preset';
import { fetchBlockPresets } from '../api/client';

// A factory, not automock: `../api/client` imports `@wordpress/api-fetch`, which is externalized to
// the `wp.apiFetch` global in production and therefore absent from `node_modules`.
jest.mock('../api/client', () => ({
	fetchBlockPresets: jest.fn(),
}));

const LIBRARY_A = { rest: { namespace: 'kb-design-tokens/v1' }, slug: 'default', version: 1, values: {} };
const LIBRARY_B = { rest: { namespace: 'kb-design-tokens/v1' }, slug: 'brand', version: 1, values: {} };

const PAYLOAD_A = { version: 'a1', default: 'primary', presets: { primary: { label: 'Primary', tokens: {} } } };
const PAYLOAD_B = { version: 'b1', default: 'primary', presets: { primary: { label: 'Brand Primary', tokens: {} } } };

describe('usePresets library switching', () => {
	let container;
	let root;

	beforeEach(() => {
		jest.clearAllMocks();
		global.IS_REACT_ACT_ENVIRONMENT = true;
		// `initialValuesFor` walks the bound surface off the localized feed, which the Style Library
		// page inline-scripts before the bundle runs.
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

	/**
	 * A single probe component type, so re-rendering with a different library updates the mounted
	 * hook instead of remounting it — a remount would reset the state this test is about.
	 *
	 * @since TBD
	 *
	 * @return {{render: Function, latest: Function}} Renders with a library, and reads the hook's
	 *                                                  most recent return value.
	 */
	function mountProbe() {
		let latest = null;

		function Probe({ library }) {
			latest = usePresets(library, BUTTON_PRESET);

			return null;
		}

		return {
			render: (library) => act(() => root.render(<Probe library={library} />)),
			latest: () => latest,
		};
	}

	/**
	 * Switching libraries with the same preset open must drop the previous library's payload right
	 * away. Holding it would let a settings panel keyed on the preset id alone keep editing the old
	 * library's draft under the new one.
	 *
	 * @return {void}
	 */
	it('drops the previous payload as soon as the library changes', async () => {
		fetchBlockPresets.mockResolvedValueOnce(PAYLOAD_A);

		const probe = mountProbe();
		await act(async () => probe.render(LIBRARY_A));

		expect(probe.latest().payload).toEqual(PAYLOAD_A);
		expect(probe.latest().initialValuesFor('primary')).not.toBeNull();

		// The new library's fetch is left pending: this is the window the panel could otherwise
		// keep the old draft in.
		let resolveB;
		fetchBlockPresets.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveB = resolve;
			})
		);

		probe.render(LIBRARY_B);

		expect(probe.latest().payload).toBeNull();
		expect(probe.latest().isLoading).toBe(true);
		expect(probe.latest().initialValuesFor('primary')).toBeNull();

		await act(async () => {
			resolveB(PAYLOAD_B);
		});

		expect(probe.latest().payload).toEqual(PAYLOAD_B);
		expect(probe.latest().isLoading).toBe(false);
	});

	/**
	 * A version bump on the same library is a refresh after a write, not a library change, so the
	 * rows must stay on screen while the re-read is in flight.
	 *
	 * @return {void}
	 */
	it('keeps the payload while the same library re-reads after a version bump', async () => {
		fetchBlockPresets.mockResolvedValueOnce(PAYLOAD_A);

		const probe = mountProbe();
		await act(async () => probe.render(LIBRARY_A));

		let resolveNext;
		fetchBlockPresets.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveNext = resolve;
			})
		);

		probe.render({ ...LIBRARY_A, version: 2 });

		expect(probe.latest().payload).toEqual(PAYLOAD_A);

		await act(async () => {
			resolveNext({ ...PAYLOAD_A, version: 'a2' });
		});

		expect(probe.latest().payload.version).toBe('a2');
	});
});
