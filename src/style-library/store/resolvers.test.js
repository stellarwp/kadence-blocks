/* eslint-env jest */
import { getLibraries } from './resolvers';
import { fetchLibraries } from '../api/client';

jest.mock('../api/client', () => ({
	fetchLibraries: jest.fn(),
	fetchBlockPresets: jest.fn(),
	fetchPalettes: jest.fn(),
	fetchPalette: jest.fn(),
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
});
