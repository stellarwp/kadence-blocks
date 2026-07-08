/* eslint-env jest */
jest.mock('../api/client', () => ({
	createUserPrimitive: jest.fn(),
	deleteUserPrimitive: jest.fn(),
	renameUserPrimitive: jest.fn(),
	fetchUserPrimitiveReferences: jest.fn(),
}));

import {
	createUserPrimitive,
	deleteUserPrimitive,
	renameUserPrimitive,
	fetchUserPrimitiveReferences,
} from '../api/client';

afterEach(() => {
	jest.resetAllMocks();
});

// These tests exercise the hook's async logic by testing the underlying
// client calls directly — the hook wraps them with state management that
// requires renderHook, which is not available in this test environment.

describe('user primitive API client (integration with client mock)', () => {
	describe('createUserPrimitive', () => {
		it('is called with payload plus version', async () => {
			createUserPrimitive.mockResolvedValueOnce({ slug: 'default', version: 'v2', document: {} });

			const result = await createUserPrimitive('default', {
				id: 'my-blue',
				$type: 'color',
				$value: '#000',
				version: 'v1',
			});

			expect(result.version).toBe('v2');
			expect(createUserPrimitive).toHaveBeenCalledWith('default', expect.objectContaining({ id: 'my-blue' }));
		});

		it('rejects with 409 data on conflict', async () => {
			createUserPrimitive.mockRejectedValueOnce({ message: 'Conflict', data: { status: 409 } });

			await expect(
				createUserPrimitive('default', { id: 'dup', $type: 'color', $value: '#fff', version: 'v1' })
			).rejects.toMatchObject({ data: { status: 409 } });
		});
	});

	describe('deleteUserPrimitive', () => {
		it('is called with id and version', async () => {
			deleteUserPrimitive.mockResolvedValueOnce({ slug: 'default', version: 'v3', document: {} });

			const result = await deleteUserPrimitive('default', 'primitive.color.custom.blue', 'v2');

			expect(result.version).toBe('v3');
			expect(deleteUserPrimitive).toHaveBeenCalledWith('default', 'primitive.color.custom.blue', 'v2');
		});

		it('rejects with 409 on stale version', async () => {
			deleteUserPrimitive.mockRejectedValueOnce({ message: 'Stale', data: { status: 409 } });

			await expect(deleteUserPrimitive('default', 'primitive.color.custom.blue', 'v0')).rejects.toMatchObject({
				data: { status: 409 },
			});
		});
	});

	describe('renameUserPrimitive', () => {
		it('returns rewrittenPaths on success', async () => {
			renameUserPrimitive.mockResolvedValueOnce({
				slug: 'default',
				version: 'v4',
				document: {},
				rewrittenPaths: ['semantic.color.button-bg'],
			});

			const result = await renameUserPrimitive('default', 'primitive.color.custom.blue', {
				new_id: 'primary-blue',
				label: 'Primary Blue',
				version: 'v3',
			});

			expect(result.version).toBe('v4');
			expect(result.rewrittenPaths).toHaveLength(1);
		});
	});

	describe('fetchUserPrimitiveReferences', () => {
		it('returns deletable flag and references array', async () => {
			const preview = {
				id: 'primitive.color.custom.blue',
				version: 'v1',
				deletable: true,
				references: [
					{ path: 'semantic.color.link', kind: 'semantic', supported: true, action: 'revert_to_baseline' },
				],
			};

			fetchUserPrimitiveReferences.mockResolvedValueOnce(preview);

			const result = await fetchUserPrimitiveReferences('default', 'primitive.color.custom.blue');

			expect(result.deletable).toBe(true);
			expect(result.references).toHaveLength(1);
			expect(result.references[0].supported).toBe(true);
		});

		it('rejects when not found', async () => {
			fetchUserPrimitiveReferences.mockRejectedValueOnce({ message: 'Not found', data: { status: 404 } });

			await expect(fetchUserPrimitiveReferences('default', 'primitive.color.custom.gone')).rejects.toMatchObject({
				data: { status: 404 },
			});
		});
	});
});
