/* eslint-env jest */
import {
	addScaleTokenFlow,
	deleteScaleTokenFlow,
	reorderScaleTokensFlow,
	saveScaleTokenFlow,
} from '../helpers/scale-flows';
import * as client from '../api/client';

// A factory, not bare automocking — see library-flows.test.js's identical note: the real module
// imports `@wordpress/api-fetch`, externalized in production and not an npm dependency here.
jest.mock('../api/client', () => ({
	createUserPrimitive: jest.fn(),
	deleteUserPrimitive: jest.fn(),
	saveTokenLeaf: jest.fn(),
	setGroupOrder: jest.fn(),
	setTokenLabel: jest.fn(),
}));

beforeEach(() => {
	jest.resetAllMocks();
});

describe('addScaleTokenFlow', () => {
	it('posts id, $type, $value, label, the stable group key, and version, refreshes the feed, and resolves the canonical id', async () => {
		client.createUserPrimitive.mockResolvedValue({ version: 'v2' });
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		const result = await addScaleTokenFlow({
			groupKey: 'radius',
			tokenType: 'dimension',
			slugBase: 'radius',
			label: 'New Radius',
			value: '0.5rem',
			existingIds: ['primitive.dimension.custom.radius'],
			slug: 'default',
			feedVersion: 'v1',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.createUserPrimitive).toHaveBeenCalledWith('default', {
			id: 'radius-2',
			$type: 'dimension',
			$value: '0.5rem',
			label: 'New Radius',
			group: 'radius',
			version: 'v1',
		});
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(result).toBe('primitive.dimension.custom.radius-2');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.createUserPrimitive.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			addScaleTokenFlow({
				groupKey: 'radius',
				tokenType: 'dimension',
				slugBase: 'radius',
				label: 'New Radius',
				value: '0.5rem',
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

describe('saveScaleTokenFlow', () => {
	const baseArgs = {
		slug: 'default',
		namespace: 'kb-design-tokens/v1',
		tokenId: 'primitive.dimension.radius.sm',
		tokenType: 'dimension',
		feedVersion: 'v1',
	};

	it('writes the label before the value when both changed', async () => {
		client.setTokenLabel.mockResolvedValue({});
		client.saveTokenLeaf.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const callOrder = [];
		client.setTokenLabel.mockImplementation(() => {
			callOrder.push('label');
			return Promise.resolve({});
		});
		client.saveTokenLeaf.mockImplementation(() => {
			callOrder.push('value');
			return Promise.resolve({});
		});

		await saveScaleTokenFlow({
			...baseArgs,
			draft: { label: 'Cozy SM', value: '0.25rem' },
			initial: { label: 'SM', value: '0.125rem' },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(callOrder).toEqual(['label', 'value']);
		expect(client.setTokenLabel).toHaveBeenCalledWith('default', baseArgs.tokenId, {
			label: 'Cozy SM',
			version: 'v1',
		});
		expect(client.saveTokenLeaf).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			baseArgs.tokenId,
			{ $type: 'dimension', $value: '0.25rem' },
			'default'
		);
		expect(refreshFeed).toHaveBeenCalledWith('default');
	});

	it('never calls setTokenLabel when the label is unchanged', async () => {
		client.saveTokenLeaf.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});

		await saveScaleTokenFlow({
			...baseArgs,
			draft: { label: 'SM', value: '0.25rem' },
			initial: { label: 'SM', value: '0.125rem' },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.setTokenLabel).not.toHaveBeenCalled();
		expect(client.saveTokenLeaf).toHaveBeenCalled();
	});

	it('never calls saveTokenLeaf when the value is unchanged', async () => {
		client.setTokenLabel.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});

		await saveScaleTokenFlow({
			...baseArgs,
			draft: { label: 'Cozy SM', value: '0.125rem' },
			initial: { label: 'SM', value: '0.125rem' },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.saveTokenLeaf).not.toHaveBeenCalled();
		expect(client.setTokenLabel).toHaveBeenCalled();
	});

	it('resolves without issuing a request when nothing changed', async () => {
		const refreshFeed = jest.fn();

		await saveScaleTokenFlow({
			...baseArgs,
			draft: { label: 'SM', value: '0.125rem' },
			initial: { label: 'SM', value: '0.125rem' },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.setTokenLabel).not.toHaveBeenCalled();
		expect(client.saveTokenLeaf).not.toHaveBeenCalled();
		expect(refreshFeed).not.toHaveBeenCalled();
	});

	it('refreshes the feed once after a successful save', async () => {
		client.setTokenLabel.mockResolvedValue({});
		client.saveTokenLeaf.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});

		await saveScaleTokenFlow({
			...baseArgs,
			draft: { label: 'Cozy SM', value: '0.25rem' },
			initial: { label: 'SM', value: '0.125rem' },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(refreshFeed).toHaveBeenCalledTimes(1);
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.setTokenLabel.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			saveScaleTokenFlow({
				...baseArgs,
				draft: { label: 'Cozy SM', value: '0.125rem' },
				initial: { label: 'SM', value: '0.125rem' },
				refreshFeed,
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(refreshFeed).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('uses the supplied buildLeaf for the value write', async () => {
		client.saveTokenLeaf.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const buildLeaf = jest.fn().mockReturnValue({ $type: 'shadow', $value: { color: '#171717' } });
		const draftValue = { color: '#171717', offsetX: 0, offsetY: 2, blur: 8, spread: 0, inset: false };

		await saveScaleTokenFlow({
			...baseArgs,
			tokenType: 'shadow',
			draft: { label: 'MD', value: draftValue },
			initial: { label: 'MD', value: { ...draftValue, offsetY: 4 } },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
			buildLeaf,
		});

		expect(buildLeaf).toHaveBeenCalledWith('shadow', draftValue);
		expect(client.saveTokenLeaf).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			baseArgs.tokenId,
			{ $type: 'shadow', $value: { color: '#171717' } },
			'default'
		);
	});

	it('defaults to buildTokenLeaf when no buildLeaf is supplied', async () => {
		client.saveTokenLeaf.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});

		await saveScaleTokenFlow({
			...baseArgs,
			draft: { label: 'SM', value: '0.25rem' },
			initial: { label: 'SM', value: '0.125rem' },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.saveTokenLeaf).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			baseArgs.tokenId,
			{ $type: 'dimension', $value: '0.25rem' },
			'default'
		);
	});

	it('detects an object value change deeply, issuing no request when unchanged', async () => {
		const refreshFeed = jest.fn();
		const draftValue = { color: '#171717', offsetX: 0, offsetY: 2, blur: 8, spread: 0, inset: false };

		await saveScaleTokenFlow({
			...baseArgs,
			draft: { label: 'MD', value: { ...draftValue } },
			initial: { label: 'MD', value: { ...draftValue } },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.setTokenLabel).not.toHaveBeenCalled();
		expect(client.saveTokenLeaf).not.toHaveBeenCalled();
		expect(refreshFeed).not.toHaveBeenCalled();
	});
});

describe('deleteScaleTokenFlow', () => {
	it('deletes with the feed version and refreshes', async () => {
		client.deleteUserPrimitive.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		await deleteScaleTokenFlow({
			slug: 'default',
			tokenId: 'primitive.dimension.custom.radius-2',
			feedVersion: 'v1',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.deleteUserPrimitive).toHaveBeenCalledWith('default', 'primitive.dimension.custom.radius-2', 'v1');
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.deleteUserPrimitive.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			deleteScaleTokenFlow({
				slug: 'default',
				tokenId: 'primitive.dimension.custom.radius-2',
				feedVersion: 'v1',
				refreshFeed,
				onBusy,
				onError,
			})
		).rejects.toBe(failure);

		expect(onError).toHaveBeenCalledWith({ message: failure.message });
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});
});

describe('reorderScaleTokensFlow', () => {
	it('PUTs the full ordered id list with the version and refreshes', async () => {
		client.setGroupOrder.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		await reorderScaleTokensFlow({
			slug: 'default',
			group: 'Border Radius',
			orderedIds: ['b', 'a'],
			feedVersion: 'v1',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.setGroupOrder).toHaveBeenCalledWith('default', 'Border Radius', {
			order: ['b', 'a'],
			version: 'v1',
		});
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.setGroupOrder.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			reorderScaleTokensFlow({
				slug: 'default',
				group: 'Border Radius',
				orderedIds: ['b', 'a'],
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
