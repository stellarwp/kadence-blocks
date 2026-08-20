/* eslint-env jest */
import { getBlockPresets, getLibraries, getPaletteListing } from './resolvers';
import { fetchBlockPresets, fetchLibraries, fetchPalettes } from '../api/client';

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

	it('getPaletteListing() fetches and dispatches receivePaletteListing under the composite key', async () => {
		const rows = [{ id: 'default', label: 'Default', is_default: true, is_current: true, user_created: false }];
		fetchPalettes.mockResolvedValueOnce(rows);

		const dispatch = { receivePaletteListing: jest.fn() };
		await getPaletteListing('kb-design-tokens/v1', 'default')({ dispatch });

		expect(fetchPalettes).toHaveBeenCalledWith('kb-design-tokens/v1', 'default');
		expect(dispatch.receivePaletteListing).toHaveBeenCalledWith('kb-design-tokens/v1::default', rows);
	});
});
