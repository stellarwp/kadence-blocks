/* eslint-env jest */
// cspell:ignore Abril Fatface .
import { addFavoriteFontFlow, removeFavoriteFontFlow } from '../helpers/font-flows';
import * as client from '../api/client';

// A factory, not bare automocking — see scale-flows.test.js's identical note: the real module
// imports `@wordpress/api-fetch`, externalized in production and not an npm dependency here.
jest.mock('../api/client', () => ({
	addFavoriteFont: jest.fn(),
	removeFavoriteFont: jest.fn(),
}));

beforeEach(() => {
	jest.resetAllMocks();
});

describe('addFavoriteFontFlow', () => {
	it('sends the family name verbatim with the client version, refreshes the feed, and resolves the name', async () => {
		client.addFavoriteFont.mockResolvedValue({ version: 'v2' });
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		const result = await addFavoriteFontFlow({
			name: 'Abril Fatface',
			slug: 'default',
			feedVersion: 'v1',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.addFavoriteFont).toHaveBeenCalledWith('default', 'Abril Fatface', { version: 'v1' });
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(result).toBe('Abril Fatface');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.addFavoriteFont.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			addFavoriteFontFlow({
				name: 'Abel',
				slug: 'default',
				feedVersion: 'v1',
				refreshFeed,
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(refreshFeed).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});

describe('removeFavoriteFontFlow', () => {
	it('sends the family name with the client version, refreshes the feed, and resolves the name', async () => {
		client.removeFavoriteFont.mockResolvedValue({ version: 'v2' });
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		const result = await removeFavoriteFontFlow({
			name: 'Abril Fatface',
			slug: 'default',
			feedVersion: 'v1',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.removeFavoriteFont).toHaveBeenCalledWith('default', 'Abril Fatface', { version: 'v1' });
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(result).toBe('Abril Fatface');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.removeFavoriteFont.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			removeFavoriteFontFlow({
				name: 'Abel',
				slug: 'default',
				feedVersion: 'v1',
				refreshFeed,
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(refreshFeed).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});
