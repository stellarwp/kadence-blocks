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

// `effectivePalette()` reads the selected block via `@wordpress/data`'s `core/block-editor` store, which
// is not registered in this test environment — mocking the module directly is simpler than standing up a
// real store registration just to drive its return value.
jest.mock('../palette-swatch-preview', () => ({
	effectivePalette: jest.fn(),
}));
const mockEffectivePalette = require('../palette-swatch-preview').effectivePalette;

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

let container;
let root;

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
		mockEffectivePalette.mockReset();
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
		mockEffectivePalette.mockReturnValue('brand-own');
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
		mockEffectivePalette.mockReturnValue('');
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
		mockEffectivePalette.mockReturnValue('brand-pending');
		mockApiFetch.mockReturnValue(new Promise(() => {}));

		const { box } = renderHook('block-1');

		expect(box.current).toEqual([]);
	});

	/**
	 * A failed fetch degrades to an empty array instead of throwing or leaving the hook in a broken
	 * state, matching every other design-token editor mechanism's fail-open tolerance.
	 *
	 * @return {Promise<void>}
	 */
	it('degrades to an empty array when the fetch rejects', async () => {
		mockEffectivePalette.mockReturnValue('brand-error');
		mockApiFetch.mockRejectedValueOnce(new Error('network error'));

		const { box } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(box.current).toEqual([]);
	});

	/**
	 * A second block instance requesting the same palette id reuses the cached fetch rather than
	 * issuing a second request.
	 *
	 * @return {Promise<void>}
	 */
	it('fetches a given palette id only once across multiple hook instances', async () => {
		mockEffectivePalette.mockReturnValue('brand-shared');
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
		mockEffectivePalette.mockReturnValue('brand-first');
		mockApiFetch.mockResolvedValueOnce({ ...PALETTE_NODE, id: 'brand-first' });

		const { box, update } = renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		expect(box.current).toEqual(MAPPED_GROUPS);

		mockEffectivePalette.mockReturnValue('brand-second');
		mockApiFetch.mockResolvedValueOnce({ ...PALETTE_NODE, id: 'brand-second', groups: [] });

		update('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		expect(mockApiFetch).toHaveBeenCalledTimes(2);
		expect(mockApiFetch).toHaveBeenLastCalledWith({
			path: '/kb-design-tokens/v1/palettes/brand-second?library=default',
		});
		expect(box.current).toEqual([]);
	});

	/**
	 * The same palette id can exist in more than one library, and the REST response depends on
	 * both — caching on the id alone could return one library's groups for another's request.
	 *
	 * @return {Promise<void>}
	 */
	it('fetches separately for the same palette id in a different library, not the cached one', async () => {
		mockEffectivePalette.mockReturnValue('shared-id');
		mockApiFetch.mockResolvedValueOnce(PALETTE_NODE);

		renderHook('block-1');
		await act(async () => {
			await Promise.resolve();
		});

		window.kadenceDesignTokensPalettes.active = 'other-library';
		mockApiFetch.mockResolvedValueOnce({ ...PALETTE_NODE, groups: [] });

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
});
