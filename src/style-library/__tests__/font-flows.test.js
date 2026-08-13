/* eslint-env jest */
// cspell:ignore Abril Fatface abril fatface .
import { addFontFlow } from '../helpers/font-flows';
import * as client from '../api/client';

// A factory, not bare automocking — see scale-flows.test.js's identical note: the real module
// imports `@wordpress/api-fetch`, externalized in production and not an npm dependency here.
jest.mock('../api/client', () => ({
	createUserPrimitive: jest.fn(),
}));

beforeEach(() => {
	jest.resetAllMocks();
});

describe('addFontFlow', () => {
	it('posts the derived slug, label, single-family stack, and font-family group, refreshes the feed, and resolves the kebab canonical id', async () => {
		client.createUserPrimitive.mockResolvedValue({ version: 'v2' });
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		const result = await addFontFlow({
			name: 'Abril Fatface',
			existingIds: [],
			slug: 'default',
			feedVersion: 'v1',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.createUserPrimitive).toHaveBeenCalledWith('default', {
			id: 'abril-fatface',
			$type: 'fontFamily',
			$value: ['Abril Fatface'],
			label: 'Abril Fatface',
			group: 'font-family',
			version: 'v1',
		});
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(result).toBe('primitive.font-family.custom.abril-fatface');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('suffixes the derived slug on collision with an existing id', async () => {
		client.createUserPrimitive.mockResolvedValue({ version: 'v2' });
		const refreshFeed = jest.fn().mockResolvedValue({});

		const result = await addFontFlow({
			name: 'Abel',
			existingIds: ['primitive.font-family.custom.abel'],
			slug: 'default',
			feedVersion: 'v1',
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.createUserPrimitive).toHaveBeenCalledWith('default', expect.objectContaining({ id: 'abel-2' }));
		expect(result).toBe('primitive.font-family.custom.abel-2');
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.createUserPrimitive.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			addFontFlow({
				name: 'Abel',
				existingIds: [],
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
