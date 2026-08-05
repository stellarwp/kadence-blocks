/* eslint-env jest */
import {
	activateLibraryFlow,
	createLibraryFlow,
	deleteLibraryFlow,
	errorMessage,
	openLibraryFlow,
	renameLibraryFlow,
} from '../helpers/library-flows';
import * as client from '../api/client';

// A factory, not bare automocking: the real module imports `@wordpress/api-fetch`, which is
// externalized to the `wp.apiFetch` global in production and is not installed as an npm
// dependency, so automocking (which loads the real module to introspect its shape) would fail to
// resolve it.
jest.mock('../api/client', () => ({
	createLibrary: jest.fn(),
	deleteLibrary: jest.fn(),
	getActiveLibrary: jest.fn(),
	renameLibrary: jest.fn(),
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

describe('openLibraryFlow', () => {
	// The regression test for the whole phase: choosing a library in the header dropdown must never
	// change which library the site uses. If this ever fails, one click restyles the live site.
	it('refreshes the feed without touching the active-library pointer', async () => {
		const refreshFeed = jest.fn().mockResolvedValue({ slug: 'brand-b' });
		const onBusy = jest.fn();
		const onError = jest.fn();

		await openLibraryFlow({ slug: 'brand-b', refreshFeed, onBusy, onError });

		expect(refreshFeed).toHaveBeenCalledWith('brand-b');
		expect(client.setActiveLibrary).not.toHaveBeenCalled();
		// Busy is toggled on, then off, on the success path — nothing else settles it.
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and rejects on failure', async () => {
		const failure = new Error('Sorry, that design token library does not exist.');
		const refreshFeed = jest.fn().mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(openLibraryFlow({ slug: 'ghost', refreshFeed, onBusy, onError })).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});

describe('activateLibraryFlow', () => {
	it('moves the pointer and reports the slug the server resolved, not the one requested', async () => {
		// The response deliberately differs from the request: the server owns which library ended
		// up active, and this asserts the flow reads it back rather than assuming.
		client.setActiveLibrary.mockResolvedValue({ slug: 'brand-b-resolved' });
		const onActivated = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await activateLibraryFlow({ slug: 'brand-b', onBusy, onError, onActivated });

		expect(client.setActiveLibrary).toHaveBeenCalledWith('brand-b');
		expect(onActivated).toHaveBeenCalledWith('brand-b-resolved');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	// Activating the library already on screen changes which library the front end reads, not any
	// value inside it — a feed refresh here would cost a request and re-render every screen to
	// produce identical output. Locked in so it is not "restored" as a missing step later.
	it('does not refresh the feed', async () => {
		client.setActiveLibrary.mockResolvedValue({ slug: 'brand-b' });
		const refreshFeed = jest.fn();

		await activateLibraryFlow({
			slug: 'brand-b',
			onBusy: jest.fn(),
			onError: jest.fn(),
			onActivated: jest.fn(),
			// Passed deliberately even though the signature ignores it — if someone wires a refresh
			// back into this flow, this assertion is what catches it.
			refreshFeed,
		});

		expect(refreshFeed).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and rejects on failure', async () => {
		const failure = new Error('Sorry, that design token library does not exist.');
		client.setActiveLibrary.mockRejectedValue(failure);
		const onActivated = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(activateLibraryFlow({ slug: 'ghost', onBusy, onError, onActivated })).rejects.toBe(failure);

		expect(onActivated).not.toHaveBeenCalled();
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
				openLibrary: jest.fn(),
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
				openLibrary: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.createLibrary).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/already exists/i) });
	});

	// The second regression test for the phase: creating a library must not publish it to the site.
	it('creates and opens the new library without activating it', async () => {
		client.createLibrary.mockResolvedValue({ slug: 'brand-b' });
		const openLibrary = jest.fn().mockResolvedValue(undefined);
		const loadLibraries = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await createLibraryFlow({
			title: 'Brand B',
			libraries: [],
			openLibrary,
			loadLibraries,
			onBusy,
			onError,
		});

		expect(client.createLibrary).toHaveBeenCalledWith('brand-b', 'Brand B');
		expect(openLibrary).toHaveBeenCalledWith('brand-b');
		expect(client.setActiveLibrary).not.toHaveBeenCalled();
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
				openLibrary: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy).toHaveBeenLastCalledWith(false);
	});

	it('routes a failure from the post-create open step through its own onError, never calling loadLibraries', async () => {
		client.createLibrary.mockResolvedValue({ slug: 'brand-b' });
		const openFailure = new Error('Open failed');
		const openLibrary = jest.fn().mockRejectedValue(openFailure);
		const loadLibraries = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			createLibraryFlow({
				title: 'Brand B',
				libraries: [],
				openLibrary,
				loadLibraries,
				onBusy,
				onError,
			})
		).rejects.toBe(openFailure);

		expect(openLibrary).toHaveBeenCalledWith('brand-b');
		expect(loadLibraries).not.toHaveBeenCalled();
		// The caller (use-libraries) binds this onError to createError, never to openError — a
		// failure in the internal open step must still report through create's own callback.
		expect(onError).toHaveBeenCalledWith({ message: openFailure.message });
	});
});

describe('renameLibraryFlow', () => {
	it('renames the library and refreshes the list without touching the feed', async () => {
		client.renameLibrary.mockResolvedValue({ slug: 'brand-a' });
		const loadLibraries = jest.fn().mockResolvedValue(undefined);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await renameLibraryFlow({
			slug: 'brand-a',
			title: '  Winter 2026  ',
			libraries: [{ slug: 'brand-a', title: 'Brand A' }],
			loadLibraries,
			onBusy,
			onError,
			refreshFeed,
		});

		// Trimmed before it reaches the API — the stored title should never carry stray whitespace.
		expect(client.renameLibrary).toHaveBeenCalledWith('brand-a', 'Winter 2026');
		expect(loadLibraries).toHaveBeenCalled();
		// A library's name is not part of the feed payload, so there is nothing to re-read.
		expect(refreshFeed).not.toHaveBeenCalled();
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('rejects without calling the API when the new title is blank', async () => {
		const onError = jest.fn();
		const onBusy = jest.fn();

		await expect(
			renameLibraryFlow({
				slug: 'brand-a',
				title: '   ',
				libraries: [{ slug: 'brand-a', title: 'Brand A' }],
				loadLibraries: jest.fn(),
				onBusy,
				onError,
			})
		).rejects.toThrow();

		// The server reads an empty title as "leave it alone", so a blank rename would look like it
		// worked and change nothing — refusing here is what makes that honest.
		expect(client.renameLibrary).not.toHaveBeenCalled();
		expect(onBusy).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/enter a library title/i) });
	});

	it('rejects without calling the API when another library already has that name', async () => {
		const onError = jest.fn();

		await expect(
			renameLibraryFlow({
				slug: 'brand-a',
				title: 'Brand B',
				libraries: [
					{ slug: 'brand-a', title: 'Brand A' },
					{ slug: 'brand-b', title: 'Brand B' },
				],
				loadLibraries: jest.fn(),
				onBusy: jest.fn(),
				onError,
			})
		).rejects.toThrow();

		expect(client.renameLibrary).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/already exists/i) });
	});

	it('allows a library to keep its own name', async () => {
		client.renameLibrary.mockResolvedValue({ slug: 'brand-a' });
		const loadLibraries = jest.fn().mockResolvedValue(undefined);

		// The user may edit the field and revert it; the library must not collide with itself.
		await renameLibraryFlow({
			slug: 'brand-a',
			title: 'Brand A',
			libraries: [{ slug: 'brand-a', title: 'Brand A' }],
			loadLibraries,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.renameLibrary).toHaveBeenCalledWith('brand-a', 'Brand A');
	});

	it('surfaces the error, clears busy, and rejects when the rename request fails', async () => {
		const failure = new Error('Sorry, that design token library does not exist.');
		client.renameLibrary.mockRejectedValue(failure);
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			renameLibraryFlow({
				slug: 'brand-a',
				title: 'Winter 2026',
				libraries: [{ slug: 'brand-a', title: 'Brand A' }],
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
	it('deletes a non-active library and moves the app to the library the site uses', async () => {
		client.deleteLibrary.mockResolvedValue({ deleted: true });
		const refreshFeed = jest.fn().mockResolvedValue({ slug: 'default' });
		const loadLibraries = jest.fn().mockResolvedValue(undefined);
		const onBusy = jest.fn();

		await deleteLibraryFlow({
			slug: 'brand-b',
			activeSlug: 'default',
			refreshFeed,
			loadLibraries,
			onBusy,
			onError: jest.fn(),
			onActiveChanged: jest.fn(),
		});

		expect(client.deleteLibrary).toHaveBeenCalledWith('brand-b');
		// The app was showing the deleted library, so the feed cannot stay on it.
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(client.setActiveLibrary).not.toHaveBeenCalled();
		expect(loadLibraries).toHaveBeenCalled();
		expect(onBusy).toHaveBeenLastCalledWith(false);
	});

	it('activates the successor before deleting the active library', async () => {
		// A shared call log, not two independent mocks: the ordering IS the correctness property
		// here, and separate mocks can only prove both ran, never in which order.
		const calls = [];
		client.setActiveLibrary.mockImplementation((slug) => {
			calls.push(`activate:${slug}`);
			return Promise.resolve({ slug });
		});
		client.deleteLibrary.mockImplementation((slug) => {
			calls.push(`delete:${slug}`);
			return Promise.resolve({ deleted: true });
		});
		const onActiveChanged = jest.fn();
		const refreshFeed = jest.fn().mockResolvedValue({ slug: 'brand-c' });

		await deleteLibraryFlow({
			slug: 'brand-b',
			activeSlug: 'brand-b',
			successorSlug: 'brand-c',
			refreshFeed,
			loadLibraries: jest.fn().mockResolvedValue(undefined),
			onBusy: jest.fn(),
			onError: jest.fn(),
			onActiveChanged,
		});

		// Deleting first would let the server fall the pointer back to the default in between,
		// briefly serving a site-wide look nobody chose.
		expect(calls).toEqual(['activate:brand-c', 'delete:brand-b']);
		expect(onActiveChanged).toHaveBeenCalledWith('brand-c');
		expect(refreshFeed).toHaveBeenCalledWith('brand-c');
	});

	// The requirement's regression test: nothing may be destroyed when no successor was named.
	it('refuses to delete the active library when no successor was chosen', async () => {
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			deleteLibraryFlow({
				slug: 'brand-b',
				activeSlug: 'brand-b',
				refreshFeed: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy,
				onError,
				onActiveChanged: jest.fn(),
			})
		).rejects.toThrow();

		expect(client.deleteLibrary).not.toHaveBeenCalled();
		expect(client.setActiveLibrary).not.toHaveBeenCalled();
		expect(onBusy).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: expect.stringMatching(/choose which library/i) });
	});

	it('leaves the target intact when activating the successor fails', async () => {
		const failure = new Error('Sorry, that design token library does not exist.');
		client.setActiveLibrary.mockRejectedValue(failure);
		const onError = jest.fn();

		await expect(
			deleteLibraryFlow({
				slug: 'brand-b',
				activeSlug: 'brand-b',
				successorSlug: 'ghost',
				refreshFeed: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy: jest.fn(),
				onError,
				onActiveChanged: jest.fn(),
			})
		).rejects.toBe(failure);

		// Nothing was destroyed, and the pointer never moved — fully recoverable.
		expect(client.deleteLibrary).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: failure.message });
	});

	// Documents the one partial outcome this ordering accepts, so it is not later read as a bug:
	// the site sits on a library the user explicitly chose and the target survives, which a retry
	// finishes off. The alternative ordering trades this for default styles nobody picked.
	it('reports the successor as active even when the delete itself fails', async () => {
		const failure = new Error('The design token library could not be deleted.');
		client.setActiveLibrary.mockResolvedValue({ slug: 'brand-c' });
		client.deleteLibrary.mockRejectedValue(failure);
		const onActiveChanged = jest.fn();
		const onError = jest.fn();

		await expect(
			deleteLibraryFlow({
				slug: 'brand-b',
				activeSlug: 'brand-b',
				successorSlug: 'brand-c',
				refreshFeed: jest.fn(),
				loadLibraries: jest.fn(),
				onBusy: jest.fn(),
				onError,
				onActiveChanged,
			})
		).rejects.toBe(failure);

		expect(onActiveChanged).toHaveBeenCalledWith('brand-c');
		expect(onError).toHaveBeenCalledWith({ message: failure.message });
	});

	it('resets the active default library in place, with no successor and no activation', async () => {
		client.deleteLibrary.mockResolvedValue({ deleted: false });
		const refreshFeed = jest.fn().mockResolvedValue({ slug: 'default' });
		const loadLibraries = jest.fn().mockResolvedValue(undefined);

		await deleteLibraryFlow({
			slug: 'default',
			activeSlug: 'default',
			refreshFeed,
			loadLibraries,
			onBusy: jest.fn(),
			onError: jest.fn(),
			onActiveChanged: jest.fn(),
		});

		// The default library is reset rather than removed, so it stays put and stays active —
		// there is no successor question to answer.
		expect(client.setActiveLibrary).not.toHaveBeenCalled();
		expect(client.deleteLibrary).toHaveBeenCalledWith('default');
		// Refreshed against itself, to pick up its now-baseline values.
		expect(refreshFeed).toHaveBeenCalledWith('default');
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
				onActiveChanged: jest.fn(),
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy).toHaveBeenLastCalledWith(false);
	});
});
