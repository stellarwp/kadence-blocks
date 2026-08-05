/* eslint-env jest */
import { resolveDraftSeed } from '../hooks/use-settings-panel';

describe('resolveDraftSeed', () => {
	it('does not seed while the caller has no values yet (initialValues null)', () => {
		expect(resolveDraftSeed('primitive.color.brand.primary', null, null)).toEqual({
			shouldSeed: false,
			nextSeededFor: null,
		});
	});

	it('seeds once values arrive after mount for an already-open item (the cold-load path)', () => {
		const itemId = 'primitive.color.brand.primary';
		const initialValues = { label: 'Main 1', value: '#3182CE' };

		// The item was already open (route.item set at mount) while the caller's data was still
		// loading, so no seed has happened yet — `seededFor` is still null for this item.
		expect(resolveDraftSeed(itemId, initialValues, null)).toEqual({
			shouldSeed: true,
			nextSeededFor: itemId,
		});
	});

	it('seeds immediately when the item changes and values are already available (the click path)', () => {
		expect(
			resolveDraftSeed(
				'primitive.color.brand.secondary',
				{ label: 'Main 2', value: '#2B6CB0' },
				'primitive.color.brand.primary'
			)
		).toEqual({
			shouldSeed: true,
			nextSeededFor: 'primitive.color.brand.secondary',
		});
	});

	it('does not reseed on a later initialValues identity change for the same item once already seeded', () => {
		const itemId = 'primitive.color.brand.primary';

		// A fresh object identity, as `refreshFeed` produces after a save elsewhere, but the same item
		// — this must not clobber a modified draft.
		const reloadedValues = { label: 'Main 1', value: '#3182CE' };

		expect(resolveDraftSeed(itemId, reloadedValues, itemId)).toEqual({
			shouldSeed: false,
			nextSeededFor: itemId,
		});
	});

	it('resets the seed-tracking value when the item changes while the new item has no values yet', () => {
		expect(resolveDraftSeed('primitive.color.brand.secondary', null, 'primitive.color.brand.primary')).toEqual({
			shouldSeed: false,
			nextSeededFor: null,
		});
	});

	it('treats undefined the same as null — not yet ready', () => {
		expect(resolveDraftSeed('primitive.color.brand.primary', undefined, null)).toEqual({
			shouldSeed: false,
			nextSeededFor: null,
		});
	});
});
