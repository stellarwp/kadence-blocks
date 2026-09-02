/* eslint-env jest */
/**
 * The block-editor's own read-only palette-groups fetch for `ColorControl`'s `groups` prop.
 *
 * Unlike the Style Library's `usePalettes()` (routing, optimistic writes, its own store), this hook is a
 * minimal, per-palette-id fetch: resolve the effective palette (own `kbPalette`, else the site's current),
 * fetch that palette's node once per id (module-level cache), and shape it through
 * `mapPaletteToColorControlGroups`. These tests drive the resolution (own override vs. fallback to current),
 * the REST call it makes, the shaping, and its tolerance for a not-yet-loaded/errored fetch.
 */
import { act, createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// `@wordpress/api-fetch` is externalized in production and not an npm dependency here (see
// `scale-flows.test.js`'s identical note for `@wordpress/api-fetch`-importing client modules), so it needs a
// virtual mock rather than jest's automatic module resolution. The factory creates its own `jest.fn()`
// (jest hoists `jest.mock()` above local `const`s, so a mock built outside the factory would still be
// uninitialized here) and the test body reaches it back via `require`.
jest.mock('@wordpress/api-fetch', () => jest.fn(), { virtual: true });
const mockApiFetch = require('@wordpress/api-fetch');

// The hook resolves its palette id through `@wordpress/data`'s `core/block-editor` store, which is not
// registered in this test environment — mocking `useSelect` to run its callback against a stub store is
// simpler than standing up a real registration. `mockBlockStore` is only dereferenced when the callback
// runs (during render), so the factory may close over it despite jest hoisting this above the `let`.
let mockBlockStore;

jest.mock(
	'@wordpress/data',
	() => ({
		useSelect: (mapSelect) => mapSelect(() => mockBlockStore),
	}),
	{ virtual: true }
);

import { useColorGroups } from '../hooks/use-color-groups';

const PALETTE_NODE = {
	id: 'brand',
	label: 'Brand',
	groups: [
		{
			id: 'accent',
			label: 'Accent',
			swatches: [{ token: 'semantic.color.accent.main', label: 'Main', $value: '#3182CE' }],
		},
	],
};

const MAPPED_GROUPS = [
	{
		id: 'accent',
		label: 'Accent',
		swatches: [
			{
				id: 'semantic.color.accent.main',
				label: 'Main',
				value: '#3182CE',
				alias: '{semantic.color.accent.main}',
			},
		],
	},
];

// A second, distinguishable palette node, for the cases that need one identity's response told apart
// from another's. It has to carry real groups: an empty response is treated as "could not read the
// palette" and retried, so it can no longer stand in as a distinct answer.
const OTHER_PALETTE_NODE = {
	id: 'other',
	label: 'Other',
	groups: [
		{
			id: 'contrast',
			label: 'Contrast',
			swatches: [{ token: 'semantic.color.contrast.main', label: 'Main', $value: '#1A202C' }],
		},
	],
};

const OTHER_MAPPED_GROUPS = [
	{
		id: 'contrast',
		label: 'Contrast',
		swatches: [
			{
				id: 'semantic.color.contrast.main',
				label: 'Main',
				value: '#1A202C',
				alias: '{semantic.color.contrast.main}',
			},
		],
	},
];

// Mirrors the hook's own retry budget and spacing, so the timer-driven cases advance far enough to
// reach its settled state.
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 250;

let container;
let root;

/**
 * Pin every block's own `kbPalette` to a palette id, or clear it so the hook falls back to the site's
 * current palette. Cases that need one block told apart from another override
 * `mockBlockStore.getBlockAttributes` directly instead.
 *
 * @param {string} palette The palette id to pin, or '' for no pinned override.
 *
 * @since TBD
 *
 * @return {void}
 */
function setOwnPalette(palette) {
	mockBlockStore.getBlockAttributes = () => (palette ? { kbPalette: palette } : {});
}

/**
 * Render `useColorGroups` and expose its latest return value, plus a way to re-render with a new
 * `clientId` on the same mounted instance.
 *
 * @param {string} clientId The initial `clientId` prop.
 *
 * @return {{box: {current: Array}, update: Function}} A ref-like box holding the hook's latest return
 *         value, and an `update(clientId)` function that re-renders the same instance.
 */
function renderHook(clientId) {
	const box = {};

	function Probe({ id }) {
		box.current = useColorGroups(id);

		return null;
	}

	function render(id) {
		act(() => {
			root.render(createElement(StrictMode, null, createElement(Probe, { id })));
		});
	}

	render(clientId);

	return { box, update: render };
}

describe('useColorGroups', () => {
	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);

		mockApiFetch.mockReset();
		mockBlockStore = {
			getBlockAttributes: () => ({}),
			getBlockParents: () => [],
		};
		window.kadenceDesignTokensRest = {
			root: 'https://example.test/wp-json/',
			namespace: 'kb-design-tokens/v1',
			nonce: 'abc',
		};
		window.kadenceDesignTokensPalettes = { active: 'default', current: 'default', palettes: [], slots: {} };
	});

	afterEach(() => {
		if (root) {
			act(() => root.unmount());
		}

		container.remove();
		delete global.IS_REACT_ACT_ENVIRONMENT;
		delete window.kadenceDesignTokensRest;
		delete window.kadenceDesignTokensPalettes;
	});

	/**
	 * A block with its own `kbPalette` override fetches that palette's id, not the site's current one.
	 *
	 * @return {Promise<void>}
	 */
	it("resolves the effective palette id from the block's own override", async () => {
		setOwnPalette('brand-own');
		mockApiFetch.mockResolvedValueOnce(PALETTE_NODE);

		const { box } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledWith({
			path: '/kb-design-tokens/v1/palettes/brand-own?library=default',
		});
		expect(box.current).toEqual(MAPPED_GROUPS);
	});

	/**
	 * A block with no pinned override falls back to the site's current palette id.
	 *
	 * @return {Promise<void>}
	 */
	it('falls back to the site current palette when the block has no override', async () => {
		setOwnPalette('');
		window.kadenceDesignTokensPalettes.current = 'seasonal-current';
		mockApiFetch.mockResolvedValueOnce({ ...PALETTE_NODE, id: 'seasonal-current' });

		renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledWith({
			path: '/kb-design-tokens/v1/palettes/seasonal-current?library=default',
		});
	});

	/**
	 * Before the fetch resolves, the hook returns an empty array rather than throwing or returning
	 * undefined.
	 *
	 * @return {void}
	 */
	it('returns an empty array while the fetch has not resolved yet', () => {
		setOwnPalette('brand-pending');
		mockApiFetch.mockReturnValue(new Promise(() => {}));

		const { box } = renderHook('block-1');

		expect(box.current).toEqual([]);
	});

	/**
	 * A fetch that keeps failing degrades to an empty array once its retries are exhausted, instead of
	 * throwing or leaving the hook in a broken state, matching every other design-token editor
	 * mechanism's fail-open tolerance.
	 *
	 * @return {Promise<void>}
	 */
	it('degrades to an empty array when the fetch rejects on every attempt', async () => {
		jest.useFakeTimers();
		setOwnPalette('brand-error');
		mockApiFetch.mockRejectedValue(new Error('network error'));

		const { box } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});

		// Drive every retry, so the assertion lands on the settled state and not merely on the initial
		// one the hook starts out in.
		for (let i = 0; i <= MAX_ATTEMPTS; i++) {
			await act(async () => {
				jest.advanceTimersByTime(RETRY_DELAY_MS);
				await Promise.resolve();
				await Promise.resolve();
			});
		}

		expect(box.current).toEqual([]);

		jest.useRealTimers();
	});

	/**
	 * The regression this hook's retry exists for: a first attempt that cannot read the palette must not
	 * settle as "this palette has no colors". The block's palette picker is hidden when the library has
	 * a single palette, so nothing else would ever re-trigger the fetch.
	 *
	 * @return {Promise<void>}
	 */
	it('retries an attempt that could not read the palette and populates once one succeeds', async () => {
		jest.useFakeTimers();
		setOwnPalette('brand-retry');
		mockApiFetch.mockRejectedValueOnce(new Error('not ready yet')).mockResolvedValueOnce(PALETTE_NODE);

		const { box } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(box.current).toEqual([]);

		await act(async () => {
			jest.advanceTimersByTime(RETRY_DELAY_MS);
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledTimes(2);
		expect(box.current).toEqual(MAPPED_GROUPS);

		jest.useRealTimers();
	});

	/**
	 * A response that maps to no groups is not cached, so the next attempt re-requests it rather than
	 * every later reader being served the same empty answer from cache.
	 *
	 * @return {Promise<void>}
	 */
	it('does not cache a response that maps to no groups', async () => {
		jest.useFakeTimers();
		setOwnPalette('brand-empty');
		mockApiFetch.mockResolvedValueOnce({ ...PALETTE_NODE, groups: [] }).mockResolvedValueOnce(PALETTE_NODE);

		const { box } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});

		await act(async () => {
			jest.advanceTimersByTime(RETRY_DELAY_MS);
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledTimes(2);
		expect(box.current).toEqual(MAPPED_GROUPS);

		jest.useRealTimers();
	});

	/**
	 * A second block instance requesting the same palette id reuses the cached fetch rather than
	 * issuing a second request.
	 *
	 * @return {Promise<void>}
	 */
	it('fetches a given palette id only once across multiple hook instances', async () => {
		setOwnPalette('brand-shared');
		mockApiFetch.mockResolvedValue(PALETTE_NODE);

		renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		const otherContainer = document.createElement('div');
		document.body.appendChild(otherContainer);
		const otherRoot = createRoot(otherContainer);

		function OtherProbe() {
			useColorGroups('block-2');
			return null;
		}

		act(() => {
			otherRoot.render(createElement(OtherProbe));
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledTimes(1);

		act(() => otherRoot.unmount());
		otherContainer.remove();
	});

	/**
	 * A `kbPalette` change on the SAME selected block — no `clientId` change — must still re-fetch;
	 * the effect depends on the resolved palette id itself, not only on `clientId`.
	 *
	 * @return {Promise<void>}
	 */
	it('re-fetches when the resolved palette id changes without a clientId change', async () => {
		setOwnPalette('brand-first');
		mockApiFetch.mockResolvedValueOnce({ ...PALETTE_NODE, id: 'brand-first' });

		const { box, update } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		expect(box.current).toEqual(MAPPED_GROUPS);

		setOwnPalette('brand-second');
		mockApiFetch.mockResolvedValueOnce({ ...OTHER_PALETTE_NODE, id: 'brand-second' });

		update('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledTimes(2);
		expect(mockApiFetch).toHaveBeenLastCalledWith({
			path: '/kb-design-tokens/v1/palettes/brand-second?library=default',
		});
		expect(box.current).toEqual(OTHER_MAPPED_GROUPS);
	});

	/**
	 * The same palette id can exist in more than one library, and the REST response depends on
	 * both — caching on the id alone could return one library's groups for another's request.
	 *
	 * @return {Promise<void>}
	 */
	it('fetches separately for the same palette id in a different library, not the cached one', async () => {
		setOwnPalette('shared-id');
		mockApiFetch.mockResolvedValueOnce(PALETTE_NODE);

		renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		window.kadenceDesignTokensPalettes.active = 'other-library';
		mockApiFetch.mockResolvedValueOnce(OTHER_PALETTE_NODE);

		const otherContainer = document.createElement('div');
		document.body.appendChild(otherContainer);
		const otherRoot = createRoot(otherContainer);

		function OtherLibraryProbe() {
			useColorGroups('block-2');
			return null;
		}

		act(() => {
			otherRoot.render(createElement(OtherLibraryProbe));
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledTimes(2);
		expect(mockApiFetch).toHaveBeenLastCalledWith({
			path: '/kb-design-tokens/v1/palettes/shared-id?library=other-library',
		});

		act(() => otherRoot.unmount());
		otherContainer.remove();
	});

	/**
	 * The regression a stale `kbPalette` causes: deleting a palette leaves every block that pinned it
	 * holding an id the library no longer defines, which can only ever 404. The site's own palette is
	 * used instead, rather than retrying the dead id until the control settles empty.
	 *
	 * @return {Promise<void>}
	 */
	it('falls back to the site palette when the block pins one the library no longer defines', async () => {
		setOwnPalette('deleted-palette');
		window.kadenceDesignTokensPalettes.current = 'default';
		mockApiFetch
			.mockRejectedValueOnce({
				code: 'rest_design_tokens_not_found',
				data: { status: 404 },
			})
			.mockResolvedValueOnce(PALETTE_NODE);

		const { box } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledTimes(2);
		expect(mockApiFetch).toHaveBeenLastCalledWith({
			path: '/kb-design-tokens/v1/palettes/default?library=default',
		});
		expect(box.current).toEqual(MAPPED_GROUPS);
	});

	/**
	 * A 404 is answered by one fallback, never by a retry of the dead id — and when the fallback is
	 * itself missing the hook settles empty instead of recursing.
	 *
	 * @return {Promise<void>}
	 */
	it('does not retry a missing palette, and stops when the fallback is missing too', async () => {
		jest.useFakeTimers();
		setOwnPalette('deleted-palette');
		window.kadenceDesignTokensPalettes.current = 'also-deleted';
		mockApiFetch.mockRejectedValue({
			code: 'rest_design_tokens_not_found',
			data: { status: 404 },
		});

		const { box } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
		});

		for (let i = 0; i <= MAX_ATTEMPTS; i++) {
			await act(async () => {
				jest.advanceTimersByTime(RETRY_DELAY_MS);
				await Promise.resolve();
				await Promise.resolve();
			});
		}

		// The pinned id, then the fallback — and nothing further.
		expect(mockApiFetch).toHaveBeenCalledTimes(2);
		expect(box.current).toEqual([]);

		jest.useRealTimers();
	});

	/**
	 * The palette is resolved against the hook's own `clientId`, not against whichever block happens to
	 * be selected. The hook is called from the block's `edit`, which renders for every instance on the
	 * canvas — including at first paint, when nothing is selected at all.
	 *
	 * @return {Promise<void>}
	 */
	it("resolves against the hook's own clientId rather than the selected block", async () => {
		mockBlockStore.getBlockAttributes = (id) => (id === 'block-2' ? { kbPalette: 'block-2-palette' } : {});
		mockApiFetch.mockResolvedValue(PALETTE_NODE);

		renderHook('block-2');
		await act(async () => {
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledWith({
			path: '/kb-design-tokens/v1/palettes/block-2-palette?library=default',
		});
	});

	/**
	 * A block with no pinned palette of its own follows its nearest pinned ancestor, walking outward so
	 * the closest one wins over a further ancestor that also pins one.
	 *
	 * @return {Promise<void>}
	 */
	it('follows the nearest pinned ancestor when the block pins nothing itself', async () => {
		const pinned = { outer: 'outer-palette', inner: 'inner-palette' };

		mockBlockStore.getBlockAttributes = (id) => (pinned[id] ? { kbPalette: pinned[id] } : {});
		mockBlockStore.getBlockParents = () => ['outer', 'inner'];
		mockApiFetch.mockResolvedValue(PALETTE_NODE);

		renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledWith({
			path: '/kb-design-tokens/v1/palettes/inner-palette?library=default',
		});
	});
});
