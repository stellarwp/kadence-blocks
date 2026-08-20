/* eslint-env jest */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { RegistryProvider } from '@wordpress/data';
import { useDesignTokensFeed } from '../hooks/use-design-tokens-feed';
import { fetchDesignTokensFeed, configureRestClient } from '../api/client';
import { createTestRegistry } from '../store/test-utils';

jest.mock('../api/client', () => ({
	fetchDesignTokensFeed: jest.fn(),
	configureRestClient: jest.fn(),
}));

const LOCALIZED_FEED = { slug: 'default', version: 'v1', rest: { root: 'x', nonce: 'y' }, schema: { groups: {} } };
const BRAND_FEED = { slug: 'brand', version: 'b1', rest: { root: 'x', nonce: 'y' }, schema: { groups: {} } };
const THIRD_FEED = { slug: 'third', version: 't1', rest: { root: 'x', nonce: 'y' }, schema: { groups: {} } };

describe('useDesignTokensFeed', () => {
	let container;
	let root;
	let registry;

	beforeEach(() => {
		jest.clearAllMocks();
		registry = createTestRegistry();
		global.IS_REACT_ACT_ENVIRONMENT = true;
		window.kadenceDesignTokens = LOCALIZED_FEED;
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

	function mountProbe() {
		let latest = null;

		function Probe() {
			latest = useDesignTokensFeed();
			return null;
		}

		return {
			render: () =>
				act(() =>
					root.render(
						<RegistryProvider value={registry}>
							<Probe />
						</RegistryProvider>
					)
				),
			latest: () => latest,
		};
	}

	it('is ready on the very first render, with no fetch for the localized slug', async () => {
		const probe = mountProbe();
		await probe.render();

		expect(probe.latest().isReady).toBe(true);
		expect(probe.latest().feed).toEqual(LOCALIZED_FEED);
		expect(fetchDesignTokensFeed).not.toHaveBeenCalled();
	});

	it('refreshFeed() switches to a fetched library and always forces a fresh read', async () => {
		fetchDesignTokensFeed.mockResolvedValueOnce(BRAND_FEED);

		const probe = mountProbe();
		await probe.render();

		await act(async () => probe.latest().refreshFeed('brand'));

		expect(fetchDesignTokensFeed).toHaveBeenCalledWith('brand');
		expect(probe.latest().feed).toEqual(BRAND_FEED);
		expect(probe.latest().slug).toBe('brand');
	});

	it('configures the REST client once the feed carries a rest descriptor', async () => {
		const probe = mountProbe();
		await probe.render();

		expect(configureRestClient).toHaveBeenCalledWith(LOCALIZED_FEED.rest);
	});

	it('does not advance slug/feed until refreshFeed()s fresh read actually resolves', async () => {
		let resolveFetch;
		fetchDesignTokensFeed.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					resolveFetch = resolve;
				})
		);

		const probe = mountProbe();
		await probe.render();

		let refreshPromise;
		await act(async () => {
			refreshPromise = probe.latest().refreshFeed('brand');
			// The resolver's own fetch call is scheduled via `setTimeout(0)` internally by
			// `@wordpress/data`, so a real timer tick is needed before `fetchDesignTokensFeed`
			// has actually been called and `resolveFetch` is assigned.
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// The fetch is still in flight: `slug`/`feed`/`isReady` must not have moved yet, or every
		// consumer (including `StyleLibraryApp`, which gates its whole render on `isReady`) would
		// already be showing nothing for a library switch that hasn't resolved.
		expect(probe.latest().slug).toBe('default');
		expect(probe.latest().isReady).toBe(true);
		expect(probe.latest().feed).toEqual(LOCALIZED_FEED);

		await act(async () => {
			resolveFetch(BRAND_FEED);
			await refreshPromise;
		});

		expect(probe.latest().slug).toBe('brand');
		expect(probe.latest().isReady).toBe(true);
		expect(probe.latest().feed).toEqual(BRAND_FEED);
	});

	it('keeps showing the previous library when refreshFeed()s fresh read rejects', async () => {
		fetchDesignTokensFeed.mockRejectedValueOnce(new Error('network down'));

		const probe = mountProbe();
		await probe.render();

		await act(async () => {
			await expect(probe.latest().refreshFeed('brand')).rejects.toThrow('network down');
		});

		// `slug` never advanced onto 'brand', so the app keeps rendering the old library's feed
		// instead of getting stuck on a permanent spinner behind a `slug` no feed ever resolved for.
		expect(probe.latest().slug).toBe('default');
		expect(probe.latest().isReady).toBe(true);
		expect(probe.latest().feed).toEqual(LOCALIZED_FEED);
	});

	it('refreshFeed() with the current slug always forces a fresh read, without ever dropping readiness', async () => {
		let resolveFetch;
		fetchDesignTokensFeed.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					resolveFetch = resolve;
				})
		);

		const probe = mountProbe();
		await probe.render();

		let refreshPromise;
		await act(async () => {
			refreshPromise = probe.latest().refreshFeed('default');
			// See the previous test: the resolver's fetch call is scheduled via `setTimeout(0)`
			// internally, so a real timer tick is needed before `fetchDesignTokensFeed` has
			// actually run and `resolveFetch` is assigned.
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// A write must always force a fresh read, never serve a cached value — even for the slug
		// already showing.
		expect(fetchDesignTokensFeed).toHaveBeenCalledWith('default');
		expect(probe.latest().isReady).toBe(true);
		expect(probe.latest().feed).toEqual(LOCALIZED_FEED);

		const updatedFeed = { ...LOCALIZED_FEED, version: 'v2' };
		await act(async () => {
			resolveFetch(updatedFeed);
			await refreshPromise;
		});

		expect(probe.latest().isReady).toBe(true);
		expect(probe.latest().feed).toEqual(updatedFeed);
	});

	it('a slower first refreshFeed() call never overwrites a faster, later call', async () => {
		let resolveBrand;
		let resolveThird;
		fetchDesignTokensFeed
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveBrand = resolve;
					})
			)
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveThird = resolve;
					})
			);

		const probe = mountProbe();
		await probe.render();

		let firstCall;
		let secondCall;
		await act(async () => {
			firstCall = probe.latest().refreshFeed('brand');
			await new Promise((resolve) => setTimeout(resolve, 0));
			secondCall = probe.latest().refreshFeed('third');
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// The second, later call resolves FIRST — its result must win.
		await act(async () => {
			resolveThird(THIRD_FEED);
			await secondCall;
		});

		expect(probe.latest().slug).toBe('third');
		expect(probe.latest().feed).toEqual(THIRD_FEED);

		// The first, earlier call resolves LAST — it must not be allowed to overwrite the newer slug.
		await act(async () => {
			resolveBrand(BRAND_FEED);
			await firstCall;
		});

		expect(probe.latest().slug).toBe('third');
		expect(probe.latest().feed).toEqual(THIRD_FEED);
	});
});
