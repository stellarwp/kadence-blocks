/* eslint-env jest */
import { createPresetFlow, deletePresetFlow, reorderPresetsFlow, savePresetFlow } from '../helpers/preset-flows';
import * as client from '../api/client';

// A factory, not bare automocking — see scale-flows.test.js's identical note: the real module
// imports `@wordpress/api-fetch`, externalized in production and not an npm dependency here.
jest.mock('../api/client', () => ({
	fetchBlockPresets: jest.fn(),
	saveBlockPreset: jest.fn(),
	deleteBlockPreset: jest.fn(),
	setBlockPresetOrder: jest.fn(),
}));

beforeEach(() => {
	jest.resetAllMocks();
});

describe('createPresetFlow', () => {
	const defaultTokens = {
		'button-bg': 'semantic.color.action-primary',
		'button-text': 'semantic.color.on-primary',
		'button-bg-hover': 'semantic.color.action-primary-hover',
		'button-text-hover': 'semantic.color.on-primary',
		'button-radius': 'semantic.dimension.radius-md',
	};

	it('mints the base slug, posts the translated label and the default tokens wrapped as aliases, refreshes the feed, and resolves the slug', async () => {
		client.saveBlockPreset.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		const result = await createPresetFlow({
			namespace: 'kb-design-tokens/v1',
			block: 'kadence/singlebtn',
			existingSlugs: ['primary', 'secondary'],
			defaultTokens,
			slug: 'default',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.saveBlockPreset).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			'kadence/singlebtn',
			{
				preset: 'button',
				label: 'New Button',
				tokens: {
					'button-bg': '{semantic.color.action-primary}',
					'button-text': '{semantic.color.on-primary}',
					'button-bg-hover': '{semantic.color.action-primary-hover}',
					'button-text-hover': '{semantic.color.on-primary}',
					'button-radius': '{semantic.dimension.radius-md}',
				},
			},
			'default'
		);
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(result).toBe('button');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('mints button-2 when button is already taken', async () => {
		client.saveBlockPreset.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});

		const result = await createPresetFlow({
			namespace: 'kb-design-tokens/v1',
			block: 'kadence/singlebtn',
			existingSlugs: ['primary', 'secondary', 'button'],
			defaultTokens,
			slug: 'default',
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.saveBlockPreset).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			'kadence/singlebtn',
			expect.objectContaining({ preset: 'button-2' }),
			'default'
		);
		expect(result).toBe('button-2');
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.saveBlockPreset.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			createPresetFlow({
				namespace: 'kb-design-tokens/v1',
				block: 'kadence/singlebtn',
				existingSlugs: [],
				defaultTokens,
				slug: 'default',
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

describe('savePresetFlow', () => {
	const baseArgs = {
		namespace: 'kb-design-tokens/v1',
		block: 'kadence/singlebtn',
		preset: 'primary',
		slug: 'default',
	};

	it('skips the request entirely for an unchanged draft', async () => {
		const refreshFeed = jest.fn();
		const draft = {
			label: 'Primary',
			tokens: { 'button-bg': 'semantic.color.action-primary' },
		};

		await savePresetFlow({
			...baseArgs,
			draft,
			initialValues: { label: 'Primary', tokens: { 'button-bg': 'semantic.color.action-primary' } },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.saveBlockPreset).not.toHaveBeenCalled();
		expect(refreshFeed).not.toHaveBeenCalled();
	});

	it('posts the label and all five wrapped tokens when the draft is dirty, and refreshes the feed', async () => {
		client.saveBlockPreset.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		await savePresetFlow({
			...baseArgs,
			draft: {
				label: 'Main Action',
				tokens: {
					'button-bg': 'semantic.color.action-primary',
					'button-text': 'semantic.color.on-primary',
					'button-bg-hover': 'semantic.color.action-primary-hover',
					'button-text-hover': 'semantic.color.on-primary',
					'button-radius': 'semantic.dimension.radius-md',
				},
			},
			initialValues: {
				label: 'Primary',
				tokens: {
					'button-bg': 'semantic.color.action-primary',
					'button-text': 'semantic.color.on-primary',
					'button-bg-hover': 'semantic.color.action-primary-hover',
					'button-text-hover': 'semantic.color.on-primary',
					'button-radius': 'semantic.dimension.radius-md',
				},
			},
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.saveBlockPreset).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			'kadence/singlebtn',
			{
				preset: 'primary',
				label: 'Main Action',
				tokens: {
					'button-bg': '{semantic.color.action-primary}',
					'button-text': '{semantic.color.on-primary}',
					'button-bg-hover': '{semantic.color.action-primary-hover}',
					'button-text-hover': '{semantic.color.on-primary}',
					'button-radius': '{semantic.dimension.radius-md}',
				},
			},
			'default'
		);
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('posts the full token map even for a label-only rename, leaving the stored map intact', async () => {
		client.saveBlockPreset.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const tokens = { 'button-bg': 'semantic.color.action-primary' };

		await savePresetFlow({
			...baseArgs,
			draft: { label: 'Renamed', tokens },
			initialValues: { label: 'Primary', tokens },
			refreshFeed,
			onBusy: jest.fn(),
			onError: jest.fn(),
		});

		expect(client.saveBlockPreset).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			'kadence/singlebtn',
			{
				preset: 'primary',
				label: 'Renamed',
				tokens: { 'button-bg': '{semantic.color.action-primary}' },
			},
			'default'
		);
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.saveBlockPreset.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			savePresetFlow({
				...baseArgs,
				draft: { label: 'Renamed', tokens: { 'button-bg': 'semantic.color.action-primary' } },
				initialValues: { label: 'Primary', tokens: { 'button-bg': 'semantic.color.action-primary' } },
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

describe('deletePresetFlow', () => {
	it('deletes and refreshes the feed', async () => {
		client.deleteBlockPreset.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		await deletePresetFlow({
			namespace: 'kb-design-tokens/v1',
			block: 'kadence/singlebtn',
			preset: 'button-2',
			slug: 'default',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.deleteBlockPreset).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			'kadence/singlebtn',
			'button-2',
			'default'
		);
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
	});

	it('surfaces the server 422 message and re-throws, leaving the row for the guard-modal contract', async () => {
		const failure = new Error('The default preset must name an existing preset.');
		client.deleteBlockPreset.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			deletePresetFlow({
				namespace: 'kb-design-tokens/v1',
				block: 'kadence/singlebtn',
				preset: 'primary',
				slug: 'default',
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

describe('reorderPresetsFlow', () => {
	it('PUTs the full ordered slug list with the version and refreshes', async () => {
		client.setBlockPresetOrder.mockResolvedValue({});
		const refreshFeed = jest.fn().mockResolvedValue({});
		const onBusy = jest.fn();
		const onError = jest.fn();

		await reorderPresetsFlow({
			namespace: 'kb-design-tokens/v1',
			block: 'kadence/singlebtn',
			orderedIds: ['secondary', 'primary'],
			feedVersion: 'v1',
			slug: 'default',
			refreshFeed,
			onBusy,
			onError,
		});

		expect(client.setBlockPresetOrder).toHaveBeenCalledWith(
			'kb-design-tokens/v1',
			'kadence/singlebtn',
			{ order: ['secondary', 'primary'], version: 'v1' },
			'default'
		);
		expect(refreshFeed).toHaveBeenCalledWith('default');
		expect(onBusy.mock.calls).toEqual([[true], [false]]);
		expect(onError).not.toHaveBeenCalled();
	});

	it('surfaces the error, clears busy, and re-throws on failure', async () => {
		const failure = new Error('Boom');
		client.setBlockPresetOrder.mockRejectedValue(failure);
		const refreshFeed = jest.fn();
		const onBusy = jest.fn();
		const onError = jest.fn();

		await expect(
			reorderPresetsFlow({
				namespace: 'kb-design-tokens/v1',
				block: 'kadence/singlebtn',
				orderedIds: ['secondary', 'primary'],
				feedVersion: 'v1',
				slug: 'default',
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
