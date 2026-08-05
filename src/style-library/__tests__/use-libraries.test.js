/* eslint-env jest */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { createElement } from '@wordpress/element';
import { useLibraries } from '../hooks/use-libraries';
import * as client from '../api/client';

// Required for `react-dom`'s `act()` to recognize this as a test environment — without it, every
// state update outside an explicit `act()` call (e.g. inside a resolved promise chain) logs a
// "not configured to support act" warning even though the update is correctly wrapped.
global.IS_REACT_ACT_ENVIRONMENT = true;

// A factory, not bare automocking: the real module imports `@wordpress/api-fetch`, which is
// externalized to the `wp.apiFetch` global in production and is not installed as an npm
// dependency, so automocking (which loads the real module to introspect its shape) would fail to
// resolve it.
jest.mock('../api/client', () => ({
	fetchLibraries: jest.fn(),
	createLibrary: jest.fn(),
	deleteLibrary: jest.fn(),
	getActiveLibrary: jest.fn(),
	setActiveLibrary: jest.fn(),
}));

/**
 * Mounts `useLibraries` inside a bare host component and exposes its latest return value, so the
 * hook's state transitions can be exercised without a component-testing library — this repo has
 * none installed, so the harness uses `react-dom/test-utils` directly (already a transitive
 * dependency of `@wordpress/element`) instead of adding one.
 *
 * @param {Object}   feed        The design-tokens admin feed passed to `useLibraries`.
 * @param {Function} refreshFeed The feed-refresh callback passed to `useLibraries`.
 *
 * @since TBD
 *
 * @return {Object} `{ latest, unmount }` — `latest()` reads the hook's current return value.
 */
function renderUseLibraries(feed, refreshFeed) {
	let latest;

	function Harness() {
		latest = useLibraries(feed, refreshFeed);
		return null;
	}

	const container = document.createElement('div');
	const root = createRoot(container);

	act(() => {
		root.render(createElement(Harness));
	});

	return {
		latest: () => latest,
		unmount: () => act(() => root.unmount()),
	};
}

describe('useLibraries error scoping', () => {
	let hook;

	beforeEach(() => {
		jest.resetAllMocks();
		client.fetchLibraries.mockResolvedValue([{ slug: 'default', title: 'Default' }]);
	});

	afterEach(() => {
		hook?.unmount();
	});

	/**
	 * A failed switch must surface only through `switchError`, leaving `createError` and
	 * `deleteError` untouched — otherwise the delete/reset modal or the create modal could render
	 * an error that a switch, not their own action, produced.
	 *
	 * @return {Promise<void>}
	 */
	it('surfaces a failed switch only through switchError', async () => {
		client.setActiveLibrary.mockRejectedValue(new Error('Switch failed'));
		hook = renderUseLibraries({ slug: 'default' }, jest.fn());

		await act(async () => {
			await hook
				.latest()
				.switchLibrary('brand-b')
				.catch(() => {});
		});

		expect(hook.latest().switchError).toEqual({ message: 'Switch failed' });
		expect(hook.latest().createError).toBeNull();
		expect(hook.latest().deleteError).toBeNull();
	});

	/**
	 * A failed create must surface only through `createError`, even though creating chains an
	 * internal switch — a failure in that internal switch step must not leak into `switchError`,
	 * which the library dropdown reads independently of the create modal.
	 *
	 * @return {Promise<void>}
	 */
	it('surfaces a failed create only through createError', async () => {
		client.createLibrary.mockRejectedValue(new Error('Create failed'));
		hook = renderUseLibraries({ slug: 'default' }, jest.fn());

		await act(async () => {
			await hook
				.latest()
				.createLibrary('Brand B')
				.catch(() => {});
		});

		expect(hook.latest().createError).toEqual({ message: 'Create failed' });
		expect(hook.latest().switchError).toBeNull();
		expect(hook.latest().deleteError).toBeNull();
	});

	/**
	 * A failed delete must surface only through `deleteError`, leaving `switchError` untouched —
	 * otherwise a stale delete failure could resurface under the library dropdown.
	 *
	 * @return {Promise<void>}
	 */
	it('surfaces a failed delete only through deleteError', async () => {
		client.deleteLibrary.mockRejectedValue(new Error('Delete failed'));
		hook = renderUseLibraries({ slug: 'default' }, jest.fn());

		await act(async () => {
			await hook
				.latest()
				.deleteLibrary('default')
				.catch(() => {});
		});

		expect(hook.latest().deleteError).toEqual({ message: 'Delete failed' });
		expect(hook.latest().switchError).toBeNull();
		expect(hook.latest().createError).toBeNull();
	});

	/**
	 * Each flow clears its own error slot the moment it is invoked again, so a stale failure from
	 * a previous attempt never lingers once the same action is retried and succeeds.
	 *
	 * @return {Promise<void>}
	 */
	it('clears switchError when the switch is retried', async () => {
		client.setActiveLibrary.mockRejectedValueOnce(new Error('Switch failed'));
		client.setActiveLibrary.mockResolvedValueOnce({ slug: 'brand-b' });
		const refreshFeed = jest.fn().mockResolvedValue({ slug: 'brand-b' });
		hook = renderUseLibraries({ slug: 'default' }, refreshFeed);

		await act(async () => {
			await hook
				.latest()
				.switchLibrary('brand-b')
				.catch(() => {});
		});
		expect(hook.latest().switchError).toEqual({ message: 'Switch failed' });

		await act(async () => {
			await hook.latest().switchLibrary('brand-b');
		});
		expect(hook.latest().switchError).toBeNull();
	});

	/**
	 * `clearDeleteError` dismisses only the delete error, leaving the other flows' errors intact —
	 * the delete/reset modal must be able to clear its own error independently.
	 *
	 * @return {Promise<void>}
	 */
	it('clearDeleteError dismisses only the delete error', async () => {
		client.deleteLibrary.mockRejectedValue(new Error('Delete failed'));
		client.setActiveLibrary.mockRejectedValue(new Error('Switch failed'));
		hook = renderUseLibraries({ slug: 'default' }, jest.fn());

		await act(async () => {
			await hook
				.latest()
				.deleteLibrary('default')
				.catch(() => {});
		});
		await act(async () => {
			await hook
				.latest()
				.switchLibrary('brand-b')
				.catch(() => {});
		});

		expect(hook.latest().deleteError).toEqual({ message: 'Delete failed' });
		expect(hook.latest().switchError).toEqual({ message: 'Switch failed' });

		act(() => {
			hook.latest().clearDeleteError();
		});

		expect(hook.latest().deleteError).toBeNull();
		expect(hook.latest().switchError).toEqual({ message: 'Switch failed' });
	});
});
