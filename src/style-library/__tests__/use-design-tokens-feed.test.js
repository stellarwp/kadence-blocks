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
});
