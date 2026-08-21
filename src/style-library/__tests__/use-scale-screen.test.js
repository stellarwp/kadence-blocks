/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * WordPress dependencies
 */
import { RegistryProvider } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useScaleScreen } from '../hooks/use-scale-screen';
import * as client from '../api/client';
import * as notify from '../helpers/notify';
import { createTestRegistry } from '../store/test-utils';

// A factory, not bare automocking: the real module imports `@wordpress/api-fetch`, which is
// externalized to the `wp.apiFetch` global in production and is not installed as an npm
// dependency, so automocking (which loads the real module to introspect its shape) would fail to
// resolve it.
jest.mock('../api/client', () => ({
	createUserPrimitive: jest.fn(),
	deleteUserPrimitive: jest.fn(),
	saveTokenLeaf: jest.fn(),
	setGroupOrder: jest.fn(),
	setTokenLabel: jest.fn(),
}));

jest.mock('../helpers/notify');

const NAMESPACE = 'kb-design-tokens/v1';
const SLUG = 'default';
const GROUP = 'Border Radius';

const CONFIG = { group: GROUP, groupKey: 'border-radius', tokenType: 'dimension' };

const SM_ID = 'primitive.dimension.radius.sm';
const MD_ID = 'primitive.dimension.radius.md';

const schema = () => ({
	groups: {
		[GROUP]: [
			{ id: SM_ID, label: 'Small', userCreated: false },
			{ id: MD_ID, label: 'Medium', userCreated: true },
		],
	},
});

const values = () => ({
	[SM_ID]: '0.125rem',
	[MD_ID]: '0.25rem',
});

const feed = () => ({
	slug: SLUG,
	version: 'v1',
	rest: { namespace: NAMESPACE },
	schema: schema(),
	values: values(),
});

describe('useScaleScreen optimistic save/delete', () => {
	let container;
	let root;
	let registry;

	beforeEach(() => {
		jest.clearAllMocks();
		registry = createTestRegistry();
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		delete global.IS_REACT_ACT_ENVIRONMENT;
	});

	function mountProbe() {
		let latest = null;

		function Probe({ config, library, route, navigate }) {
			latest = useScaleScreen(config, library, route, navigate);
			return null;
		}

		return {
			render: async ({
				config = CONFIG,
				library = { slug: SLUG, feed: feed(), tokens: [], refreshFeed: jest.fn().mockResolvedValue(undefined) },
				route = { screen: 'border-radius', item: '' },
				navigate = jest.fn(),
			} = {}) => {
				await act(() =>
					root.render(
						<RegistryProvider value={registry}>
							<Probe config={config} library={library} route={route} navigate={navigate} />
						</RegistryProvider>
					)
				);

				return { library, navigate };
			},
			latest: () => latest,
		};
	}

	it('applies the draft optimistically, then settles once the write resolves and notifies success', async () => {
		client.setTokenLabel.mockResolvedValueOnce({ version: 'v2' });

		const probe = mountProbe();
		const { library } = await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.saveToken(SM_ID, { label: 'Small Updated', value: '0.125rem' }, { label: 'Small', value: '0.125rem' });
		});

		// Applied immediately, before the write settles.
		expect(probe.latest().rows.find((row) => row.id === SM_ID)).toMatchObject({ label: 'Small Updated' });

		await act(async () => writePromise);

		expect(client.setTokenLabel).toHaveBeenCalledWith(SLUG, SM_ID, { label: 'Small Updated', version: 'v1' });
		expect(library.refreshFeed).toHaveBeenCalledWith(SLUG);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Token saved.');
		expect(notify.notifyError).not.toHaveBeenCalled();
	});

	it('reverts the optimistic patch and notifies an error when the save fails', async () => {
		client.setTokenLabel.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.saveToken(SM_ID, { label: 'Small Updated', value: '0.125rem' }, { label: 'Small', value: '0.125rem' })
				.catch(() => {});
		});

		expect(probe.latest().rows.find((row) => row.id === SM_ID)).toMatchObject({ label: 'Small Updated' });

		await act(async () => writePromise);

		expect(probe.latest().rows.find((row) => row.id === SM_ID)).toMatchObject({ label: 'Small' });
		expect(notify.notifyError).toHaveBeenCalledWith('Conflict');
		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('flags the target token pendingDelete immediately, before the delete resolves', async () => {
		let resolveDelete;
		client.deleteUserPrimitive.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveDelete = resolve;
			})
		);

		const probe = mountProbe();
		const { library } = await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe.latest().deleteToken(MD_ID);
		});

		// Still present in `rows`, only flagged — never an instant vanish.
		const rows = probe.latest().rows;
		expect(rows).toHaveLength(2);
		expect(rows.find((row) => row.id === MD_ID)).toMatchObject({ pendingDelete: true });

		resolveDelete({ version: 'v2' });
		await act(async () => writePromise);

		expect(client.deleteUserPrimitive).toHaveBeenCalledWith(SLUG, MD_ID, 'v1');
		expect(library.refreshFeed).toHaveBeenCalledWith(SLUG);
		expect(notify.notifySuccess).toHaveBeenCalledWith('Token deleted.');
		expect(notify.notifyError).not.toHaveBeenCalled();
	});

	it('clears pendingDelete and keeps the token when the delete fails', async () => {
		client.deleteUserPrimitive.mockRejectedValueOnce(new Error('Conflict'));

		const probe = mountProbe();
		await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe
				.latest()
				.deleteToken(MD_ID)
				.catch(() => {});
		});

		expect(probe.latest().rows.find((row) => row.id === MD_ID)).toMatchObject({ pendingDelete: true });

		await act(async () => writePromise);

		const row = probe.latest().rows.find((r) => r.id === MD_ID);
		expect(row.pendingDelete).toBeFalsy();
		expect(notify.notifyError).toHaveBeenCalledWith('Conflict');
		expect(notify.notifySuccess).not.toHaveBeenCalled();
	});

	it('reorderTokens still applies the local order immediately and keeps it once the write resolves', async () => {
		client.setGroupOrder.mockResolvedValueOnce({ version: 'v2' });

		const probe = mountProbe();
		const { library } = await probe.render();

		let writePromise;
		act(() => {
			writePromise = probe.latest().reorderTokens([MD_ID, SM_ID]);
		});

		expect(probe.latest().rows.map((row) => row.id)).toEqual([MD_ID, SM_ID]);

		await act(async () => writePromise);

		expect(client.setGroupOrder).toHaveBeenCalledWith(SLUG, GROUP, { order: [MD_ID, SM_ID], version: 'v1' });
		expect(library.refreshFeed).toHaveBeenCalledWith(SLUG);
		expect(probe.latest().orderError).toBeNull();
	});

	it('composes a pending optimistic delete with a pending reorder override', async () => {
		let resolveDelete;
		client.deleteUserPrimitive.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveDelete = resolve;
			})
		);
		client.setGroupOrder.mockResolvedValueOnce({ version: 'v2' });

		const probe = mountProbe();
		await probe.render();

		let deletePromise;
		let reorderPromise;
		act(() => {
			deletePromise = probe.latest().deleteToken(SM_ID);
			reorderPromise = probe.latest().reorderTokens([MD_ID, SM_ID]);
		});

		const rows = probe.latest().rows;
		expect(rows.map((row) => row.id)).toEqual([MD_ID, SM_ID]);
		expect(rows.find((row) => row.id === SM_ID)).toMatchObject({ pendingDelete: true });

		resolveDelete({ version: 'v3' });
		await act(async () => Promise.all([deletePromise, reorderPromise]));
	});
});
