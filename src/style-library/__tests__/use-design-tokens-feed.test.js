/* eslint-env jest */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { RegistryProvider } from '@wordpress/data';
import { seedDesignTokensFeed, useDesignTokensFeed } from '../hooks/use-design-tokens-feed';
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

		// Mirrors `style-library.js`'s bootstrap: seeds the (isolated, test) registry BEFORE
		// mounting, the same way production seeds the default registry before `createRoot(...).render()`.
		seedDesignTokensFeed(registry.dispatch);

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

	it('seedDesignTokensFeed() is a no-op when there is no localized feed', () => {
		delete window.kadenceDesignTokens;

		const dispatch = jest.fn(() => ({ receiveDesignTokensFeed: jest.fn(), finishResolution: jest.fn() }));

		seedDesignTokensFeed(dispatch);

		expect(dispatch).not.toHaveBeenCalled();
	});

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
			// `refreshFeed` calls `fetchDesignTokensFeed` synchronously (it no longer routes through
			// the store's resolver framework, whose own dispatch is scheduled via `setTimeout(0)`
			// internally by `@wordpress/data`) — this tick just lets the surrounding `act()` settle
			// before the assertions below read state.
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
			// See the previous test: `fetchDesignTokensFeed` runs synchronously inside `refreshFeed`
			// now; this tick just lets the surrounding `act()` settle.
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

	// Two overlapping refreshes of the SAME slug (unlike the previous test's different-slug race —
	// this is the shape every write flow's own `refreshFeed(slug)` produces when a sibling instance,
	// e.g. a screen and its settings panel, both write close together). Before this was fixed, an
	// older call's promise resolved the moment ANY call for the same tuple finished — including a
	// newer sibling's — so it could settle with stale data before its own fetch had even landed, and
	// code chaining logic off it (every write flow does) would act on that stale read.
	it('an older refreshFeed() call for the SAME slug settles on its own fetch, not a newer sibling call finishing first', async () => {
		let resolveOlder;
		let resolveNewer;
		fetchDesignTokensFeed
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveOlder = resolve;
					})
			)
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveNewer = resolve;
					})
			);

		const probe = mountProbe();
		await probe.render();

		let olderCall;
		let newerCall;
		let olderSettled = false;
		let olderResolvedWith = null;
		await act(async () => {
			olderCall = probe.latest().refreshFeed('brand');
			olderCall.then((resolvedFeed) => {
				olderSettled = true;
				olderResolvedWith = resolvedFeed;
			});
			await new Promise((resolve) => setTimeout(resolve, 0));
			newerCall = probe.latest().refreshFeed('brand');
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// The newer call resolves first — it must win, and the older call must still be pending,
		// not resolved early by the newer call finishing the same (slug-only) tuple.
		await act(async () => {
			resolveNewer({ ...BRAND_FEED, version: 'newer' });
			await newerCall;
		});

		expect(probe.latest().feed).toEqual({ ...BRAND_FEED, version: 'newer' });
		expect(olderSettled).toBe(false);

		// The older call's own fetch finally lands, with stale data — its promise settles now (not
		// before, on the newer call's own resolution), with its OWN fetch's payload, and its stale
		// response must not overwrite the newer feed already in the store.
		await act(async () => {
			resolveOlder({ ...BRAND_FEED, version: 'older' });
			await olderCall;
		});

		expect(olderSettled).toBe(true);
		expect(olderResolvedWith).toEqual({ ...BRAND_FEED, version: 'older' });
		expect(probe.latest().feed).toEqual({ ...BRAND_FEED, version: 'newer' });
	});
});
