/* eslint-env jest */
import { getBlockPresets, getLibraries } from './resolvers';
import { fetchBlockPresets, fetchLibraries } from '../api/client';

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

	it('getBlockPresets() fetches and dispatches receiveBlockPresets under the composite key', async () => {
		const payload = { version: 'a1', presets: {} };
		fetchBlockPresets.mockResolvedValueOnce(payload);

		const dispatch = { receiveBlockPresets: jest.fn() };
		await getBlockPresets('kb-design-tokens/v1', 'kadence/singlebtn', 'default')({ dispatch });

		expect(fetchBlockPresets).toHaveBeenCalledWith('kb-design-tokens/v1', 'kadence/singlebtn', 'default');
		expect(dispatch.receiveBlockPresets).toHaveBeenCalledWith(
			'kb-design-tokens/v1::kadence/singlebtn::default',
			payload
		);
	});
});
