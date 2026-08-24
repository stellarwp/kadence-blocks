/* eslint-env jest */
import { getBlockPresets, getLibraries, getPaletteListing, getDesignTokensFeed } from './resolvers';
import { fetchBlockPresets, fetchLibraries, fetchPalettes, fetchDesignTokensFeed } from '../api/client';

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
		await getDesignTokensFeed('brand')({ dispatch });

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

		const firstCall = getDesignTokensFeed('race-slug')({ dispatch });
		const secondCall = getDesignTokensFeed('race-slug')({ dispatch });

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
});
