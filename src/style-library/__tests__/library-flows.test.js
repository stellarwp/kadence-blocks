/* eslint-env jest */
import { createLibraryFlow, deleteLibraryFlow, errorMessage, switchLibraryFlow } from '../helpers/library-flows';
import * as client from '../api/client';

// A factory, not bare automocking: the real module imports `@wordpress/api-fetch`, which is
// externalized to the `wp.apiFetch` global in production and is not installed as an npm
// dependency, so automocking (which loads the real module to introspect its shape) would fail to
// resolve it.
jest.mock('../api/client', () => ({
	createLibrary: jest.fn(),
	deleteLibrary: jest.fn(),
	getActiveLibrary: jest.fn(),
	setActiveLibrary: jest.fn(),
}));

beforeEach(() => {
	jest.resetAllMocks();
});

describe('errorMessage', () => {
	it('reads the message off the error when present', () => {
		expect(errorMessage({ message: 'Boom' })).toBe('Boom');
	});

	it('falls back to a generic message when the error carries none', () => {
		expect(errorMessage(undefined)).toMatch(/something went wrong/i);
		expect(errorMessage({})).toMatch(/something went wrong/i);
	});
});

describe('switchLibraryFlow', () => {
	it('activates the library, refreshes the feed, and never reloads the page', async () => {
		client.setActiveLibrary.mockResolvedValue({ slug: 'brand-b' });
		const refreshFeed = jest.fn().mockResolvedValue({ slug: 'brand-b' });
		const onBusy = jest.fn();
		const onError = jest.fn();

		await switchLibraryFlow({ slug: 'brand-b', refreshFeed, onBusy, onError });

		expect(client.setActiveLibrary).toHaveBeenCalledWith('brand-b');
		expect(refreshFeed).toHaveBeenCalledWith('brand-b');
		// Busy is toggled on, then off, on the success path — nothing else settles it.
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and rejects on failure', async () => {
		const failure = new Error('Sorry, that design token library does not exist.');
		client.setActiveLibrary.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(switchLibraryFlow({ slug: 'ghost', refreshFeed, onBusy, onError })).rejects.toBe(failure);

		expect(refreshFeed).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});

describe('createLibraryFlow', () => {
	it('rejects without calling the API when the title is empty', async () => {
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			createLibraryFlow({
				title: '   ',
				libraries: [],
				switchLibrary: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toThrow();

		expect(client.createLibrary).not.toHaveBeenCalled();
		expect(onBusy).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/enter a library title/i) });
	});

	it('rejects without calling the API when the title collides with an existing library', async () => {
		const onError = jest.fn();

		await expect(
			createLibraryFlow({
				title: 'Brand A',
				libraries: [{ slug: 'brand-a' }],
				switchLibrary: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.createLibrary).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/already exists/i) });
	});

	it('creates, switches, and refreshes the libraries list, and never reloads the page', async () => {
		client.createLibrary.mockResolvedValue({ slug: 'brand-b' });
		const switchLibrary = jest.fn().mockResolvedValue(undefined);
		const loadLibraries = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await createLibraryFlow({
			title: 'Brand B',
			libraries: [],
			switchLibrary,
			loadLibraries,
			onBusy,
			onError,
		});

		expect(client.createLibrary).toHaveBeenCalledWith('brand-b', 'Brand B');
		expect(switchLibrary).toHaveBeenCalledWith('brand-b');
		expect(loadLibraries).toHaveBeenCalled();
		expect(onBusy).toHaveBeenCalledWith(true);
		expect(onError).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and rejects when the create request fails', async () => {
		const failure = new Error('A library with that title already exists.');
		client.createLibrary.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			createLibraryFlow({
				title: 'Brand B',
				libraries: [],
				switchLibrary: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy).toHaveBeenLastCalledWith(false);
	});
});

describe('deleteLibraryFlow', () => {
	it('deletes a non-active library and only refreshes the libraries list', async () => {
		client.deleteLibrary.mockResolvedValue({ deleted: true });
		const refreshFeed = jest.fn();
		const loadLibraries = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();

		await deleteLibraryFlow({
			slug: 'brand-b',
			activeSlug: 'default',
			refreshFeed,
			loadLibraries,
			onBusy,
			onError: jest.fn(),
		});

		expect(client.deleteLibrary).toHaveBeenCalledWith('brand-b');
		expect(refreshFeed).not.toHaveBeenCalled();
		expect(loadLibraries).toHaveBeenCalled();
		expect(onBusy).toHaveBeenLastCalledWith(false);
	});

	it('deleting the active library re-reads the resolved pointer, refreshes the feed for it, and never reloads the page', async () => {
		client.deleteLibrary.mockResolvedValue({ deleted: true });
		client.getActiveLibrary.mockResolvedValue({ slug: 'default' });
		const refreshFeed = jest.fn().mockResolvedValue({ slug: 'default' });
		const loadLibraries = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();

		await deleteLibraryFlow({
			slug: 'brand-b',
			activeSlug: 'brand-b',
			refreshFeed,
			loadLibraries,
			onBusy,
			onError: jest.fn(),
		});

		expect(client.deleteLibrary).toHaveBeenCalledWith('brand-b');
		expect(client.getActiveLibrary).toHaveBeenCalled();
		// The feed is refreshed for whatever the server resolves the pointer to, not the deleted slug.
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(loadLibraries).toHaveBeenCalled();
		expect(onBusy).toHaveBeenLastCalledWith(false);
	});

	it('surfaces the error, clears busy, and rejects when the delete request fails', async () => {
		const failure = new Error('The design token library could not be deleted.');
		client.deleteLibrary.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			deleteLibraryFlow({
				slug: 'brand-b',
				activeSlug: 'default',
				refreshFeed: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy).toHaveBeenLastCalledWith(false);
	});
});
