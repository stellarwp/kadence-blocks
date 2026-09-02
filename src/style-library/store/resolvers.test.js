/* eslint-env jest */
import { getBlockPresets, getLibraries, getPaletteListing, getDesignTokensFeed } from './resolvers';
import { fetchBlockPresets, fetchLibraries, fetchPalettes, fetchDesignTokensFeed } from '../api/client';
import { createTestRegistry } from './test-utils';

jest.mock('../api/client', () => ({
	fetchLibraries: jest.fn(),
	fetchBlockPresets: jest.fn(),
	fetchPalettes: jest.fn(),
	fetchDesignTokensFeed: jest.fn(),
}));

describe('resolvers', () => {
	beforeEach(() => jest.clearAllMocks());

	it('getLibraries() fetches the list and dispatches receiveLibraries', async () => {
		const rows = [{ slug: 'default', title: '', version: 'v1', document: {} }];
		fetchLibraries.mockResolvedValueOnce(rows);

		const dispatch = { receiveLibraries: jest.fn() };
		await getLibraries()({ dispatch });

		expect(dispatch.receiveLibraries).toHaveBeenCalledWith(rows);
	});

	it('getBlockPresets() fetches and dispatches receiveBlockPresets under the composite key', async () => {
		const payload = { version: 'a1', presets: {} };
		fetchBlockPresets.mockResolvedValueOnce(payload);

		const dispatch = { receiveBlockPresets: jest.fn() };
		await getBlockPresets('kb-design-tokens/v1', 'kadence/singlebtn', 'default')({ dispatch });

		expect(fetchBlockPresets).toHaveBeenCalledWith('kb-design-tokens/v1', 'kadence/singlebtn', 'default');
		expect(dispatch.receiveBlockPresets).toHaveBeenCalledWith(
			'kb-design-tokens/v1::kadence/singlebtn::default',
			payload
		);
	});

	it('getPaletteListing() fetches and dispatches receivePaletteListing under the composite key', async () => {
		const rows = [{ id: 'default', label: 'Default', is_default: true, is_current: true, user_created: false }];
		fetchPalettes.mockResolvedValueOnce(rows);

		const dispatch = { receivePaletteListing: jest.fn() };
		await getPaletteListing('kb-design-tokens/v1', 'default')({ dispatch });

		expect(fetchPalettes).toHaveBeenCalledWith('kb-design-tokens/v1', 'default');
		expect(dispatch.receivePaletteListing).toHaveBeenCalledWith('kb-design-tokens/v1::default', rows);
	});

	it('getDesignTokensFeed() fetches and dispatches receiveDesignTokensFeed under the slug', async () => {
		const feed = { slug: 'brand', version: 'b1' };
		fetchDesignTokensFeed.mockResolvedValueOnce(feed);

		const dispatch = { receiveDesignTokensFeed: jest.fn() };
		await getDesignTokensFeed('brand')({ dispatch, registry: createTestRegistry() });

		expect(fetchDesignTokensFeed).toHaveBeenCalledWith('brand');
		expect(dispatch.receiveDesignTokensFeed).toHaveBeenCalledWith('brand', feed);
	});

	/**
	 * This resolver's own `bumpFeedRevision`/`isFeedRevisionCurrent` guard is shared with
	 * `use-design-tokens-feed.js`'s `refreshFeed`, which now fetches and dispatches directly rather
	 * than routing through this resolver — see that hook's own docblock. Two organic resolver runs
	 * for the SAME slug close together (this test's scenario) still need to coordinate through the
	 * same counter: if the FIRST call's network response lands AFTER the second's, only the second's
	 * (newer) response may reach the store; the first's must be discarded as stale.
	 *
	 * @return {void}
	 */
	it('a slower first getDesignTokensFeed() call never overwrites a faster, later call for the same slug', async () => {
		let resolveFirst;
		let resolveSecond;

		fetchDesignTokensFeed
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveFirst = resolve;
					})
			)
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveSecond = resolve;
					})
			);

		const dispatch = { receiveDesignTokensFeed: jest.fn() };
		// The thunk context's `registry` object — both calls share it because they are the SAME
		// registry racing against itself.
		const registry = createTestRegistry();

		const firstCall = getDesignTokensFeed('race-slug')({ dispatch, registry });
		const secondCall = getDesignTokensFeed('race-slug')({ dispatch, registry });

		// The second, later call resolves FIRST — its result must win.
		resolveSecond({ slug: 'race-slug', version: 'newer' });
		await secondCall;

		expect(dispatch.receiveDesignTokensFeed).toHaveBeenCalledTimes(1);
		expect(dispatch.receiveDesignTokensFeed).toHaveBeenCalledWith('race-slug', {
			slug: 'race-slug',
			version: 'newer',
		});

		// The first, earlier call resolves LAST — it must not be allowed to overwrite the newer feed.
		resolveFirst({ slug: 'race-slug', version: 'older' });
		await firstCall;

		expect(dispatch.receiveDesignTokensFeed).toHaveBeenCalledTimes(1);
	});

	/**
	 * Two INDEPENDENT registries (e.g. two isolated app instances, as `createTestRegistry()`
	 * builds for tests) requesting the same slug concurrently have no ordering relationship to
	 * each other. A fast response landing in one registry must never cause the other, unrelated
	 * registry's own slower-resolving request to be discarded as "stale" — each registry's
	 * revision tracking must stay scoped to that registry.
	 *
	 * @return {void}
	 */
	it('a slow getDesignTokensFeed() call in one registry is not discarded by a fast call in a different registry', async () => {
		let resolveSlow;
		let resolveFast;

		fetchDesignTokensFeed
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveSlow = resolve;
					})
			)
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveFast = resolve;
					})
			);

		const dispatchA = { receiveDesignTokensFeed: jest.fn() };
		const dispatchB = { receiveDesignTokensFeed: jest.fn() };
		// Two SEPARATE, real `@wordpress/data` registries — like two isolated app instances — used
		// here as the stand-in for the thunk context's `registry` object, so the revision map is
		// keyed on genuinely distinct registry identities, not look-alike plain objects.
		const registryA = createTestRegistry();
		const registryB = createTestRegistry();

		const slowCall = getDesignTokensFeed('shared-slug')({ dispatch: dispatchA, registry: registryA });
		const fastCall = getDesignTokensFeed('shared-slug')({ dispatch: dispatchB, registry: registryB });

		// Registry B's request resolves first — it has no bearing on registry A's own request.
		resolveFast({ slug: 'shared-slug', version: 'b' });
		await fastCall;

		expect(dispatchB.receiveDesignTokensFeed).toHaveBeenCalledTimes(1);
		expect(dispatchB.receiveDesignTokensFeed).toHaveBeenCalledWith('shared-slug', {
			slug: 'shared-slug',
			version: 'b',
		});

		// Registry A's request resolves last, but it is the ONLY request registry A ever made, so
		// it must still be dispatched — it is not "stale" relative to a different registry.
		resolveSlow({ slug: 'shared-slug', version: 'a' });
		await slowCall;

		expect(dispatchA.receiveDesignTokensFeed).toHaveBeenCalledTimes(1);
		expect(dispatchA.receiveDesignTokensFeed).toHaveBeenCalledWith('shared-slug', {
			slug: 'shared-slug',
			version: 'a',
		});
	});
});
